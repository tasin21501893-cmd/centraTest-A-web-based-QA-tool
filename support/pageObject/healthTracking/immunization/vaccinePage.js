/**
 * @author Sayed Ahmed Tasin
 * @since 10/29/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';

export class VaccinePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);

        this.txtVaccineName = page.locator('#genericName');
        this.txtCvxShortDescription = page.locator('#cvxAbbrCode');
        this.txtCvxCode = page.locator('#cvxCode');
        this.ddlStatus = page.locator('#status');
        this.btnSave = page.locator('input[name="_action_save"]');
        this.btnCancel = page.locator('input[name="_action_cancel"]');
        this.headerDetails = page.locator('h1:has-text("Vaccine Details")');
    }

    /**
     * Fills out the Vaccine New form and clicks Save.
     * @param {Object} vaccineData
     */
    async createVaccine(vaccineData) {
        if (vaccineData.vaccineName) {
            await this.txtVaccineName.fill(vaccineData.vaccineName);
        }
        if (vaccineData.cvxShortDescription) {
            await this.txtCvxShortDescription.fill(vaccineData.cvxShortDescription);
        }
        if (vaccineData.cvxCode) {
            await this.txtCvxCode.fill(String(vaccineData.cvxCode));
        }
        if (vaccineData.status) {
            await this.ddlStatus.selectOption(vaccineData.status);
        }

        await this.btnSave.click();
        await this.page.waitForURL(url => url.href.includes('vaccineDetails'), { timeout: 15000 });
    }

    /**
     * Verifies that the vaccine was created and displays on the Details page.
     * @param {string} vaccineName
     */
    async verifyVaccineCreated(vaccineName) {
        await expect(this.headerDetails).toBeVisible();
        await expect(this.page.locator(`text=${vaccineName}`).first()).toBeVisible();
    }
}
