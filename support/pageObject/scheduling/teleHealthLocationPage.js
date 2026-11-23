/**
 * @author Abdullah Umar Nasib
 * @since 04/20/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class TeleHealthLocationPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);

        this.txtLocationName = page.locator('[name="locationName"]');
        this.errMsgLocationName = page.locator('#locationName\\.errors');
        this.txtStreet1 = page.locator('[name="address.street1"]');
        this.errMsgStreet1 = page.locator('#address\\.street1\\.errors');
        this.txtStreet2 = page.locator('[name="address.street2"]');
        this.errMsgStreet2 = page.locator('#address\\.street2\\.errors');
        this.txtCity = page.locator('[name="address.city"]');
        this.errMsgCity = page.locator('#address\\.city\\.errors');
        this.txtZipCode = page.locator('[name="address.zip"]');
        this.errMsgZipCode = page.locator('#address\\.zip\\.errors');
        this.errMsgCountry = page.locator('#address\\.country\\.errors');
        this.lnkNewTeleHealthLocation = page.locator('a:has-text("New TeleHealth Location")');
        this.txtAvailableIndividualSearch = page.locator('.available-search');
        this.ulAvailableIndividuals = page.locator('.ul-available');
        this.txtIndividualSelectedSearch = page.locator('.selected-search');
        this.ulSelectedIndividuals = page.locator('.ul-selected');
        this.btnRemoveAllIndividuals = page.locator('.selected .remove-all-button').first();

        this.successAlertMsg = page.locator('div.alert.alert-success.text-center');
        this.errorAlertMsg = page.locator('div.alert.alert-danger');
    }

    async navigateToNewForm() {
        await this.lnkNewTeleHealthLocation.waitFor({ state: 'visible' });
        await this.lnkNewTeleHealthLocation.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectIndividuals(data) {
        await this.commonUtils.addItemsFromMultiselect(
            data.individuals,
            null,
            this.txtAvailableIndividualSearch,
            this.ulAvailableIndividuals,
            null
        );
    }

    async removeIndividuals(data) {
        await this.commonUtils.removeItemsFromMultiselect(
            data.individualsToRemove,
            data.removeAll,
            this.txtIndividualSelectedSearch,
            this.ulSelectedIndividuals,
            this.btnRemoveAllIndividuals
        );
    }

    async fillUpTeleHealthLocationForm(data) {
        await this.page.waitForLoadState('domcontentloaded');

        if (data.locationName) {
            await this.txtLocationName.fill(data.locationName);
        }

        const searchLocation = data.location || `${data.street1 || ''} ${data.city || ''} ${data.state || ''} ${data.zipCode || ''}`.trim();

        await this.commonUtils.fillUpAddressAndLocation(
            data.street1, data.street2, data.city, data.zipCode, data.state,
            data.country, searchLocation, data.useAddressAndLocation);

        await this.selectIndividuals(data);
        await this.removeIndividuals(data);
    }

    async fillupTeleHealthLocationWithoutLocation(data) {
        if (data.locationName) {
            await this.txtLocationName.fill(data.locationName);
        }

        await this.commonUtils.fillUpAddress(
            data.street1, data.street2, data.city, data.zipCode, data.state,
            data.country);

        await this.selectIndividuals(data);
        await this.removeIndividuals(data);
    }

    async fillUpTeleHealthLocationFormAndSave(data) {
        await this.fillUpTeleHealthLocationForm(data);
        await this.commonButtons.clickButton('Save');

        await this.page.waitForLoadState('domcontentloaded');
        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
    }
}