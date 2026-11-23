/**
 * @author Maksuda Islam (Lima)
 * @since 07/05/2024
 */

import { expect } from '@playwright/test';

import { postActionMessage } from '../../../support/constants/acfCore/postActionMessage.js';
import { GeneralInformation } from '../../../support/pageObject/assessmentAndScreening/generalInformation.js';
import { getYesterdayDate } from '../../helper/acfCore/formFillUpDataProcessor.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { FormPage } from './formFillUpEditableMode/formPage.js';
import { FromInputValidatorEditableMode } from './formFillUpEditableMode/formInputValidatorEditableMode.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class Workflow {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.generalInformation = new GeneralInformation(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.fromInputValidatorEditableMode = new FromInputValidatorEditableMode(page);
        this.formPage = new FormPage(page);
        this.commonButtons = new CommonButtons(page);
    }

    statusActionObject;
    arraysWithCopyAction = [];
    statusActionObjectForCopy;

    async actionButton(action) {
        const words = action.toLowerCase().split(' ');

        let output = words[0];
        for (let i = 1; i < words.length; i++) {
            output += words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }

        await this.page.locator(`[name="_action_${output}"]`).click();
    }

    async validateStatus(status) {
        let extractedStatusTextLocator = (this.page.locator('span.status.text-primary')).or(this.page.locator('span.status.text-danger')).or(this.page.locator('span.status.text-success')).nth(0);
        expect.soft(extractedStatusTextLocator).toHaveText(status);
    }

    async clickConfirmButtonUponAvailability() {
        const confirmButtonLocator = this.page.locator('[name="_action_confirm"]');

        if (await this.commonUtils.isElementAvailable(confirmButtonLocator)) {
            await confirmButtonLocator.click();
        }
    }

    async validateDoneMsg(msgText) {
        let extractedDoneMsgText = this.page.locator('div.alert.alert-success');
        await expect.soft(extractedDoneMsgText).toContainText(msgText);
    }

    async iteratePaths(formInfo, path) {
        for (const step of path) {

            if (step.action === "SAVE") {
                await this.validateStatus(step.status);
                await this.generalInformation.fillUpGeneralInfoSection(formInfo.formLabel, formInfo.formVersion, getYesterdayDate());
                await this.commonButtons.clickButton('Save and Continue');
                await this.commonButtons.clickButton('Update and Show');

            } else if (step.action === "UPDATE") {
                await this.validateStatus(step.status);
                await this.actionButton("EDIT");
                await this.commonButtons.clickButton('Update and Show');

                if (postActionMessage[step.action] !== undefined) {
                    await this.validateDoneMsg(postActionMessage[step.action])
                }

            } else if (step.action === "DISCONTINUE") {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);

            } else if (step.action === "DELETE") {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

            } else if ((step.action === "undefined") || (step.action === "VIEW") || (step.action === "ACKNOWLEDGE")) {
                continue;

            } else if (step.action === "COPY") {
                await this.actionButton(step.action);
                await this.validateStatus("New");

            } else if (step.action === "SUBMIT") {
                await this.validateStatus(step.status);
                await this.page.locator('[name="_action_submit_without_scores"], [name="_action_submit"]').click();

                await this.clickConfirmButtonUponAvailability();

            } else {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);

                if (postActionMessage[step.action] !== undefined) {
                    await this.validateDoneMsg(postActionMessage[step.action])
                };
            }
        }
    }

    async iteratePathsWithFormFillUp(formInfo, path, definitionData) {
        for (const step of path) {

            if (step.action === "SAVE") {
                await this.validateStatus(step.status);
                await this.generalInformation.fillUpGeneralInfoSection(formInfo.formLabel, formInfo.formVersion, getYesterdayDate());
                await this.commonButtons.clickButton('Save and Continue');
                await this.formPage.fillSectionsWithRandomInput(definitionData.sections, definitionData.conditionalItems, 'no');
                await this.commonButtons.clickButton('Update and Show');

            } else if (step.action === "UPDATE") {
                await this.validateStatus(step.status);
                await this.actionButton("EDIT");
                await this.commonButtons.clickButton('Update and Show');

                if (postActionMessage[step.action] !== undefined) {
                    await this.validateDoneMsg(postActionMessage[step.action])
                }

            } else if (step.action === "DISCONTINUE") {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);

            } else if (step.action === "DELETE") {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);
                this.page.once('dialog', async dialog => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    await dialog.accept();
                });

            } else if ((step.action === "undefined") || (step.action === "VIEW") || (step.action === "ACKNOWLEDGE")) {
                continue;

            } else if (step.action === "COPY") {
                await this.actionButton(step.action);
                await this.validateStatus("New");

                await this.generalInformation.fillUpGeneralInfoSection(formInfo.formLabel, formInfo.formVersion, getYesterdayDate());
                await this.commonButtons.clickButton('Save and Continue');
                await this.fromInputValidatorEditableMode.iterateSectionsToValidateInput(definitionData.sections);

            } else if (step.action === "SUBMIT") {
                await this.validateStatus(step.status);
                await this.page.locator('[name="_action_submit_without_scores"], [name="_action_submit"]').click();

                await this.clickConfirmButtonUponAvailability();

            } else {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);

                if (postActionMessage[step.action] !== undefined) {
                    await this.validateDoneMsg(postActionMessage[step.action])
                };
            }
        }
    }

}