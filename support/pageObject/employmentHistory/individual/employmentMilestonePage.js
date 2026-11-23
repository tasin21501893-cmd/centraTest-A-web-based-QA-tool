/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { readExcelDataWithSheetName } from "../../../../support/commonUtility/read-xlsx.js";
import { AttachmentUtils } from "../../../commonUtility/attachmentUtils.js";
import { CommonButtons } from "../../../commonUtility/commonButtons.js";
import { CommonUtils } from "../../../commonUtility/commonUtils.js";
import { ListPage } from "../../../commonPages/listPage.js";
import { DonePage } from "../../../commonPages/donePage.js";
import { resourcePaths } from "../../../constants/resourcePaths.js";

export class EmploymentMilestonePage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.jobDetailModal = this.page.locator("#job-detail-search-modal").frameLocator("iframe[frameborder='0']");
        this.ddlMilestoneType = this.page.locator("[name='milestoneType']");
        this.txtOtherMilestoneType = this.page.locator("[name='otherMilestoneType']");
        this.dtpStartDate = this.page.locator("[name='startDate']");
        this.dtpDueDate = this.page.locator("[name='milestoneDate']");
        this.txtDescription = this.page.locator("[id='description']");
        this.chkIsCompleted = this.page.locator("[name='completed']");
        this.dtpCompletedDate = this.page.locator("[name='completedDate']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgMilestoneType = this.page.locator("[id='milestoneType.errors']");
        this.errMsgOtherMilestoneType = this.page.locator("[id='otherMilestoneType.errors']");
        this.errMsgStartDate = this.page.locator("[id='startDate.errors']");
        this.errMsgDueDate = this.page.locator("[id='milestoneDate.errors']");
        this.errMsgDescription = this.page.locator("[id='description.errors']");
        this.errMsgDescriptionMaxLimit = this.page.locator(".text-counter-wrapper>.text-danger:below(#description)");
        this.errMsgIsCompleted = this.page.locator("[id='completed.errors']");
        this.errMsgCompletedDate = this.page.locator("[id='completedDate.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Employment Milestone", "New");
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

    async linkJobDetail(startDate) {
        const txtIframeFilterField = this.jobDetailModal.getByPlaceholder('Filter');
        const tblIframeFirstListItem = this.jobDetailModal.locator('tbody > tr').first();

        await this.commonButtons.clickButton('Link Job Detail');
        await this.commonButtons.clickButton('Search', this.jobDetailModal);
        await txtIframeFilterField.fill(startDate);
        await tblIframeFirstListItem.click();
        await this.commonButtons.clickButton('Add', this.jobDetailModal);
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
        if(data.milestoneType) {
            await this.ddlMilestoneType.selectOption(data.milestoneType);
            if (data.milestoneType.trim().toLowerCase() === 'other') {
                await this.txtOtherMilestoneType.fill(data.otherMilestoneType);
            }
        }

        if (data.linkJobDetail && ['yes', 'y'].includes(data.linkJobDetail.trim().toLowerCase())) {
            await this.linkJobDetail(data.startDate);
        }

        data.startDate && await this.dtpStartDate.fill(data.startDate);
        data.dueDate && await this.dtpDueDate.fill(data.dueDate);
        data.description && await this.txtDescription.fill(data.description);
        await this.page.waitForTimeout(2000);
        data.isCompleted && await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Is Completed?', data.isCompleted);
        data.completedDate && await this.dtpCompletedDate.fill(data.completedDate);
        data.comments && await this.txtComments.fill(data.comments);
        
        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_EMPLOYMENT_MILESTONE, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}