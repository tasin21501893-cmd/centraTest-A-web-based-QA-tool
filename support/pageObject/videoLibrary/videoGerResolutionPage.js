/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { VideoLabels } from './utility/videoLabels.js';

export class VideoGerResolutionPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page);
	}

	async navigateToForm(program, eventDate) {
		await this.commonUtils.navigateToDashboardLink('Individual', 'GER Resolution', 'Search');
		await this.atcProgramSite.fill(program);
		await this.firstLookupResult.waitFor({ state: 'visible' });
		await this.firstLookupResult.click();
		await this.dtpGerEventDateFrom.fill(eventDate);
		await this.dtpGerResolutionOpenDateFrom.fill(eventDate);
		await this.commonButtons.clickButton(VideoLabels.SEARCH);
		await this.listPage.selectFilteredFirstItem(eventDate);
	}

	async saveForm() {
		await this.commonButtons.clickButton(VideoLabels.SAVE);
	}

	#initializeLocators(page) {
		this.dtpGerEventDateFrom = page.locator('[name="gerEventDateFrom"]');
		this.dtpGerResolutionOpenDateFrom = page.locator('[name="openDateFrom"]');
		this.atcProgramSite = page.locator('#programLookup');
		this.firstLookupResult = page.locator('.ui-menu-item > .ui-menu-item-wrapper:visible').first();
	}
}
