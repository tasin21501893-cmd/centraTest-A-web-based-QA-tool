/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { AttachmentUtils } from "../../../commonUtility/attachmentUtils.js";
import { CommonUtils } from "../../../commonUtility/commonUtils.js";
import { readExcelDataWithSheetName } from "../../../../support/commonUtility/read-xlsx.js";
import { resourcePaths } from "../../../constants/resourcePaths.js";

export class JobTemplatePage {

    constructor(page) {
        this.page = page;
        this.ddlJobCategory = this.page.locator("[name='jobCategory']");
        this.txtPositionTitle = this.page.locator("[name='positionTitle']");
        this.ddlBenefits = this.page.locator("[name='benefits']");
        this.txtAverageHourlyWage = this.page.locator("[name='averageWage']");
        this.txtAverageWeeklyWorkHours = this.page.locator("[name='averageHourWork']");
        this.txtWorkSchedule = this.page.locator("[name='workSchedule']");
        this.ddlWorkShift = this.page.locator("[name='workShift']");
        this.ddlSkillsNeededfortheJob = this.page.locator("[name='jobSkills']");
        this.ddlJobRequirements = this.page.locator("[name='jobRequirements']");
        this.rdoCurrentlyOpenYes = this.page.locator("#jobCurrentlyOpen1");
        this.rdoCurrentlyOpenNo = this.page.locator("#jobCurrentlyOpen2");
        this.txtDescription = this.page.locator("[id='description']");

        this.errMsgPositionTitle = this.page.locator("[id='positionTitle.errors']");
        this.errMsgAverageHourlyWage = this.page.locator("[id='averageWage.errors']");
        this.errMsgAverageWeeklyWorkHours = this.page.locator("[id='averageHourWork.errors']");
        this.errMsgWorkSchedule = this.page.locator("[id='workSchedule.errors']");
        this.errMsgDescription = this.page.locator("[id='description.errors']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonUtils = new CommonUtils(page);
    }

    async fillUpForm(data) {
        await this.page.waitForLoadState('domcontentloaded');
        data.jobCategory && await this.ddlJobCategory.selectOption(data.jobCategory);
        data.positionTitle && await this.txtPositionTitle.fill(data.positionTitle);
        data.benefits && await this.ddlBenefits.selectOption(data.benefits.split(',').map(value=> value.trim()));
        data.averageHourlyWage && await this.txtAverageHourlyWage.fill(data.averageHourlyWage);
        data.averageWeeklyWorkHours && await this.txtAverageWeeklyWorkHours.fill(data.averageWeeklyWorkHours);
        data.workSchedule && await this.txtWorkSchedule.fill(data.workSchedule);
        data.workShift && await this.ddlWorkShift.selectOption(data.workShift);
        data.skillsNeededForTheJob && await this.ddlSkillsNeededfortheJob.selectOption(data.skillsNeededForTheJob.split(',').map(value=> value.trim()));
        data.jobRequirements && await this.ddlJobRequirements.selectOption(data.jobRequirements.split(',').map(value=> value.trim()));
        data.currentlyOpen && await this.commonUtils.selectRadioOption(data.currentlyOpen, this.rdoCurrentlyOpenYes, this.rdoCurrentlyOpenNo);
        data.description && await this.txtDescription.fill(data.description);

        if(data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_JOB_TEMPLATE, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }
}