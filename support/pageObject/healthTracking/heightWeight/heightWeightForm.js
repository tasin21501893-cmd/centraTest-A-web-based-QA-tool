/**
 * @author Sayed Ahmed Tasin
 * @since 04/30/2026
 */

import { ListPage } from '../../../commonPages/listPage.js';
import { SearchPage } from '../../../commonPages/searchPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';

export class HeightWeightForm {
    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.searchPage = new SearchPage(page);
        this.commonButtons = new CommonButtons(page);
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.txtWeight = page.locator('[name="weight"]');
        this.ddlHeightFeet = page.locator('[name="heightFoot"]');
        this.ddlHeightInch = page.locator('[name="heightInch"]');
        this.txtComments = page.locator('[name="comments"]');
        this.txtReasonForDeletion = page.locator('[name="deleteComments"]');
        this.errMsgEventDate = page.locator('[id="eventDate.errors"]');
        this.errMsgReporter = page.locator('[id="reporter.errors"]');
        this.errMsgReporterNameOther = page.locator('[id="reporterNameOther.errors"]');
        this.errMsgWeight = page.locator('[id="weight.errors"]');
        this.errMsgComments = page.locator('[id="comments.errors"]');
    }

    /**
     * Reusable macro method to fill out and save/submit a Height/Weight record.
     * @param {Object} testcase 
     * @param {string} buttonLabel 
     */
    async createNewRecord(testcase, buttonLabel) {
        await this.fillupForm(testcase);
        await this.commonButtons.clickButton(buttonLabel);
    }

    async fillupForm(formObject) {
        if (formObject.program) await this.listPage.selectFilteredFirstItem(formObject.program);
        if (formObject.individual) await this.listPage.selectFilteredFirstItem(formObject.individual);

        if (formObject.reportedBy) {
            await this.ddlReportedBy.selectOption(formObject.reportedBy);
            if (formObject.reportedBy === 'Other' && formObject.reportedByOther) {
                await this.txtReportedByOther.fill(formObject.reportedByOther);
            }
        }

        if (formObject.eventDate === 'EMPTY') {
            await this.dtpEventDate.clear();
        } else if (formObject.eventDate) {
            await this.dtpEventDate.clear();
            await this.dtpEventDate.fill(formObject.eventDate);
        }

        if (formObject.notificationLevel) await this.ddlNotificationLevel.selectOption(formObject.notificationLevel);

        if (formObject.weight) {
            formObject.weight = String(formObject.weight);
            await this.txtWeight.fill(formObject.weight);
        }

        if (formObject.heightFeet) await this.ddlHeightFeet.selectOption(String(formObject.heightFeet));
        if (formObject.heightInch) await this.ddlHeightInch.selectOption(String(formObject.heightInch));
        if (formObject.comments) await this.txtComments.fill(formObject.comments);
    }

    async searchByFormId(formId) {
        await this.searchPage.searchForm({ formId });
        await this.listPage.clickFirstListItem();
    }
}
