/**
* @author Emran Hossain Rabbi
* @since 08 / 02 / 2026
*/

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { DonePage } from "../../commonPages/donePage.js";

/**
 * Page object for Pharmacy Mapping related actions (Provider and Individual)
 */
export class PharmacyMappingPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);

        // Locators for Provider Mapping
        this.txtProviderCode = page.locator('#providerCode');
        this.txtMappedProviderId = page.locator('#pharmacyProvider\\.mappedProviderId');
        this.ddlPharmacyProvider = page.locator('#pharmacyProvider\\.pharmacy');
        this.txtFormId = page.locator('[id="formId"]');

        // Locators for Individual Mapping
        this.txtIndividualSearch = page.locator('[placeholder="Search"]');
        this.txtClientLookup = page.locator('input.clientLookup');
        this.lstAutocomplete = page.locator('.ui-autocomplete');
        this.txtMappedClientId = page.locator('#pharmacyClient\\.mappedClientId');
        this.btnPharmacyClient = page.locator('button[data-id="pharmacyClient.pharmacy"]');
        this.txtSearchBox = page.locator('.bs-searchbox input');

        // Table
        this.tblDataList = '#dataList';
    }

    /**
     * Maps a provider and verifies the mapping
     * @param {string} dataProviderCode 
     * @param {string} linkedPharmacyName 
     * @param {string} linkPId 
     */
    async providerMappingAndVerify(dataProviderCode, linkedPharmacyName, linkPId) {
        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'Link Provider', 'New');
        await this.txtProviderCode.fill(dataProviderCode);
        await this.txtMappedProviderId.fill(linkPId);

        await this.ddlPharmacyProvider.selectOption({ label: `${linkedPharmacyName} (${linkedPharmacyName})` });

        await this.commonButtons.clickButton('Next');
        await this.commonButtons.clickButton('Save');

        const pharmacyLinkedProviderFormId = await this.donePage.fetchFormIdFromDoneMessage();

        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'Link Provider', 'Search');
        await this.txtFormId.fill(pharmacyLinkedProviderFormId);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('load');
        const linkedProivderId = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Linked Provider ID');
        const formID = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Form ID');
        const pharmacyName = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Pharmacy Name');
        const providerCode = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Provider Code');

        expect(linkedProivderId).toEqual(linkPId);
        expect(pharmacyName).toEqual(linkedPharmacyName);
        expect(formID).toEqual(pharmacyLinkedProviderFormId);
        expect(dataProviderCode).toEqual(providerCode);
    }

    /**
     * Maps an individual and verifies the mapping
     * @param {Object} testcase Data object containing testcase information
     */
    async individualMappingAndVerify(testcase) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'Link Individual', 'New');

        await this.txtIndividualSearch.fill(testcase.individualName);
        await this.page.waitForSelector('#ui-id-1', { state: 'visible' });
        await this.page.keyboard.press("ArrowDown");
        await this.page.keyboard.press("Enter");

        await this.txtClientLookup.fill(testcase.individualName);
        await this.lstAutocomplete.waitFor({ state: 'visible' });
        await this.lstAutocomplete.locator('li', { hasText: testcase.individualName }).click();

        await this.txtMappedClientId.fill(testcase["Linked Individual ID"]);
        await this.btnPharmacyClient.click();

        await this.txtSearchBox.fill(testcase.Username);
        await this.page.locator('.dropdown-menu.open a.dropdown-item', { hasText: testcase.Username }).click();

        await this.commonButtons.clickButton('Next');
        await this.commonButtons.clickButton('Link');
    }
}
