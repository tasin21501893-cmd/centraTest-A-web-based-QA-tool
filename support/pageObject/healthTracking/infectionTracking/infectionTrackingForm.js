/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons';
import { CommonUtils } from '../../../commonUtility/commonUtils';
import { ListPage } from '../../../commonPages/listPage';
import { SearchPage } from '../../../commonPages/searchPage';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';

export class InfectionTrackingForm {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.dtpEventDate = page.locator('#eventDate');
        this.ddlNotificationLevel = page.locator('#notifLevel');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('#reporterNameOther');
        this.atcInfectionType = page.locator('#infectionDesc');
        this.ddlBodyPart1 = page.locator('#bodyPart1');
        this.ddlBodyPart2 = page.locator('#bodyPart2');
        this.ddlBodyPart3 = page.locator('#bodyPart3');
        this.txtIfOtherBodyPart = page.locator('#bodyPartOther');
        this.dtpDateOnset = page.locator('#dateOnset');
        this.dtpDateOfResolution = page.locator('#dateResolution');
        this.rdoHospitalizationYes = page.locator('#hospitalization1');
        this.rdoHospitalizationNo = page.locator('#hospitalization2');
        this.btnMedicationHistorySearch = page.getByRole('group', { name: 'Medication History' }).getByRole('button');
        this.iframe = page.frameLocator("iframe[frameborder='0']");
        this.iframeMedicationNameInput = this.iframe.locator('input.form-control.input-sm');
        this.txtComments = page.locator('#comments');
        this.txtReasonForDeletion = page.locator('#deleteComments');
        
        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporter\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgInfectionType = page.locator('#infectionDesc\\.errors');
        this.errMsgBodyPart = page.locator('#bodyPart1\\.errors');
        this.errMsgComments = page.locator('#comments\\.errors');
        this.errMsgDateOnSet = page.locator('#dateOnset\\.errors');
        this.errMsgDateOfResolution = page.locator('#dateResolution\\.errors');
        this.errMsgDeleteRequired = page.locator('#deleteRequiredMessage');
        
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.searchPage = new SearchPage(page);
        this.commonUtils = new CommonUtils(page);
    }

    async setInfectionType(infectionTypeCode) {
        await this.atcInfectionType.fill(infectionTypeCode);
        await this.page.waitForSelector('.form-control.ui-autocomplete-input');

        const suggestedInfectionType = this.page.locator(`li.ui-menu-item >> text=${infectionTypeCode}`);
        await suggestedInfectionType.click();
    }

    async addMedHistory(medicationName) {
        await this.btnMedicationHistorySearch.click();
        await this.page.waitForLoadState();

        await this.iframeMedicationNameInput.fill(medicationName);
        await this.iframe.getByRole('link', { name: 'Add' }).first().click();
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);

        await this.ddlReportedBy.selectOption(formObject.reporter);
        formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.ddlNotificationLevel.selectOption(formObject.notification);

        formObject.infectionTypeCode && await this.setInfectionType(formObject.infectionTypeCode);
        await this.ddlBodyPart1.selectOption(formObject.bodyPart1);
        await this.ddlBodyPart2.selectOption(formObject.bodyPart2);
        await this.ddlBodyPart3.selectOption(formObject.bodyPart3);
        await this.txtIfOtherBodyPart.fill(formObject.otherBodyPart);

        await this.dtpDateOnset.fill(formObject.dateOnset);
        await this.dtpDateOfResolution.fill(formObject.dateOfResolution);
        formObject.hospitalization && await this.commonUtils.selectRadioOption(formObject.hospitalization, this.rdoHospitalizationYes, this.rdoHospitalizationNo);

        await this.txtComments.fill(formObject.comments);
    }

    async deleteForm(formObject){
        formObject.individual && await this.searchPage.setIndividualField(formObject.individual);
        await this.commonButtons.clickButton(ButtonLabels.SEARCH);
        
        await this.listPage.selectFilteredFirstItem(formObject.searchForDeleting);
        await this.commonButtons.clickButton(ButtonLabels.DELETE);
        await this.page.waitForLoadState();
        await this.txtReasonForDeletion.fill(formObject.reasonForDeletion);
        await this.commonButtons.clickButton(ButtonLabels.CONFIRM);
    }

    async errMsgValidate(locator, expectedMsg) {
        expect(await locator.textContent()).toContain(expectedMsg);
    }
}