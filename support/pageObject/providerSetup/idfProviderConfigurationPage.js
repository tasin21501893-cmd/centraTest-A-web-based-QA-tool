/**
 * @author Abdullah Umar Nasib
 * @since 12/25/2024 8:43 PM
*/

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class IdfProviderConfigurationPage {
    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
    }

    async checkProviderTypeAndSelectCheckboxes(data) {
        const oversightProviderTypes = ['State Oversight', 'County Oversight', 'Regional Oversight', 'Private Oversight'];
        const providerType = data.providerType.toLowerCase().trim();

        await this.utils.toggleCheckboxUsingValue(this.page, 'Disable IDF Creation', data.disableIdfCreation);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Disable IDF Modification', data.disableIdfModification);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Show Gender/Pronoun', data.showGenderPronoun);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Document Checklist', data.enableDocumentChecklist);

        if (oversightProviderTypes.some(type => type.toLowerCase() === providerType)) {
            await this.utils.toggleCheckboxUsingValue(this.page, 'Disable Linked Provider IDF Creation', data.disableLinkedProviderIdfCreation);
            await this.utils.toggleCheckboxUsingValue(this.page, 'Disable Linked Provider IDF Modification', data.disableLinkedProviderIdfModification);
            await this.utils.toggleCheckboxUsingValue(this.page, 'IDF Initial Sync', data.idfInitialSync);
            await this.utils.toggleCheckboxUsingValue(this.page, 'IDF Sync', data.idfSync);
            await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Referral', data.enableReferral);
            await this.utils.toggleCheckboxUsingValue(this.page, 'Disable Quick Referral', data.disableQuickReferral);
            await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Oversight Program', data.enableOversightProgram);
        } 
        else if (providerType.includes('provider')) { // Checks if 'providerType' includes 'provider', covering both 'Case Management Provider' and the 'Provider' type.  
            await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Default Enrollment Program', data.enableDefaultEnrollmentProgram);
        }
    }

    async updateIdfProviderConfig() {
        await this.commonButtons.clickButton('Update');
    }
}