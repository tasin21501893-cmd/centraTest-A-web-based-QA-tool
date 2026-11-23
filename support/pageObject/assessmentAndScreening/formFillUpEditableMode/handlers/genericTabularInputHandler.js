/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

import { CommentHandler } from '../commentHandler';
import { generateInteger, generateDouble, singleOptionSelect, createRandomString, getTodayDate } from '../../../../helper/acfCore/formFillUpDataProcessor';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput';
import { CommonUtils } from '../../../../commonUtility/commonUtils';
import { CommonButtons } from '../../../../commonUtility/commonButtons';

export class GenericTabularInputHandler {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;

        this.commentHandler = new CommentHandler(page);
        this.commonButtons = new CommonButtons(page);
    }

    async clickAddNewButtonForTabularQuestionItem(childCode) {
        await this.page.locator(`[id="item-${childCode}"]`).filter({ hasText: 'Add New' }).getByRole('button', { name: 'Add New' }).click();
    }

    async handleIntegerInput(childCode, inputForInt) {
        const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForInt);
    }

    async handleDoubleInput(childCode, inputForDouble) {
        const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForDouble);
    }

    async handleDateInput(childCode, presentDate) {
        const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(presentDate);
    }

    async handleTextFieldInput(childCode, inputForText) {
        const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);

        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.fill(inputForText);
    }

    async handleTextAreaInput(childCode, inputForTextArea) {
        const textAreaSelector = `textarea[id="tabularAnswer\\.multiValuedAnswers\\[${childCode}\\]\\.value"]`;
        const textAreaLocator = this.page.frameLocator('iframe').locator(textAreaSelector);

        await textAreaLocator.waitFor({ state: 'visible' });
        await textAreaLocator.fill(inputForTextArea);
    }

    async handleRadioInput(child, childCode) {
        const inputForRadioButton = await singleOptionSelect(child);
        const radioSelector = `input[name="tabularAnswer.multiValuedAnswers[${childCode}].refData"][value="${inputForRadioButton}"]`;
        const radioLocator = this.page.frameLocator('iframe').locator(radioSelector);

        await radioLocator.waitFor({ state: 'visible' });
        await radioLocator.click();

        return inputForRadioButton;
    }

    async handleDropdownInput(child, childCode) {
        const inputForDropdown = await singleOptionSelect(child);
        await this.page.frameLocator('iframe').locator(`select[id="tabularAnswer.multiValuedAnswers[${childCode}].refData"]`).selectOption(String(inputForDropdown));

        return inputForDropdown;
    }

    async handleChildTypeForGenericTabular(child, inputForInt, inputForDouble, inputForText, inputForTextArea, presentDate) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;

        switch (childType) {
            case "Q_INTEGER":
                await this.handleIntegerInput(childCode, inputForInt);
                return inputForInt;

            case "Q_DOUBLE":
                await this.handleDoubleInput(childCode, inputForDouble);
                return inputForDouble;

            case "Q_TEXT_FIELD":
                await this.handleTextFieldInput(childCode, inputForText);
                return inputForText;

            case "Q_TEXT_AREA":
                await this.handleTextAreaInput(childCode, inputForTextArea);
                return inputForTextArea;

            case "Q_DATE":
                await this.handleDateInput(childCode, presentDate);
                return presentDate;

            case "Q_RADIO":
                const radioValue = await this.handleRadioInput(child, childCode);
                return radioValue;

            case "Q_DROPDOWN":
                const dropdownValue = await this.handleDropdownInput(child, childCode);
                return dropdownValue;

            case "Q_CHECKBOX":
                return "N/A for Generic Tabular";

            default:
                throw new Error(`Unsupported Question Type for Generic Tabular: ${childType}`);
        }
    }

    async handleGenericTabular(
        child,
        childCode,
        noOfRowsForGenericTabular,
        inputComment,
        shouldAddComment,
        mode
    ) {
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
                    String(generateInteger(limit)),
                    String(generateDouble(limit)),
                    createRandomString(limit, regex),
                    createRandomString(limit),
                    getTodayDate()
                );

                rowData[codeKey] = value;
            }

            FORM_INPUT.questionCodeInputValueObj[childCode].push(rowData);
            await this.commonButtons.clickButton('Continue', this.page.frameLocator('iframe'));
        }

        if (CommonUtils.isAffirmative(shouldAddComment)) {
            await this.commentHandler.handleCommentInput(child, inputComment);
        }
    }

}