/**
 * @author Rifatun Nesa Nishat
 * @since 02/16/2026
 */

import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

import { IdfPage } from './idfPage.js';

export class CaseStatusPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.idfPage = new IdfPage(page);

        this.ddlCaseStatus = page.locator('[name="caseStatus"]');
        this.dtpStartDate = page.locator('[name="startDate"]');
        this.dtpEndDate = page.locator('[name="endDate"]');
    }

    async navigateToCaseStatusForm(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Case Status cannot be saved or updated for Deleted individuals');
        }

        await this.donePage.clickLinkByText('Case Status');
    }

    async fillUpCaseStatusData(data) {
        await this.ddlCaseStatus.selectOption(data.caseStatus);
        await this.dtpStartDate.fill(data.startDate);
        await this.dtpEndDate.fill(data.endDate);
    }

    async saveOrUpdateCaseStatus(data) {
        await this.navigateToCaseStatusForm(data);

        const isEditButtonPresent = await this.commonButtons.isButtonPresent('Edit');

        if (isEditButtonPresent) {
            await this.commonButtons.clickButton('Edit');
        }

        await this.fillUpCaseStatusData(data);

        const actionButton = isEditButtonPresent ? 'Update' : 'Save';
        await this.commonButtons.clickButton(actionButton);
    }
}