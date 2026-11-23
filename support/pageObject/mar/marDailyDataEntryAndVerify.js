/**
 * @author Emran Hossain Rabbi
 * @since 12/07/2025
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { MarCommonUtils } from './marCommonUtils.js';
import { MarDailyDataFilter } from './marDailyDataFilter.js';
import { MarDailyDataQuickEntry } from './marDailyDataQuickEntry.js';
import { MarDailyDataBulkEntry } from './marDailyDataBulkEntry.js';
import { readExcelDataWithSheetName } from "../../../support/commonUtility/read-xlsx.js";

const recordData = readExcelDataWithSheetName('resources/mar/marData.xlsx', "marRecordData");
export class MarDailyDataEntryAndVerify {
    constructor(page) {
        this.page = page;
        this.iframe = this.page.frameLocator('[title="Update History"]');
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.marCommonUtils = new MarCommonUtils(page);
        this.marDailyDataFilter = new MarDailyDataFilter(page);
        this.marDailyDataQuickEntry = new MarDailyDataQuickEntry(page);
        this.marDailyDataBulkEntry = new MarDailyDataBulkEntry(page);

        this.btnViewDetails = page.getByRole('button', { name: 'View Details' });
        this.addRecordContainer = page.locator('.tq-tabs-add-record-container');
        this.txtAdministerTime = page.locator('[name="administer-time"]');
        this.txtFollowUpTime = page.locator('[name="follow-up-time"]');
        this.txtFollUpDate = page.locator('[name="follow-up-date"]');
        this.txtCommentField = page.getByRole('textbox', { name: 'mar-textarea' });
        this.txtToDoBadge = page.locator('.ms-2.badge.rounded-pill.bg-danger');
        this.btnReset = page.locator('button.mar-danger-button');
        this.txtResetMsg = page.locator('.mar-reset-secondary-text');
        this.txtFilterDate = page.locator('[name="filter-date"]');
        this.txtUserLocalDateAndTime = page.locator('.d-flex.align-items-center.d-sm-flex');
        this.btnCloseDetailModal = page.locator('div.t-modal-header:has-text("Detail Data") >> button.btn-close');
        this.btnClose = page.locator('[class="btn-close"]');
        this.btnFollowUp = page.locator('.th-link.me-3');
        this.btnUpdateHistory = page.getByText('Update History');
        this.btnUpdateHistoryClose = page.locator('div.t-modal-header:has-text("Update History") >> button.btn-close');
        this.txtFollowUpScheduleTime = page.locator('[name="schedule-time"]');
        this.txtFollowUpScheduleDate = page.locator('[name="schedule-date"]');
        this.btnToDoTab = page.getByRole("tab", { name: 'To Do' });
        this.txtAlertMsg = page.locator('div[role="alert"]');
        this.chkScheduleFollowUp = page.locator('#schedule-follow-up');
        this.chkSchedulePRN = page.locator('#schedule-prn');
        this.followupDialog = page.getByRole('dialog').filter({ hasText: 'FollowupUpdate History*' });

        this.lnkRecordView = index => page.locator('.th-rounded-bottom.th-border.border-top-0.tab-content').nth(index).locator('.th-link').last();
        this.tabPanel = index => page.locator('.th-rounded-bottom.th-border.border-top-0.tab-content').nth(index);
    }
    async scheduleFollowUp(tabIndex) {
        const userLocalTime = await this.marCommonUtils.txtUserLocalTime();
        await this.chkScheduleFollowUp.check();
        await this.txtFollowUpScheduleTime.first().clear();
        await this.txtFollowUpScheduleTime.first().fill(userLocalTime);
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
        await this.chkScheduleFollowUp.check();
        const txtFollowUpScheduleDate = this.txtFollowUpScheduleDate;
        const futureDate = await this.marCommonUtils.pastAndFutureDate(1, txtFollowUpScheduleDate)
        await this.txtFollowUpScheduleDate.clear()
        await this.txtFollowUpScheduleDate.fill(futureDate)
        await this.txtFollowUpScheduleTime.first().clear();
        await this.txtFollowUpScheduleTime.first().fill(userLocalTime);
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
        await this.btnFollowUp.last().click()
        await this.commonButtons.clickButton('Resolve');
        await this.followupDialog.getByLabel('mar-textarea').fill('Resolved');
        await this.followupDialog.getByText('Save').click();
        await this.commonButtons.clickButton('Ok');
        await this.btnClose.click();
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
        await this.btnClose.click();
        await this.btnFollowUp.last().click()
        const txtFollowUpDate = this.txtFollUpDate;
        const pastDate = await this.marCommonUtils.pastAndFutureDate(-1, txtFollowUpDate)
        await this.txtFollUpDate.clear()
        await this.txtFollUpDate.fill(pastDate)
        await this.txtFollowUpTime.fill(userLocalTime);
        await this.txtCommentField.fill('New Follow Up');
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
        await this.btnClose.click();
    }

    async schedulePRN(tabIndex) {
        const userLocalTime = await this.marCommonUtils.txtUserLocalTime();
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
        await this.chkSchedulePRN.check();
        await this.txtFollowUpScheduleTime.last().clear();
        await this.txtFollowUpScheduleTime.last().fill(userLocalTime);
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Ok');
    }

    async pastDateValidation(tabIndex, slotIndex, i) {
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);
        await this.lnkRecordView(tabIndex).click();
        await this.page.waitForTimeout(600000);
        await expect(this.btnReset).toBeEnabled();
        await this.btnReset.click();
        await this.commonButtons.clickButton('Yes');
        const msg = (await this.txtAlertMsg.textContent()).trim();
        expect(msg).toBe('Data cannot be reset for a past date');
    }

    async verifyResetButtonExistenceForPastDate(tabIndex, slotIndex, i) {
        const dateLocator = this.txtFilterDate;
        const dayOffset = -1;
        await this.marCommonUtils.changeDateAndFilterDailyMAR(dayOffset, dateLocator);
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
        await this.btnCloseDetailModal.click();
    }

    async recordDataWithAllTypesRecorAndVerifyResetButton(tabIndex, slotIndex, totalRecordType) {
        const tab = await this.marDailyDataFilter.getTabName()
        await this.page.getByRole("tab", { name: tab }).click();
        await this.btnViewDetails.click();

        for (let recordTypeIndex = 0; recordTypeIndex < totalRecordType; recordTypeIndex++) {
            await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, recordTypeIndex);
            await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
            await this.marCommonUtils.resetButtonEnableVerify()
        }

        await this.btnViewDetails.click();
    }

    async recordAndResetScheduleMedicationData(medName, tabIndex, slotIndex, i) {
        let toDoCountBeforeRecord = await this.marCommonUtils.toDoCount();
        await this.marCommonUtils.selectScheduledTimes(tabIndex, slotIndex);
        await this.commonUtils.waitForChangeInDOM(`.tq-tabs-header:nth-child(${tabIndex + 1})`);
        const detailsBeforeRecord = await this.marCommonUtils.getRecordDetails(tabIndex);
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);

        const toDoCountAfterRecord = await this.marCommonUtils.toDoCount();
        expect(toDoCountAfterRecord).toEqual(toDoCountBeforeRecord - 1);

        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await this.marCommonUtils.checkAndMatchUpdateHistory('Due', 'Administered');
        await this.marCommonUtils.confirmReset();
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await this.marCommonUtils.checkAndMatchUpdateHistory('Administered', 'Due');
        await this.btnCloseDetailModal.click()
        const toDoCountAfterReset = await this.marCommonUtils.toDoCount();
        expect(toDoCountAfterReset).toEqual(toDoCountBeforeRecord);

        const detailsAfterReset = await this.marCommonUtils.getRecordDetails(tabIndex);
        expect(detailsBeforeRecord).toEqual(detailsAfterReset);
        await this.btnToDoTab.click();

        const medCount = await this.page.locator('.med-title:visible', { hasText: medName }).count();
        expect(toDoCountAfterReset).toEqual(medCount);
        await this.recordDataWithAllTypesRecorAndVerifyResetButton(tabIndex, slotIndex, recordData.length);
        await this.verifyResetButtonExistenceForPastDate(tabIndex, slotIndex, i);
        await this.marDailyDataBulkEntry.verifyResetButtonExistenceForFutureDateUsingBulkEntry(tabIndex, slotIndex);
        await this.marDailyDataQuickEntry.verifyResetButtonForQuickEntry(medName);

    }

    async recordAndResetPRNMedicationData(tabIndex, slotIndex, i) {
        let toDoCountBeforeRecord = await this.marCommonUtils.toDoCount();
        expect(toDoCountBeforeRecord).toEqual(0);
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);
        let toDoCountAfterRecord = await this.marCommonUtils.toDoCount();
        expect(toDoCountAfterRecord).toEqual(0);
        await this.schedulePRN(tabIndex);
        let afterPRNCount = await this.marCommonUtils.toDoCount();
        expect(afterPRNCount).toEqual(toDoCountAfterRecord + 1);
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);
        toDoCountAfterRecord = await this.marCommonUtils.toDoCount();
        expect(toDoCountAfterRecord).toEqual(afterPRNCount - 1);
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toBeEnabled();
        await this.scheduleFollowUp(tabIndex);
        let afterFollowUpCount = await this.marCommonUtils.toDoCount();
        expect(afterFollowUpCount).toEqual(toDoCountAfterRecord);
    }

    async recordAndResetOtherMedicationData(tabIndex, slotIndex, i) {
        let toDoCountBeforeRecord = await this.marCommonUtils.toDoCount();
        await this.marCommonUtils.selectScheduledTimes(tabIndex, slotIndex);
        await this.marCommonUtils.recordDailyData(tabIndex, slotIndex, i);
        expect(toDoCountBeforeRecord).toEqual(0);
        await this.marCommonUtils.clickRecordViewOrAddRecord(tabIndex);
        await expect(this.btnReset).toHaveCount(0);
    }
}