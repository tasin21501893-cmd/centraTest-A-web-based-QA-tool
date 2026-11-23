/**
 * @author Muhammad Muntasir Mamoor
 * @since 26/12/24
*/

import { CommonUtils } from '../../commonUtility/commonUtils.js'

export class PlacePage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.txtName = page.locator('[name="name"]');
        this.ddlStatusFilter = page.locator('#status');
    }

    async fillUpPlaceForm(data) {
        await this.commonUtils.fillUpAddressAndLocation(data.addressStreet1, data.addressStreet2, data.addressCity, data.addressZip, data.addressState, data.addressCountry, data.location, data.useAddressAndLocation)
        await this.txtName.fill(data.name);
    }

    async filterStatus(status) {
        await this.ddlStatusFilter.selectOption(status);
        await this.page.waitForLoadState("domcontentloaded");
    }
}