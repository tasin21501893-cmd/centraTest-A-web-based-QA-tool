/**
 * @author Emran Hossain Rabbi
 * @since 12/07/2025
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { MarCommonUtils } from './marCommonUtils.js';
import { MarDailyDataFilter } from './marDailyDataFilter.js';

export class MarDailyDataBulkEntry {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.marCommonUtils = new MarCommonUtils(page);
        this.marDailyDataFilter = new MarDailyDataFilter(page);

        this.txtCommentField = page.getByRole('textbox', { name: 'mar-textarea' });
        this.txtFilterDate = page.locator('[name="filter-date"]');
        this.ddlOptionLOA = page.locator(`div.dropdown-option-list div:has-text("LOA")`);
        this.btnTabBase = '.tq-tabs-header:nth-child';
    }

    async verifyResetButtonExistenceForFutureDateUsingBulkEntry(tabIndex, slotIndex) {
        await this.commonButtons.clickButton('To Do')
        const dateLocator = this.txtFilterDate;
        const daysOffset = 2;
        await this.marCommonUtils.changeDateAndFilterDailyMAR(daysOffset, dateLocator);
        await this.marCommonUtils.selectScheduledTimes(tabIndex, slotIndex);
        await this.commonUtils.waitForChangeInDOM(`${this.btnTabBase}(${tabIndex + 1})`);
        const detailsBeforeRecord = await this.marCommonUtils.getRecordDetails(tabIndex);
        await this.commonButtons.clickButton('LOA/On Hold Bulk Entry');
        await this.commonButtons.clickButton('Save Preview');
        await this.marCommonUtils.clickDropdownListByLabel('Record Type');
        await this.ddlOptionLOA.click();
        await this.txtCommentField.fill('LOA');
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
        await this.commonButtons.clickButton('LOA/On Hold Bulk Entry');
        await this.commonButtons.clickButton('View Details');
        await this.marCommonUtils.selectScheduledTimes(tabIndex, slotIndex);
        await this.commonUtils.waitForChangeInDOM(`${this.btnTabBase}(${tabIndex + 1})`);
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await this.marCommonUtils.confirmReset();
        const detailsAfterReset = await this.marCommonUtils.getRecordDetails(tabIndex);
        expect(detailsBeforeRecord).toEqual(detailsAfterReset);
        const toDoCountAfterReset = await this.marCommonUtils.toDoCount();
        expect(toDoCountAfterReset).toEqual(1);
    }
}