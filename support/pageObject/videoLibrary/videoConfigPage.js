/**
 * @author Shahil Azmayish
 * @since 08/10/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { VideoTagConfigBasePage } from './videoTagConfigBasePage.js';
import { VideoLabels } from './utility/videoLabels.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';


export class VideoConfigPage extends VideoTagConfigBasePage {
	constructor(page) {
		super(page, {
			modalSelector: '#video-tag-config-modal',
			tableSelector: '#videoTagConfigTable'
		});
		this.commonButtons = new CommonButtons(page);
		this.listPage = new ListPage(page);
		this.#initializeLocators(page);
	}

	async updateVideoConfiguration(data) {
		const checkboxConfigs = [
			{ label: VideoLabels.ENABLE_VIDEO_LIBRARY, value: data.videoLibraryEnabled },
			{ label: VideoLabels.ENABLE_MOBILE_VIDEO_LIBRARY, value: data.mobileVideoLibrary },
			{ label: VideoLabels.ENABLE_VIDEO_TRANSCRIPT, value: data.videoTranscript }
		];

		for (const { label, value } of checkboxConfigs) {
			await this.#toggleCheckboxIfConfigured(label, value);
		}
		await this.commonButtons.clickButton(VideoLabels.UPDATE);
	}

	async enableVideoProvPreference(data) {
		await this.listPage.selectFilteredFirstItem(data.providerCode);
		await this.#toggleCheckboxIfConfigured(
			VideoLabels.ENABLE_VIDEO_LIBRARY,
			data.videoProviderPreference
		);
		await this.commonButtons.clickButton(VideoLabels.UPDATE);
	}

	async applyTemplate(data) {
		await this.commonButtons.clickButton(VideoLabels.TEMPLATES);
		await expect(this.templateModal).toBeVisible();
		await this.listPage.selectFilteredFirstItem(data.configTemplateForm, this.templateModalIframe);
		await this.commonButtons.clickButton(VideoLabels.APPLY_VIDEO_CONFIG_TEMPLATE, this.templateModalIframe);
		await expect(this.templateModal).toBeHidden();
	}

	async #toggleCheckboxIfConfigured(label, value) {
		if (CommonUtils.isAffirmative(value) || CommonUtils.isNegative(value)) {
			await this.commonUtils.toggleCheckboxUsingValue(this.page, label, value);
		}
	}

	#initializeLocators(page) {
		this.errMsgMobileVideoEnabled = page.locator('#mobileVideoLibraryEnabled\\.errors');
		this.errMsgTranscribeEnabled = page.locator('#transcribeEnabled\\.errors');
		this.btnTemplates = page.getByRole('button', { name: VideoLabels.TEMPLATES });
		this.templateModal = page.locator('#video-config-template-apply');
		this.templateModalIframe = this.templateModal.frameLocator('iframe');
		this.templateIframePopUpModal = this.templateModalIframe.getByRole('dialog');
		this.msgTagConfigMsg = page.locator('#tagMsgDiv');
	}
}
