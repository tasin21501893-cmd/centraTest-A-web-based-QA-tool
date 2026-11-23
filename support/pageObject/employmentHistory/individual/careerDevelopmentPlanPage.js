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

export class CareerDevelopmentPlanPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.dtpEffectiveDate = this.page.locator("[name='effectiveDate']");
        this.txtSummary = this.page.locator("[name='summary']");
        this.dtpNextMeetingDueDate = this.page.locator("[name='nextMeetingDueDate']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgEffectiveDate = this.page.locator("[id='effectiveDate.errors']");
        this.errMsgSummary = this.page.locator("[id='summary.errors']");
        this.errMsgNextMeetingDueDate = this.page.locator("[id='nextMeetingDueDate.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Career Development Plan", "New");
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
        data.effectiveDate && await this.dtpEffectiveDate.fill(data.effectiveDate);
        data.summary && await this.txtSummary.fill(data.summary);
        data.nextMeetingDueDate && await this.dtpNextMeetingDueDate.fill(data.nextMeetingDueDate);
        data.comments && await this.txtComments.fill(data.comments);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_CAREER_DEVELOPMENT_PLAN, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}