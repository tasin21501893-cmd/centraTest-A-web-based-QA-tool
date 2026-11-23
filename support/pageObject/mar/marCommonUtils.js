/**
 * @author Emran Hossain Rabbi
 * @since 12/07/2025
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { MarDailyDataFilter } from './marDailyDataFilter.js';
import { readExcelDataWithSheetName } from "../../../support/commonUtility/read-xlsx.js";

const recordData = readExcelDataWithSheetName('resources/mar/marData.xlsx', "marRecordData");

export class MarCommonUtils {

    constructor(page) {
        this.page = page;
        this.iframe = this.page.frameLocator('[title="Update History"]');
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.marDailyDataFilter = new MarDailyDataFilter(page)

        this.addRecordContainer = page.locator('.tq-tabs-add-record-container');
        this.txtAdministerTime = page.locator('[name="administer-time"]');
        this.txtComment = page.getByRole('textbox', { name: 'mar-textarea' });
        this.txtToDoBadge = page.locator('.ms-2.badge.rounded-pill.bg-danger');
        this.btnReset = page.locator('button.mar-danger-button');
        this.txtResetMsg = page.locator('.mar-reset-secondary-text');
        this.ddlFilter = page.locator('#filter-dropdown');
        this.txtFilterDate = page.locator('[name="filter-date"]');
        this.txtUserLocalDateAndTime = page.locator('.d-flex.align-items-center.d-sm-flex');
        this.btnUpdateHistory = page.getByText('Update History');
        this.btnUpdateHistoryClose = page.locator('div.t-modal-header:has-text("Update History") >> button.btn-close')

        this.lnkRecordView = index => page.locator('.th-rounded-bottom.th-border.border-top-0.tab-content').nth(index).locator('.th-link').last();
        this.tabPanel = index => page.locator('.th-rounded-bottom.th-border.border-top-0.tab-content').nth(index);
    }

    async toDoCount() {
        const countText = await this.txtToDoBadge.innerText();
        return parseInt(countText.trim(), 10);
    }

    async clickDropdownListByLabel(label) {
        await this.page.locator(`label:has-text("${label}")`).locator('xpath=..').locator('.dropdown-select-input-close.form-control').click();
    }

    async selectScheduledTimes(tabIndex, slotIndex) {
        const slot = this.page.locator('.tq-tabs-header').nth(tabIndex).locator('.rounded-top.tq-tab-border.nav-item').nth(slotIndex);
        await slot.click();
        await expect(slot.locator('a')).toHaveAttribute('aria-selected', 'true');
    }

    async txtUserLocalTime() {
        const parentText = await this.txtUserLocalDateAndTime.innerText();
        const timeMatch = parentText.match(/\b\d{2}:\d{2}\s?(AM|PM)\b/);
        const userLocalTime = timeMatch[0];
        return userLocalTime;
    }

    async clickRecordViewOrAddRecord(tabIndex) {
        const recordView = this.lnkRecordView(tabIndex);
        if (await recordView.isVisible()) await recordView.click();
        else await this.addRecordContainer.nth(tabIndex).locator('.font-12.btn.btn-outline-primary.btn-sm').click();
    }

    async recordDailyData(tabIndex, slotIndex, i) {
        const userLocalTime = await this.txtUserLocalTime();
        const tab = await this.marDailyDataFilter.getTabName()
        if (tab === 'Scheduled') await this.selectScheduledTimes(tabIndex, slotIndex);
        const recordView = this.lnkRecordView(tabIndex);

        if (await recordView.isVisible()) await recordView.click();
        else await this.page.locator('.tq-tabs-add-record-container').nth(tabIndex).locator('.font-12.btn.btn-outline-primary.btn-sm').click();

        await this.clickDropdownListByLabel('Record Type');
        await this.page.locator(`div.dropdown-option-list div:has-text("${recordData[i].Record}")`).click();
        await this.txtAdministerTime.clear();
        await this.txtAdministerTime.fill(userLocalTime);

        if (recordData[i].Record.trim().toLowerCase() === 'administered') {
            await this.clickDropdownListByLabel('Administered By');
            await this.page.click(`text="${recordData[i].AdministeredBy}"`);
        }

        await this.txtComment.clear();
        await this.txtComment.fill(recordData[i].Comment);

        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
    }

    async getRecordDetails(tabIndex) {
        const tabPanel = this.tabPanel(tabIndex);
        const status = (await tabPanel.locator('[class="px-2 py-1 rounded-pill me-1 font-12 fw-bold"]').textContent()).trim();
        const bold = tabPanel.locator('span.fw-bold');

        return {
            status,
            adminDate: (await bold.nth(0).textContent()).trim(),
            recordDate: (await bold.nth(1).textContent()).trim(),
            userInitial: (await bold.nth(2).textContent()).trim()
        };
    }

    async checkAndMatchUpdateHistory(expectedOld, expectedNew) {
        await this.btnUpdateHistory.click();
        const recordedByRows = this.iframe.locator('tr').filter({ has: this.iframe.locator('td', { hasText: 'Recorded By' }) });
        const count = await recordedByRows.count();
        const row = this.iframe.locator('tr.even').filter({ has: this.iframe.locator('td', { hasText: 'Record Type' }) }).first();
        expect((await row.locator('td').nth(1).textContent()).trim()).toBe(expectedOld);
        expect((await row.locator('td').nth(2).textContent()).trim()).toBe(expectedNew);

        if (expectedOld === 'Due') {
            expect(count).toBe(0);
        }
        else {
            expect(count).toBe(1);
        }

        await this.btnUpdateHistoryClose.click();
    }

    async confirmReset() {
        await expect(this.btnReset).toBeEnabled();
        await this.btnReset.click();
        const resetMsg = (await this.txtResetMsg.textContent()).trim();
        expect(resetMsg).toEqual('Resetting this data will clear the current entry and return the item to the To Do tab so it can be documented again.')
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Ok');
    }

    async resetButtonEnableVerify() {
        await expect(this.btnReset).toBeEnabled();
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
    }

    async pastAndFutureDate(dayOffset, locator) {
        const currentValue = await locator.inputValue() || new Date().toLocaleDateString('en-US');
        const [month, day, year] = currentValue.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + dayOffset);
        const newdate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        return newdate;
    }

    async changeDateAndFilterDailyMAR(dayOffset, locator) {
        await this.ddlFilter.click();
        const newdate = await this.pastAndFutureDate(dayOffset, locator)
        await this.txtFilterDate.fill(newdate);
        const tab = await this.marDailyDataFilter.getTabName()
        await this.page.getByRole("tab", { name: tab }).click();
        await this.commonButtons.clickButton('View Details');
    }
}