/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */
import { parseBrokenItemKeyObjectStrings } from './algoDataProcessor';

export class GenericTabularInputHandlerForAlgorithm {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
    }

    async clickAddNewButtonForTabularQuestionItem(childCode) {
        await this.page.locator(`[id="item-${childCode}"]`).filter({ hasText: 'Add New' }).getByRole('button', { name: 'Add New' }).click();
    }

    async clickContinueButton() {
        await this.page.frameLocator('iframe').getByRole('button', { name: 'Continue' }).click();
    }

    async handleIntegerDoubleDateTextFieldInput(childCode, childInputValue) {
        const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(String(childInputValue));
    }

    async handleTextAreaInput(childCode, childInputValue) {
        const textAreaSelector = `textarea[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const textAreaLocator = this.page.frameLocator('iframe').locator(textAreaSelector);

        await textAreaLocator.waitFor({ state: 'visible' });
        await textAreaLocator.fill(String(childInputValue));
    }

    async handleRadioInput(childCode, childInputValue, childOptions) {
        const filteredOption = childOptions.filter(option => option.weight === Number(childInputValue));
        let finalInputValue = null;

        if (filteredOption.length > 0) {
            finalInputValue = filteredOption[0].optionNumber;

        } else {
            console.log(`${childCode}: ${childInputValue} - does not match with any weight of defn data`);
        }

        if (finalInputValue !== null) {
            const radioSelector = `input[name="tabularAnswer.multiValuedAnswers[${childCode}].refData"][value="${finalInputValue}"]`;
            const radioLocator = this.page.frameLocator('iframe').locator(radioSelector);

            await radioLocator.waitFor({ state: 'visible' });
            await radioLocator.click();
        }
    }

    async handleDropdownInput(childCode, childInputValue, childOptions) {
        const filteredOption = childOptions.filter(option => option.weight === Number(childInputValue));
        let finalInputValue = null;

        if (filteredOption.length > 0) {
            finalInputValue = filteredOption[0].optionNumber;

        } else {
            console.log(`${childCode}: ${childInputValue} - does not match with any weight of defn data`);
        }

        if (finalInputValue !== null) {
            const dropdownSelector = `select[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.refData"]`;
            const locator = this.page.frameLocator('iframe').locator(dropdownSelector);

            await locator.waitFor({ state: 'visible' });
            await locator.selectOption(String(finalInputValue));
        }
    }

    async handleChildInputForGenericTabular(child, childInputValue) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;
        const childOptions = child.options;

        switch (childType) {
            case "Q_INTEGER":
            case "Q_DOUBLE":
            case "Q_DATE":
            case "Q_TEXT_FIELD":
                await this.handleIntegerDoubleDateTextFieldInput(childCode, childInputValue);
                break;

            case "Q_TEXT_AREA":
                await this.handleTextAreaInput(childCode, childInputValue);
                break;

            case "Q_RADIO":
                await this.handleRadioInput(childCode, childInputValue, childOptions);
                break;

            case "Q_CHECKBOX":
                console.log("Checkbox is not supported for Generic Tabular Input in ASC.");
                break;

            case "Q_DROPDOWN":
                await this.handleDropdownInput(childCode, childInputValue, childOptions);
                break;

            default:
                throw new Error(`Unsupported Question Type: ${childType}`);
        }
    }

    async handleGenericTabularInput(child) {
        let childInputValue = parseBrokenItemKeyObjectStrings(child.inputValue)

        for (let row of childInputValue) {
            await this.clickAddNewButtonForTabularQuestionItem(child.code);

            for (let childrenCode in row) {
                const matchedChild = child.children.find(c => c.itemKey === childrenCode);
                if (matchedChild) {
                    await this.handleChildInputForGenericTabular(matchedChild, row[childrenCode]);
                }
            }

            await this.clickContinueButton();
        }
    }
}