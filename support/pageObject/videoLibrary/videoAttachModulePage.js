/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { expect } from '@playwright/test';
import { VideoFormPage } from './videoFormPage.js';
import { VideoTLogPage } from './videoTLogPage.js';
import { VideoIspProgramPage } from './videoIspProgramPage.js';
import { VideoGerPage } from './videoGerPage.js';
import { VideoGerResolutionPage } from './videoGerResolutionPage.js';
import { VideoIndividualHomePage } from './videoIndividualHomePage.js';

export class VideoAttachModulePage {
	constructor(page) {
		this.page = page;
		this.videoFormPage = new VideoFormPage(page);
		this.#initializeLocators(page);
	}

	getModulePage(moduleName) {
		switch (moduleName) {
			case 'ISP Program': return new VideoIspProgramPage(this.page);
			case 'T-Log': return new VideoTLogPage(this.page);
			case 'GER': return new VideoGerPage(this.page);
			case 'GER Resolution': return new VideoGerResolutionPage(this.page);
			case 'Individual Home Page': return new VideoIndividualHomePage(this.page);
			default: throw new Error(`Unsupported module: ${moduleName}`);
		}
	}

	async navigateAndPlayVideo(modulePage, testcase) {
		if (testcase.module === 'Individual Home Page') {
			await modulePage.goToIndividualHomePage(testcase);
			await modulePage.findVideoFromAboutMe(testcase);
			await modulePage.playVideoFromIHP();

		} else {
			await modulePage.navigateToForm(testcase.otherModuleProgramName, testcase.eventDate);
			await this.clickPlayAttachedVideo(testcase.videoTitle);
		}
	}

	async navigateAndDownloadVideo(modulePage, testcase) {
		if (testcase.module === 'Individual Home Page') {
			await modulePage.goToIndividualHomePage(testcase);
			await modulePage.findVideoFromAboutMe(testcase);
			await modulePage.downloadVideoFromIHP();

		} else {
			await modulePage.navigateToForm(testcase.otherModuleProgramName, testcase.eventDate);
			await this.clickDownloadAttachedVideo(testcase.videoTitle);
		}
	}

	async clickPlayAttachedVideo(videoTitle) {
		const playButton = this.btnVideoPlayInAttachment(videoTitle);
		await expect(playButton, `Play button for video '${videoTitle}' should be visible.`).toBeVisible();
		await playButton.click();
		await this.videoFormPage.verifyVideoPlay();
	}

	async clickDownloadAttachedVideo(videoTitle) {
		const downloadButton = this.btnVideoDownloadInAttachment(videoTitle);
		await expect(downloadButton, `Download button for video '${videoTitle}' should be visible.`).toBeVisible();
		await this.videoFormPage.handleDownloadWithProgressBar(() => downloadButton.click());
	}

	#initializeLocators(page) {
		this.btnVideoPlayInAttachment = (videoTitle) =>
			page.locator(`tr:has-text('${videoTitle}') .video-preview-button`);
		this.btnVideoDownloadInAttachment = (videoTitle) =>
			page.locator(`tr:has-text('${videoTitle}') .video-download-button`);
	}
}
