/**
 * @author Shahil Azmayish
 * @since 01/22/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { SearchPage } from '../../../commonPages/searchPage.js';
import { ListPage } from '../../../commonPages/listPage.js';
import { GaIddsLabels } from '../utility/gaIddsLabels.js';
import { GaIddsWorkerAssignmentPage } from './gaIddsWorkerAssignmentPage.js';

export class GaIddsApplicationManagementPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.listPage = new ListPage(page);
		this.searchPage = new SearchPage(page);
		this.workerAssignmentPage = new GaIddsWorkerAssignmentPage(page);
		this.#initLocators(page);
	}

	async openIddManagement(data) {
		await this.searchPage.searchForm(data);
		await this.listPage.selectFilteredFirstItemUponAvailability(data.formId);
	}

	async discharge() {
		await this.commonButtons.clickButton(GaIddsLabels.DISCHARGE);
		await this.commonButtons.clickButton(GaIddsLabels.YES);
	}

	async reopen(data) {
		await this.commonButtons.clickButton(GaIddsLabels.REOPEN);
		await this.workerAssignmentPage.fillWorkerAssignmentDetails(data);
		await this.commonButtons.clickButton(GaIddsLabels.REOPEN);
	}

	#initLocators(page) {
		this.msgSuccess = page.locator('.alert-success');
	}
}
