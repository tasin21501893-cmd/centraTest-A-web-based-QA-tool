/**
* @author [Sayed Ahmed Tasin]
* @since 02/22/2026
*/

import { ListPage } from '../../commonPages/listPage.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class LifeTrajectoryForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.ddlTemplate = page.locator('[name="template"]');
        this.dtpEventDate = page.locator('[name="lifeTrajectory.createDate"]');
        this.txtVisionForWhat = page.locator('[name="lifeTrajectory.visionForWant"]');
        this.txtDoNotWant = page.locator('[name="lifeTrajectory.doNotWant"]');
        this.txtPositiveLifeEvents = page.locator('[name="lifeTrajectory.positiveLifeEvents"]');
        this.txtNegativeLifeEvents = page.locator('[name="lifeTrajectory.negativeLifeEvents"]');
        this.txtPositiveLifeEventsPast = page.locator('[name="lifeTrajectory.positiveLifeEventsPast"]');
        this.txtNegativeLifeEventsPast = page.locator('[name="lifeTrajectory.negativeLifeEventsPast"]');
        this.txtGoodLifeVisionForWant = page.locator('[name="lifeTrajectory.goodLifeVisionForWant"]');
        this.txtDecisionsChoicesForWant = page.locator('[name="lifeTrajectory.decisionsChoicesForWant"]');
        this.txtNotGoodLifeDoNotWant = page.locator('[name="lifeTrajectory.notGoodLifeDoNotWant"]');
        this.txtDecisionsChoicesDoNotWant = page.locator('[name="lifeTrajectory.decisionsChoicesDoNotWant"]');
        this.txtUnderstandIssuesPast = page.locator('[name="lifeTrajectory.understandIssuesPast"]');
        this.txtCommunicatePreferencesPast = page.locator('[name="lifeTrajectory.communicatePreferencesPast"]');
        this.txtFollowThroughChoicesPast = page.locator('[name="lifeTrajectory.followThroughChoicesPast"]');
        this.txtUnderstandIssuesFuture = page.locator('[name="lifeTrajectory.understandIssuesFuture"]');
        this.txtCommunicatePreferencesFuture = page.locator('[name="lifeTrajectory.communicatePreferencesFuture"]');
        this.txtFollowThroughChoicesFuture = page.locator('[name="lifeTrajectory.followThroughChoicesFuture"]');
        this.txtAvoidBarriersFuture = page.locator('[name="lifeTrajectory.avoidBarriersFuture"]');
        this.txtPositiveLifeEventsFuture = page.locator('[name="lifeTrajectory.positiveLifeEventsFuture"]');
        this.txtNegativeLifeEventsFuture = page.locator('[name="lifeTrajectory.negativeLifeEventsFuture"]');

        this.errMsgPositiveLifeEventsPast = page.locator('[id="lifeTrajectory.positiveLifeEventsPast.errors"]');
        this.errMsgNegativeLifeEventsPast = page.locator('[id="lifeTrajectory.negativeLifeEventsPast.errors"]');
        this.errMsgEventDate = page.locator('[id="lifeTrajectory.createDate.errors"]');
        this.errMsgVisionForWhat = page.locator('[id="lifeTrajectory.visionForWant.errors"]');
        this.errMsgDoNotWant = page.locator('[id="lifeTrajectory.doNotWant.errors"]');
        this.errMsgPositiveLifeEvents = page.locator('[id="lifeTrajectory.positiveLifeEvents.errors"]');
        this.errMsgNegativeLifeEvents = page.locator('[id="lifeTrajectory.negativeLifeEvents.errors"]');
        this.errMsgPositiveLifeEventsFuture = page.locator('[id="lifeTrajectory.positiveLifeEventsFuture.errors"]');
        this.errMsgNegativeLifeEventsFuture = page.locator('[id="lifeTrajectory.negativeLifeEventsFuture.errors"]');
        this.errMsgGoodLifeVisionForWant = page.locator('[id="lifeTrajectory.goodLifeVisionForWant.errors"]');
        this.errMsgDecisionsChoicesForWant = page.locator('[id="lifeTrajectory.decisionsChoicesForWant.errors"]');
        this.errMsgNotGoodLifeDoNotWant = page.locator('[id="lifeTrajectory.notGoodLifeDoNotWant.errors"]');
        this.errMsgDecisionsChoicesDoNotWant = page.locator('[id="lifeTrajectory.decisionsChoicesDoNotWant.errors"]');
        this.errMsgUnderstandIssuesPast = page.locator('[id="lifeTrajectory.understandIssuesPast.errors"]');
        this.errMsgCommunicatePreferencesPast = page.locator('[id="lifeTrajectory.communicatePreferencesPast.errors"]');
        this.errMsgFollowThroughChoicesPast = page.locator('[id="lifeTrajectory.followThroughChoicesPast.errors"]');
        this.errMsgUnderstandIssuesFuture = page.locator('[id="lifeTrajectory.understandIssuesFuture.errors"]');
        this.errMsgCommunicatePreferencesFuture = page.locator('[id="lifeTrajectory.communicatePreferencesFuture.errors"]');
        this.errMsgFollowThroughChoicesFuture = page.locator('[id="lifeTrajectory.followThroughChoicesFuture.errors"]');
        this.errMsgAvoidBarriersFuture = page.locator('[id="lifeTrajectory.avoidBarriersFuture.errors"]');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        await this.ddlTemplate.selectOption(formObject.template);
        await this.commonButtons.clickButton(ButtonLabels.NEXT);
        formObject.eventDate && await this.dtpEventDate.fill(formObject.eventDate);
        formObject.visionForWhat && await this.txtVisionForWhat.fill(formObject.visionForWhat);
        formObject.doNotWant && await this.txtDoNotWant.fill(formObject.doNotWant);
        formObject.positiveLifeEvents && await this.txtPositiveLifeEvents.fill(formObject.positiveLifeEvents);
        formObject.negativeLifeEvents && await this.txtNegativeLifeEvents.fill(formObject.negativeLifeEvents);
        formObject.positiveLifeEventsPast && await this.txtPositiveLifeEventsPast.fill(formObject.positiveLifeEventsPast);
        formObject.negativeLifeEventsPast && await this.txtNegativeLifeEventsPast.fill(formObject.negativeLifeEventsPast);
        formObject.positiveLifeEventsFuture && await this.txtPositiveLifeEventsFuture.fill(formObject.positiveLifeEventsFuture);
        formObject.negativeLifeEventsFuture && await this.txtNegativeLifeEventsFuture.fill(formObject.negativeLifeEventsFuture);
        formObject.goodLifeVisionForWant && await this.txtGoodLifeVisionForWant.fill(formObject.goodLifeVisionForWant);
        formObject.decisionsChoicesForWant && await this.txtDecisionsChoicesForWant.fill(formObject.decisionsChoicesForWant);
        formObject.notGoodLifeDoNotWant && await this.txtNotGoodLifeDoNotWant.fill(formObject.notGoodLifeDoNotWant);
        formObject.decisionsChoicesDoNotWant && await this.txtDecisionsChoicesDoNotWant.fill(formObject.decisionsChoicesDoNotWant);
        formObject.understandIssuesPast && await this.txtUnderstandIssuesPast.fill(formObject.understandIssuesPast);
        formObject.communicatePreferencesPast && await this.txtCommunicatePreferencesPast.fill(formObject.communicatePreferencesPast);
        formObject.followThroughChoicesPast && await this.txtFollowThroughChoicesPast.fill(formObject.followThroughChoicesPast);
        formObject.understandIssuesFuture && await this.txtUnderstandIssuesFuture.fill(formObject.understandIssuesFuture);
        formObject.communicatePreferencesFuture && await this.txtCommunicatePreferencesFuture.fill(formObject.communicatePreferencesFuture);
        formObject.followThroughChoicesFuture && await this.txtFollowThroughChoicesFuture.fill(formObject.followThroughChoicesFuture);
        formObject.avoidBarriersFuture && await this.txtAvoidBarriersFuture.fill(formObject.avoidBarriersFuture);
    }
}