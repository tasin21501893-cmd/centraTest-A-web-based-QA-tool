/**
 * @author Sk Fahim Mushfiq
 * @since 02/24/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { ListPage } from '../../../support/commonPages/listPage.js';

export class CaseNoteTemplatePage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);

        this.txtTemplateName = page.locator('[name="name"]');
        this.txtActivityType = page.locator('#activityTypeListLookup');
        this.txtLocation = page.locator('#locationListLookup');
        this.rdoDuration = page.getByLabel('Duration', { exact: true });
        this.rdoTimeRange = page.getByLabel('Time Range');
        this.chkShowUnitRate = page.locator('[name="showUnitRate"]');
        this.ddlPlaceOfService = page.locator('[name="placeOfServiceList"]');
        this.ddlQuestionnaire = page.locator('[name="questionnaire"]');
        this.lstAutocompleteResults = page.locator('.ui-autocomplete li');
        this.chkShareableWithLinkedProviders = page.locator('[name="shareable"]');
    }

    async selectMultiSelectDropdown(inputField, values) {
        const itemList = await this.commonUtils.parseCommaSeparatedList(values);

        for (const item of itemList) {
            await inputField.click();
            await inputField.fill(item);
            const escapedItem = this.listPage._escapeRegExp(item);
            const exactMatch = this.lstAutocompleteResults.filter({ hasText: new RegExp(`^${escapedItem}$`, 'i') }).first();

            try {
                await exactMatch.click();
            } catch (error) {
                console.error(`Automation could not find "${item}" in the dropdown`);
            }
        }
    }

    async selectPlaceOfService(placeOfServiceData) {
        if (placeOfServiceData) {
            const placeofServiceList = await this.commonUtils.parseCommaSeparatedList(placeOfServiceData);

            try {
                await this.ddlPlaceOfService.selectOption(placeofServiceList);
            } catch (error) {
                console.error(`Failed to select Place of Service options: ${placeofServiceList}. 
                Ensure these match the dropdown values exactly.`);
            }
        }
    }

    async configureCaseNoteTemplateFieldProperties(data) {
        const fieldPropertyConfigurationMap = {
            programVisible: 'clientProgramProp\\.visible',
            timeVisible: 'timeFormatProp\\.visible',
            serviceCodeVisible: 'unitRateProp\\.visible',
            billingUnitsVisible: 'billingUnitsProp\\.visible',
            placeOfServiceVisible: 'placeOfServiceProp\\.visible',
            activityTypeVisible: 'activityTypesProp\\.visible',
            locationVisible: 'locationsProp\\.visible',
            billableVisible: 'billableProp\\.visible',
            faceToFaceVisible: 'faceToFaceProp\\.visible',
            personContactedVisible: 'personContactedProp\\.visible',
            questionnaireVisible: 'qnrProp\\.visible',
            attachmentVisible: 'attachmentProp\\.visible',
            notesVisible: 'noteProp\\.visible',
            programRequired: 'clientProgramProp\\.required',
            timeRequired: 'timeFormatProp\\.required',
            serviceCodeRequired: 'unitRateProp\\.required',
            billingUnitsRequired: 'billingUnitsProp\\.required',
            placeOfServiceRequired: 'placeOfServiceProp\\.required',
            activityTypeRequired: 'activityTypesProp\\.required',
            locationRequired: 'locationsProp\\.required',
            billableRequired: 'billableProp\\.required',
            faceToFaceRequired: 'faceToFaceProp\\.required',
            personContactedRequired: 'personContactedProp\\.required',
            questionnaireRequired: 'qnrProp\\.required',
            attachmentRequired: 'attachmentProp\\.required',
            notesRequired: 'noteProp\\.required'
        };

        for (const flag in fieldPropertyConfigurationMap) {
            const checkboxId = fieldPropertyConfigurationMap[flag];
            const value = data[flag];

            await this.commonUtils.toggleCheckboxUsingValueById(this.page, checkboxId, value);
        }
    }

    async checkTimeFormatButton(format) {
        if (await this.rdoDuration.isEnabled()) {
            if (format === 'Duration') {
                await this.commonUtils.selectRadioButton(this.rdoDuration);
            } else if (format === 'Time Range') {
                await this.commonUtils.selectRadioButton(this.rdoTimeRange);
            }
        }
    }

    async navigateToCreateOrSearchCaseNoteTemplate(isOversight, action) {
        if (CommonUtils.isAffirmative(isOversight)) {
            await this.commonUtils.navigateToDashboardLink("Module Configuration", "Case Note Template", `${action} Template`);
        } else {
            await this.commonUtils.navigateToDashboardLink("Admin", "Case Note Template", `${action} Template`);
        }
    }

    async isCaseNoteTemplateExist(data) {
        await this.navigateToCreateOrSearchCaseNoteTemplate(data.isOversight, "Search");
        await this.commonButtons.clickButton('Search');

        if (await this.listPage.isItemExistInColumnByName(data.templateName, "Template Name")) {
            throw new Error(`CaseNoteTemplate: ${data.templateName} Already Exist!`);
        }
    }
    
    async fillUpCaseNoteTemplateForm(data) {
        await this.isCaseNoteTemplateExist(data);
        await this.navigateToCreateOrSearchCaseNoteTemplate(data.isOversight, "Create");
        await this.configureCaseNoteTemplateFieldProperties(data);
        await this.txtTemplateName.fill(data.templateName);
        await this.checkTimeFormatButton(data.timeFormat);

        if (data.showUnitRate && await this.chkShowUnitRate.isEnabled()) {
            await this.commonUtils.selectRadioOption(data.showUnitRate, this.chkShowUnitRate);
        }

        if (data.placeOfService && await this.ddlPlaceOfService.isEnabled()) {
            await this.selectPlaceOfService(data.placeOfService);
        }

        if (data.activityType && await this.txtActivityType.isEnabled()) {
            await this.selectMultiSelectDropdown(this.txtActivityType, data.activityType);
        }

        if (data.location && await this.txtLocation.isEnabled()) {
            await this.selectMultiSelectDropdown(this.txtLocation, data.location);
        }

        if (data.questionnaire && await this.ddlQuestionnaire.isEnabled()) {
            await this.ddlQuestionnaire.selectOption(data.questionnaire);
        }

        if (data.shareable && await this.chkShareableWithLinkedProviders.isVisible()) {
            await this.commonUtils.selectRadioOption(data.shareable, this.chkShareableWithLinkedProviders);
        }

        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Yes');
        return await this.commonUtils.handleFormSubmissionError();
    }
}