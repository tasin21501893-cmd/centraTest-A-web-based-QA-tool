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

export class VariancePage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlVarianceType = this.page.locator("[name='varianceType']");
        this.txtOtherVarianceType = this.page.locator("[name='otherVarianceType']");
        this.dtpDate = this.page.locator("[name='eventDate']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgVarianceType = this.page.locator("[id='varianceType.errors']");
        this.errMsgOtherVarianceType = this.page.locator("[id='otherVarianceType.errors']");
        this.errMsgDate = this.page.locator("[id='eventDate.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Variance", "New");
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
        if(data.varianceType) {
            await this.ddlVarianceType.selectOption(data.varianceType);
            if (data.varianceType.trim().toLowerCase() === 'other') {
                await this.txtOtherVarianceType.fill(data.otherVarianceType);
            }
        }
        data.date && await this.dtpDate.fill(data.date);
        data.comments && await this.txtComments.fill(data.comments);
    
        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_VARIANCE, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}