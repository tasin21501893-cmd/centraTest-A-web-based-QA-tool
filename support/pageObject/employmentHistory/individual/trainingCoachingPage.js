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

export class TrainingCoachingPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlSkillDeveloped = this.page.locator("[name='skills']");
        this.dtpStartDate = this.page.locator("[name='startDate']");
        this.dtpEndDate = this.page.locator("[name='endDate']");
        this.txtTotalContactHour = this.page.locator("[name='totalHour']");
        this.txtDescription = this.page.locator("[id='description']");

        this.errMsgStartDate = this.page.locator("[id='startDate.errors']");
        this.errMsgEndDate = this.page.locator("[id='endDate.errors']");
        this.errMsgTotalContactHour = this.page.locator("[id='totalHour.errors']");
        this.errMsgDescription = this.page.locator("[id='description.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Training/Coaching", "New");
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
        data.skillDeveloped && await this.ddlSkillDeveloped.selectOption(data.skillDeveloped.split(',').map(value=> value.trim()));
        data.startDate && await this.dtpStartDate.fill(data.startDate);
        data.endDate && await this.dtpEndDate.fill(data.endDate);
        data.totalContactHour && await this.txtTotalContactHour.fill(data.totalContactHour);
        data.description && await this.txtDescription.fill(data.description);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_TRAINING_COACHING, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}