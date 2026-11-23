/**
 * @author Maksuda Islam (Lima)
 * @since 07/05/2024
 */

import { expect } from '@playwright/test';

import { GeneralSection } from '../../../support/pageObject/acf/generalSection.js';
import { getTodayDate, createRandomString } from '../../helper/acfCore/formFillUpDataProcessor.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class Workflow {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.getAddCommentFieldInAcknowledgePrompt = page.locator('textarea.form-control.w-100');
        this.getAcknowledgeSaveButton = page.getByRole('dialog').getByRole('button', { name: 'Acknowledge' });
        this.btnSubmit = page.locator('[name="_action_submit_without_scores"], [name="_action_submit"]');
        this.lnkGeneralSection = page.locator('a[href*="menuIndex=1"]');

        this.generalSection = new GeneralSection(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
    }

    async actionConfigMatch(definitionData, step) {
        let actionConfig = definitionData.acfPromptConfigs.find(config => config.action === step.action);

        if (actionConfig) {
            let promptText = await this.page.locator('div.py-4.modal-body').textContent();

            expect.soft(promptText).toEqual(actionConfig.message);
            await this.commonButtons.clickButton('Yes');
        }
    }

    async clickActionBtn(definitionData, actionBtnLabel) {
        await this.commonButtons.clickButton(actionBtnLabel);

        let actionConfig = definitionData.acfPromptConfigs.find(config => config.action === actionBtnLabel.toUpperCase());
        if (actionConfig) {
            await this.commonButtons.clickButton('Yes');
        }
    }

    async actionButton(action) {
        const words = action.toLowerCase().split(' ');
        let output = words[0];

        for (let i = 1; i < words.length; i++) {
            output += words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }

        await this.page.locator(`[name="_action_${output}"]`).click();
    }

    async validateStatus(status) {
        let extractedStatusText = (this.page.locator('span.font-14.th-text-primary.fw-bold')).or(this.page.locator('span.font-14.th-text-danger.fw-bold')).or(this.page.locator('span.font-14.th-text-success.fw-bold')).nth(0)
        await expect.soft(extractedStatusText).toHaveText(status);
    }

    async clickConfirmButtonUponAvailability() {
        await this.commonUtils.waitForChangeInDOM('.modal-content');
        const confirmButtonLocator = this.page.getByRole('button', { name: 'Confirm' });
        await this.page.waitForLoadState('domcontentloaded');

        if (await this.commonUtils.isElementAvailable(confirmButtonLocator)) {
            await this.commonButtons.clickButton('Confirm');
        }
    }

    async iteratePaths(definitionData, path) {
        for (const step of path) {
            if (step.action === "SAVE") {
                await this.validateStatus(step.status);
                await this.generalSection.fillUpGeneralSection(getTodayDate(), getTodayDate());
                await this.actionButton("Save");
                await this.actionConfigMatch(definitionData, step);

            } else if (step.action === "UPDATE") {
                await this.validateStatus(step.status);
                await this.actionButton("EDIT");
                await this.actionButton("UPDATE AND SHOW");
                await this.commonButtons.clickButton('Yes');

            } else if (step.action === "COPY") {
                await this.actionButton(step.action);
                await this.actionConfigMatch(definitionData, step);
                await this.lnkGeneralSection.click();
                await this.validateStatus("New");
                await this.generalSection.fillUpGeneralSection(getTodayDate(), getTodayDate());
                await this.actionButton("Save");
                await this.commonButtons.clickButton('Yes');

            } else if (step.action === "SUBMIT") {
                await this.validateStatus(step.status);
                await this.btnSubmit.click();
                await this.actionConfigMatch(definitionData, step);

                await this.clickConfirmButtonUponAvailability();

            } else if (step.action === "ACKNOWLEDGE") {
                await this.actionButton(step.action);
                await this.actionConfigMatch(definitionData, step);

                if (await this.getAddCommentFieldInAcknowledgePrompt.count() > 0) {
                    await this.getAddCommentFieldInAcknowledgePrompt.fill(createRandomString(8));
                }

                if (await this.commonUtils.isElementAvailable(this.getAcknowledgeSaveButton)) {
                    await this.commonButtons.clickButton('Acknowledge');
                }

                await this.validateStatus(step.status);

            } else if ((step.action === "undefined") || (step.action === "VIEW")) {
                continue;

            } else {
                await this.validateStatus(step.status);
                await this.actionButton(step.action);
                await this.actionConfigMatch(definitionData, step);
            }
        }
    }

}