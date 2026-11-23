/**
 * @author Shahil Azmayish
 * @since 08/10/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';
import { VideoLabels } from './utility/videoLabels.js';

export class VideoTagConfigBasePage {
	constructor(page, { modalSelector, tableSelector } = {}) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page, modalSelector, tableSelector);
	}

	async configureNewVideoTag(data) {
		const videoTags = await this.commonUtils.parseCommaSeparatedList(data.videoTag);

		for (const tag of videoTags) {
			await this.ddlVideoTag.selectOption({ label: tag });
			await this.commonButtons.clickButton(VideoLabels.CONFIGURE);
			await expect(this.tagModal).toBeVisible();
			await this.fillTagConfigurationPopup(data);
			await this.commonButtons.clickButton(ButtonLabels.SAVE, this.tagModalIframe);
		}
	}

	async editVideoTag(data) {
		const videoTags = await this.commonUtils.parseCommaSeparatedList(data.videoTag);

		for (const tag of videoTags) {
			const row = this.getVideoTagRow(tag);
			await expect(row, `The table row for tag "${tag}" should be visible.`).toBeVisible();
			await this.commonButtons.clickButton(VideoLabels.EDIT, row);
			await expect(this.tagModal).toBeVisible();
			await this.fillTagConfigurationPopup(data);
			await this.commonButtons.clickButton(ButtonLabels.UPDATE, this.tagModalIframe);
		}
	}

	async deleteVideoTag(data) {
		const videoTags = await this.commonUtils.parseCommaSeparatedList(data.videoTag);

		for (const tag of videoTags) {
			const row = this.getVideoTagRow(tag);
			await expect(row, `The table row for tag "${tag}" should be visible.`).toBeVisible();
			await this.commonButtons.clickButton(VideoLabels.DELETE, row);
			await this.commonButtons.clickButton(ButtonLabels.DELETE, this.tagModalIframe);
			await expect(this.iframePopUpModal).toBeVisible();
			await this.btnPromptYes.evaluate(button => button.click());
		}
	}

	getVideoTagRow(tagName) {
		return this.tblVideoTagConfig.locator('tr', {
			has: this.page.locator('td', { hasText: new RegExp(`^${tagName}$`) })
		});
	}

	async fillTagConfigurationPopup(data) {
		if (data.totalStorageLimitPerIndividual) {
			await this.ddlStorageLimitPerIndividual.selectOption({
				label: data.totalStorageLimitPerIndividual
			});
		}

		if (data.storageLimitPerFile) {
			await this.ddlStorageLimitPerFile.selectOption({
				label: data.storageLimitPerFile
			});
		}

		if (data.playLimitPerFile) {
			await this.ddlPlayLimitPerFile.selectOption(
				data.playLimitPerFile
			);
		}

		if (data.downloadLimitPerFile) {
			await this.ddlDownloadLimitPerFile.selectOption(
				data.downloadLimitPerFile
			);
		}

		if (data.uploadLimitPerDay) {
			await this.ddlUploadLimitPerDay.selectOption(
				data.uploadLimitPerDay
			);
		}
	}

	#initializeLocators(page, modalSelector, tableSelector) {
		this.tblVideoTagConfig = tableSelector ? page.locator(tableSelector) : null;
		this.ddlVideoTag = page.locator('.tag-selector select');
		this.tagModal = modalSelector ? page.locator(modalSelector) : null;
		this.tagModalIframe = this.tagModal.frameLocator('iframe');
		this.errMsgStorageLimit = this.tagModalIframe.locator('#storageLimitPerFile\\.errors');
		this.ddlStorageLimitPerIndividual = this.tagModalIframe.locator('#storageLimitPerIndividual');
		this.ddlStorageLimitPerFile = this.tagModalIframe.locator('#storageLimitPerFile');
		this.ddlPlayLimitPerFile = this.tagModalIframe.locator('#playLimitPerFile');
		this.ddlDownloadLimitPerFile = this.tagModalIframe.locator('#downloadLimitPerFile');
		this.ddlUploadLimitPerDay = this.tagModalIframe.locator('#uploadCountLimitPerDay');
		this.iframePopUpModal = this.tagModalIframe ? this.tagModalIframe.getByRole('dialog') : null;
		this.btnPromptYes = this.tagModalIframe ? this.tagModalIframe.locator('.btn-prompt-yes') : null;
		this.msgSuccess = page.locator('#msgDiv.alert-success #msgHolder');
	}
}
