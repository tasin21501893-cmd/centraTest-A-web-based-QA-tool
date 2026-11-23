/**
 * @author Maksuda Islam (Lima)
 * @since 01/08/2024
 */

import { expect } from '@playwright/test';
import { FORM_INPUT } from '../../../support/constants/acfCore/formInput.js';

export class FromInputValidatorReadOnlyMode {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
    }

    async iterateChildren(children, childCodeValuesObject) {
        for (const child of children) {
            const childCode = child.code;

            if (childCodeValuesObject.hasOwnProperty(childCode)) {
                if (child.options && Array.isArray(child.options)) {
                    const currentValue = childCodeValuesObject[childCode];
                    const matchingOption = child.options.find(option =>
                        option.optionNumber === currentValue
                    );

                    if (matchingOption) {
                        childCodeValuesObject[childCode] = matchingOption.weight;
                    }
                }
            }

            if (child.children) {
                await this.iterateChildren(child.children, childCodeValuesObject);
            }
        }
    }

    async iterateSections(sections, childCodeValuesObject) {
        const clonedSections = structuredClone(sections);

        for (const section of clonedSections) {
            section.conditionalItem = false;

            if (section.children) {
                await this.iterateChildren(section.children, childCodeValuesObject);
            }
        }

        return childCodeValuesObject;
    }

    async validateTextFieldTextAreaIntInput(childCode, childCodeValuesObject) {
        const extractedText = (await this.page.locator(`#item-${childCode} > div.row:last-of-type`).textContent()).trim();
        expect.soft(extractedText).toBe(childCodeValuesObject[childCode]);
    }

    async validateDateInput(childCode, childCodeValuesObject) {
        const extractedText = (await this.page.locator(`#item-${childCode} > div.row:last-of-type`).textContent()).trim();
        expect.soft(extractedText).toBe(childCodeValuesObject[childCode].selected);
    }

    async validateDoubleInput(childCode, childCodeValuesObject) {
        const extractedText = (await this.page.locator(`#item-${childCode} > div.row:last-of-type`).textContent()).trim();
        expect.soft(Number(extractedText)).toBe(Number(childCodeValuesObject[childCode]));
    }

    async validateDropdownInput(childCode, childCodeValuesObject) {
        const optionValue = (await this.page.locator(`#item-${childCode} > div.row:nth-of-type(3)`).textContent()).trim();
        const match = optionValue.match(/\((\d+)\)/);
        const extractedText = match ? match[1] : null;

        expect.soft(Number(extractedText)).toBe(Number(childCodeValuesObject[childCode]));
    }

    async validateRadioInput(sections, childCode, childCodeValuesObject) {
        const container = await this.page.$(`#item-${childCode}`);
        const elements = await container.$$('div.col-sm-1.text-right');
        const updatedValues = await this.iterateSections(sections, { ...childCodeValuesObject });

        for (const element of elements) {
            const content = (await element.textContent())?.trim();

            if (content === '×') {
                const parentRow = await element.evaluateHandle(node => node.closest('.row'));
                const labelElement = await parentRow.$('div.col-sm-10');
                const labelText = await labelElement?.textContent();
                const label = labelText?.trim() ?? '';
                const match = label.match(/\((\d+)\)/);
                const extractedText = match ? match[1] : null;

                expect.soft(Number(extractedText)).toBe(Number(updatedValues[childCode]));
            }
        }
    }

    async validateCheckboxInput(childCode, childCodeValuesObject) {
        const container = await this.page.$(`#item-${childCode}`);
        const elements = await container.$$('div.col-sm-1.text-right');
        const selectedValues = [];

        for (const element of elements) {
            const content = (await element.textContent())?.trim();
            
            if (content === '×') {
                const parentRow = await element.evaluateHandle(node => node.closest('.row'));
                const labelElement = await parentRow.$('div.col-sm-10');
                const labelText = await labelElement?.textContent();
                const label = labelText?.trim() ?? '';
                const match = label.match(/\((\d+)\)/);
                const value = match ? parseInt(match[1], 10) : null;

                if (value !== null) {
                    selectedValues.push(value);
                }
            }
        }

        const expectedValues = childCodeValuesObject[childCode].sort();
        const actualValues = selectedValues.sort();
        expect.soft(actualValues).toEqual(expectedValues);
    }

    async validateGenericTabularData(childCode, childCodeValuesObject) {
        const expectedNoOfRows = await this.page.locator(`#item-${childCode} tbody tr`).count();
        const actualNoOfRows = childCodeValuesObject[childCode]?.length ?? 0;
        expect.soft(Number(actualNoOfRows)).toEqual(Number(expectedNoOfRows));
    }

    async validateDiagnosisTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#diagnosis_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#diagnosis_${childCode} tbody tr`).count();
        expect.soft(Number(childCodeValuesObject[childCode])).toEqual(Number(expectedNoOfRows));
    }

    async validateSurgeryTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#surgery_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#surgery_${childCode} tbody tr`).count();
        expect.soft(Number(childCodeValuesObject[childCode])).toEqual(Number(expectedNoOfRows));
    }

    async validateMedicationTable(childCode, childCodeValuesObject) {
        await this.page.waitForSelector(`#medication_${childCode} table`);
        const expectedNoOfRows = await this.page.locator(`#medication_${childCode} tbody tr`).count();
        expect.soft(Number(childCodeValuesObject[childCode])).toEqual(Number(expectedNoOfRows));
    }

    async handleChildTypeInputValidation(child, sections) {
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
            case "Q_TEXT_FIELD":
            case "Q_INTEGER":
                await this.validateTextFieldTextAreaIntInput(childCode, childCodeValuesObject);
                break;

            case "Q_DATE":
                await this.validateDateInput(childCode, childCodeValuesObject);
                break;

            case "Q_DOUBLE":
                await this.validateDoubleInput(childCode, childCodeValuesObject);
                break;

            case "Q_DROPDOWN":
                await this.validateDropdownInput(childCode, childCodeValuesObject);
                break;

            case "Q_RADIO":
                await this.validateRadioInput(sections, childCode, childCodeValuesObject);
                break;

            case "Q_CHECKBOX":
                await this.validateCheckboxInput(childCode, childCodeValuesObject);
                break;

            case "Q_GENERIC_TABULAR":
                await this.validateGenericTabularData(childCode, childCodeValuesObject);
                break;

            case "Q_DIAGNOSIS":
                await this.validateDiagnosisTable(childCode, childCodeValuesObject);
                break;

            case "Q_MEDICATION":
                await this.validateMedicationTable(childCode, childCodeValuesObject);
                break;

            case "Q_SURGERY":
                await this.validateSurgeryTable(childCode, childCodeValuesObject);
                break;
        }
    }

    async iterateChildrenToValidateInput(children, sections) {
        for (const child of children) {
            await this.handleChildTypeInputValidation(child, sections);
        }
    }

    async iterateSectionsToValidateInput(sections) {
        for (let i = 0; i < sections.length; i++) {
            await this.page.locator('.panel-body ul > li > a').nth(i).click();
            const section = sections[i];
            await this.iterateChildrenToValidateInput(section.children, sections);
        }
    }

    async iterateSectionsToValidateComment(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section.conditionalItem !== true) {
                const isLastSection = i === sections.length - 1;
                await this.iterateChildrenToValidateComment(section.children, FORM_INPUT.questionCodeInputValueObj);

                if (!isLastSection) {
                    await this.page.locator(`#menu_${sections[i + 1].code}`).click();
                }
            }
        }
    }

    async iterateChildrenToValidateComment(children, childCodeValuesObject) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;
            const type = child.type;

            try {
                if (child.conditionalItem) continue;

                if (child.canComment === true && child.type !== 'READONLY_TEXT') {
                    let extractedText = await this.page
                        .locator(`#item-${childCode} i .row p`)
                        .first()
                        .textContent();

                    extractedText = extractedText.trim();

                    if (childCodeValuesObject.hasOwnProperty(childCode)) {
                        expect.soft(extractedText).toBe(childCodeValuesObject[childCode]);
                    }
                }

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.iterateChildrenToValidateComment(child.children, childCodeValuesObject);
                }
            } catch (err) {
                if (err.message.includes("waiting for")) {
                    console.log(`Couldn't find code "${childCode}": ${err.message}`);
                }
            }
        }
    }
}
