/**
* @author [Sayed Ahmed Tasin]
* @since 02/22/2026
*/

import { ListPage } from '../../commonPages/listPage.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class VisionToolForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.ddlPerspective = page.locator('[name="perspective"]');
        this.dtpEventDate = page.locator('[id="createDate"]');
        this.ddlFamilyMember = page.locator('select[name="familyMember"]');
        this.ddlPriorityDailyLifeAnswer = page.locator('[name="lifeDomainInfoList[0].priority"]');
        this.ddlPriorityCommunityLivingAnswer = page.locator('[name="lifeDomainInfoList[1].priority"]');
        this.ddlPrioritySocialAndSpiritualityAnswer = page.locator('[name="lifeDomainInfoList[2].priority"]');
        this.ddlPriorityHealthyLivingAnswer = page.locator('[name="lifeDomainInfoList[3].priority"]');
        this.ddlPrioritySafetySecurityAnswer = page.locator('[name="lifeDomainInfoList[4].priority"]');
        this.ddlPriorityAdvocacyEngagementAnswer = page.locator('[name="lifeDomainInfoList[5].priority"]');
        this.ddlPrioritySupportsForFamilyAnswer = page.locator('[name="lifeDomainInfoList[6].priority"]');
        this.ddlPrioritySupportsServicesAnswer = page.locator('[name="lifeDomainInfoList[7].priority"]');

        this.txtFamilyMemberOther = page.locator('[name="familyMemberOther"]');
        this.txtDailyLifeAnswer = page.locator('[name="lifeDomainInfoList[0].answer"]');
        this.txtCommunityLivingAnswer = page.locator('[name="lifeDomainInfoList[1].answer"]');
        this.txtSocialAndSpiritualityAnswer = page.locator('[name="lifeDomainInfoList[2].answer"]');
        this.txtHealthyLivingAnswer = page.locator('[name="lifeDomainInfoList[3].answer"]');
        this.txtSafetySecurityAnswer = page.locator('[name="lifeDomainInfoList[4].answer"]');
        this.txtAdvocacyEngagementAnswer = page.locator('[name="lifeDomainInfoList[5].answer"]');
        this.txtSupportsForFamilyAnswer = page.locator('[name="lifeDomainInfoList[6].answer"]');
        this.txtSupportsServicesAnswer = page.locator('[name="lifeDomainInfoList[7].answer"]');

        this.errMsgEventDate = page.locator('[id="createDate.errors"]');
        this.errMsgfamilyMemberOther = page.locator('[id="familyMemberOther.errors"]');
        this.errMsgDailyLifeAnswer = page.locator('[id="lifeDomainInfoList0.answer.errors"]');
        this.errMsgCommunityLivingAnswer = page.locator('[id="lifeDomainInfoList1.answer.errors"]');
        this.errMsgSocialAndSpiritualityAnswer = page.locator('[id="lifeDomainInfoList2.answer.errors"]');
        this.errMsgHealthyLivingAnswer = page.locator('[id="lifeDomainInfoList3.answer.errors"]');
        this.errMsgSafetySecurityAnswer = page.locator('[id="lifeDomainInfoList4.answer.errors"]');
        this.errMsgAdvocacyEngagementAnswer = page.locator('[id="lifeDomainInfoList5.answer.errors"]');
        this.errMsgSupportsForFamilyAnswer = page.locator('[id="lifeDomainInfoList6.answer.errors"]');
        this.errMsgSupportsServicesAnswer = page.locator('[id="lifeDomainInfoList7.answer.errors"]');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.perspective && await this.ddlPerspective.selectOption(formObject.perspective);
        await this.commonButtons.clickButton(ButtonLabels.NEXT);
        formObject.familyMember && await this.ddlFamilyMember.selectOption(formObject.familyMember);
        formObject.familyMemberOther && await this.txtFamilyMemberOther.fill(formObject.familyMemberOther);
        formObject.eventDate && await this.dtpEventDate.fill(formObject.eventDate);
        formObject.dailyLifeAnswer && await this.txtDailyLifeAnswer.fill(formObject.dailyLifeAnswer);
        formObject.priorityDailyLifeAnswer && await this.ddlPriorityDailyLifeAnswer.selectOption(formObject.priorityDailyLifeAnswer);
        formObject.communityLivingAnswer && await this.txtCommunityLivingAnswer.fill(formObject.communityLivingAnswer);
        formObject.priorityCommunityLivingAnswer && await this.ddlPriorityCommunityLivingAnswer.selectOption(formObject.priorityCommunityLivingAnswer);
        formObject.socialAndSpiritualityAnswer && await this.txtSocialAndSpiritualityAnswer.fill(formObject.socialAndSpiritualityAnswer);
        formObject.prioritySocialAndSpiritualityAnswer && await this.ddlPrioritySocialAndSpiritualityAnswer.selectOption(formObject.prioritySocialAndSpiritualityAnswer);
        formObject.healthyLivingAnswer && await this.txtHealthyLivingAnswer.fill(formObject.healthyLivingAnswer);
        formObject.priorityHealthyLivingAnswer && await this.ddlPriorityHealthyLivingAnswer.selectOption(formObject.priorityHealthyLivingAnswer);
        formObject.safetySecurityAnswer && await this.txtSafetySecurityAnswer.fill(formObject.safetySecurityAnswer);
        formObject.prioritySafetySecurityAnswer && await this.ddlPrioritySafetySecurityAnswer.selectOption(formObject.prioritySafetySecurityAnswer);
        formObject.advocacyEngagementAnswer && await this.txtAdvocacyEngagementAnswer.fill(formObject.advocacyEngagementAnswer);
        formObject.priorityAdvocacyEngagementAnswer && await this.ddlPriorityAdvocacyEngagementAnswer.selectOption(formObject.priorityAdvocacyEngagementAnswer);
        formObject.supportsForFamilyAnswer && await this.txtSupportsForFamilyAnswer.fill(formObject.supportsForFamilyAnswer);
        formObject.prioritySupportsForFamilyAnswer && await this.ddlPrioritySupportsForFamilyAnswer.selectOption(formObject.prioritySupportsForFamilyAnswer);
        formObject.supportsServicesAnswer && await this.txtSupportsServicesAnswer.fill(formObject.supportsServicesAnswer);
        formObject.prioritySupportiveServicesAnswer && await this.ddlPrioritySupportsServicesAnswer.selectOption(formObject.prioritySupportiveServicesAnswer);
    }
}