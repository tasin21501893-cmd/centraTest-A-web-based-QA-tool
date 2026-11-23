/**
 * @author Sayed Ahmed Tasin
 * @since 08/10/2026
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { HealthTrackingUtils } from '../utility/healthTrackingUtils.js';

export class BloodGlucoseForm {
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.htUtils = new HealthTrackingUtils(page);
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.dtpReadingDate = page.locator('[name="entryDate"]');
        this.txtReadingTime = page.locator('[name="entryTime"]');
        this.txtGlucoseValue = page.locator('[name="value"]');
        this.ddlMethodUsed = page.locator('[name="howMeasured"]');
        this.rdoFastingYes = page.locator('input[name="fasting"][value="true"]');
        this.rdoFastingNo = page.locator('input[name="fasting"][value="false"]');
        this.txtTimeSinceLastMeal = page.locator('[name="timeSinceLastMeal"]');
        this.rdoInsulinGivenYes = page.locator('input[name="insulinGiven"][value="true"]');
        this.rdoInsulinGivenNo = page.locator('input[name="insulinGiven"][value="false"]');
        this.txtInsulinAmount = page.locator('[name="insulinAmount"]');
        this.rdoNotifiedYes = page.locator('input[name="notified"][value="true"]');
        this.rdoNotifiedNo = page.locator('input[name="notified"][value="false"]');
        this.ddlTreatmentType = page.locator('[name="otherTreatment"]');
        this.txtComments = page.locator('[name="comments"]');
        this.txtReasonForDeletion = page.locator('[name="deleteComments"]');

        this.errMsgEventDate = page.locator('[id="eventDate.errors"]');
        this.errMsgReporter = page.locator('[id="reporter.errors"]');
        this.errMsgReporterNameOther = page.locator('[id="reporterNameOther.errors"]');
        this.errMsgReadingDate = page.locator('[id="entryDate.errors"]');
        this.errMsgReadingTime = page.locator('[id="entryTime.errors"]');
        this.errMsgGlucoseValue = page.locator('[id="value.errors"]');
        this.errMsgTimeSinceLastMeal = page.locator('[id="timeSinceLastMeal.errors"]');
        this.errMsgInsulinAmount = page.locator('[id="insulinAmount.errors"]');
        this.errMsgComments = page.locator('[id="comments.errors"]');
    }

    /**
     * Reusable macro method to navigate, fill out, and save/submit a Blood Glucose record.
     * @param {Object} testcase 
     * @param {string} buttonLabel 
     */
    async createNewRecord(testcase, buttonLabel) {
        await this.fillUpForm(testcase);
        await this.commonButtons.clickButton(buttonLabel);
    }

    async fillUpForm(formObject) {
        await this.htUtils.selectProgramAndIndividual(formObject.program, formObject.individual);

        if (CommonUtils.isValueValid(formObject.reportedBy)) {
            await this.ddlReportedBy.selectOption(formObject.reportedBy);
            if (formObject.reportedBy === 'Other') {
                await this.htUtils.fillOrClearInput(this.txtReportedByOther, formObject.reportedByOther);
            }
        }

        await this.htUtils.fillOrClearInput(this.dtpEventDate, formObject.eventDate);

        if (CommonUtils.isValueValid(formObject.notificationLevel)) {
            await this.ddlNotificationLevel.selectOption(formObject.notificationLevel);
        }

        await this.htUtils.fillOrClearInput(this.dtpReadingDate, formObject.readingDate);
        await this.htUtils.fillOrClearInput(this.txtReadingTime, formObject.readingTime);
        await this.htUtils.fillOrClearInput(this.txtGlucoseValue, formObject.glucoseValue);

        if (CommonUtils.isValueValid(formObject.methodUsed)) {
            await this.ddlMethodUsed.selectOption(formObject.methodUsed);
        }

        await this.commonUtils.selectRadioOption(formObject.fasting, this.rdoFastingYes, this.rdoFastingNo);

        await this.htUtils.fillOrClearInput(this.txtTimeSinceLastMeal, formObject.timeSinceLastMeal);

        await this.commonUtils.selectRadioOption(formObject.insulinGiven, this.rdoInsulinGivenYes, this.rdoInsulinGivenNo);

        if (CommonUtils.isAffirmative(formObject.insulinGiven) || CommonUtils.isValueValid(formObject.insulinAmount)) {
            await this.htUtils.fillOrClearInput(this.txtInsulinAmount, formObject.insulinAmount);
        }

        await this.commonUtils.selectRadioOption(formObject.nurseDoctorNotified, this.rdoNotifiedYes, this.rdoNotifiedNo);

        if (CommonUtils.isValueValid(formObject.treatmentType)) {
            await this.ddlTreatmentType.selectOption(formObject.treatmentType);
        }

        await this.htUtils.fillOrClearInput(this.txtComments, formObject.comments);
    }
}
