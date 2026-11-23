/**
 * @author Sheikh Faiyaz Mahamud
 * @since 15/06/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class AttendanceDataUpdatePage {

    constructor(page) {
        this.page = page;
        this.iframe = page.frameLocator(`.modal-body > iframe`);
        this.txtTimeIn = this.iframe.locator(`[name='billableTimeTrackers[0].timeInStr']`);
        this.txtTimeOut = this.iframe.locator(`[name='billableTimeTrackers[0].timeOutStr']`);
        this.commonButtons = new CommonButtons(page);
    }

    async updateTimeOut(data) {
        await this.txtTimeOut.fill(data.updatedTimeOut);
    }

    async clickUpdate() {
        await this.commonButtons.clickButton('Update', this.iframe);
        const btnYes = this.commonButtons.getButtonLocator('Yes', this.iframe);
        try {
            await btnYes.waitFor({ state: 'visible', timeout: 1000 });
            await btnYes.click();
        } catch (e) {
        }
        await this.page.locator('.modal-body').waitFor({ state: 'detached', timeout: 5000 });
    }

    async confirmDelete() {
        await this.commonButtons.clickButton('Yes', this.iframe);
        await this.page.locator('.modal-body').waitFor({ state: 'detached', timeout: 5000 });
    }
}
