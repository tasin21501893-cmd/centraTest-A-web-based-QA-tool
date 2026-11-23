/**
* @author Shahil Azmayish
* @since 01/19/2026
*/

import { expect, errors } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { VideoNewPage } from './videoNewPage.js';
import { VideoLabels } from './utility/videoLabels.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';

const DOWNLOAD_TIMEOUT = 5 * 60 * 1000; // wait for 5 minutes for completion of download process
const PLAYBACK_TIMEOUT = 2 * 60 * 1000; // wait for 2 minutes for video player to be ready
const PROGRESS_BAR_APPEAR_TIMEOUT = 3000; // wait for 3 seconds to appear the progress bar

export class VideoFormPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.videoNewPage = new VideoNewPage(page);
		this.donePage = new DonePage(page);
		this.#initializeLocators(page);
	}

	async updateVideo(data) {
		const currentFormTag = await this.valFormTag.textContent();
		await this.commonButtons.clickButton(ButtonLabels.EDIT);
		await this.videoNewPage.fillUpVideoForm(data);
		await this.commonButtons.clickButton(ButtonLabels.UPDATE);

		if (
			data.formTag === VideoLabels.VIDEO_LIBRARY_ONLY &&
			currentFormTag.trim() !== VideoLabels.VIDEO_LIBRARY_ONLY  // popup validation does not appear when the form is already in video library only
		) {
			await this.videoNewPage.handleVideoLibraryOnlyPopup();
		}
	}

	async playVideo() {
		await this.imgVideoThumbnail.click();
		await this.verifyVideoPlay();
	}

	async verifyVideoPlay() {
		await this.verifyVideoPlayerIsReady();
		await this.startPlayback();
		await this.verifyPlaybackIsProgressing();
		await this.pausePlayback();
	}

	async verifyVideoPlayerIsReady() {
		await expect(this.mdlVideoPlayer).toBeVisible();
		await expect(this.btnOverlayPlay).toBeVisible();
	}

	async startPlayback() {
		await this.btnOverlayPlay.click();
		await expect(this.btnPause).toBeVisible({ timeout: PLAYBACK_TIMEOUT }); // wait until pause button is visible, indicate that video is playing
	}

	// verify playback by checking the seekbar value is increasing value for every 1 second interval and wait until the 15 sec interval
	async verifyPlaybackIsProgressing() {
		const initialSeekValue = await this.sldSeekBar.inputValue();
		await expect.poll(async () => {
			return parseFloat(await this.sldSeekBar.inputValue());
		}, {
			message: 'Expected seek bar value to increase, but it did not. Video may not be playing.',
			intervals: [1000],
			timeout: 15000
		}).toBeGreaterThan(parseFloat(initialSeekValue));
	}

	async pausePlayback() {
		await this.cntPlayer.hover();
		await this.btnPause.click();
		await expect(this.cntPlayer).toHaveClass(/plyr--paused/);
	}

	async closeVideoPlayer() {
		await this.btnCloseVideoPlayer.click();
	}

	async downloadVideo() {
		await this.handleDownloadWithProgressBar(() => this.btnDownload.click());
	}

	// DOWNLOAD_TIMEOUT wait until download event is triggered
	async handleDownloadWithProgressBar(clickAction) {
		const downloadPromise = this.page.waitForEvent('download', { timeout: DOWNLOAD_TIMEOUT });
		await clickAction();

		try {
			await this.videoModalProgressBar.waitFor({
				state: 'visible',
				timeout: PROGRESS_BAR_APPEAR_TIMEOUT // wait until the progress bar appear
			});
			await this.videoModalProgressBar.waitFor({ state: 'hidden', timeout: DOWNLOAD_TIMEOUT });
		}

		catch (error) {
			if (!(error instanceof errors.TimeoutError)) throw error;
		}
		const download = await downloadPromise;
		const fileName = download.suggestedFilename();

		await expect(fileName, `Expected downloaded file: ${fileName}`).toMatch(VideoLabels.SUPPORTED_VIDEO_FORMATS);
		return fileName;
	}

	async viewTranscript() {
		await Promise.all([
			this.page.waitForResponse(
				resp => resp.url().includes('/ma/video/lib/transcript') && resp.status() === 200,
				{ timeout: 15000 }
			),
			this.commonButtons.clickButton(VideoLabels.VIEW_TRANSCRIPT),
		]);

		await expect(
			this.mdlTranscript,
			'Transcript modal should be visible after clicking "View Transcript".'
		).toBeVisible();
		const transcriptText = await this.transcriptContainer.textContent();
		expect(transcriptText, 'Transcript text should not be empty.').not.toBe('');
	}

	/**
	 * Verifies post-upload video (play, download, transcript) based on Excel Y/N value.
	 */
	async verifyPostUploadVideoActions(testcase) {
		if (CommonUtils.isAffirmative(testcase.playVideo)) {
			await this.playVideo();
			await this.closeVideoPlayer();
		}

		if (CommonUtils.isAffirmative(testcase.downloadVideo)) {
			await this.downloadVideo();
		}

		if (CommonUtils.isAffirmative(testcase.viewTranscript)) {
			await this.viewTranscript();
		}
	}

	async getVideoFormStatus() {
		return await this.lblFormStatus.textContent();
	}

	async clickCreateTlog() {
		await this.commonButtons.clickButton(VideoLabels.CREATE_T_LOG);
	}

	async approveVideo(testcase) {
		const currentStatus = await this.getVideoFormStatus();

		if (currentStatus.trim() === VideoLabels.PENDING_APPROVAL) {
			await this.commonButtons.clickButton(ButtonLabels.APPROVE);
			await expect(this.getConfirmationModalLocator(VideoLabels.DIALOG_TITLE_APPROVE)).toBeVisible();
			await this.commonButtons.clickButton(VideoLabels.YES);
			await this.donePage.verifyPartialDoneMessage(testcase.doneMessage);

		} else {
			throw new Error(
				`The video form is not in '${VideoLabels.PENDING_APPROVAL}' status. ` +
				'The test cannot verify the approve functionality.'
			);
		}
	}

	async deleteVideo(testcase) {
		const currentStatus = await this.getVideoFormStatus();
		const status = currentStatus.trim();

		const isPendingApproval = status === VideoLabels.PENDING_APPROVAL;
		const isApprovedAndUnlinked = status === VideoLabels.APPROVED &&
			(await this.linkedFormSectionMsg.isVisible());

		if (isPendingApproval || isApprovedAndUnlinked) {
			await this.commonButtons.clickButton(ButtonLabels.DELETE);
			await expect(this.getConfirmationModalLocator(VideoLabels.DIALOG_TITLE_DELETE), 'Delete confirmation modal should be visible.').toBeVisible();
			await this.commonButtons.clickButton(VideoLabels.YES);
			await this.donePage.verifyPartialDoneMessage(testcase.doneMessage);

		} else {
			throw new Error(
				`The video form is not in a deletable state. Current status: '${status}'. ` +
				'The test cannot verify the delete functionality.'
			);
		}
	}

	async reprocessWithTranscript(testcase) {
		const transcriptEnabledValue = await this.lblEnableVideoTranscript.textContent();

		if (transcriptEnabledValue.trim() !== ButtonLabels.YES) {
			await this.commonButtons.clickButton(VideoLabels.REPROCESS_WITH_TRANSCRIPT);
			await expect(this.getConfirmationModalLocator(VideoLabels.DIALOG_TITLE_REPROCESS)).toBeVisible();
			await this.commonButtons.clickButton(VideoLabels.YES);
			await this.donePage.verifyPartialDoneMessage(testcase.doneMessage);

		} else {
			throw new Error(
				'The video form is not in a state to reprocess with transcript. ' +
				'The test cannot verify the reprocess functionality.'
			);
		}
	}

	async verifyNoEditButton() {
		await expect(this.btnEdit).toBeHidden();
	}

	async verifyNoApproveButton() {
		await expect(this.btnApprove).toBeHidden();
	}

	async verifyNoDeleteButton() {
		await expect(this.btnDelete).toBeHidden();
	}

	/**
	 * Polls the video form's status until it reaches a terminal state (pending approval or failed).
	 * @param {object} [options] - Configuration for polling.
	 * @param {number} [options.timeout=900000] - Maximum time to wait in milliseconds (default: 15 minutes).
	 * @param {number[]} [options.intervals=[15000]] - Intervals between polling attempts in milliseconds (default: 15 seconds).
	 * @returns {Promise<void>}
	 */
	async waitForProcessingCompletion({ timeout = 15 * 60 * 1000, intervals = [15 * 1000] } = {}) {
		const successState = VideoLabels.PENDING_APPROVAL;
		const terminalFailureStates = [VideoLabels.FAILED, VideoLabels.VIRUS_DETECTED];

		await expect(async () => {
			await this.page.reload();
			const currentStatus = (await this.getVideoFormStatus()).trim();

			if (terminalFailureStates.includes(currentStatus)) {
				throw new Error(`Video processing entered a terminal failure state: "${currentStatus}".`);
			}

			expect(currentStatus,
				`Waiting for status to become "${successState}", but it is currently "${currentStatus}".`
			).toBe(successState);
		}).toPass({
			intervals: intervals,
			timeout: timeout
		});
	}

	#initializeLocators(page) {
		this.btnApprove = page.getByRole('button', { name: ButtonLabels.APPROVE });
		this.btnDownload = page.locator('[id^="video-download-"], #download-link');
		this.btnDelete = page.getByRole('button', { name: ButtonLabels.DELETE });
		this.btnEdit = page.getByRole('button', { name: ButtonLabels.EDIT });
		this.getConfirmationModalLocator = (title) => page.locator('.modal-content', { hasText: title });
		this.imgVideoThumbnail = page.locator('.item.active img, #thumbnail img');
		this.mdlVideoPlayer = page.locator('#videoPlayModal');
		this.lblFormStatus = page.locator('section.page-header span.status');
		this.videoModalProgressBar = page.locator('#progress-bar');
		this.cntPlayer = this.mdlVideoPlayer.locator('.plyr');
		this.btnOverlayPlay = this.cntPlayer.locator('.plyr__control--overlaid');
		this.btnPause = this.cntPlayer.locator('.plyr__controls').getByRole('button', { name: 'Pause' });
		this.sldSeekBar = this.cntPlayer.locator('input[data-plyr="seek"]');
		this.mdlTranscript = page.locator('.modal-content:has(#video-transcription-container)');
		this.lblEnableVideoTranscript = page.locator(
			'div.row:has(label:text-is("Enable Video Transcript")) > div.label-value'
		);
		this.valFormTag = page.locator('div.row:has(label:text-is("Form Tag")) > div.label-value');
		this.transcriptContainer = page.locator('#video-transcription-container');
		this.linkedFormSectionMsg = page.locator('#linked-form-url-section-body #msg');
		this.btnCloseVideoPlayer = page.getByRole('button', { name: 'Close dialog' });
	}
}
