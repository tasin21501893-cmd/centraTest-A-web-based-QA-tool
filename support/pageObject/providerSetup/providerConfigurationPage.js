/**
 * @author Abdullah Umar Nasib
 * @author Emran Hossain Rabbi
 * @since 10/02/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { expect } from 'playwright/test';

export class ProviderConfigurationPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.txtEmdeon = page.locator('#preference\\.emdeonFacilityId')
        this.txtEmergencyContact1Name = page.locator('[name="provider\\.emerg1Name"]');
        this.txtEmergencyContact1PhoneNo = page.locator('[name="provider\\.emerg1Telno"]');
        this.txtEmergencyContact1PhoneNoExt = page.locator('[name="provider\\.emerg1TelnoExt"]');
        this.txtEmergencyContact2Name = page.locator('[name="provider\\.emerg2Name"]');
        this.txtEmergencyContact2PhoneNo = page.locator('[name="provider\\.emerg2Telno"]');
        this.txtEmergencyContact2PhoneNoExt = page.locator('[name="provider\\.emerg2TelnoExt"]');
        this.ddlPreferredDocStorageLimit = page.locator('[name="preference\\.docStorageLimit"]');
        this.ddlPreferredSummarizationLLM = page.locator('[name="preference\\.summarizationLlm"]');
        this.btnSave = page.locator('[name="saveButton"]');
        this.txtTitle = page.locator('.h2');
    }

    async checkUncheckModulesForProviderAgainstData(data) {
        const EXCLUDED_FIELDS = [
            'testCaseNumber',
            'testCaseName',
            'providerCode'];

        const EXCLUDED_FIELDS_SELECTS_ITEMS = [
            'Disable "Other" option from GER',
            'Select Summarization Prompt(s)',
            'Select Dashboards',
            'Select Tools',
            'Select Life Trajectory Template'
        ];

        for (let moduleTitle of Object.keys(data)) {
            moduleTitle = moduleTitle.trim();

            if (!moduleTitle || EXCLUDED_FIELDS.includes(moduleTitle) || EXCLUDED_FIELDS_SELECTS_ITEMS.includes(moduleTitle)) continue;
            const moduleValue = data[moduleTitle];

            if (CommonUtils.isAffirmative(moduleValue)) {
                await this.page.getByLabel(moduleTitle, { exact: true }).check();

                if (moduleTitle === 'Enable Emdeon') {
                    await this.txtEmdeon.fill(data['Emdeon Facility Id'])
                }

                if (moduleTitle === 'Enable Document Storage Module') {
                    await this.ddlPreferredDocStorageLimit.selectOption(data['Document Storage Limit (Per Individual)']);
                }

                if (moduleTitle === 'Enable LLM Summary Report') {
                    await this.ddlPreferredSummarizationLLM.selectOption(data['Select Summarization LLM']);
                }
            }

            else if (CommonUtils.isNegative(moduleValue)) {
                await this.page.getByLabel(moduleTitle, { exact: true }).uncheck();
            }
        }

        for (const labelText of EXCLUDED_FIELDS_SELECTS_ITEMS) {

            if (data[labelText] && typeof data[labelText] === 'string') {
                const arrayOfSelectedItems = data[labelText].split(',');
                await this.selectOptions(arrayOfSelectedItems)
            }
        }
    }

    async selectOptions(desiredOptions) {
        for (const value of desiredOptions) {
            const isAlreadySelected = await this.page.locator(`.ul-selected li[data-label="${value.trim()}"]`).isVisible();
            if (!isAlreadySelected) {
                await this.page.locator(`.ul-available li[data-label="${value.trim()}"]`).click();
            }
        }
    }

    async fillupEmpergencyContact1(data) {
        await this.txtEmergencyContact1Name.fill(data.emergencyContact1Name);
        await this.txtEmergencyContact1PhoneNo.fill(data.emergencyContact1PhoneNo);
        await this.txtEmergencyContact1PhoneNoExt.fill(data.emergencyContact1PhoneNoExt);
    }

    async fillupEmpergencyContact2(data) {
        await this.txtEmergencyContact2Name.fill(data.emergencyContact2Name);
        await this.txtEmergencyContact2PhoneNo.fill(data.emergencyContact2PhoneNo);
        await this.txtEmergencyContact2PhoneNoExt.fill(data.emergencyContact2PhoneNoExt);
    }

    async saveProvider() {
        await this.btnSave.click();
        await this.page.waitForLoadState('load');
        expect(await this.page.url()).toContain('providerList');
    }
}