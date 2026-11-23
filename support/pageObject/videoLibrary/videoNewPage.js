/**
 * @author Shahil Azmayish
 * @since 01/19/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { VideoLabels } from './utility/videoLabels.js';
import { expect, errors } from '@playwright/test';
import path from 'path';

export class VideoNewPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page);
	}

	async fillUpVideoForm(data) {
		data.individualName && await this.ddlIndividual.selectOption(data.individualName);
		data.formTag && await this.ddlFormTag.selectOption(data.formTag);
		data.title && await this.txtTitle.fill(data.title);
		data.description && await this.txtDescription.fill(data.description);
		data.transcribeEnabled && await this.commonUtils.toggleCheckboxUsingValue(this.page, VideoLabels.ENABLE_VIDEO_TRANSCRIPT, data.transcribeEnabled);
		data.videoFile && await this.chooseVideo({ fileName: data.videoFile });
	}

	async handlePopupsAndProgressBar(data) {
		if (data.formTag === VideoLabels.VIDEO_LIBRARY_ONLY) {
			await this.handleVideoLibraryOnlyPopup();
		}

		await this.waitForVideoUploadCompletion();
	}

	getErrorMsg(fieldLocator) {
		return this.page.locator('div.form-group.has-error').filter({ has: fieldLocator }).locator('.help-block');
	}

	async handleVideoLibraryOnlyPopup() {
		await expect(this.mdlVideoLibraryOnlyConfirmation).toBeVisible();
		await this.btnVideoLibraryOnlyYes.click();
	}

	async clickUpload() {
		await this.commonButtons.clickButton(VideoLabels.UPLOAD);
	}

	async clickCancel() {
		await this.commonButtons.clickButton(VideoLabels.CANCEL);
	}

	/**
	 * Waits for the video upload progress bar to appear and disappear.
	 * This should be called immediately after an action that triggers a file upload.
	 */
	async waitForVideoUploadCompletion(parentLocator = null) {
		if (this.page.url().includes('/done')) {
			return;
		}

		const pageOrParentLocator = parentLocator === null ? this.page : parentLocator;
		const progressBar = pageOrParentLocator.locator('#progress-bar');
		
		try {
			await progressBar.waitFor({ state: 'attached', timeout: 5000 });
			await progressBar.waitFor({ state: 'detached', timeout: 60 * 60 * 1000 });
			await this.page.waitForURL(url => url.toString().includes('/done'), { timeout: 30000 });

		} catch (error) {

			if (error instanceof errors.TimeoutError) {
				try {
					await this.page.waitForURL(url => url.toString().includes('/done'), { timeout: 15000 });
					return;
				} catch {
					// Fall through to throw session expiration error
				}
			}
			throw new Error('Session Expired, Please make sure your provider session timeout is 60 minutes');
		}
	}

	async chooseVideo(data) {
		await expect(this.btnBrowseVideo).toBeVisible();
		const relativeSubpath = data.fileName.includes('custom') ? '' : 'common';
		const filePath = path.join('resources', 'attachment', relativeSubpath, data.fileName);
		// Retry clicking until the JS listener is active and filechooser opens
		let fileChooser = null;

		for (let attempt = 0; attempt < 5; attempt++) {
			try {
				const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 2000 });
				await this.btnBrowseVideo.click();
				fileChooser = await fileChooserPromise;
				break;
			} catch {
				await this.page.waitForTimeout(500);
			}
		}

		if (!fileChooser) {
			throw new Error('Failed to open file chooser: event listener was not ready.');
		}
		await fileChooser.setFiles(filePath);
	}

	#initializeLocators(page) {
		this.ddlIndividual = page.locator('#clientId');
		this.ddlFormTag = page.locator('#tag');
		this.txtTitle = page.locator('#title');
		this.txtDescription = page.locator('#description');
		this.errMsgVideoInput = page.locator('.video-input-error');
		this.errMsgVideoSelectionPopup = page.locator('.modal-body.panel-body').getByText(VideoLabels.PLEASE_SELECT_A_VIDEO_TO_UPLOAD);
		this.errMsgIndividual = this.getErrorMsg(this.ddlIndividual);
		this.errMsgFormTag = this.getErrorMsg(this.ddlFormTag);
		this.errMsgTitle = this.getErrorMsg(this.txtTitle);
		this.errMsgDescription = this.getErrorMsg(this.txtDescription);
		this.errMsgChangeDetection = page.getByRole('dialog');
		this.mdlVideoLibraryOnlyConfirmation = page.locator('.modal-content', { hasText: VideoLabels.DIALOG_TITLE_VIDEO_LIBRARY_ONLY });
		this.btnVideoLibraryOnlyYes = this.mdlVideoLibraryOnlyConfirmation.getByRole('button', { name: VideoLabels.YES });
		this.btnBrowseVideo = page.getByText('Choose Video');
	}
}
