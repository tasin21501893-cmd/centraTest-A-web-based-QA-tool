/**
 * @author Sheikh Faiyaz Mahamud
 * @since 24/06/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class BillingDataPage {
    constructor(page) {
        this.page = page;
        this.dtpServiceDateFrom = page.locator("[name='serviceDate']");
        this.dtpServiceDateTo = page.locator("[name='serviceDateTo']");
        this.txtTotalUnits = page.locator("[name='billableUnit']");
        this.txtComments = page.locator("[name='comments']");
        this.txtUnitRate = page.locator('#unitCost');

        this.commonButtons = new CommonButtons(page);
    }

    async getUnitRate() {
        return Number(await this.txtUnitRate.inputValue());
    }

    async fillBillingDataForm(data) {
        await this.dtpServiceDateFrom.waitFor({ state: 'visible', timeout: 5000 });
        await this.dtpServiceDateFrom.fill(data.serviceDateFrom);
        await this.dtpServiceDateTo.fill(data.serviceDateTo);
        await this.txtTotalUnits.fill(data.totalBillableUnits);
    }

    async updateBillingDataForm(data) {
        await this.txtComments.waitFor({ state: 'visible', timeout: 5000 });
        await this.txtComments.fill(data.comments);
        await this.txtTotalUnits.fill(data.updatedTotalBillableUnits);
    }

    async handleDuplicateWarning() {
        try {
            await this.page.locator('text=One or more Billing Data has already been entered').waitFor({ state: 'visible', timeout: 3000 });
            await this.commonButtons.clickButton('Yes');
        } catch (error) {
            console.log('Duplicate warning did not appear within timeout, proceeding normally.');
        }
    }

    async updateTotalBillableUnitsToZero() {
        await this.txtTotalUnits.fill('0');
    }
}
