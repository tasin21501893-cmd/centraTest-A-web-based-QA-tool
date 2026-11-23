/**
* @author [Sayed Ahmed Tasin]
* @since 03/04/2026
*/

import { ListPage } from '../../../commonPages/listPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class VitalSignsForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtComments = page.locator('[name="comments"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.txtTemperatureValue = page.locator('[name="temperature"]');
        this.txtTemperatureTime = page.locator('[name="temperatureTime"]');
        this.ddlTemperatureSite = page.locator('[name="tempSite"]');
        this.txtPulseValue = page.locator('[name="pulse"]');
        this.txtPulseOxygenSaturation = page.locator('[name="oxygenSaturation"]');
        this.txtPulseTime = page.locator('[name="pulseTime"]');
        this.ddlPulseRhythm = page.locator('[name="rhythm"]');
        this.ddlPulseForce = page.locator('[name="force"]');
        this.ddlPulseSite = page.locator('[name="site"]');
        this.ddlPulseMethodUsed = page.locator('[name="method"]');
        this.txtRespirationValue = page.locator('[name="respiration"]');
        this.txtRespirationTime = page.locator('[name="respTime"]');
        this.ddlRespirationLungSound = page.locator('[name="lungSounds"]');
        this.txtLungSoundOther = page.locator('[name="lungSoundsOther"]');
        this.txtBloodPressureSystolicValue = page.locator('[name="bpSystol"]');
        this.txtBloodPressureDiastolicValue = page.locator('[name="bpDiastol"]');
        this.txtBloodPressureTime = page.locator('[name="bpTime"]');
        this.ddlBloodPressureMethodUsed = page.locator('[name="bpMeasure"]');
        this.ddlReaction = page.locator('[name="reaction"]');
        this.btnTempCopyTime = page.locator('[name="temperatureCopyTime"]');
        this.btnPulseCopyTime = page.locator('[name="pulseCopyTime"]');
        this.btnRespCopyTime = page.locator('[name="respCopyTime"]');
        this.btnBpCopyTime = page.locator('[name="bpCopyTime"]');
        this.errMsgEventDate = page.locator('[id="eventDate.errors"]');
        this.errMsgReportedBy = page.locator('[id="reporter.errors"]');
        this.errMsgReportedByOther = page.locator('[id="reporterNameOther.errors"]');
        this.errMsgComments = page.locator('[id="comments.errors"]');
        this.errMsgTemperatureRange = page.locator('[id="tempOutsideRange"]');
        this.errMsgPulseRange = page.locator('[id="pulseOutsideRange"]');
        this.errMsgOxygenSaturationRange = page.locator('[id="oxygenOutsideRange"]');
        this.errMsgRespirationRange = page.locator('[id="respOutsideRange"]');
        this.errMsgBpSystolRange = page.locator('[id="systolicOutsideRange"]');
        this.errMsgBpDiastolRange = page.locator('[id="diastolicOutsideRange"]');
        this.errMsgTemperature = page.locator('[id="temperature.errors"]');
        this.errMsgPulse = page.locator('[id="pulse.errors"]');
        this.errMsgOxygenSaturation = page.locator('[id="oxygenSaturation.errors"]');
        this.errMsgRespiration = page.locator('[id="respiration.errors"]');
        this.errMsgBpSystol = page.locator('[id="bpSystol.errors"]');
        this.errMsgBpDiastol = page.locator('[id="bpDiastol.errors"]');
        this.errMsgTemperatureTime = page.locator('[id="temperatureTime.errors"]');
        this.errMsgPulseTime = page.locator('[id="pulseTime.errors"]');
        this.errMsgRespirationTime = page.locator('[id="respTime.errors"]');
        this.errMsgLungSoundOther = page.locator('[id="lungSoundsOther.errors"]');
        this.errMsgBpTime = page.locator('[id="bpTime.errors"]');
        this.errMsgPulseOrOxygen = page.locator('div.alert-danger ul li:nth-child(1)');
        this.errMsgOutsideNormalRange = page.locator('div.alert-danger ul li:nth-child(1)');
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.reportedBy && await this.ddlReportedBy.selectOption(formObject.reportedBy);

        if (formObject.reportedByOther) {
            if (formObject.reportedByOther.length > 64) {
                await this.commonUtils.removeMaxLengthAndFill(this.txtReportedByOther);
            }
            await this.txtReportedByOther.fill(formObject.reportedByOther);
        }

        if (!formObject.eventDate) {
            await this.dtpEventDate.clear();
        } else {
            await this.dtpEventDate.fill(formObject.eventDate);
        }

        formObject.notificationLevel && await this.ddlNotificationLevel.selectOption(formObject.notificationLevel);
        formObject.temperature && await this.txtTemperatureValue.fill(formObject.temperature);

        if (formObject.temperatureTime) {
            await this.txtTemperatureTime.fill(formObject.temperatureTime);
        } else if (formObject.pulseTime || formObject.respTime || formObject.bpTime) {
            await this.btnTempCopyTime.click();
        }

        formObject.temperatureSite && await this.ddlTemperatureSite.selectOption(formObject.temperatureSite);
        formObject.pulse && await this.txtPulseValue.fill(formObject.pulse);
        formObject.oxygenSaturation && await this.txtPulseOxygenSaturation.fill(formObject.oxygenSaturation);

        if (formObject.pulseTime) {
            await this.txtPulseTime.fill(formObject.pulseTime);
        } else if (formObject.temperatureTime || formObject.respTime || formObject.bpTime) {
            await this.btnPulseCopyTime.click();
        }

        formObject.rhythm && await this.ddlPulseRhythm.selectOption(formObject.rhythm);
        formObject.force && await this.ddlPulseForce.selectOption(formObject.force);
        formObject.site && await this.ddlPulseSite.selectOption(formObject.site);
        formObject.method && await this.ddlPulseMethodUsed.selectOption(formObject.method);
        formObject.respiration && await this.txtRespirationValue.fill(formObject.respiration);

        if (formObject.respTime) {
            await this.txtRespirationTime.fill(formObject.respTime);
        } else if (formObject.temperatureTime || formObject.pulseTime || formObject.bpTime) {
            await this.btnRespCopyTime.click();
        }

        formObject.lungSounds && await this.ddlRespirationLungSound.selectOption(formObject.lungSounds);

        if (formObject.lungSoundsOther) {
            if (formObject.lungSoundsOther.length > 64) {
                await this.commonUtils.removeMaxLengthAndFill(this.txtLungSoundOther);
            }
            await this.txtLungSoundOther.fill(formObject.lungSoundsOther);
        }

        formObject.bpSystol && await this.txtBloodPressureSystolicValue.fill(formObject.bpSystol);
        formObject.bpDiastol && await this.txtBloodPressureDiastolicValue.fill(formObject.bpDiastol);

        if (formObject.bpTime) {
            await this.txtBloodPressureTime.fill(formObject.bpTime);
        } else if (formObject.temperatureTime || formObject.pulseTime || formObject.respTime) {
            await this.btnBpCopyTime.click();
        }

        formObject.bpMeasure && await this.ddlBloodPressureMethodUsed.selectOption(formObject.bpMeasure);
        formObject.reaction && await this.ddlReaction.selectOption(formObject.reaction);
        formObject.comments && await this.txtComments.fill(formObject.comments);
    }
}