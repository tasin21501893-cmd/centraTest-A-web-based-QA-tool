/**
 * @author Emran Hossain Rabbi
 * @since 12/07/2025
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { MarCommonUtils } from './marCommonUtils.js';
import { MarDailyDataFilter } from './marDailyDataFilter.js';

export class MarDailyDataQuickEntry {
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.marCommonUtils = new MarCommonUtils(page);
        this.marDailyDataFilter = new MarDailyDataFilter(page);

        this.tqTabHeader = page.locator('.tq-tabs-header');
        this.scheduleDetailsContainer = page.locator('.schedule-details-container');
        this.addRecordContainer = page.locator('.tq-tabs-add-record-container');
        this.lnkRecordView = index => page.locator('.th-rounded-bottom.th-border.border-top-0.tab-content').nth(index).locator('.th-link').last();
    }

    async verifyResetButtonForQuickEntry(medName) {
        const tqTabIndex = 1;
        await this.marDailyDataFilter.filterMedicationFromDailyMAR(medName);
        const slot = this.page.locator('.tq-tabs-header').nth(tqTabIndex).locator('.rounded-top.tq-tab-border.nav-item').nth(2);
        await slot.click();
        const amount = (await this.scheduleDetailsContainer.nth(tqTabIndex).locator('div:has-text("Give Amount / Quantity")').locator('span.fw-bold').innerText()).trim();
        const frequency = (await this.scheduleDetailsContainer.nth(tqTabIndex).locator('div:has-text("Frequency")').locator('span.fw-bold').innerText()).trim();
        const scheduleTime = (await this.tqTabHeader.nth(1).locator('a[aria-selected="true"]').innerText()).trim();
        await this.commonButtons.clickButton('Quick Entry');

        const selectedMedicationRowForQuickEntry = this.page.locator('div.d-flex.justify-content-between').filter({
            has: this.page.locator('.med-title', { hasText: medName })
        }).filter({
            has: this.page.locator('.info-border', { hasText: scheduleTime })
        }).filter({
            has: this.page.locator('.info-border', { hasText: frequency })
        }).filter({
            has: this.page.locator('.info-border', { hasText: amount })
        });

        await selectedMedicationRowForQuickEntry.locator('input[type="checkbox"]').check();

        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Ok');
        await this.marCommonUtils.clickRecordViewOrAddRecord(tqTabIndex);
        await this.marCommonUtils.confirmReset()
        await this.commonButtons.clickButton('Quick Entry');
        await expect(selectedMedicationRowForQuickEntry).toHaveCount(1);
    }

}