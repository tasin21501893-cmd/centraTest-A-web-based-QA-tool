/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

import { CommentHandler } from '../commentHandler';
import { generateInteger, generateDouble, singleOptionSelect, multiOptionsSelect, createRandomString, getTodayDate } from '../../../../helper/acfCore/formFillUpDataProcessor.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';
import { CommonButtons } from '../../../../commonUtility/commonButtons.js';

export class GenericTabularInputHandler {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.commentHandler = new CommentHandler(page);
        this.commonButtons = new CommonButtons(page);
    }

    async actionOnContinueButton() {
        await this.commonButtons.clickButton('Continue');
    }

    async clickAddNewButtonForTabularQuestionItem(childCode) {
        await this.page.locator(`[id="item-${childCode}"]`).filter({ hasText: 'Add New' }).getByRole('button', { name: 'Add New' }).click();
    }

    async handleIntegerInput(childCode, parentCode, inputForInt) {
        const inputLocator = this.page.getByTestId(
            `${parentCode}-${childCode}`
        );

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForInt);
    }

    async handleDoubleInput(childCode, parentCode, inputForDouble) {
        const inputLocator = this.page.getByTestId(
            `${parentCode}-${childCode}`
        );
        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForDouble);
    }

    async handleDateInput(childCode, parentCode, presentDate) {
        const inputLocator = this.page.getByTestId(
            `${parentCode}-${childCode}`
        );

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(presentDate);
    }

    async handleTextFieldInput(childCode, parentCode, inputForText) {
        const inputLocator = this.page.getByTestId(
            `${parentCode}-${childCode}`
        );

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForText);
    }

    async handleTextAreaInput(childCode, parentCode, inputForTextArea) {
        const textAreaLocator = this.page.getByTestId(
            `${parentCode}-${childCode}`
        );

        await textAreaLocator.waitFor({ state: 'visible' });
        await textAreaLocator.fill(inputForTextArea);
    }

    async handleRadioInput(child, parentCode, childCode) {
        const inputForRadioButton = await singleOptionSelect(child);

        const radioLocator = this.page.getByTestId(
            `${parentCode}-${childCode}-${inputForRadioButton}`
        );

        await radioLocator.waitFor({ state: 'visible' });
        await radioLocator.click();

        return inputForRadioButton;
    }

    async handleCheckBoxInput(child, parentCode, childCode) {
        const selectedValues = await multiOptionsSelect(child);

        for (const val of selectedValues) {
            const checkbox = this.page.getByTestId(
                `${parentCode}-${childCode}-${val}`
            );

            await checkbox.waitFor({ state: 'visible' });
            await checkbox.click();
        }

        return selectedValues;
    }

    async handleDropdownInput(child, parentCode, childCode) {
        const value = await singleOptionSelect(child);
        const selectInput = this.page.getByTestId(
            `${parentCode}-${childCode}-select`
        );
        await selectInput.click();

        await this.page.getByTestId('dropdown-list').waitFor({ state: 'visible' });

        const option = this.page.getByTestId(
            `${parentCode}-${childCode}-${value}`
        );
        await option.waitFor({ state: 'visible' });
        await option.click();

        return value;
    }

    async handleChildTypeForGenericTabular(child, parentCode, inputForInt, inputForDouble, inputForText, inputForTextArea, presentDate) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;

        switch (childType) {
            case "Q_INTEGER":
                await this.handleIntegerInput(childCode, parentCode, inputForInt);
                return inputForInt;

            case "Q_DOUBLE":
                await this.handleDoubleInput(childCode, parentCode, inputForDouble);
                return inputForDouble;

            case "Q_TEXT_FIELD":
                await this.handleTextFieldInput(childCode, parentCode, inputForText);
                return inputForText;

            case "Q_TEXT_AREA":
                await this.handleTextAreaInput(childCode, parentCode, inputForTextArea);
                return inputForTextArea;

            case "Q_DATE":
                await this.handleDateInput(childCode, parentCode, presentDate);
                return presentDate;

            case "Q_RADIO":
                const radioValue = await this.handleRadioInput(child, parentCode, childCode);
                return radioValue;

            case "Q_DROPDOWN":
                const dropdownValue = await this.handleDropdownInput(child, parentCode, childCode);
                return dropdownValue;

            case "Q_CHECKBOX":
                const checkboxValue = await this.handleCheckBoxInput(child, parentCode, childCode);
                return checkboxValue;

            default:
                throw new Error(`Unsupported Question Type for Generic Tabular: ${childType}`);
        }
    }

    async handleGenericTabular(child, childCode, noOfRowsForGenericTabular, mode) {
        const cols = child.children || [];
        FORM_INPUT.questionCodeInputValueObj[childCode] = [];

        for (let row = 0; row < noOfRowsForGenericTabular; row++) {
            await this.clickAddNewButtonForTabularQuestionItem(childCode);
            const rowData = {};

            for (const col of cols) {
                let maxLimit = col.maxLimit;
                if (!maxLimit) {
                    maxLimit =
                        col.type === "Q_GENERIC_TABULAR" ? 10 :
                            col.type === "Q_TEXT_AREA" ? 500 :
                                30;
                }

                const limit = mode === 'less'
                    ? Math.floor(maxLimit / 2)
                    : maxLimit;
                const regex = col.regExPattern;
                const codeKey = col.code || col.itemKey;
                const value = await this.handleChildTypeForGenericTabular(
                    col,
                    child.code,
                    String(generateInteger(limit)),
                    String(generateDouble(limit)),
                    createRandomString(limit, regex),
                    createRandomString(limit),
                    getTodayDate()
                );

                rowData[codeKey] = value;
            }

            FORM_INPUT.questionCodeInputValueObj[childCode].push(rowData);
            await this.actionOnContinueButton();
        }
    }
}