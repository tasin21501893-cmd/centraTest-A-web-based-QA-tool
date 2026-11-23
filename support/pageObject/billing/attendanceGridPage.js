/**
 * @author Sheikh Faiyaz Mahamud
 * @since 01/09/2025
 */
import { expect } from '@playwright/test';

import { AttendanceUpdatePage } from './attendanceUpdatePage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';

export class AttendanceGridPage {

    constructor(page) {
        this.page = page;
        this.iframe = page.frameLocator(`.modal-body > iframe`);
        this.tabInput = page.locator(`#inputTab`);
        this.tabUpdate = page.locator(`#updateTab`);
        this.tabApprove = page.locator(`#approveTab`);
        this.tabGenerateBillingData = page.locator(`#billingTab`);
        this.ddlAttendanceOption = page.locator(`[name='attendanceOptionId']`);
        this.txtTimeIn = page.locator(`#timeIn`);
        this.txtTimeOut = page.locator(`#timeOut`);
        this.lblIndName = page.locator(`.clientName`);
        this.chkRow = page.locator(`.chkRow`);
        this.leftoverLink = page.locator('span.option');

        this.btnApproveButton = page.locator(`#approveAtt`);
        this.btnGenerateBillingData = page.locator(`#generateBill`);
        this.modal = page.locator('.modal-content');

        this.commonButtons = new CommonButtons(page);
        this.attendanceUpdatePage = new AttendanceUpdatePage(page);
        this.listPage = new ListPage(page);
    }

    async waitForModal(timeout = 2000) {
        await this.modal.waitFor({ state: 'visible', timeout }).catch(() => null);
        return this.modal;
    }

    async confirmModalIfPresent(buttonText = 'Yes', timeout = 2000) {
        await this.waitForModal(timeout);
        const btn = this.commonButtons.getButtonLocator(buttonText, this.modal);
        if (await btn.isVisible()) {
            await btn.click();
        }
    }

    async deleteAllLeftoverAttendances(commonButtons, attendanceDataUpdatePage) {
        while (await this.leftoverLink.first().isVisible()) {
            await this.leftoverLink.first().click();
            await commonButtons.clickButton('Delete', attendanceDataUpdatePage.iframe);
            await commonButtons.clickButton('Yes', attendanceDataUpdatePage.iframe);
            await this.chkRow.first().waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    async getServiceId() {
        return await this.chkRow.first().evaluate(el => el.value);
    }

    getAttendanceOpenLink(serviceId, serviceDate) {
        return this.page.locator(`#lnk-${serviceId}-${serviceDate} > span`);
    }

    async fillAndSubmitNew(serviceId, serviceDate, gridData) {
        await this.ddlAttendanceOption.selectOption(gridData.attendanceOption);
        await this.txtTimeIn.fill(gridData.timeIn);
        await this.txtTimeOut.fill(gridData.timeOut);

        const attendanceChkBox = this.page.locator(`[id='${serviceId}-${serviceDate}']`);
        await attendanceChkBox.click();
        await this.commonButtons.clickButton('Submit New');
        await this.confirmModalIfPresent('Yes');
    }

    async fillAllGridAndSubmit(gridData, serviceId) {
        await this.ddlAttendanceOption.selectOption(gridData.attendanceOption);
        await this.txtTimeIn.fill(gridData.timeIn);
        await this.txtTimeOut.fill(gridData.timeOut);

        const chkIndividualName = this.page.locator(`[id='chkRow${serviceId}']`);

        await chkIndividualName.click();
        await this.commonButtons.clickButton('Submit New');
        await this.confirmModalIfPresent('Yes');
        await this.tabApprove.click();
        await chkIndividualName.waitFor({ state: 'visible', timeout: 5000 });
        await chkIndividualName.click();
        await this.btnApproveButton.waitFor({ state: 'visible' });
        await this.btnApproveButton.click();
        await this.tabGenerateBillingData.click();
        await chkIndividualName.click();
        await this.btnGenerateBillingData.click();
    }

    async createNewAttendanceAndOpen(serviceDate, attendanceOption) {
        await this.ddlAttendanceOption.selectOption(attendanceOption);

        const serviceId = await this.chkRow.first().evaluate(el => el.value);
        const attendanceChkBox = this.page.locator(`[id='${serviceId}-${serviceDate}']`);
        const attendanceOpenLink = this.page.locator(`#lnk-${serviceId}-${serviceDate} > span`);

        await attendanceChkBox.click();
        await this.commonButtons.clickButton('Submit New');
        await this.confirmModalIfPresent('Yes');
        await attendanceOpenLink.click();
    }

    async gridFillup(serviceDates, attendanceDataArray) {
        await this.tabInput.click();
        const serviceId = await this.chkRow.first().evaluate(el => el.value);

        for (let i = 0; i < serviceDates.length; i++) {
            const serviceDate = serviceDates[i];
            const attendanceOption = attendanceDataArray[i];
            const chkAttendance = this.page.locator(`[id='${serviceId}-${serviceDate}']`);
            const attendanceCell = this.page.locator(`#cell${serviceId}-${serviceDate}`);

            await this.ddlAttendanceOption.selectOption(attendanceOption.attendanceOptions);
            await this.txtTimeIn.fill(attendanceOption.timeIn);
            await this.txtTimeOut.fill(attendanceOption.timeOut);
            await chkAttendance.click();
            await this.commonButtons.clickButton('Submit New');
            await expect(attendanceCell).toBeVisible({ timeout: 5000 });
        }

        await this.tabApprove.click();
        const chkIndividualName = this.page.locator(`[id='chkRow${serviceId}']`);
        await chkIndividualName.waitFor({ state: 'visible', timeout: 5000 });
        await chkIndividualName.click();
        await this.commonButtons.clickButton('Approve');
        await this.tabGenerateBillingData.click();
        await chkIndividualName.click();
        await this.commonButtons.clickButton('Generate Billing Data');
    }
}
