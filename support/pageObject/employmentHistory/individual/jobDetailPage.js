/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { readExcelDataWithSheetName, filterObjects } from "../../../../support/commonUtility/read-xlsx.js";
import { AttachmentUtils } from "../../../commonUtility/attachmentUtils.js";
import { CommonButtons } from "../../../commonUtility/commonButtons.js";
import { resourcePaths } from "../../../constants/resourcePaths.js";
import { CommonUtils } from "../../../commonUtility/commonUtils.js";
import { DonePage } from "../../../commonPages/donePage.js";
import { ListPage } from "../../../commonPages/listPage.js";

export class JobDetailPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.iframe = this.page.locator("#emp-outcome-modal").frameLocator("iframe[frameborder='0']");
        this.ddlJobCategory = this.page.locator("[name='jobCategory']");
        this.ddlContactPerson = this.page.locator("[name='contactPerson']");
        this.txtSupervisor = this.page.locator("[name='supervisor']");
        this.ddlBenefits = this.page.locator("[name='benefits']");
        this.txtOtherBenefit = this.page.locator("[name='otherBenefitName']");
        this.txtAverageHourlyWage = this.page.locator("[name='wage']");
        this.txtAverageWeeklyWorkHours = this.page.locator("[name='workingHour']");
        this.txtHoursOfSupportPerWeek = this.page.locator("[name='hourOfSupport']");
        this.txtSupportDescription = this.page.locator("[name='supportDescription']");
        this.txtWorkSchedule = this.page.locator("[name='workSchedule']");
        this.ddlJobType = this.page.locator("[name='jobType']");
        this.ddlJobStatus = this.page.locator("[name='jobStatus']");
        this.dtpJobStartDate = this.page.locator("[name='startDate']");
        this.dtpJobEndDate = this.page.locator("[name='endDate']");
        this.ddlReasonForJobLoss = this.page.locator("[name='jobLossReason']");
        this.txtOtherReasonForJobLoss = this.page.locator("[name='otherJobLossReason']");

        this.errMsgSupervisor = this.page.locator("[id='supervisor.errors']");
        this.errMsgOtherBenefit  = this.page.locator("[id='otherBenefitName.errors']");
        this.errMsgAverageHourlyWage  = this.page.locator("[id='wage.errors']");
        this.errMsgAverageWeeklyWorkHours  = this.page.locator("[id='workingHour.errors']");
        this.errMsgHoursOfSupportPerWeek  = this.page.locator("[id='hourOfSupport.errors']");
        this.errMsgSupportDescription  = this.page.locator("[id='supportDescription.errors']");
        this.errMsgWorkSchedule  = this.page.locator("[id='workSchedule.errors']");
        this.errMsgJobType = this.page.locator("[id='jobType.errors']");
        this.errMsgJobStatus  = this.page.locator("[id='jobStatus.errors']");
        this.errMsgJobStartDate  = this.page.locator("[id='startDate.errors']");
        this.errMsgJobEndDate  = this.page.locator("[id='endDate.errors']");
        this.errMsgReasonForJobLoss  = this.page.locator("[id='jobLossReason.errors']");
        this.errMsgOtherReasonForJobLoss  = this.page.locator("[id='otherJobLossReason.errors']");
        
        //JobOutcomeData
        this.dtpJODEffectiveDate = this.iframe.locator("[id='effectiveDate']");
        this.txtJODHoursPerWeek = this.iframe.locator("[name='workingHour']");
        this.txtJODWagePerHour = this.iframe.locator("[id='wage']");
        this.txtJODHoursOfSupportPerWeek = this.iframe.locator("[name='hourOfSupport']");
        this.txtJODSupportDescription = this.iframe.locator("[name='supportDescription']");
        this.txtJODWorkSchedule = this.iframe.locator("[name='workSchedule']");

        this.attachmentUtils = new AttachmentUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Employment", "Job Detail", "New");
        await this.listPage.selectFilteredFirstItem(data.individual);
        await this.listPage.selectFilteredFirstItem(data.employerName);
        await this.listPage.selectFilteredFirstItem(data.jobTemplateName);
    }

    async createForm(status, data) {
        await this.navigateToNewForm(data);
        await this.fillUpForm(data);
        await this.commonButtons.clickButton('Save');

        if (data.hasJobOutcomeData && ["yes", "y"].includes(data.hasJobOutcomeData.trim().toLowerCase())) {
            await this.donePage.clickLinkByText('Form');
            await this.addJobOutcomeData(data.index);
            await this.commonButtons.clickButton('Update');
        }

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
        data.jobCategory && await this.ddlJobCategory.selectOption(data.jobCategory);
        data.contactPerson && await this.ddlContactPerson.selectOption(data.contactPerson);
        data.supervisor && await this.txtSupervisor.fill(data.supervisor);
        data.benefits && await this.ddlBenefits.selectOption(data.benefits.split(',').map(value=> value.trim()));
        data.otherBenefit && await this.txtOtherBenefit.fill(data.otherBenefit);
        data.averageHourlyWage && await this.txtAverageHourlyWage.fill(data.averageHourlyWage);
        data.averageWeeklyWorkHours && await this.txtAverageWeeklyWorkHours.fill(data.averageWeeklyWorkHours);
        data.hoursOfSupportPerWeek && await this.txtHoursOfSupportPerWeek.fill(data.hoursOfSupportPerWeek);
        data.supportDescription && await this.txtSupportDescription.fill(data.supportDescription);
        data.workSchedule && await this.txtWorkSchedule.fill(data.workSchedule);
        data.jobType && await this.ddlJobType.selectOption(data.jobType);
        data.jobStatus && await this.ddlJobStatus.selectOption(data.jobStatus);
        data.jobStartDate && await this.dtpJobStartDate.fill(data.jobStartDate);
        data.jobEndDate && await this.dtpJobEndDate.fill(data.jobEndDate);

        if(data.reasonForJobLoss){
            await this.ddlReasonForJobLoss.selectOption(data.reasonForJobLoss);

            if (data.reasonForJobLoss.trim().toLowerCase() === 'other') {
                data.otherReasonForJobLoss && await this.txtOtherReasonForJobLoss.fill(data.otherReasonForJobLoss);
            }
        }

        if (data.hasAttachment && ['yes', 'y'].includes(data.hasAttachment.trim().toLowerCase())) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.EH_JOB_DETAIL, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }

    async addJobOutcomeData(jdIndex) {
        const arrayOfJobOutcomeData = readExcelDataWithSheetName(resourcePaths.EH_JOB_DETAIL, 'jobOutcomeData');
        const data = filterObjects(arrayOfJobOutcomeData, [{ "jdIndex": jdIndex }]);
        
        for (let jobOutcomeNo = 0; jobOutcomeNo < data.length; jobOutcomeNo++) {
            await this.commonButtons.clickButton('Add Job Outcome Data');

            data[jobOutcomeNo].effectiveDate && await this.dtpJODEffectiveDate.fill(data[jobOutcomeNo].effectiveDate);
            data[jobOutcomeNo].wagePerHour && await this.txtJODWagePerHour.fill(data[jobOutcomeNo].wagePerHour);
            data[jobOutcomeNo].hoursPerWeek && await this.txtJODHoursPerWeek.fill(data[jobOutcomeNo].hoursPerWeek);
            data[jobOutcomeNo].hoursOfSupportPerWeek && await this.txtJODHoursOfSupportPerWeek.fill(data[jobOutcomeNo].hoursOfSupportPerWeek);
            data[jobOutcomeNo].supportDescription && await this.txtJODSupportDescription.fill(data[jobOutcomeNo].supportDescription);
            data[jobOutcomeNo].workSchedule && await this.txtJODWorkSchedule.fill(data[jobOutcomeNo].workSchedule);

            await this.commonButtons.clickButton('Continue', this.iframe);
        }
    }

}