/**
* @author Emran Hossain Rabbi
* @since 08 / 02 / 2026
*/

import { expect } from '@playwright/test';
import { writeExcelCell } from "../../../support/commonUtility/write-xlsx.js";
import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { DonePage } from "../../commonPages/donePage.js";
import { MedHistoryCommonUtils } from "../medHistory/medHistoryCommonUtils.js";
import { resourcePaths } from '../../constants/resourcePaths.js';
import { DateTimeUtils } from '../../../support/commonUtility/dateTimeUtils.js';

const filePath = resourcePaths.PHARMACY_DATA;
const sheetName = 'Pharmacy';

/**
 * Page object for Pharmacy Configuration related actions
 */
export class PharmacyConfigurationPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
        this.medHistoryCommonUtils = new MedHistoryCommonUtils(page);

        // Locators
        this.txtPharmacyName = page.locator('#pharmacy\\.name');
        this.txtExternalPharmacyId = page.locator('#pharmacy\\.externalPharmacyId');
        this.txtPassword = page.locator('#inputPass');
        this.txtVerifyPassword = page.locator('#inputVerifyPass');
        this.txtFormId = page.locator('#formId');

        // Dropdowns
        this.ddlDataFormat = 'select#pharmacy\\.pharmacyDataFormat';
        this.ddlPharmacySystemVendor = 'select#pharmacy\\.pharmacySystemVendor';

        // Table
        this.tblPharmacyList = '#dataList';

        // Labels (Strings used as identifiers)
        this.lblPharmacyName = 'Pharmacy Name';
        this.lblExternalPharmacyId = 'External Pharmacy ID';
    }

    /**
     * Creates a new pharmacy and verifies its creation in search and details view
     * @param {Array} pharmacyData Array containing pharmacy creation data
     */
    async createPharmacyAndVerify(pharmacyData) {
        const pharmacyName = `Pharmacy auto ${DateTimeUtils.getFutureDateTimeInEpoch()}`;

        await this.enterPharmacyInformation(pharmacyData[0], pharmacyName);

        const formId = await this.donePage.fetchFormIdFromDoneMessage();

        await this.updateExcelUsername(pharmacyData.length, pharmacyName);
        await this.verifyPharmacyFromSearch(formId, pharmacyName);
        await this.verifyPharmacyDetails(formId, pharmacyName);
    }

    /**
     * Enters pharmacy information into the creation form
     * @param {Object} data The data object containing pharmacy configuration
     * @param {string} pharmacyName The generated name for the pharmacy
     */
    async enterPharmacyInformation(data, pharmacyName) {
        await this.txtPharmacyName.fill(pharmacyName);
        await this.txtExternalPharmacyId.fill(pharmacyName);
        await this.page.selectOption(this.ddlDataFormat, data.DataFormat);
        await this.page.selectOption(this.ddlPharmacySystemVendor, data.PharmacySystemVendor);
        await this.txtPassword.fill(data.Password);
        await this.txtVerifyPassword.fill(data.Password);
        await this.commonButtons.clickButton('Save');
    }

    /**
     * Updates the username in the excel file
     * @param {number} totalRows Total rows to update
     * @param {string} pharmacyName The pharmacy name to write
     */
    async updateExcelUsername(totalRows, pharmacyName) {
        for (let row = 2; row < totalRows + 2; row++) {
            await writeExcelCell({ filePath, sheetName, row, col: 'Username', value: pharmacyName });
        }
    }

    /**
     * Verifies the pharmacy data from the search page
     * @param {string} formId The created form ID
     * @param {string} expectedPharmacyName The expected pharmacy name
     */
    async verifyPharmacyFromSearch(formId, expectedPharmacyName) {
        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'Pharmacy', 'Search');
        await this.txtFormId.fill(formId);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('load');
        expect(await this.commonUtils.getTableDataValueByColumnName(this.tblPharmacyList, this.lblPharmacyName))
            .toBe(expectedPharmacyName);

        expect(await this.commonUtils.getTableDataValueByColumnName(this.tblPharmacyList, this.lblExternalPharmacyId))
            .toBe(expectedPharmacyName);
    }

    /**
     * Verifies the pharmacy details by opening the form
     * @param {string} formId The created form ID
     * @param {string} expectedPharmacyName The expected pharmacy name
     */
    async verifyPharmacyDetails(formId, expectedPharmacyName) {
        await this.page.getByText(formId).click();

        expect((await this.medHistoryCommonUtils.getValueByLabel(this.lblPharmacyName)).trim())
            .toBe(expectedPharmacyName);

        expect((await this.medHistoryCommonUtils.getValueByLabel(this.lblExternalPharmacyId)).trim())
            .toBe(expectedPharmacyName);
    }
}
