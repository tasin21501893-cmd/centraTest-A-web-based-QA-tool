/**
 * @author Mohammad Abdur Rafi Farhab
 * @since 03/12/2026
*/

import { CommonUtils } from '../../commonUtility/commonUtils';
import { DonePage } from '../../commonPages/donePage.js';

import { IdfPage } from './idfPage';

export class IndividualCustomFieldPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
        this.idfPage = new IdfPage(page);
    }

    async getCustomField(sectionName, fieldName) {
        return this.page.locator('section.panel-info').filter({ hasText: sectionName }).getByLabel(fieldName, { exact: true });
    }

    async navigateToCustomFields(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);
        await this.donePage.clickLinkByText('Custom Fields');
    }

    async fillCustomFields(type, sectionName, fieldName, customFieldValue) {
        if (customFieldValue === null || customFieldValue === undefined || customFieldValue === '') return;

        let locator = await this.getCustomField(sectionName, fieldName);

        switch (type.toLowerCase()) {
            case 'numeric':

                if (await this.commonUtils.isNumeric(customFieldValue)) {
                    await locator.fill(customFieldValue);
                } else {
                    throw new Error('The provided value is not numeric value');
                }
            case 'text':
            case 'long text':
                await locator.fill(customFieldValue);
                break;

            case 'yes/no':
            case 'dropdown':
                await locator.selectOption(customFieldValue.toString());
                break;

            case 'date':
                await locator.fill(customFieldValue.toString());
                await locator.press('Tab');
                break;

            default:
                throw new Error(`Type '${type}' not recognized for field '${fieldName}'.`);
        }
    }

    async fillUpIndividualCustomFields(data) {
        let sectionName = '';

        if (data.stateFields.toLowerCase() == 'yes') {
            sectionName = 'State Fields';
        } else if (data.oversightFields.toLowerCase() == 'yes') {
            sectionName = 'Oversight Fields';
        } else sectionName = 'Provider Fields';

        await this.fillCustomFields(data.dataType, sectionName, data.customFieldName, data.customFieldValue);
    }
}