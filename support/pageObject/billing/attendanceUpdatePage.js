/**
 * @author Sheikh Faiyaz Mahamud
 * @since 01/09/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class AttendanceUpdatePage {

    constructor(page) {
        this.page = page;
        this.iframe = page.frameLocator(`.modal-body > iframe`);

        this.billableTimeIn = (index) => this.iframe.locator(`[name='billableTimeTrackers[${index}].timeInStr']`);
        this.billableTimeOut = (index) => this.iframe.locator(`[name='billableTimeTrackers[${index}].timeOutStr']`);
        this.nonBillableTimeIn = (index) => this.iframe.locator(`[name='nonBillableTimeTrackers[${index}].timeInStr']`);
        this.nonBillableTimeOut = (index) => this.iframe.locator(`[name='nonBillableTimeTrackers[${index}].timeOutStr']`);
        this.nonBillableNotes = (index) => this.iframe.locator(`[name='nonBillableTimeTrackers[${index}].comments']`);

        this.billableSecondRowTimeIn = this.iframe.locator('[name="billableTimeTrackers[1].timeInStr"]');
        this.nonBillableFirstRowTimeIn = this.iframe.locator('[name="nonBillableTimeTrackers[0].timeInStr"]');
        this.nonBillableSecondRowTimeIn = this.iframe.locator('[name="nonBillableTimeTrackers[1].timeInStr"]');

        this.btnBillableAddTimeInOut = this.iframe.locator(`#addNewTimeTrack[value='billable']`);
        this.btnNonBillableAddTimeInOut = this.iframe.locator(`#addNewTimeTrack[value='nonBillable']`);
        this.btnBillableDeleteIcon = this.iframe.locator(`button[name^='removeTimeTrack']`);
        this.errorMessage = this.iframe.locator(`.alert.alert-danger`);

        this.commonButtons = new CommonButtons(page);
    }

    async fillUpBillableRow1(index, data) {
        await this.billableTimeIn(index).fill(data.firstBillableTrackTimeIn);
        await this.billableTimeOut(index).fill(data.firstBillableTrackTimeOut);
    }

    async fillUpBillableRow2(index, data) {
        await this.billableTimeIn(index).fill(data.secondBillableTrackTimeIn);
        await this.billableTimeOut(index).fill(data.secondBillableTrackTimeOut);
    }

    async fillUpNonBillableRow1(index, data) {
        await this.nonBillableTimeIn(index).fill(data.firstNonBillableTrackTimeIn);
        await this.nonBillableTimeOut(index).fill(data.firstNonBillableTrackTimeOut);
        await this.nonBillableNotes(index).fill(data.nonBillableComments);
    }

    async fillUpNonBillableRow2(index, data) {
        await this.nonBillableTimeIn(index).fill(data.secondNonBillableTrackTimeIn);
        await this.nonBillableTimeOut(index).fill(data.secondNonBillableTrackTimeOut);
        await this.nonBillableNotes(index).fill(data.nonBillableComments);
    }

    async attendanceDataDelete() {
        await this.commonButtons.clickButton('Delete', this.iframe);
        await this.commonButtons.clickButton('Yes', this.iframe);
        await this.page.waitForTimeout(1000);
    }

    async clickUpdateButton() {
        await this.commonButtons.clickButton('Update', this.iframe);
        await this.page.waitForTimeout(500);
        await this.handlePromptYes();
    }

    async handlePromptYes() {
        if (await this.commonButtons.isButtonPresent('Yes', this.iframe)) {
            await this.commonButtons.clickButton('Yes', this.iframe);
            await this.page.waitForTimeout(300);
        }
    }

    async createBillableRow2() {
        if (await this.billableSecondRowTimeIn.count() === 0) {
            await this.btnBillableAddTimeInOut.click();
        }
    }

    async createNonBillableRow1() {
        if (await this.nonBillableFirstRowTimeIn.count() === 0) {
            await this.btnNonBillableAddTimeInOut.click();
        }
    }

    async createNonBillableRow2() {
        if (await this.nonBillableSecondRowTimeIn.count() === 0) {
            await this.btnNonBillableAddTimeInOut.click();
        }
    }
}
