/**
 * @author Maksuda Islam (Lima)
 * @since 01/09/2024
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class ProviderPage {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.buttons = new CommonButtons(page);
        this.ddlProviderType = page.locator('[name="provider\\.type"]');
        this.txtProviderCode = page.locator('[name="provider\\.code"]');
        this.txtProviderName = page.locator('[name="provider\\.name"]');
        this.ddlOperatingState = page.locator('[name="provider\\.state"]');
        this.txtCounty = page.locator('[name="provider\\.county"]');
        this.txtPhone = page.locator('[name="provider\\.phone"]');
        this.txtFax = page.locator('[name="provider\\.fax"]');
        this.txtEmailAddress = page.locator('[name="provider\\.email"]');
        this.ddlTimeZone = page.locator('[name="provider\\.tz"]');

        this.ddlPreferredDocStorageLimit = page.locator('[name="preference\\.docStorageLimit"]');

        this.rdoDemoAccountYes = page.getByLabel('Yes');
        this.rdoDemoAccountNo = page.getByLabel('No', { exact: true });

        this.rdoStatusPending = page.getByLabel('Pending', { exact: true });
        this.rdoStatusActive = page.getByLabel('Active');
    }

    async checkDemoRadioButton(demo) {
        if (demo == "Yes") {
            await this.utils.selectRadioButton(this.rdoDemoAccountYes);
        }
        else if (demo == "No") {
            await this.utils.selectRadioButton(this.rdoDemoAccountNo);
        }
    }

    async checkStatusButton(status) {
        if (status == 'Active') {
            await this.utils.selectRadioButton(this.rdoStatusActive);
        }
        else if (status == 'Pending') {
            await this.utils.selectRadioButton(this.rdoStatusPending);
        }
    }

    async enableFlags(flagEnableList) {
        for (let flagEnableIndex = 0; flagEnableIndex < flagEnableList.length; flagEnableIndex++) {
            await this.page.getByLabel(flagEnableList[flagEnableIndex], { exact: true }).check()
        }
    }

    async createNewProvider(data) {
        await this.ddlProviderType.selectOption(data.providerType);
        await this.txtProviderCode.fill(data.providerCode);
        await this.txtProviderName.fill(data.name);
        await this.buttons.clickButton('Add / Edit');
        await this.utils.fillUpAddressAndLocationWithLocator('provider.address.autocomplete', '', data);
        await this.buttons.clickButton('Submit');
        await this.buttons.clickButton('Yes');
        await this.ddlOperatingState.selectOption(data.operatingStateValue);
        await this.txtCounty.fill(data.countryName);
        await this.txtPhone.fill(data.phone);
        await this.txtFax.fill(data.faxID);
        await this.txtEmailAddress.fill(data.emailAddress);
        await this.ddlTimeZone.selectOption(data.timeZone);
        await this.checkDemoRadioButton(data.demo);
        await this.checkStatusButton(data.status);

        if (data.flagEnableList && data.flagEnableList.trim() !== '') {
            let array = data.flagEnableList.split(',');
            await this.enableFlags(array, data.providerCode);
        }

        if (data.documentStorageLimit) {
            if (await this.page.getByLabel('Enable Document Storage Module', { exact: true }).isChecked()) {
                await this.ddlPreferredDocStorageLimit.selectOption(data.documentStorageLimit);
            }
        }
    }

    async saveProvider() {
        await this.buttons.clickButton('Save');
        await this.buttons.clickButton('Yes');
    }

    async enableFlagsForExistingProviders(flagEnableList) {
        if (flagEnableList) {
            for (let flagEnableIndex = 0; flagEnableIndex < flagEnableList.length; flagEnableIndex++) {
                if (!(await this.page.getByLabel(`${flagEnableList[flagEnableIndex]}`, { exact: true }).isChecked())) {
                    await this.page.getByLabel(flagEnableList[flagEnableIndex], { exact: true }).check();
                }
            }
        }
    }
}