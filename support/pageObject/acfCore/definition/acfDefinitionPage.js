/**
 * @author Maksuda Islam (Lima)
 * @since 01/08/2024
 */

import { CommonButtons } from '../../../commonUtility/commonButtons';
import { CommonUtils } from '../../../commonUtility/commonUtils';

export class AcfJsonHandler {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        this.advancedCustomFormTypeListFilter = page.getByPlaceholder('Filter');
        this.btnEdit = page.locator('.col-sm-8.pull-right.text-right.button-section.right-buttons').locator('[name="_action_edit"]');

        this.btnJsonModeForDefinitionData = page.locator('input[value="JSON Mode"]').nth(0);
        this.btnFormatJson = page.locator('input[name="formatCodeBtn"]');
        this.jsonDataAcfDefn = page.getByLabel('* ACF Definition JSON Data');

        this.btnFormatJsonForWorkflow = page.locator('input.btn.btn-default.workflowJsonFormatCodeBtn');
        this.lnkJSONDataACFWorkflow = page.getByLabel('* ACF Workflow JSON Data');
        this.btnJsonModeForWorkflowData = page.locator('input.btn.btn-default.workflowJsonToggleModeBtn');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    async openFormInEditMode(formLabel, formVersion) {
        await this.selectForm(formLabel);
        await this.clickFormVersion(formVersion);
        await this.btnEdit.click();
    }

    async selectForm(formLabel) {
        const filterInput = this.advancedCustomFormTypeListFilter;

        await filterInput.fill(formLabel);
        await this.page.click(`tbody tr:has(td:text-is("${formLabel}"))`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickFormVersion(formVersion) {
        let row, viewLink;

        row = await this.page.$(`tr:has(td:text-is("${formVersion}"))`);
        if (!row) {
            throw new Error(`Row not found with the specified version ${formVersion}`);
        }

        viewLink = await row.$('a:text-is("View")');
        if (!viewLink) {
            throw new Error('View link not found in the row');
        }

        await viewLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async copyAndReadClipboardContent(getJSONData) {
        await getJSONData.click({ force: true });
        await getJSONData.press('Control+a');
        await getJSONData.press('Control+c');

        return await this.page.evaluate(() => navigator.clipboard.readText());
    }

    async navigateAndGetDefinitionDataJSON(formLabel, formVersion) {
        await this.openFormInEditMode(formLabel, formVersion);
        await this.btnJsonModeForDefinitionData.click();
        await this.btnFormatJson.waitFor({ state: 'visible' });
        await this.btnFormatJson.click();

        return await this.copyAndReadClipboardContent(this.jsonDataAcfDefn);
    }

    async saveWorkflowDataJSON(formLabel, formVersion) {
        let elementHandle;

        await this.openFormInEditMode(formLabel, formVersion);
        elementHandle = await this.page.waitForSelector('input.btn.btn-default.workflowJsonToggleModeBtn');
        await elementHandle.waitForElementState('stable');
        await this.btnJsonModeForWorkflowData.click();
        await this.page.locator('input[name="workflowJsonFormatCodeBtn"]').waitFor({ state: 'visible' });
        await this.btnFormatJsonForWorkflow.click({ timeout: 5000 });

        return await this.copyAndReadClipboardContent(this.lnkJSONDataACFWorkflow);
    }

    async fetchedValue(labelText) {
        const allLabels = this.page.locator('label.control-label');
        let count, label, rawText, normalizedLabelText, labelFormGroup, valueDiv, valueText;

        count = await allLabels.count();

        for (let i = 0; i < count; i++) {
            label = allLabels.nth(i);
            rawText = await label.textContent();
            normalizedLabelText = rawText?.replace(/\s+/g, ' ').trim();

            if (normalizedLabelText === labelText) {
                labelFormGroup = label.locator(
                    'xpath=ancestor::div[contains(@class, "form-group")]'
                );
                valueDiv = labelFormGroup.locator(
                    'xpath=following-sibling::div[contains(@class, "form-group")][1]'
                );

                try {
                    await valueDiv.waitFor({ state: 'visible', timeout: 3000 });
                } catch {
                    return '';
                }

                valueText = await valueDiv.textContent();
                return valueText ? valueText.replace(/\s+/g, ' ').trim() : '';
            }
        }

        throw new Error(`Label with text "${labelText}" not found.`);
    }

    async checkShowAnswerOptionScore() {
        await this.commonUtils.selectCheckboxUsingFieldName(this.page, 'Show Answer Option Score(s)');
    }

    async uncheckRestrictOverlappingDateRange() {
        await this.commonUtils.unselectCheckboxUsingFieldName(this.page, 'Restrict Overlapping Date Range');
    }

    async checkShowAnswerOptionScoreFromProviderAssignment() {
        await this.commonUtils.selectCheckboxUsingFieldName(this.page, 'Show Answer Option Score(s)');
        await this.commonButtons.clickButton('Save');
    }

    async uncheckDisallowPostApprovalFlag() {
        if (await this.commonUtils.isElementAvailable(this.btnEdit)) {
            await this.btnEdit.click();
            await this.commonUtils.unselectCheckboxUsingFieldName(this.page, 'Disallow Post Approval Update');
        }
    }

    async uncheckEnableAcknowledgementFlag() {
        await this.commonUtils.unselectCheckboxUsingFieldName(this.page, 'Enable Acknowledgement');
        await this.commonButtons.clickButton('Update');
    }
}