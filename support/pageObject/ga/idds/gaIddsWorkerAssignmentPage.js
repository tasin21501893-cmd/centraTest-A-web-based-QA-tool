/**
 * @author Shahil Azmayish
 * @since 01/22/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { ListPage } from '../../../commonPages/listPage.js';
import { GaIddsLabels } from '../utility/gaIddsLabels.js';

export class GaIddsWorkerAssignmentPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.listPage = new ListPage(page);
		this.#initLocators(page);
	}

	async addWorkerAssignment(data) {
		await this.commonButtons.clickButton(GaIddsLabels.ADD_WORKER_ASSIGNMENT);
		await this.fillWorkerAssignmentDetails(data);
		await this.commonButtons.clickButton(GaIddsLabels.SAVE);
	}

	async updateWorkerAssignment(data) {
		await this.listPage.fillFilterField(data.oldReviewer, this.secWorkerAssignment);
		await this.btnShow.click();
		await this.commonButtons.clickButton(GaIddsLabels.EDIT);
		await this.fillWorkerAssignmentDetails(data);
		await this.commonButtons.clickButton(GaIddsLabels.UPDATE);
	}

	async fillWorkerAssignmentDetails(data) {
		await this.ddlBusinessStatus.selectOption(data.businessStatus);
		await this.dtpAssignedDate.fill(data.assignedDate);
		await this.ddlReviewer.selectOption(data.reviewer);
	}

	#initLocators(page) {
		this.ddlBusinessStatus = page.locator('#workerAssignment\\.applicationProcessingStatus');
		this.ddlReviewer = page.locator('#workerAssignment\\.assignee');
		this.dtpAssignedDate = page.locator('#workerAssignment\\.assignedDate');
		this.tblWorkerAssignment = page.locator('#workerAssignmentTable');
		this.errMsgBusinessStatus = page.locator('#workerAssignment\\.applicationProcessingStatus\\.errors');
		this.errMsgReviewer = page.locator('#workerAssignment\\.assignee\\.errors');
		this.errMsgAssignedDate = page.locator('#workerAssignment\\.assignedDate\\.errors');
		this.secWorkerAssignment = page.locator('section[data-jump-to="Worker Assignment"]');
		this.btnShow = this.tblWorkerAssignment.locator('tbody tr').first().getByRole('link', { name: 'Show' });
	}
}
