/**
 * @author Sheikh Faiyaz Mahamud
 * @since 26/05/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class BillingProvider {

    constructor(page) {
        this.page = page;
        this.btnEntryType = page.locator(`#personEntityPickerBtn`);
        this.txtOrganizationName = page.locator(`[name='name']`);
        this.txtFirstName = page.locator(`[name='firstName']`);
        this.txtLastName = page.locator(`[name='lastName']`);
        this.btnIdType = page.locator(`#idTypePickerBtn`);
        this.txtIdNumber = page.locator(`[name='idNumber']`);
        this.txtNpiNumber = page.locator(`[name='npiNumber']`);
        this.txtStreet1 = page.locator(`[name='address1']`);
        this.txtCity = page.locator(`[name='city']`);
        this.btnState = page.locator(`#statePickerBtn`);
        this.txtZip = page.locator(`[name='zip']`);
        this.commonUtils = new CommonUtils(page);
    }

    async fillUpBillingProviderForm(data) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnEntryType, data.entryType);

        if (data.entryType.trim().toLowerCase() === 'person') {
            await this.txtFirstName.fill(data.firstName);
            await this.txtLastName.fill(data.lastName);
        } else if (data.entryType.trim().toLowerCase() === 'non person') {
            await this.txtOrganizationName.fill(data.organizationName);
        }
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnIdType, data.idType);
        await this.txtIdNumber.fill(data.idNumber);
        await this.txtNpiNumber.fill(data.npiNumber);
        await this.txtStreet1.fill(data.street1);
        await this.txtCity.fill(data.city);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnState, data.state);
        await this.txtZip.fill(data.zip);
    }

    async updateBillingProviderForm(data) {
        await this.txtStreet1.fill(data.updatedStreet1);
    }
}
