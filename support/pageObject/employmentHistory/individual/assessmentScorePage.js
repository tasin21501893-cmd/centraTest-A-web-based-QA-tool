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

export class AssessmentScorePage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.btnAssessmentType = this.page.locator("[id='assessmentTypePicker']");
        this.txtAssessmentScore = this.page.locator("[name='score']");
        this.dtpAssessmentDate = this.page.locator("[name='assessmentDate']");
        this.dtpEffectiveDate = this.page.locator("[name='effectiveDate']");
        this.dtpExpirationDate = this.page.locator("[name='expirationDate']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgAssessmentType = this.page.locator("[id='assessmentType.errors']");
        this.errMsgAssessmentScore = this.page.locator("[id='score.errors']");
        this.errMsgAssessmentDate = this.page.locator("[id='assessmentDate.errors']");
        this.errMsgEffectiveDate = this.page.locator("[id='effectiveDate.errors']");
        this.errMsgExpirationDate = this.page.locator("[id='expirationDate.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Assessment", "New");
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
        if(!await this.commonButtons.isButtonPresent(action) && await this.commonButtons.isButtonPresent('Edit')){
            await this.commonButtons.clickButton('Edit');
        }

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
        if (data.assessmentType) {
            await this.btnAssessmentType.click();
            await this.page.getByText(data.assessmentType, { exact: true }).click();
        }
        
        data.assessmentScore && await this.txtAssessmentScore.fill(data.assessmentScore);
        data.assessmentDate && await this.dtpAssessmentDate.fill(data.assessmentDate);
        data.effectiveDate && await this.dtpEffectiveDate.fill(data.effectiveDate);
        data.expirationDate && await this.dtpExpirationDate.fill(data.expirationDate);
        data.comments && await this.txtComments.fill(data.comments);

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_ASSESSMENT_SCORE, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}