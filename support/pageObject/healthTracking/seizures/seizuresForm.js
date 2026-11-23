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

export class SeizuresForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.rdoSeizureOccuredYes = page.locator('#seizureOccurred1');
        this.rdoSeizureOccuredNo = page.locator('#seizureOccurred2');
        this.ddlLocation = page.locator('[name="location"]');
        this.txtOtherLocation = page.locator('[name="locationOther"]');
        this.dtpBeginTime = page.locator('[name="beginTime"]');
        this.ddlDurationMinute = page.locator('[name="durationMin"]');
        this.ddlDurationSecond = page.locator('[name="durationSec"]');
        this.btnAddDescription = page.locator('button[data-target="#seizureModal"]');
        this.modalDescriptionOfSeizure = page.locator('#seizureModal');
        this.modalTxtOtherDescription = this.modalDescriptionOfSeizure.locator('#seizureOtherStr');
        this.btnModalAddDescription = this.modalDescriptionOfSeizure.getByRole('button', { name: 'Add' });
        this.btnAddBehavior = page.locator('button[data-target="#bhvModal"]');
        this.modalBehaviorAfterSeizure = page.locator('#bhvModal');
        this.modalTxtOtherBehavior = this.modalBehaviorAfterSeizure.locator('#behaviorOtherStr');
        this.btnModalAddBehavior = this.modalBehaviorAfterSeizure.getByRole('button', { name: 'Add' });
        this.btnAddStaffAction = page.locator('button[data-target="#actionModal"]');
        this.modalStaffAction = page.locator('#actionModal');
        this.modalTxtOtherStaffAction = this.modalStaffAction.locator('#actionOtherStr');
        this.btnModalAddStaffAction = this.modalStaffAction.getByRole('button', { name: 'Add' });
        this.txtPrecipitatingFactors = page.locator('[name="precipitatingFactor"]');
        this.txtResultingIjuries = page.locator('[name="resultingInjury"]');
        this.txtComments = page.locator('[name="remarks"]');
        this.txtReasonForDeletion = page.locator('#deleteComments');

        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporter\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgOtherLocation = page.locator('#locationOther\\.errors');
        this.errMsgBeginTime = page.locator('#beginTime\\.errors');
        this.errMsgPrecipitatingFactors = page.locator('#precipitatingFactor\\.errors');
        this.errMsgResultingInjuries = page.locator('#resultingInjury\\.errors');
        this.errMsgComments = page.locator('#remarks\\.errors');
        this.errMsgDeleteRequired = page.locator('#deleteRequiredMessage');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
    }

    async addDescriptionOfSeizure(descriptionOfSeizure, otherDescription) {
        await this.btnAddDescription.click();
        if (descriptionOfSeizure) {
            const inputs = descriptionOfSeizure.split(',').map(input => input.trim());
            for (const input of inputs) {
                await this.modalDescriptionOfSeizure.getByText(input).check();
            }
        }

        otherDescription && await this.modalTxtOtherDescription.pressSequentially(otherDescription);
        await this.btnModalAddDescription.click();
    }

    async addBehaviorAfterSeizure(behaviorAfterSeizure, otherBehavior) {
        await this.btnAddBehavior.click();
        if (behaviorAfterSeizure) {
            const inputs = behaviorAfterSeizure.split(',').map(input => input.trim());
            for (const input of inputs) {
                await this.modalBehaviorAfterSeizure.getByText(input).check();
            }
        }

        otherBehavior && await this.modalTxtOtherBehavior.pressSequentially(otherBehavior);
        await this.btnModalAddBehavior.click();
    }

    async addStaffAction(staffAction, otherStaffAction) {
        await this.btnAddStaffAction.click();
        if (staffAction) {
            const inputs = staffAction.split(',').map(input => input.trim());
            for (const input of inputs) {
                await this.modalStaffAction.getByText(input).check();
            }
        }

        otherStaffAction && await this.modalTxtOtherStaffAction.pressSequentially(otherStaffAction);
        await this.btnModalAddStaffAction.click();
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        await this.ddlReportedBy.selectOption(formObject.reporter);
        formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.ddlNotificationLevel.selectOption(formObject.notification);
        formObject.seizureOccured && await this.commonUtils.selectRadioOption(formObject.seizureOccured, this.rdoSeizureOccuredYes, this.rdoSeizureOccuredNo);

        if (CommonUtils.isAffirmative(formObject.seizureOccured)) {
            formObject.location && await this.ddlLocation.selectOption(formObject.location);
            formObject.otherLocation && await this.txtOtherLocation.fill(formObject.otherLocation);
            formObject.beginTime && await this.dtpBeginTime.fill(formObject.beginTime);
            formObject.durationMinute && await this.ddlDurationMinute.selectOption(formObject.durationMinute);
            formObject.durationSecond && await this.ddlDurationSecond.selectOption(formObject.durationSecond);
            (formObject.descriptionOfSeizure || formObject.otherDescription) && await this.addDescriptionOfSeizure(formObject.descriptionOfSeizure, formObject.otherDescription);
            (formObject.behaviorAfterSeizure || formObject.otherBehavior) && await this.addBehaviorAfterSeizure(formObject.behaviorAfterSeizure, formObject.otherBehavior);
            (formObject.staffAction || formObject.otherStaffAction) && await this.addStaffAction(formObject.staffAction, formObject.otherStaffAction);
            formObject.precipitatingFactors && await this.txtPrecipitatingFactors.fill(formObject.precipitatingFactors);
            formObject.resultingIjuries && await this.txtResultingIjuries.fill(formObject.resultingIjuries);
        }

        formObject.comments && await this.txtComments.fill(formObject.comments);
    }

    async deleteForm(reasonForDeletion) {
        await this.donePage.clickLinkByText("Form");
        await this.commonButtons.clickButton(ButtonLabels.DELETE);
        await this.page.waitForLoadState();
        reasonForDeletion && await this.txtReasonForDeletion.fill(reasonForDeletion);
        await this.commonButtons.clickButton(ButtonLabels.CONFIRM);
    }

    async errMsgValidate(locator, expectedMsg) {
        expect(await locator.textContent()).toContain(expectedMsg);
    }
}