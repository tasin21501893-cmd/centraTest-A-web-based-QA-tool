/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { expect } from 'playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons';
import { CommonUtils } from '../../../commonUtility/commonUtils';
import { ListPage } from '../../../commonPages/listPage';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';
import { DonePage } from '../../../commonPages/donePage';

export class RespiratoryTreatmentForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.dtpEventTime = page.locator('[name="eventTime"]');
        this.txtPulseBeforeTreatment = page.locator('[name="pulseBeforeTreatment"]');
        this.txtPulseAfterTreatment = page.locator('[name="pulseAfterTreatment"]');
        this.txtRespirationBeforeTreatment = page.locator('[name="respirationBeforeTreatment"]');
        this.txtRespirationAfterTreatment = page.locator('[name="respirationAfterTreatment"]');
        this.txtOxygenBeforeTreatment = page.locator('[name="oxygenBeforeTreatment"]');
        this.txtOxygenAfterTreatment = page.locator('[name="oxygenAfterTreatment"]');
        this.ddlLungSoundsBeforeTreatment = page.locator('[name="lungSounds"]');
        this.txtOtherLungSoundsBeforeTreatment = page.locator('[name="lungSoundsOther"]');
        this.ddlLungSoundsAfterTreatment = page.locator('[name="lungSoundsAfter"]');
        this.txtOtherLungSoundsAfterTreatment = page.locator('[name="lungSoundsOtherAfter"]');
        this.rdoChestPhysiotherapyYes = page.locator('#chestPhysiotheraphyOrder1');
        this.rdoChestPhysiotherapyNo = page.locator('#chestPhysiotheraphyOrder2');
        this.txtComments = page.locator('[name="comments"]');
        this.txtReasonForDeletion = page.locator('[name="deleteComments"]');
        
        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporter\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgEventTime = page.locator('#eventTime\\.errors');
        this.errMsgComments = page.locator('#comments\\.errors');
        this.errMsgPulseBeforeTreatment = page.locator('#pulseBeforeTreatment\\.errors');
        this.errMsgPulseAfterTreatment = page.locator('#pulseAfterTreatment\\.errors');
        this.errMsgRespirationBeforeTreatment = page.locator('#respirationBeforeTreatment\\.errors');
        this.errMsgRespirationAfterTreatment = page.locator('#respirationAfterTreatment\\.errors');
        this.errMsgOxygenSaturationBeforeTreatment = page.locator('#oxygenBeforeTreatment\\.errors');
        this.errMsgOxygenSaturationAfterTreatment = page.locator('#oxygenAfterTreatment\\.errors');
        this.errMsgLungSoundOtherBeforeTreatment = page.locator('#lungSoundsOther\\.errors');
        this.errMsgLungSoundOtherAfterTreatment = page.locator('#lungSoundsOtherAfter\\.errors');
        this.errMsgDeleteRequired = page.locator('#deleteRequiredMessage');
        this.errMsgWarning = page.locator('.modal-body.panel-body');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.reporter && await this.ddlReportedBy.selectOption(formObject.reporter);
        formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.ddlNotificationLevel.selectOption(formObject.notification);

        await this.dtpEventTime.fill(formObject.eventTime);
        formObject.pulseBeforeTreatment && await this.txtPulseBeforeTreatment.fill(formObject.pulseBeforeTreatment);
        formObject.pulseAfterTreatment && await this.txtPulseAfterTreatment.fill(formObject.pulseAfterTreatment);
        formObject.respirationBeforeTreatment && await this.txtRespirationBeforeTreatment.fill(formObject.respirationBeforeTreatment);
        formObject.respirationAfterTreatment && await this.txtRespirationAfterTreatment.fill(formObject.respirationAfterTreatment);
        formObject.oxygenBeforeTreatment && await this.txtOxygenBeforeTreatment.fill(formObject.oxygenBeforeTreatment);
        formObject.oxygenAfterTreatment && await this.txtOxygenAfterTreatment.fill(formObject.oxygenAfterTreatment);
        formObject.lungSoundsBeforeTreatment && await this.ddlLungSoundsBeforeTreatment.selectOption(formObject.lungSoundsBeforeTreatment);
        formObject.otherLungSoundsBeforeTreatment && await this.txtOtherLungSoundsBeforeTreatment.fill(formObject.otherLungSoundsBeforeTreatment);
        formObject.lungSoundsAfterTreatment && await this.ddlLungSoundsAfterTreatment.selectOption(formObject.lungSoundsAfterTreatment);
        formObject.otherLungSoundsAfterTreatment && await this.txtOtherLungSoundsAfterTreatment.fill(formObject.otherLungSoundsAfterTreatment);
        formObject.chestPhysiotherapy && await this.commonUtils.selectRadioOption(formObject.chestPhysiotherapy, this.rdoChestPhysiotherapyYes, this.rdoChestPhysiotherapyNo);
        formObject.comments && await this.txtComments.fill(formObject.comments);
    }

    async deleteForm(reasonForDeletion) {
        await this.donePage.clickLinkByText("Form");
        await this.commonButtons.clickButton(ButtonLabels.DELETE);
        await this.page.waitForLoadState();
        reasonForDeletion && await this.txtReasonForDeletion.fill(reasonForDeletion);
        await this.commonButtons.clickButton(ButtonLabels.CONFIRM);
    }
}