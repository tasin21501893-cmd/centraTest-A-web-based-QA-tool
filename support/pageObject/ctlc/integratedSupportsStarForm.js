/**
* @author [Sayed Ahmed Tasin]
* @since 02/22/2026
*/

import { ListPage } from '../../commonPages/listPage';

export class IntegratedSupportsStarForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="createDate"]');
        this.txtTypeSubject = page.locator('[name="type"]');
        this.txtPersonalStrengthsAndAssets = page.locator('[name="personalStrengthsAndAssets"]');
        this.txtRelationships = page.locator('[name="relationships"]');
        this.txtEligibilitySpecific = page.locator('[name="eligibilitySpecific"]');
        this.txtCommunityBased = page.locator('[name="communityBased"]');
        this.txtTechnology = page.locator('[name="technology"]');

        this.errMsgEventDate = page.locator('[id="createDate.errors"]');
        this.errMsgTypeSubject = page.locator('[id="type.errors"]');
        this.errMsgPersonalStrengthsAndAssets = page.locator('[id="personalStrengthsAndAssets.errors"]');
        this.errMsgRelationships = page.locator('[id="relationships.errors"]');
        this.errMsgEligibilitySpecific = page.locator('[id="eligibilitySpecific.errors"]');
        this.errMsgCommunityBased = page.locator('[id="communityBased.errors"]');
        this.errMsgTechnology = page.locator('[id="technology.errors"]');

        this.listPage = new ListPage(page);
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.eventDate && await this.dtpEventDate.fill(formObject.eventDate);
        if (formObject.typeSubject.length > 20) {
            await this.txtTypeSubject.evaluate(maxlength => maxlength.setAttribute('maxlength', '25'))
        }
        await this.txtTypeSubject.fill(formObject.typeSubject);
        formObject.personalStrengthsAndAssets && await this.txtPersonalStrengthsAndAssets.fill(formObject.personalStrengthsAndAssets);
        formObject.relationships && await this.txtRelationships.fill(formObject.relationships);
        formObject.eligibilitySpecific && await this.txtEligibilitySpecific.fill(formObject.eligibilitySpecific);
        formObject.communityBased && await this.txtCommunityBased.fill(formObject.communityBased);
        formObject.technology && await this.txtTechnology.fill(formObject.technology);
    }
}