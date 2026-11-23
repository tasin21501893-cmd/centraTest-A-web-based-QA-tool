/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { readExcelDataWithSheetName } from "../../../../support/commonUtility/read-xlsx.js";
import { AttachmentUtils } from "../../../commonUtility/attachmentUtils.js";
import { resourcePaths } from "../../../constants/resourcePaths.js";
import { CommonUtils } from "../../../commonUtility/commonUtils.js";
import { CommonButtons } from "../../../commonUtility/commonButtons.js";
import { DonePage } from "../../../commonPages/donePage.js";
import { ListPage } from "../../../commonPages/listPage.js";

export class BenefitsCounselingPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.dtpDate = this.page.locator("[name='eventDate']");
        this.ddlReason = this.page.locator("[name='benefitsCounselingReason']");
        this.ddlDecision = this.page.locator("[name='benefitsCounselingDecision']");
        this.txtOtherDecision = this.page.locator("[name='otherBenefitsCounselDecision']");
        this.txtCounselingProvidedBy = this.page.locator("[name='counselingProvidedBy']");
        this.txtResponsibilityToReportEarnings = this.page.locator("[name='responsibilityToReport']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgDate = this.page.locator("[id='eventDate.errors']");
        this.errMsgOtherDecision = this.page.locator("[id='otherBenefitsCounselDecision.errors']");
        this.errMsgCounselingProvidedBy = this.page.locator("[id='counselingProvidedBy.errors']");
        this.errMsgResponsibilityToReportEarnings = this.page.locator("[id='responsibilityToReport.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Benefits Counseling", "New");
        await this.listPage.selectFilteredFirstItem(data.individual);
    }

    async createForm(status, data) {
        await this.navigateToNewForm(data);
        await this.fillUpForm(data);
        await this.commonButtons.clickButton('Save');
        if (status === 'Deleted'){
            await this.donePage.clickLinkByText('Form');
            await this.commonButtons.clickButton('Delete');
            await this.commonButtons.clickButton('Yes');
        }
    }

    async takeAction(action){
        if(await this.commonButtons.isButtonPresent(action)){
            await this.commonButtons.clickButton(action);
            if(action === 'Delete') await this.commonButtons.clickButton('Yes');
            await this.donePage.verifyPartialDoneMessage('successfully');
            return true;
        }
        return false;
    }

    async fillUpForm(data) {
        await this.page.waitForLoadState('domcontentloaded');
        data.date && await this.dtpDate.fill(data.date);
        data.reason && await this.ddlReason.selectOption(data.reason);
        if(data.decision){
            await this.ddlDecision.selectOption(data.decision);
            if (data.decision.trim().toLowerCase() === 'other') {
                await this.txtOtherDecision.fill(data.otherDecision);
            }
        }

        data.counselingProvidedBy && await this.txtCounselingProvidedBy.fill(data.counselingProvidedBy);
        data.responsibilityToReportEarnings && await this.txtResponsibilityToReportEarnings.fill(data.responsibilityToReportEarnings);
        data.comments && await this.txtComments.fill(data.comments);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_BENEFITS_COUNSELING, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}