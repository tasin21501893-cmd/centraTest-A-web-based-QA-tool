/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */
import { expect } from 'playwright/test';
import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';
import { getRandomSelectValue, createRandomString, generateInteger } from '../../../../helper/acfCore/formFillUpDataProcessor.js';
import { CommonButtons } from '../../../../commonUtility/commonButtons.js';

const MEDICATION_MODAL_DOSE = '12';

export class MedicationHandler extends BaseHandler {

    /**
     * @param {import('playwright').Page} page
     */

    constructor(page) {
        super(page);

        this.commonButtons = new CommonButtons(page);
    }

    async handle(child, params) {
        const { shouldAddComment, inputComment, noOfRows } = params;
        const code = child.code || child.itemKey;
        FORM_INPUT.questionCodeInputValueObj[code] = noOfRows;

        for (let i = 0; i < noOfRows; i++) {
            await this.page.locator(`input[data-target="#medicationModal_${code}"]`).click();

            await this.page.locator(`#medicationModal_${code}Name`).fill(`medication 0${i}`);
            await this.page.locator(`#medicationModal_${code}Dose`).fill(MEDICATION_MODAL_DOSE);

            const unitLocator = `#medicationModal_${code}Unit`;

            await expect(this.page.locator(unitLocator)).toBeVisible();

            const randomValueOfUnitDropdown = await getRandomSelectValue(this.page, unitLocator);
            await this.page.locator(unitLocator).selectOption(randomValueOfUnitDropdown);

            const routeLocator = `#medicationModal_${code}Route`;
            const randomValueOfRouteDropdown = await getRandomSelectValue(this.page, routeLocator);
            await this.page.locator(routeLocator).selectOption(randomValueOfRouteDropdown);

            const freqLocator = `#medicationModal_${code}Freq`;
            const randomValueOfFreqDropdown = await getRandomSelectValue(this.page, freqLocator);
            await this.page.locator(freqLocator).selectOption(randomValueOfFreqDropdown);

            const prnLocator = `#medicationModal_${code}PRN`;
            const randomValueOfPRNDropdown = await getRandomSelectValue(this.page, prnLocator);
            await this.page.locator(prnLocator).selectOption(randomValueOfPRNDropdown);

            const codingSystemRadioButton = await this.page.locator(`#medicationModal_${code}CodingSystemDiv input[type="radio"]`).all();
            const randomIndex = generateInteger(Number(codingSystemRadioButton.length) - 1);
            await codingSystemRadioButton[randomIndex].click();

            await this.page.locator(`#medicationModal_${code}DrugCode`).fill(createRandomString(40));
            await this.commonButtons.clickButton('Continue');
        }

        await this.addComment(child, code, shouldAddComment, inputComment);
    }

}