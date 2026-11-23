/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { VideoLabels } from './utility/videoLabels.js';

export class VideoIspProgramPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page);
	}

	async navigateToForm(ispProgramName, eventDate) {
		await this.commonUtils.navigateToDashboardLink('Individual', 'ISP Program', 'Search');
		await this.txtIspProgramName.fill(ispProgramName);
		await this.txtCreateDateFrom.fill(eventDate);
		await this.commonButtons.clickButton(VideoLabels.SEARCH);
		await this.listPage.selectFilteredFirstItem(ispProgramName);
		await this.page.waitForLoadState('domcontentloaded');
	}

	async saveForm() {
		await this.commonButtons.clickButton(VideoLabels.SAVE);
	}

	#initializeLocators(page) {
		this.txtCreateDateFrom = page.locator('[name="createDateFrom"]');
		this.txtIspProgramName = page.locator('[name="ispProgramName"]');
	}
}
