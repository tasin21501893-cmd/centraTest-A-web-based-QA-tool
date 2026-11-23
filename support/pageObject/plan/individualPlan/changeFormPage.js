/**
* @author Md. Hasin Ibtida Alam
* @since 08/17/2026
*/

import { filterObjects } from '../../../../support/commonUtility/read-xlsx.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class ChangeFormPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);

        // Main Form
        this.dtpChangeDate = this.page.locator("[name='changeDate']");
        this.dtpSendDate = this.page.locator("[name='sendDate']");
        this.ddlChangeInitiatedBy = this.page.locator("[name='initiatedBy']");
        this.txtChangeInitiatedByOther = this.page.locator("[name='initiatedByOther']");

        this.chkFinancialPlan = this.page.locator("[id='docTypes1']");
        this.chkIndividualPlan = this.page.locator("[id='docTypes2']");
        this.chkProtocols = this.page.locator("[id='docTypes3']");
        this.chkSafetyPlan = this.page.locator("[id='docTypes4']");
        this.chkOtherDocuments = this.page.locator("[id='docTypes5']");

        this.ddlReasonForChange = this.page.locator("[name='reasonForChange']");
        this.txtOtherReason = this.page.locator("[name='otherReason']");
        this.txtListSpecificChanges = this.page.locator("[name='change']");
        this.txtWhereIsTheChangeDocumented = this.page.locator("[name='documented']");

        // Acknowledge
        this.acknowledgeModal = this.page.locator("#ackModal");
        this.txtAcknowledgeComments = this.page.locator('[name="acknowledgeComments"]');

    }

    /**
     * Fills up the Change Form with data.
     * @param {Object} data - Main individual plan test case row.
     * @param {Object} individualPlanExcelObject - Full Excel workbook object.
     * @param {number} [changeFormIndex=1] - 1-based index of the change form.
     */
    async fillUpForm(data, individualPlanExcelObject, changeFormIndex = 1) {
        const changeFormData = filterObjects(individualPlanExcelObject.changeFormData, [{ 'ipIndex': data.index }])[changeFormIndex - 1];

        await this.dtpChangeDate.fill(changeFormData.changeDate);
        await this.dtpSendDate.fill(changeFormData.sendDate);
        await this.ddlChangeInitiatedBy.selectOption(changeFormData.changeInitiatedBy || '');

        if (changeFormData.changeInitiatedBy?.trim().toLowerCase() === 'other') {
            await this.txtChangeInitiatedByOther.fill(changeFormData.changeInitiatedByOther);
        }

        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkFinancialPlan, changeFormData.isFinancialPlan);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkIndividualPlan, changeFormData.isIndividualPlan);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkProtocols, changeFormData.isProtocols);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkSafetyPlan, changeFormData.isSafetyPlan);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkOtherDocuments, changeFormData.isOtherDocuments);

        await this.ddlReasonForChange.selectOption(changeFormData.reasonForChange || '');
        await this.txtOtherReason.fill(changeFormData.otherReason);
        await this.txtListSpecificChanges.fill(changeFormData.listSpecificChanges);
        await this.txtWhereIsTheChangeDocumented.fill(changeFormData.whereIsTheChangeDocumented);
    }

    async executeAcknowledgeAction(data, individualPlanExcelObject, changeFormIndex = 1) {
        const changeFormData = filterObjects(individualPlanExcelObject.changeFormData, [{ 'ipIndex': data.index }])[changeFormIndex - 1];
        await this.commonButtons.clickButton('Acknowledge');
        await this.txtAcknowledgeComments.fill(changeFormData.acknowledgeComments || '');
        await this.commonButtons.clickButton('Acknowledge', this.acknowledgeModal);
    }
}