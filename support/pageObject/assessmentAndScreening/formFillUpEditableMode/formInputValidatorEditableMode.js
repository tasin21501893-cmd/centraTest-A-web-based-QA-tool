/**
 * @author Maksuda Islam (Lima)
 * @since 01/08/2024
 */

import { expect } from '@playwright/test';
import { FORM_INPUT } from '../../../../support/constants/acfCore/formInput.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';

export class FromInputValidatorEditableMode {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
    }

    async validateTextFieldIntDoubleInput(childCode, childCodeValuesObject) {
        let extractedText = await this.page.locator(`#input-${childCode} input.form-control`).inputValue();
        extractedText = extractedText.trim();
        const expectedValue = childCodeValuesObject[childCode];

        expect.soft(Number(extractedText)).toBe(Number(expectedValue));
    }

    async validateTextAreaInput(childCode, childCodeValuesObject) {
        let extractedText = await this.page.locator(`#input-${childCode} textarea.form-control`).textContent();
        extractedText = extractedText.trim();

        expect.soft(extractedText).toBe(childCodeValuesObject[`${childCode}`])
    }

    async validateDateInput(childCode, childCodeValuesObject) {
        const locator = this.page.locator(`#input-${childCode} input[input-type="DATE"]`);
        const extractedText = (await locator.inputValue()).trim();
        const expected = childCodeValuesObject[childCode];
        const expectedText = (expected && typeof expected === 'object')
            ? expected.selected
            : expected;

        expect.soft(extractedText).toBe(expectedText);
    }

    async validateDropdownInput(childCode, childCodeValuesObject) {
        let optionValue = await this.page.locator(`[id="input-${childCode}"] button[role="combobox"]`).getAttribute('title');
        optionValue = optionValue.trim();
        const match = optionValue.match(/\((\d+)\)/);
        const extractedText = match ? match[1] : null;

        expect.soft(String(extractedText)).toBe(String(childCodeValuesObject[`${childCode}`]));
    }

    async validateRadioInput(childCode, childCodeValuesObject) {
        const element = this.page.locator(`#input-${childCode} input[type="radio"][checked]`);
        const selectedValue = await element.getAttribute('value');

        expect.soft(String(selectedValue)).toBe(String(childCodeValuesObject[`${childCode}`]));

    }

    async validateCheckboxInput(childCode, childCodeValuesObject) {
        const container = await this.page.$(`#input-${childCode}`);
        const elements = await container.$$('input[type="checkbox"][checked]');
        const selectedValues = [];

        for (const element of elements) {
            let value = await element.getAttribute('value');

            if (value !== null) {
                selectedValues.push(Number(value));
            }
        }
        const expectedValues = childCodeValuesObject[childCode].sort();
        const actualValues = selectedValues.sort();

        expect.soft(actualValues).toEqual(expectedValues);
    }

    async validateGenericTabularData(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#tabular_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#tabular_${childCode} tbody tr`).count();
        const actualNoOfRows = childCodeValuesObject[childCode]?.length ?? 0;

        expect.soft(String(actualNoOfRows)).toEqual(String(expectedNoOfRows));
    }

    async validateDiagnosisTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#diagnosis_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#diagnosis_${childCode} tbody tr`).count();

        expect.soft(String(childCodeValuesObject[`${childCode}`])).toEqual(String(expectedNoOfRows));
    }

    async validateSurgeryTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#surgery_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#surgery_${childCode} tbody tr`).count();

        expect.soft(String(childCodeValuesObject[`${childCode}`])).toEqual(String(expectedNoOfRows));
    }

    async validateMedicationTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#medication_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#medication_${childCode} tbody tr`).count();

        expect.soft(String(childCodeValuesObject[`${childCode}`])).toEqual(String(expectedNoOfRows));
    }

    async handleChildTypeInputValidation(child) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;
        const childCodeValuesObject = FORM_INPUT.questionCodeInputValueObj;

        if (!childCodeValuesObject.hasOwnProperty(childCode)) {
            if (childType !== 'READONLY_TEXT') {
                console.warn(`Expected value for childCode '${childCode}' not found in FORM_INPUT.`);
            }
            return;
        }

        switch (childType) {
            case "Q_TEXT_AREA":
                await this.validateTextAreaInput(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_TEXT_FIELD":
            case "Q_INTEGER":
            case "Q_DOUBLE":
                await this.validateTextFieldIntDoubleInput(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_DATE":
                await this.validateDateInput(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_DROPDOWN":
                await this.validateDropdownInput(childCode, FORM_INPUT.questionCodeInputValueObj);
                break;

            case "Q_RADIO":
                await this.validateRadioInput(childCode, FORM_INPUT.questionCodeInputValueObj);
                break;

            case "Q_CHECKBOX":
                await this.validateCheckboxInput(childCode, FORM_INPUT.questionCodeInputValueObj);
                break;

            case "Q_GENERIC_TABULAR":
                await this.validateGenericTabularData(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_DIAGNOSIS":
                await this.validateDiagnosisTable(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_MEDICATION":
                await this.validateMedicationTable(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;

            case "Q_SURGERY":
                await this.validateSurgeryTable(childCode, FORM_INPUT.questionCodeInputValueObj)
                break;
        }
    }

    async iterateChildrenToValidateInput(children) {
        for (const child of children) {
            await this.handleChildTypeInputValidation(child);

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateChildrenToValidateInput(
                        child.children
                    );
                }
            }
        }
    }

    async iterateSectionsToValidateInput(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const isLastSection = i === sections.length - 1;

            await this.iterateChildrenToValidateInput(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }
}