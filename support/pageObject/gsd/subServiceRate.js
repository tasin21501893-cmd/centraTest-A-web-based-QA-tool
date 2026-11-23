/**
 * @author Md Asoad Alvi Yanur Saom
 * @since 02/12/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { SubService } from './subService.js';

const THREE_SECOND = 3000;

export class SubServiceRate {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.SubService = new SubService(page);
		this.txtAmount = page.locator('[name = "subServiceRate.amount"]');
		this.dtpEffectiveFrom = page.locator('[name="subServiceRate.effectiveDateFrom"]');
		this.dtpEffectiveTo = page.locator('[name="subServiceRate.effectiveDateTo"]');
	}

	async createSubServiceRate(data) {
		await this.SubService.searchAndClickService(data);
		await this.findSubService(data);
		await this.clickAddNewRate();
		await this.fillSubServiceRateDetails(data);
		await this.commonButtons.clickButton('Save');
	}

	async findSubService(data) {
        const targetRow = this.page.locator('table tbody tr').filter({ 
            has: this.page.getByText(data.subServiceCode, { exact: true }) 
        });
		await expect(
            targetRow.first(),`Sub Service with code '${data.subServiceCode}' was not found`).toBeVisible({ timeout: THREE_SECOND});
        const editLink = targetRow.getByRole('link', { name: 'Edit' });
        await editLink.waitFor({ state: 'visible' });
        await editLink.click();
	}

	async clickAddNewRate() {
		await this.commonButtons.clickButton('Add New Rate');
	}

	async fillSubServiceRateDetails(data) {
		await this.txtAmount.fill(data.fixedAmount);
		await this.dtpEffectiveFrom.fill(data.effectiveDateFrom);
		await this.dtpEffectiveTo.fill(data.effectiveDateTo);
	}
}

