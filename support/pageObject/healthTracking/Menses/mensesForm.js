/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons';
import { CommonUtils } from '../../../commonUtility/commonUtils';
import { ListPage } from '../../../commonPages/listPage';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';
import { DonePage } from '../../../commonPages/donePage';

export class MensesForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.dtpMensesDate = page.locator('[name="beginDate"]');
        this.rdoDayWithMensesYes = page.locator('#dayWithMenses1');
        this.rdoDayWithMensesNo = page.locator('#dayWithMenses2');
        this.ddlBleeding = page.locator('[name="bleeding"]');
        this.ddlDiscomfort = page.locator('[name="discomfort"]');
        this.txtComments = page.locator('[name="remarks"]');
        this.txtReasonForDeletion = page.locator('[name="deleteComments"]');

        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporter\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgMensesDate = page.locator('#beginDate\\.errors');
        this.errMsgComments = page.locator('#remarks\\.errors');
        this.errMsgDeleteRequired = page.locator('#deleteRequiredMessage');
        
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
    }

    async fillupForm(formObject){
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);

        await this.ddlReportedBy.selectOption(formObject.reporter);
        formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.ddlNotificationLevel.selectOption(formObject.notification);

        await this.dtpMensesDate.clear();
        formObject.mensesDate && await this.dtpMensesDate.fill(formObject.mensesDate);
        formObject.mensesValue && await this.commonUtils.selectRadioOption(formObject.mensesValue, this.rdoDayWithMensesYes, this.rdoDayWithMensesNo);
        formObject.bleeding && await this.ddlBleeding.selectOption(formObject.bleeding);
        formObject.discomfort && await this.ddlDiscomfort.selectOption(formObject.discomfort);
        formObject.comments && await this.txtComments.fill(formObject.comments);
    }

    async deleteForm(reasonForDeletion){
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