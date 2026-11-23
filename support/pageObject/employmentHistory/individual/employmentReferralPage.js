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

export class EmploymentReferralPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlReferralSource = this.page.locator("[name='referralSource']");
        this.ddlReferralType = this.page.locator("[name='referralType']");
        this.dtpReferralDate = this.page.locator("[name='referralDate']");
        this.txtReferralBy = this.page.locator("[name='referralBy']");
        this.dtpInitialMeetingDate = this.page.locator("[name='initialMeetingDate']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgReferralSource = this.page.locator("[id='referralSource.errors']");
        this.errMsgReferralType = this.page.locator("[id='referralType.errors']");
        this.errMsgReferralDate = this.page.locator("[id='referralDate.errors']");
        this.errMsgReferralBy = this.page.locator("[id='referralBy.errors']");
        this.errMsgInitialMeetingDate = this.page.locator("[id='initialMeetingDate.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Employment Referral", "New");
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
        data.referralSource && await this.ddlReferralSource.selectOption(data.referralSource);
        data.referralType && await this.ddlReferralType.selectOption(data.referralType);
        data.referralDate && await this.dtpReferralDate.fill(data.referralDate);
        data.referralBy && await this.txtReferralBy.fill(data.referralBy);
        data.initialMeetingDate && await this.dtpInitialMeetingDate.fill(data.initialMeetingDate);
        data.comments && await this.txtComments.fill(data.comments);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_EMPLOYMENT_REFERRAL, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}