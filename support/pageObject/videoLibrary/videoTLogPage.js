/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { VideoLabels } from './utility/videoLabels.js';
import { TLogPage } from '../tlog/tLogPage.js';

export class VideoTLogPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.commonButtons = new CommonButtons(page);
		this.tlogPage = new TLogPage(page);
		this.#initializeLocators(page);
	}

	async navigateToForm(summary, eventDate) {
		await this.commonUtils.navigateToDashboardLink('Individual', 'T-Log', 'Search');
		await this.txtSummary.fill(summary);
		await this.dtpCreatedFrom.fill(eventDate);
		await this.commonButtons.clickButton(VideoLabels.SEARCH);
		await this.listPage.selectFilteredFirstItem(summary);
	}

	async openVideoAttachmentMode() {
		await this.commonButtons.clickButton(VideoLabels.UPDATE);
	}

	async saveForm() {
		await this.commonButtons.clickButton(VideoLabels.UPDATE);
	}

	async fillUpTLogAndSubmit(data) {
		await this.tlogPage.fillUpTLogForm(data);
		await this.commonButtons.clickButton(VideoLabels.SUBMIT);
	}

	#initializeLocators(page) {
		this.dtpCreatedFrom = page.locator('[name="createdFrom"]');
		this.txtSummary = page.locator('[name="summary"]');
	}
}
