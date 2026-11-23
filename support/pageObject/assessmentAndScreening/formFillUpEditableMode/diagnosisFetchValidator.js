/**
 * @author Maksuda Islam (Lima)
 * @since 08/05/2025
 */

import { getRandomSelectValue, createRandomString, generateInteger } from '../../../helper/acfCore/formFillUpDataProcessor.js';
import { DiagnosisFetchInputHandler } from './handlers/diagnosisFetchInputHandler.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { expect } from '@playwright/test';

export class DiagnosisFetchValidator {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.diagnosisFetchInputHandler = new DiagnosisFetchInputHandler(page);
        this.commonButtons = new CommonButtons(page);
    }

    #isConditionalItem(item) {
        return item.conditionalItem === true;
    }

    async fillSectionsWithRandomInputExceedsLimit(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;

            const isLastSection = i === sections.length - 1;

            await this.fillChildrenWithRandomInputExceedsLimit(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }

    async fillChildrenWithRandomInputExceedsLimit(children) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            let maxLimit = child.maxLimit;

            if (this.#isConditionalItem(child)) continue;

            try {
                if (child.type === 'Q_DIAGNOSIS') {
                    await this.handleDiagnosisFetchUsingAddNewDiagnosis(code, maxLimit);
                }

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.fillChildrenWithRandomInputExceedsLimit(
                        child.children
                    );
                }
            }
            catch (err) {
                if (err.message.includes("waiting for")) {
                    console.log(`Skipping ${code} due to timeout: ${err.message}`);
                }
            }
        }
    }

    async handleDiagnosisFetchUsingAddNewDiagnosis(childCode, noOfRowsForDiagnosisTable) {
        for (let i = 0; i < noOfRowsForDiagnosisTable; i++) {
            await this.page.locator(`input[data-target="#diagnosisModal_${childCode}"][value="Add New Diagnosis"]`).click();
            await this.page.locator(`#diagnosisModal_${childCode}Diagnosis`).waitFor({ state: 'visible' });
            await this.page.locator(`#diagnosisModal_${childCode}Diagnosis`).fill(`diagnosis0${i}`);

            const diseaseCodeLocator = `#diagnosisModal_${childCode}DiseaseCode`;
            const randomValueOfDiseaseCodeDropdown = await getRandomSelectValue(this.page, diseaseCodeLocator);
            await this.page.locator(diseaseCodeLocator).selectOption(randomValueOfDiseaseCodeDropdown);

            const radioLocator = `#diagnosisModal_${childCode}CodingSystemDiv input[type="radio"]`;
            const codingSystemRadioButtons = await this.page.locator(radioLocator).all();

            if (codingSystemRadioButtons.length === 0) {
                throw new Error(`No radio buttons found for childCode: ${childCode}`);
            }

            const randomIndex = generateInteger(Number(codingSystemRadioButtons.length) - 1);
            await codingSystemRadioButtons[randomIndex].click();

            await this.page.locator(`#diagnosisModal_${childCode}IcdCode`).fill(createRandomString(5));
            await this.commonButtons.clickButton('Continue');

            const isLastRow = i === noOfRowsForDiagnosisTable - 1;
            if (isLastRow) {
                await this.validationFlow();
            }
        }
    }

    async validationFlow() {
        const globalError = this.page.locator('#diagnosisModal_iI2GlobalError');
        const closeModal = async () => {
            const closeBtn = this.page.getByRole('button', { name: '×' });
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
                await this.page.locator('#diagnosisModal_iI2').waitFor({ state: 'hidden' });
            }
        };

        // Max row value validation (for add new)
        await this.commonButtons.clickButton('Add New Diagnosis');
        await this.page.locator(`#diagnosisModal_iI2Diagnosis`).waitFor({ state: 'visible' });
        await this.page.locator(`#diagnosisModal_iI2Diagnosis`).fill('');
        await this.page.locator(`#diagnosisModal_iI2IcdCode`).fill('');
        await this.commonButtons.clickButton('Continue');

        await globalError.waitFor({ state: 'visible' });
        await expect(globalError).toContainText('Please see below for error messages!');
        await expect(globalError).toContainText('You can add upto 6 diagnosis');
        await closeModal();

        // Max row value validation (for fetch)
        await this.commonButtons.clickButton('Fetch Individual Diagnosis');
        const select = this.page.locator('#individualDiagnosisModal_iI2 select.selectpicker').first();
        await select.waitFor({ state: 'attached' });
        await select.selectOption({ index: 1 });
        await this.page.locator('#individualDiagnosisModal_iI2 table tbody tr').first().locator('a', { hasText: 'Add' }).click();

        await expect(globalError).toContainText('Please see below for error messages!');
        await expect(globalError).toContainText('You can add upto 6 diagnosis');
        await closeModal();

        await this.page.locator('#diagnosis_iI2 tbody tr td >> text=Remove').first().click();

        // Required field validation
        await this.commonButtons.clickButton('Add New Diagnosis');
        await this.commonButtons.clickButton('Continue');
        await expect(globalError).toContainText('Please see below for error messages!');
        await expect(this.page.locator('#diagnosisModal_iI2DiagnosisDiv')).toContainText('Required');
        await expect(this.page.locator('#diagnosisModal_iI2DiseaseCodeDiv')).toContainText('Required');
        await expect(this.page.locator('#diagnosisModal_iI2CodingSystemDiv')).toContainText('Required');
        await expect(this.page.locator('#diagnosisModal_iI2IcdCodeDiv')).toContainText('Required');
        await closeModal();

        // ICD Code length validation (code length more than 8 char)
        await this.commonButtons.clickButton('Add New Diagnosis');
        await this.page.locator('#diagnosisModal_iI2IcdCode').fill('abcdefghijklmnopqrstuvwxyz');
        await this.commonButtons.clickButton('Continue');
        await expect(this.page.locator('#diagnosisModal_iI2IcdCodeDiv')).toContainText('Length can not be more than 8 characters');
        await closeModal();

        // Duplicate ICD case validation for fetch
        await this.page.locator('#diagnosis_iI2 tbody tr td >> text=Remove').last().click();

        await this.page.getByRole('button', { name: 'Fetch Individual Diagnosis' }).waitFor({ state: 'attached' });
        await this.page.getByRole('button', { name: 'Fetch Individual Diagnosis' }).click();

        await select.waitFor({ state: 'attached' });
        await select.selectOption({ index: 1 });
        await this.page.locator('#individualDiagnosisModal_iI2 table tbody tr').first().locator('a', { hasText: 'Add' }).click();

        await this.commonButtons.clickButton('Fetch Individual Diagnosis');
        await select.waitFor({ state: 'attached' });
        await select.selectOption({ index: 1 });
        await this.page.locator('#individualDiagnosisModal_iI2 table tbody tr').first().locator('a', { hasText: 'Add' }).click();

        const duplicateError = this.page.locator('#individualDiagnosisModal_iI2GlobalError');
        await expect(duplicateError).toContainText('Please see below for error messages!');
        await expect(this.page.locator('#individualDiagnosisModal_iI2GlobalErrorList')).toContainText('You have already added this ICD Code');
        await closeModal();
    }
}