/**
* @author Emran Hossain Rabbi
* @since 08 / 02 / 2026
*/

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

/**
 * Page object for Pharmacy Message Worklist Configuration
 */
export class PharmacyMessageWorklistPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);

        // Locators
        this.tblSelectItemTable = page.locator('#pMsgWrklistConfigSection-selectItemTable');
        this.ddlWorklistExpiryDays = page.locator('#worklistConfig\\.worklistExpiryDays');
        this.btnSaveUpdate = page.locator('[name="_action_save_update"]');
        this.txtSelectedOption = page.locator('[selected="selected"]');
        this.txtSuccessAlert = page.locator('[class="text-center alert alert-success"]');
        this.tblSelectedHead = page.locator('#pMsgWrklistConfigSection-selectedHead th');
        this.tblSelectedRow = page.locator('#pMsgWrklistConfigSection-selected-row');
        this.btnMultiSelectBoxClose = page.locator('#pMsgWrklistConfigSection-selectedTable .multi-select-box-close');
    }

    /**
     * Configures the Pharmacy Message Worklist
     * @param {Object} testcase Data object containing orderName, priority, and ExpDay
     */
    async pharmacyMessageWorkListConfiguration(testcase) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'Message Worklist Configuration', 'Manage');
        await this.closeAllSelectedOrderValue();

        const row = this.tblSelectItemTable.locator(`tr:has(td[data-order="${testcase.orderName}"])`);
        await expect(row).toBeVisible();

        await row.getByRole('button', { name: testcase.priority }).click();

        await this.ddlWorklistExpiryDays.selectOption(testcase.ExpDay);
        await this.btnSaveUpdate.click();

        await this.commonUtils.waitForChangeInDOM('#pMsgWrklistConfigSection');

        const successfulText = await this.txtSuccessAlert.innerText();
        expect(successfulText).toEqual('Successfully Updated');

        const header = this.tblSelectedHead.filter({ hasText: testcase.priority });

        const index = await header.evaluate(
            th => Array.from(th.parentElement.children).indexOf(th)
        );

        // td index: High=0, Medium=1, Low=2
        const column = this.tblSelectedRow.locator(`td:nth-child(${index + 1})`);

        await expect(
            column.locator(`.selected-block[data-order="${testcase.orderName}"]`)
        ).toBeVisible();

        await this.commonUtils.waitForChangeInDOM('#pMsgWrklistConfigSection');
    }

    /**
     * Closes all selected order values
     */
    async closeAllSelectedOrderValue() {
        await this.page.waitForLoadState('load');
        while (await this.btnMultiSelectBoxClose.count() > 0) {
            await this.btnMultiSelectBoxClose.first().click();
        }
    }
}
