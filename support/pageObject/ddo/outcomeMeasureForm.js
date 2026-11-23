/**
* @author Sayed Ahmed Tasin
* @since 05/20/2026
*/

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';

export class OutcomeMeasureForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.txtOutcomeMeasureType = page.locator('[name="outcomeMeasure.type"]');
        this.txtDescription = page.locator('[name="outcomeMeasure.description"]');
        this.txtComments = page.locator('[name="outcomeMeasure.instruction"]');
        this.ddlNumberOfTaskDomains = page.locator('[name="outcomeMeasure.noOfTaskDomains"]');
        this.ddlNumberOfScoreLabels = page.locator('[name="outcomeMeasure.noOfScoreLabels"]');
        this.errMsgOutcomeMeasureType = page.locator('[id="outcomeMeasure.type.errors"]');
        this.errMsgDescription = page.locator('[id="outcomeMeasure.description.errors"]');
        this.errMsgComments = page.locator('[id="outcomeMeasure.instruction.errors"]');
        this.errMsgMismatchFound = page.locator('.alert-danger li', { hasText: 'Mismatch Found' });
        this.errMsgScoreLabelsOrTaskDomainsCannotBeEmpty = page.locator('.alert-danger li', { hasText: 'Score Labels Or Task Domains cannot be empty' });
    }

    getTaskDomain(index) {
        return this.page.locator(`[name="outcomeMeasure.outcomeMeasureTaskDomainList[${index - 1}].name"]`);
    }

    getTaskDomainError(index) {
        return this.page.locator(`[id="outcomeMeasure.outcomeMeasureTaskDomainList${index - 1}.name.errors"]`);
    }

    getScoreLabel(index) {
        return this.page.locator(`[name="outcomeMeasure.outcomeMeasureScoreLabelList[${index - 1}].label"]`);
    }

    getScoreLabelError(index) {
        return this.page.locator(`[id="outcomeMeasure.outcomeMeasureScoreLabelList${index - 1}.label.errors"]`);
    }

    async fillupForm(formObject) {
        if (formObject.outcomeMeasureType) await this.txtOutcomeMeasureType.fill(formObject.outcomeMeasureType);
        if (formObject.description) await this.txtDescription.fill(formObject.description);
        if (formObject.comments) await this.txtComments.fill(formObject.comments);

        // --- Task Domains Section ---
        if (formObject.numberOfTaskDomains) {
            await this.ddlNumberOfTaskDomains.selectOption(formObject.numberOfTaskDomains.toString());
            await this.commonButtons.clickButton(ButtonLabels.ADD_TASK_DOMAIN);

            for (let i = 1; i <= formObject.numberOfTaskDomains; i++) {
                const domainLocator = this.getTaskDomain(i);
                await domainLocator.clear();

                //Fallback to dynamic generation Task Domains
                let domainValue = formObject[`taskDomain${i}`];
                if (!domainValue && formObject.errorMsgLocator !== 'getTaskDomainError') {
                    domainValue = `Domain_${i}`;
                }

                if (domainValue) await domainLocator.fill(domainValue);
            }

            if (formObject.updatedNumberOfTaskDomains) {
                await this.ddlNumberOfTaskDomains.selectOption(formObject.updatedNumberOfTaskDomains.toString());
            }
        }

        // --- Score Labels Section ---
        if (formObject.numberOfScoreLabels) {
            await this.commonButtons.clickButton(ButtonLabels.CHANGE_SCORE_MAPPING);
            await this.ddlNumberOfScoreLabels.selectOption(formObject.numberOfScoreLabels.toString());
            await this.commonButtons.clickButton(ButtonLabels.CHANGE_SCORE_MAPPING);

            for (let i = 1; i <= formObject.numberOfScoreLabels; i++) {
                const labelLocator = this.getScoreLabel(i);
                await labelLocator.clear();

                // Fallback to dynamic generation for Score Labels as well
                let labelValue = formObject[`scoreLabel${i}`];
                if (!labelValue && formObject.errorMsgLocator !== 'getScoreLabelError') {
                    labelValue = `Label_${i}`;
                }

                if (labelValue) await labelLocator.fill(labelValue);
            }

            if (formObject.updatedNumberOfScoreLabels) {
                await this.ddlNumberOfScoreLabels.selectOption(formObject.updatedNumberOfScoreLabels.toString());
            }
        }
    }
}
