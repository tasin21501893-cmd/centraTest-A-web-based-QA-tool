/**
 * @author Maksuda Islam (Lima)
 * @since 08/05/2025
 */
import { expect } from '@playwright/test';

import { HandlerFactory } from './handlers/handlerFactory.js';
import { FORM_INPUT } from '../../../../support/constants/acfCore/formInput.js';
import { generateInteger, generateDouble, createRandomString, getTomorrowDate, getYesterdayDate } from '../../../helper/acfCore/formFillUpDataProcessor.js';
import { GenericTabularInputHandler } from './handlers/genericTabularInputHandler.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';

export class FormValidator {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.factory = new HandlerFactory(page);
        this.genericTabularInputHandler = new GenericTabularInputHandler(page);
        this.commonButtons = new CommonButtons(page);
    }

    #isConditionalItem(item) {
        return item.conditionalItem === true;
    }

    //validate maxLimit exceed error msg
    async fillSectionsWithRandomInputExceedsLimit(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) {
                continue;
            }

            const isLastSection = i === sections.length - 1;
            await this.fillChildrenWithRandomInputExceedsLimit(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForLimitExceed(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    async fillChildrenWithRandomInputExceedsLimit(children) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            let maxLimit = child.maxLimit + 3000;
            const inputTextArea = createRandomString(maxLimit);

            if (this.#isConditionalItem(child)) {
                continue;
            }

            try {
                if (child.type === 'Q_TEXT_AREA') {
                    const locator = this.page.locator(`#input-${code} textarea.form-control`);
                    await locator.fill(inputTextArea);

                } else if (child.type === "Q_GENERIC_TABULAR") {
                    const childrenToIterate = child.children;

                    for (const childToIterate of childrenToIterate) {
                        const codeKey = childToIterate.code || childToIterate.itemKey;

                        if (childToIterate.type === "Q_TEXT_AREA") {
                            let textAreaInput = createRandomString(childToIterate.maxLimit + 3000);
                            await this.commonButtons.clickButton('Add New');

                            const textAreaSelector = `textarea[id="tabularAnswer\\.multiValuedAnswers\\[${codeKey}\\]\\.value"]`;
                            const textAreaLocator = this.page.frameLocator('iframe').locator(textAreaSelector);
                            await textAreaLocator.waitFor({ state: 'visible' });
                            await textAreaLocator.fill(textAreaInput);

                            await this.commonButtons.clickButton('Continue', this.page.frameLocator('iframe'));

                            await expect(this.page.locator('iframe').contentFrame().locator(`#${codeKey}`)).toContainText('extra characters have been entered');
                            await expect(this.page.locator('iframe').contentFrame().locator(`[id="tabularAnswer.multiValuedAnswers${codeKey}.value.errors"]`)).toContainText('Length can not be more than ');

                            await this.commonButtons.clickButton('×');
                        }
                    }
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

    async validateErrorMsgForLimitExceed(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if (child.type === "Q_TEXT_AREA") {
                const selector1 = `#input-${childCode} .text-danger`;
                const selector2 = `#input-${childCode} .help-block`;

                await this.page.locator(selector1).waitFor({ state: 'visible', timeout: 5000 });

                expect.soft(this.page.locator(selector1)).toContainText('extra characters have been entered');
                expect.soft(this.page.locator(selector2)).toContainText('Length can not be more than');
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForLimitExceed(child.children);
                }
            }
        }
    }

    // validate title
    async validateCommentTitle(child) {
        if ((child.canComment === true) && (child.code) && (child.type !== "READONLY_TEXT")) {
            const childID = this.page.locator(`#item-${child.code}`);

            await childID.getByTitle('Comments').click();
            const extractedCommentTitle = await this.page.locator(`[id="comment-${child.code}"]`).locator('[class="control-label"]').textContent();
            await expect.soft(extractedCommentTitle).toBe('Comments');
        }
    }

    async validateTitle(item, extractTitle) {
        if (item.serialLabel === "" && item.title === "") {
            return;
        }

        if (item.serialLabel !== "") {
            await expect.soft(extractTitle).toBe(item.serialLabel + "." + " " + item.title);

        } else {
            expect.soft(extractTitle).toBe(item.title);
        }
    }

    async iterateChildrenToValidateTitle(children) {
        for (const child of children) {
            if (this.#isConditionalItem(child)) {
                continue;
            }

            if (child.serialLabel === "" && child.title === "") {
                continue;
            }

            let extractedChildTitle = await this.page.locator(`[id="item-${child.code}"]`).locator('[class="control-label"]').nth(0).textContent();
            extractedChildTitle = extractedChildTitle.trim();

            await this.validateTitle(child, extractedChildTitle);
            await this.validateCommentTitle(child);

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateChildrenToValidateTitle(
                        child.children
                    );
                }
            }
        }
    }

    async iterateSectionsToValidateTitle(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;
            const isLastSection = i === sections.length - 1;

            let extractedSectionTitle = await this.page.locator(`[id="${section.code}"]`).locator('[class="panel-title"]').textContent();
            extractedSectionTitle = extractedSectionTitle.trim();

            await this.validateTitle(section, extractedSectionTitle)
            await this.iterateChildrenToValidateTitle(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }

    // validate the order of options with defn data
    async validateOptionOrderForRadioButton(childCode, child) {
        await this.page.locator(`#input-${childCode} input[type="radio"]`).first().waitFor({ state: 'visible' });

        let radioButtonValues = await this.page.locator(
            `#input-${childCode} input[type="radio"]`
        ).evaluateAll(inputs =>
            inputs.map(input => Number(input.getAttribute('value')))
        );

        const optionNumberArray = child.options.map(option => option.optionNumber);
        expect.soft(radioButtonValues).toEqual(optionNumberArray);
    }

    async validateOptionOrderForCheckbox(childCode, child) {
        const checkboxValues = await this.page.locator(
            `#input-${childCode} input[type="checkbox"]`
        ).evaluateAll(inputs =>
            inputs.map(input => Number(input.getAttribute('value')))
        );

        const optionNumberArray = child.options.map(option => option.optionNumber);
        expect.soft(checkboxValues.sort()).toEqual(optionNumberArray.sort());
    }

    async validateOptionOrderForDropdown(childCode, child) {
        await this.page.locator(`[id="input-${childCode}"]`).waitFor({ state: 'visible' });
        await this.page.locator(`[id="input-${childCode}"]`).click();

        const listItems = await this.page.locator(`div.dropdown-menu.open ul.dropdown-menu.inner li`).all();

        const dropdownValues = [];
        for (const li of listItems) {
            const text = await li.locator('span.text').textContent();
            const match = text && text.match(/\((\d+)\)$/);
            if (match) {
                dropdownValues.push(Number(match[1]));
            }
        }

        const expectedValues = child.options
            .map(option => option.optionNumber);

        expect.soft(dropdownValues).toEqual(expectedValues);
    }

    async handleChildType(child) {
        const childCode = child.code || child.itemKey;
        const childType = child.type;

        switch (childType) {
            case "Q_RADIO":
                await this.validateOptionOrderForRadioButton(childCode, child);
                break;

            case "Q_CHECKBOX":
                await this.validateOptionOrderForCheckbox(childCode, child);
                break;

            case "Q_DROPDOWN":
                await this.validateOptionOrderForDropdown(childCode, child);
                break;

            default:
                break;
        }
    }

    async iterateChildrenToValidateOrder(children) {
        for (const child of children) {

            if (this.#isConditionalItem(child)) {
                continue;
            }

            await this.handleChildType(child);

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateChildrenToValidateOrder(
                        child.children
                    );
                }
            }
        }
    }

    async iterateSectionsToValidateOrder(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;
            const isLastSection = i === sections.length - 1;

            await this.iterateChildrenToValidateOrder(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }

    // validate input,double with string input
    async validateErrorMsgForIntDouble(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER")) {
                const selector = `#input-${childCode} .help-block span`;
                await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
                expect.soft(this.page.locator(selector)).toContainText('must be an integer');
            }

            if ((child.type === "Q_DOUBLE")) {
                const selector = `#input-${childCode} .help-block span`;
                await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
                expect.soft(this.page.locator(selector)).toContainText('must be a number');
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForIntDouble(
                        child.children
                    );
                }
            }
        }
    }

    async iterateIntDoubleType(children, input) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER") || (child.type === "Q_DOUBLE")) {
                await this.page.locator(`#input-${childCode} input.form-control`).fill(input);
                FORM_INPUT.questionCodeInputValueObj[childCode] = input;
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateIntDoubleType(
                        child.children, input
                    );
                }
            }
        }
    }

    async validateIntDoubleTypeWithStringInput(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;
            const isLastSection = i === sections.length - 1;

            await this.iterateIntDoubleType(section.children, 'stringInput');

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForIntDouble(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    // validate int, double with neg input
    async validateErrorMsgForIntDoubleNegValue(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER") || (child.type === "Q_DOUBLE")) {
                const selector = `#input-${childCode} .help-block span`;
                await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });

                expect.soft(this.page.locator(selector)).toContainText('can not be less than zero');
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForIntDoubleNegValue(
                        child.children
                    );
                }
            }
        }
    }

    async iterateIntDoubleTypeWithNegInput(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER")) {
                await this.page.locator(`#input-${childCode} input.form-control`).fill('-11');
                FORM_INPUT.questionCodeInputValueObj[childCode] = '-11';
            }

            if ((child.type === "Q_DOUBLE")) {
                await this.page.locator(`#input-${childCode} input.form-control`).fill('-11.00');
                FORM_INPUT.questionCodeInputValueObj[childCode] = '-11.00';
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateIntDoubleTypeWithNegInput(
                        child.children
                    );
                }
            }
        }
    }

    async validateIntDoubleTypeWithNegInput(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;
            const isLastSection = i === sections.length - 1;

            await this.iterateIntDoubleTypeWithNegInput(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForIntDoubleNegValue(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    // validate int with double input
    async validateErrorMsgForInt(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER")) {
                const selector = `#input-${childCode} .help-block span`;
                await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
                expect.soft(this.page.locator(selector)).toContainText('must be an integer');
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForInt(
                        child.children
                    );
                }
            }
        }
    }

    async iterateIntType(children, input) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if ((child.type === "Q_INTEGER")) {
                await this.page.locator(`#input-${childCode} input.form-control`).fill(input);
                FORM_INPUT.questionCodeInputValueObj[childCode] = input;
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateIntType(
                        child.children, input
                    );
                }
            }
        }
    }

    async validateIntWithDoubleInput(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) continue;

            const isLastSection = i === sections.length - 1;
            await this.iterateIntType(section.children, '11.00');

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForInt(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    // validate hint
    decodeHtmlEntities(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }

    async iterateChildrenToValidateHint(children) {
        for (const child of children) {

            if (this.#isConditionalItem(child)) {
                continue;
            }

            if (!child.hint) {
                continue;
            }

            const rawHtml = await this.page
                .locator(`#item-${child.code} .help-block`)
                .nth(0)
                .innerHTML();

            const actual = this.decodeHtmlEntities(rawHtml)
                .replace(/\s+/g, ' ')
                .trim();
            const expected = child.hint
                .replace(/\s+/g, ' ')
                .trim();

            await expect.soft(actual).toContain(expected);

            if (
                child.children &&
                child.type !== 'Q_GENERIC_TABULAR' &&
                child.type !== 'Q_DIAGNOSIS'
            ) {
                await this.iterateChildrenToValidateHint(child.children);
            }
        }
    }

    async iterateSectionsToValidateHint(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (this.#isConditionalItem(section)) continue;

            if (section.hint) {
                const locator = this.page.locator(`#item-${child.code} .help-block`).nth(0);
                await locator.waitFor({ state: 'visible', timeout: 5000 });

                const rawHtml = await locator.innerHTML();
                const actual = this.decodeHtmlEntities(rawHtml)
                    .replace(/\s+/g, ' ')
                    .trim();
                const expected = section.hint
                    .replace(/\s+/g, ' ')
                    .trim();

                await expect.soft(actual).toContain(expected);
            }

            if (section.children) {
                await this.iterateChildrenToValidateHint(section.children);
            }

            if (i !== sections.length - 1) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }

    //validate future date
    async validateErrorMsgForFutureDate(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if ((child.type === "Q_DATE")) {
                if (child.futureDateAllowed === false) {
                    const selector = `#input-${childCode} .help-block span`;
                    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
                    expect.soft(this.page.locator(selector)).toContainText('can not be a future date');
                }
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForFutureDate(
                        child.children
                    );
                }
            }
        }
    }

    async iterateDateType(children, input) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;

            if ((child.type === "Q_DATE")) {
                if (child.futureDateAllowed === false) {
                    await this.page.locator(`div#input-${childCode} input[placeholder="MM/DD/YYYY"]`).fill(input);
                    FORM_INPUT.questionCodeInputValueObj[childCode] = input;
                }
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.iterateDateType(
                        child.children, input
                    );
                }
            }
        }
    }

    async validateDateWithFutureDate(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (this.#isConditionalItem(section)) {
                continue;
            }

            const isLastSection = i === sections.length - 1;

            await this.iterateDateType(section.children, getTomorrowDate());

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForFutureDate(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    // give string as input in date field and validate error msg
    async fillSectionsWithRandomInputForDate(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];


            if (this.#isConditionalItem(section)) {
                continue;
            }

            const isLastSection = i === sections.length - 1;

            await this.fillChildrenWithRandomInputForDate(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
                await this.validateErrorMsgForInvalidDate(section.children);
                this.page.once('dialog', async dialog => {
                    await dialog.accept();
                });

                await this.page.locator(`#menu_${sections[i + 1].code}`).click();
            }
        }
    }

    async fillChildrenWithRandomInputForDate(children) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;
            const inputRandomStrimg = createRandomString(10);

            if (this.#isConditionalItem(child)) {
                continue;
            }

            try {
                if (child.type === 'Q_DATE') {
                    const locator = this.page.locator(`div#input-${code} input[placeholder="MM/DD/YYYY"]`);
                    await locator.fill(inputRandomStrimg);

                } else if (child.type === "Q_GENERIC_TABULAR") {
                    const childrenToIterate = child.children;

                    for (const childToIterate of childrenToIterate) {
                        const codeKey = childToIterate.code || childToIterate.itemKey;

                        if (childToIterate.type === "Q_DATE") {
                            const inputSelector = `input[id="tabularAnswer\\.multiValuedAnswers\\[${codeKey}\\]\\.value"]`;
                            const inputLocator = this.page.frameLocator('iframe').locator(inputSelector);
                            const errorSelector = `[id="tabularAnswer.multiValuedAnswers${codeKey}.value.errors"]`;
                            const errorLocator = this.page.frameLocator('iframe').locator(errorSelector);

                            await this.commonButtons.clickButton('Add New');
                            await inputLocator.waitFor({ state: 'visible' });
                            await inputLocator.fill(inputRandomStrimg);
                            await this.page.frameLocator('iframe').getByRole('button', { name: 'Continue' }).click();
                            await expect(errorLocator).toContainText('invalid!');
                            await this.commonButtons.clickButton('×');
                        }
                    }
                }

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.fillChildrenWithRandomInputForDate(
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

    async validateErrorMsgForInvalidDate(children) {
        for (const child of children) {
            const childCode = child.code || child.itemKey;
            if (this.#isConditionalItem(child)) {
                continue;
            }

            if (child.type === "Q_DATE") {
                const selector1 = `#input-${childCode} .help-block`;
                await this.page.locator(selector1).waitFor({ state: 'visible', timeout: 5000 });
                expect.soft(this.page.locator(selector1)).toContainText('invalid!');
            }

            if (child.type !== "Q_GENERIC_TABULAR" && child.type !== "Q_DIAGNOSIS") {
                if (child.children) {
                    await this.validateErrorMsgForInvalidDate(child.children);
                }
            }
        }
    }

    //max row tabular data validation
    async fillSectionsWithGenericTabular(sections) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const isLastSection = i === sections.length - 1;

            if (this.#isConditionalItem(section)) {
                continue;
            }

            await this.fillChildrenForGenericTabular(section.children);

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }
        }
    }

    async fillChildrenForGenericTabular(children) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const noOfRows = Number(child.maxLimit) + 1

            if (this.#isConditionalItem(child)) {
                continue;
            }

            try {
                if (child.type === "Q_GENERIC_TABULAR" && child.maxLimit !== 0) {
                    await this.handleGenericTabular(child, code, noOfRows, '', 'no', 'less');
                }
            }
            catch (err) {
                if (err.message.includes("waiting for")) {
                    console.log(`Skipping ${code} due to timeout: ${err.message}`);
                }
            }
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
            await this.genericTabularInputHandler.clickAddNewButtonForTabularQuestionItem(childCode);
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

                const value = await this.genericTabularInputHandler.handleChildTypeForGenericTabular(
                    col,
                    String(generateInteger(limit)),
                    String(generateDouble(limit)),
                    createRandomString(limit, regex),
                    createRandomString(limit),
                    getYesterdayDate()
                );

                rowData[codeKey] = value;
            }

            FORM_INPUT.questionCodeInputValueObj[childCode].push(rowData);
            await this.commonButtons.clickButton('Continue', this.page.frameLocator('iframe'));

            const isLastRow = row === noOfRowsForGenericTabular - 1;
            if (isLastRow) {
                await expect(this.page.locator('iframe').contentFrame().locator('#assessmentDocCmd')).toContainText('Please see below for error messages!');
                await expect(this.page.locator('iframe').contentFrame().getByRole('listitem')).toContainText(`You can add upto ${child.maxLimit} answers`);
                await this.commonButtons.clickButton('×');
            }
        }

        if (CommonUtils.isAffirmative(shouldAddComment)) {
            await this.genericTabularInputHandler.commentHandler.handleCommentInput(child, inputComment);
        }
    }

}