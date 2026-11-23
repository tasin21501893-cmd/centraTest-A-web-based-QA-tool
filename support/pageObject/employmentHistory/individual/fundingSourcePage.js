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

export class FundingSourcePage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlFundingSource = this.page.locator("[name='fundingSourceType']");
        this.txtOtherFundingSource = this.page.locator("[name='otherFundingSourceType']")
        this.dtpStartDate = this.page.locator("[name='startDate']");
        this.dtpEndDate = this.page.locator("[name='endDate']");
        this.txtReasonforEndingRequest = this.page.locator("[name='reasonForEnding']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgFundingSource = this.page.locator("[id='fundingSourceType.errors']");
        this.errMsgOtherFundingSource = this.page.locator("[id='otherFundingSourceType.errors']")
        this.errMsgStartDate = this.page.locator("[id='startDate.errors']");
        this.errMsgEndDate = this.page.locator("[id='endDate.errors']");
        this.errMsgReasonforEndingRequest = this.page.locator("[id='reasonForEnding.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Funding Source", "New");
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
        if(data.fundingSource) {
            await this.ddlFundingSource.selectOption(data.fundingSource);
            if (data.fundingSource.trim().toLowerCase() === 'other') {
                await this.txtOtherFundingSource.fill(data.otherFundingSource);
            }
        }

        data.startDate && await this.dtpStartDate.fill(data.startDate);
        data.endDate && await this.dtpEndDate.fill(data.endDate);
        data.reasonforEndingRequest && await this.txtReasonforEndingRequest.fill(data.reasonforEndingRequest);
        data.comments && await this.txtComments.fill(data.comments);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_FUNDING_SOURCE, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}