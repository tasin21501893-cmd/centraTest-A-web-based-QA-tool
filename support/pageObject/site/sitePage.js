/**
 * @author Muhammad Muntasir Mamoor
 * @author Akash Ahmed
 * @since 15/08/24
*/

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class SitePage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.txtSiteName = page.locator('[name="name"]');
        this.txtSiteId = page.locator('[name="siteId"]');
        this.txtSiteCode = page.locator('[name="siteCode"]');
        this.txtCostCenterNumber = page.locator('[name="costCenterNumber"]');
        this.ddlTimeZone = page.locator('[name="tz"]');
        this.txtPhoneNo = page.locator('[name="telno"]');
        this.txtPhoneNoExt = page.locator('[name="telnoExt"]');
        this.txtFax = page.locator('[name="fax"]');
        this.modalContent = page.locator('.modal-content .panel-body');

        this.txtAddressStreet1 = page.locator('[name="address.street1"]');
        this.txtAddressStreet2 = page.locator('[name="address.street2"]');
        this.txtCity = page.locator('[name="address.city"]');
        this.ddlState = page.locator('[name="address.state"]');
        this.txtZipCode = page.locator('[name="address.zip"]');
        this.ddlCountry = page.locator('[name="address.country"]');
        this.btnCountryBs = page.locator('#address_country_bs_btn');
        this.txtLocation = page.locator('#locationDisplayLocation');
        this.txtLocationLat = page.locator('[id="location.lat"]');
        this.txtLocationLng = page.locator('[id="location.lng"]');

        this.btnUpdate = page.locator('[name="_action_update"]');
        this.btnDelete = page.locator('[name="_action_delete"]');

        this.btnStatusPicker = page.locator('#statusPickerBtn');
        this.statusText = page.locator('#form-status-text');
    }

    async siteDataFillUp(data) {
        await this.txtSiteName.fill(data.siteName);
        await this.txtSiteId.fill(data.siteId);
        await this.txtSiteCode.fill(data.siteCode);
        await this.txtCostCenterNumber.fill(data.costCenterNumber);

        // Fill up Time Zone only if data.timeZone is provided and not null
        if (data.timeZone !== null && data.timeZone !== undefined && data.timeZone !== '') {
            await this.ddlTimeZone.selectOption(data.timeZone);
        }

        await this.txtPhoneNo.fill(data.phone);
        await this.txtPhoneNoExt.fill(data.phoneExt);
        await this.txtFax.fill(data.fax);
    }

    async siteFormFillUp(data) {
        await this.siteDataFillUp(data);
        await this.commonUtils.fillUpAddressAndLocation(data.street1, data.street2, data.city, data.zip, data.state, data.country, data.location, data.useAddressAndLocation);
    }

    async verifyWarningMsg(expectedMsg) {
        await expect(this.modalContent).toContainText(`${expectedMsg}`);
    }

    async verifyValidationMessage(errorLocator, expectedMsg) {
        await expect(this.page.locator(`#${errorLocator}\\.errors`)).toHaveText(`${expectedMsg}`);
    }

    async clickUpdateButton() {
        await this.btnUpdate.click();
    }

    async clickDeleteButton() {
        await this.btnDelete.click();
    }

    /**
     * Reads all current input, select, and display values for all form fields.
     * @returns {Promise<Object>} Object containing extracted UI values.
     */
    async getFormValues() {

        // --- 1. Country (Bootstrap-Select or Native Select) ---
        let countryValue = await this.btnCountryBs.getAttribute('title');

        if (!countryValue || countryValue === 'Country') {
            countryValue = await this.ddlCountry.evaluate(
                select => select.options[select.selectedIndex]?.text.trim() ?? ''
            ).catch(() => '');
        }

        // --- 2. Time Zone (Static Display or Dropdown Option) ---
        let tzValue = '';
        const tzSelectVisible = await this.ddlTimeZone.isVisible().catch(() => false);

        if (tzSelectVisible) {
            tzValue = await this.ddlTimeZone.evaluate(
                select => select.options[select.selectedIndex]?.text.trim() ?? select.value
            );
        } else {
            tzValue = await this.page.locator('.row:has(#tz-label) .label-value, div.form-group:has(#tz-label) + div').innerText().catch(() => '');
        }

        // --- 3. Location Lat & Lng ---
        const latVal = await this.txtLocationLat.getAttribute('value').catch(() => '');
        const lngVal = await this.txtLocationLng.getAttribute('value').catch(() => '');

        return {
            // Site Details
            siteName: (await this.txtSiteName.inputValue().catch(() => '')).trim(),
            siteId: (await this.txtSiteId.inputValue().catch(() => '')).trim(),
            siteCode: (await this.txtSiteCode.inputValue().catch(() => '')).trim(),
            costCenterNumber: (await this.txtCostCenterNumber.inputValue().catch(() => '')).trim(),
            timeZone: tzValue.trim(),

            // Address Fields
            street1: (await this.txtAddressStreet1.inputValue().catch(() => '')).trim(),
            street2: (await this.txtAddressStreet2.inputValue().catch(() => '')).trim(),
            city: (await this.txtCity.inputValue().catch(() => '')).trim(),
            state: (await this.ddlState.inputValue().catch(() => '')).trim(),
            zip: (await this.txtZipCode.inputValue().catch(() => '')).trim(),
            country: countryValue.trim(),

            // Contact Fields
            phone: (await this.txtPhoneNo.inputValue().catch(() => '')).trim(),
            phoneExt: (await this.txtPhoneNoExt.inputValue().catch(() => '')).trim(),
            fax: (await this.txtFax.inputValue().catch(() => '')).trim(),

            // Location Coordinates
            locationLat: latVal ? latVal.trim() : '',
            locationLng: lngVal ? lngVal.trim() : '',
            location: (await this.txtLocation.inputValue().catch(() => '')).trim()
        };
    }

    /**
     * Asserts UI values match expected data from Excel row object.
     * @param {Object} data - Excel data object for the current test case.
     */
    async verifySiteDetails(data) {
        const actual = await this.getFormValues();

        if (data.siteName !== undefined) expect(actual.siteName).toBe(String(data.siteName));
        if (data.siteId !== undefined) expect(actual.siteId).toBe(String(data.siteId));
        if (data.siteCode !== undefined) expect(actual.siteCode).toBe(String(data.siteCode));
        if (data.costCenterNumber !== undefined) expect(actual.costCenterNumber).toBe(String(data.costCenterNumber));
        if (data.timeZone !== undefined) expect(actual.timeZone).toBe(String(data.timeZone));
        if (data.street1 !== undefined) expect(actual.street1).toBe(String(data.street1));
        if (data.street2 !== undefined) expect(actual.street2).toBe(String(data.street2));
        if (data.city !== undefined) expect(actual.city).toBe(String(data.city));
        if (data.country !== undefined) expect(actual.country).toBe(String(data.country));
        if (data.state !== undefined) expect(actual.state).toBe(String(data.state));
        if (data.zip !== undefined) expect(actual.zip).toBe(String(data.zip));
        if (data.phone !== undefined) expect(actual.phone).toBe(String(data.phone));
        if (data.phoneExt !== undefined) expect(actual.phoneExt).toBe(String(data.phoneExt));
        if (data.fax !== undefined) expect(actual.fax).toBe(String(data.fax));

        if (data.location) {
            const actualLocation = `${actual.locationLat}, ${actual.locationLng}`;
            expect(actualLocation).toBe(String(data.location));
        }
    }
}