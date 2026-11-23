/**
* @author Sheikh Faiyaz Mahamud
* @since 07/04/2025
*/

import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class FundingSource {

    constructor(page) {
        this.page = page;
        this.txtName = page.locator(`[name='name']`);
        this.txtStreet1 = page.locator(`[name='street1']`);
        this.txtCity = page.locator(`[name='city']`);
        this.btnState = page.locator(`#statePickerBtn`);
        this.txtZip = page.locator(`[name='zip']`);
        this.btnPayer = page.locator(`#payerIdPickerBtn`);
        this.commonUtils = new CommonUtils(page);
    }

    async fillUpFundingSourceForm(data) {
        await this.txtName.fill(data.fundingSource);
        await this.txtStreet1.fill(data.street1);
        await this.txtCity.fill(data.city);
        await this.txtZip.fill(data.zip);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnState, data.state);
        // await this.page.waitForTimeout(2000);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnPayer, data.payer);
    }

    async updateFundingSourceForm(data) {
        await this.txtCity.fill(data.updatedCity);
        await this.txtZip.fill(data.updatedZip);
    }
}
