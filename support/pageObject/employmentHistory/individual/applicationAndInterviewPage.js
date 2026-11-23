/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { readExcelDataWithSheetName } from "../../../../support/commonUtility/read-xlsx.js";
import { CommonUtils } from "../../../commonUtility/commonUtils.js";
import { CommonButtons } from "../../../commonUtility/commonButtons.js";
import { AttachmentUtils } from "../../../commonUtility/attachmentUtils.js";
import { resourcePaths } from "../../../constants/resourcePaths.js";
import { DonePage } from "../../../commonPages/donePage.js";
import { ListPage } from "../../../commonPages/listPage.js";

export class ApplicationAndInterviewPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.dtpApplicationSubmissionDate = this.page.locator("[name='submissionDate']");
        this.txtApplicationCompletedBy = this.page.locator("[name='applicationCompletedBy']");
        this.dtpInterviewDate = this.page.locator("[name='interviewDate']");
        this.ddlEmployer = this.page.locator("[name='employer']");
        this.txtInterviewWith = this.page.locator("[name='interviewWith']");
        this.ddlTypeOfInterview = this.page.locator("[name='interviewType']");
        this.rdoInterviewAttendedYes = this.page.locator("#interviewAttended1");
        this.rdoInterviewAttendedNo = this.page.locator("#interviewAttended2");
        this.rdoJobOfferedYes = this.page.locator("#jobOffered1");
        this.rdoJobOfferedNo = this.page.locator("#jobOffered2");
        this.rdoJobAcceptedByIndividualYes = this.page.locator("#jobAccepted1");
        this.rdoJobAcceptedByIndividualNo = this.page.locator("#jobAccepted2");
        this.txtDescription = this.page.locator("[id='description']");
        
        this.errMsgApplicationSubmissionDate = this.page.locator("[id='submissionDate.errors']");
        this.errMsgApplicationCompletedBy = this.page.locator("[id='applicationCompletedBy.errors']");
        this.errMsgInterviewDate = this.page.locator("[id='interviewDate.errors']");
        this.errMsgInterviewWith = this.page.locator("[id='interviewWith.errors']");
        this.errMsgDescription = this.page.locator("[id='description.errors']");
        
        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Application and Interview", "New");
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
        data.applicationSubmissionDate && await this.dtpApplicationSubmissionDate.fill(data.applicationSubmissionDate);
        data.applicationCompletedBy && await this.txtApplicationCompletedBy.fill(data.applicationCompletedBy);
        data.interviewDate && await this.dtpInterviewDate.fill(data.interviewDate);
        if (data.employer) {
            const option = await this.ddlEmployer.locator(`option:has-text("${data.employer}")`).first().getAttribute('value');
            await this.ddlEmployer.selectOption({ value: option }, { force: true });
        }
        data.interviewWith && await this.txtInterviewWith.fill(data.interviewWith);
        data.typeOfInterview && await this.ddlTypeOfInterview.selectOption(data.typeOfInterview);
        data.interviewAttended && await this.commonUtils.selectRadioOption(data.interviewAttended, this.rdoInterviewAttendedYes, this.rdoInterviewAttendedNo);
        data.jobOffered && await this.commonUtils.selectRadioOption(data.jobOffered, this.rdoJobOfferedYes, this.rdoJobOfferedNo);
        data.jobAcceptedByIndividual && await this.commonUtils.selectRadioOption(data.jobAcceptedByIndividual, this.rdoJobAcceptedByIndividualYes, this.rdoJobAcceptedByIndividualNo);
        data.description && await this.txtDescription.fill(data.description);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_APPLICATION_AND_INTERVIEW, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}