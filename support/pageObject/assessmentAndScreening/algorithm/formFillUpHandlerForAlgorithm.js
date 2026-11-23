/**
 * @author Maksuda Islam (Lima)
 * @author Md Raihan Rahman (Raihan)
 * @since 04/03/2025
 */
import { GenericTabularInputHandlerForAlgorithm } from './genericTabularInputHandlerForAlgorithm.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';

export class FormFillUpHandlerForAlgorithm {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.genericTabularInputHandlerForAlgorithm = new GenericTabularInputHandlerForAlgorithm(page);
        this.commonButtons = new CommonButtons(page);
    }

    async handleTextAreaInput(child, childCode) {
        await this.page.locator(`#textarea-${childCode} textarea.form-control`).fill(child.inputValue);
    }

    async handleIntegerDoubleTextFieldInput(child, childCode) {
        await this.page.locator(`#input-${childCode} input.form-control`).fill(child.inputValue);
    }

    async handleDateInput(child, childCode) {
        const dateInput = this.page.locator(`div#input-${childCode}`);
        await dateInput.locator('input[placeholder="MM/DD/YYYY"]').fill(child.inputValue);
    }

    async handleRadioInput(child, childCode, childOptions) {
        const filteredOption = childOptions.filter(option => option.weight === Number(child.inputValue));

        let finalInputValue = null;

        if (filteredOption.length > 0) {
            finalInputValue = filteredOption[0].optionNumber;

        } else {
            throw new Error `${childCode}: ${child.inputValue} - does not match with any weight of defn data`;
        }

        if (finalInputValue !== null) {
            await this.page.click(`#item-${childCode} input[type="radio"][value="${finalInputValue}"]`);
        }
    }

    async handleCheckBoxInput(child, childCode, childOptions) {
        const inputValues = Array.isArray(child.inputValue) ? child.inputValue : [child.inputValue];

        for (const value of inputValues) {
            const filteredOption = childOptions.filter(option => option.weight === Number(value));

            if (filteredOption.length > 0) {
                const finalInputValue = filteredOption[0].optionNumber;
                const childLocator = this.page.locator(`#item-${childCode}`);
                const checkboxLocator = childLocator.locator(`#input-${childCode} input[type="checkbox"][id="checkbox-item-${childCode}-${finalInputValue}"]`);
                await checkboxLocator.check();
            } else {
                throw new Error `${childCode}: ${value} - does not match with any weight of defn data`;
            }
        }
    }

    async handleDropdownInput(child, childCode, childOptions) {
        const filteredOption = childOptions.filter(option => option.weight === Number(child.inputValue));

        let finalInputValue = null;

        if (filteredOption.length > 0) {
            finalInputValue = filteredOption[0].optionNumber;

        } else {
            throw new Error `${childCode}: ${child.inputValue} - does not match with any weight of defn data`;
        }

        if (finalInputValue !== null) {
            let childLocator = this.page.locator(`[id="input-${childCode}"]`);

            await childLocator.locator('button[data-toggle="dropdown"]').waitFor({ state: 'visible' });
            await childLocator.locator('button[data-toggle="dropdown"]').click();

            await childLocator.locator(`.dropdown-menu li[data-original-index="${finalInputValue}"]`).waitFor({ state: 'visible' });
            await childLocator.locator(`.dropdown-menu li[data-original-index="${finalInputValue}"]`).click();
        }
    }

    async handleChildInput(child) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;
        const childOptions = child.options;
        const childSerial = child.serial

        switch (childType) {
            case "Q_TEXT_FIELD":
            case "Q_INTEGER":
            case "Q_DOUBLE":
                await this.handleIntegerDoubleTextFieldInput(child, childCode);
                break;

            case "Q_TEXT_AREA":
                await this.handleTextAreaInput(child, childCode);
                break;

            case "Q_RADIO":
                await this.handleRadioInput(child, childCode, childOptions);
                break;

            case "Q_CHECKBOX":
                await this.handleCheckBoxInput(child, childCode, childOptions);
                break;

            case "Q_DROPDOWN":
                await this.handleDropdownInput(child, childCode, childOptions);
                break;

            case "Q_DATE":
                await this.handleDateInput(child, childCode);
                break;

            case "Q_GENERIC_TABULAR":
                await this.genericTabularInputHandlerForAlgorithm.handleGenericTabularInput(child, childCode);
                break;

            default:
                throw new Error(`Unsupported Question Type: ${childType}`);
        }
    }

    async iterateChildren(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            try {
                if (child.inputValue) {
                    await this.handleChildInput(child);
                }

                if (child.children && child.type !== "Q_GENERIC_TABULAR") {
                    await this.iterateChildren(child.children);
                }
            }
            catch (error) {
                if (error.message.includes('waiting for')) {
                    console.log("Skipping iterateChildren for section: " + "child.code: " + childCode + " error.message: " + error.message);
                    continue;
                }
            }
        }
    }

    async iterateSections(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            const isLastSection = i === sections.length - 1;
            await this.iterateChildren(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }
}