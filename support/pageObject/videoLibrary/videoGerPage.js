/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { VideoLabels } from './utility/videoLabels.js';

export class VideoGerPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page);
	}

	async navigateToForm(program, eventDate) {
		await this.commonUtils.navigateToDashboardLink('Individual', 'General Event Reports (GER)', 'Search');
		await this.atcProgramSite.fill(program);
		await this.btnFirstLookupResult.waitFor({ state: 'visible' });
		await this.btnFirstLookupResult.click();
		await this.dtpEventDateFrom.fill(eventDate);
		await this.commonButtons.clickButton(VideoLabels.SEARCH);
		await this.listPage.selectFilteredFirstItem(eventDate);
	}

	async openVideoAttachmentMode() {
		await this.commonButtons.clickButton('Edit', this.page.locator('#gerActionsTaken'));
	}

	async saveForm() {
		await this.btnPreview.click();
		await this.commonButtons.clickButton(VideoLabels.SAVE);
	}

	#initializeLocators(page) {
		this.btnPreview = page.getByRole('button', { name: 'Preview' });
		this.atcProgramSite = page.locator('#programLookup');
		this.btnFirstLookupResult = page.locator('.ui-menu-item > .ui-menu-item-wrapper:visible').first();
		this.dtpEventDateFrom = page.locator('#eventDateFrom');
	}
}
