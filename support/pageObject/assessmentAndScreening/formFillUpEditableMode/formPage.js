/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { expect } from '@playwright/test';
import { evaluateCondition } from '../../../helper/acfCore/conditionalItemsEvaluator.js';
import { FORM_INPUT } from '../../../../support/constants/acfCore/formInput.js';

import { HandlerFactory } from './handlers/handlerFactory.js';
import { CommonButtons } from "../../../commonUtility/commonButtons.js";

import {
    generateDouble, generateInteger, createRandomString,
    singleOptionSelect, multiOptionsSelect,
    getTodayDate, getTomorrowDate
} from '../../../helper/acfCore/formFillUpDataProcessor.js';

export class FormPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.factory = new HandlerFactory(page);
        this.commonButtons = new CommonButtons(page);

        this.optionalFalseCount = 0;
    }

    async #generateInputParams(child, shouldAddComment, options = {}) {
        const { mode = 'less', excelData } = options;
        const type = child.type;
        const regex = child.regExPattern;
        let maxLimit = child.maxLimit;

        if (!maxLimit) {
            maxLimit =
                type === "Q_GENERIC_TABULAR" ? 10 :
                    type === "Q_TEXT_AREA" ? 500 :
                        30;
        }

        if (mode === 'less') {
            maxLimit = Math.floor(maxLimit / 2);

        } else if (mode === 'equal') {
            maxLimit = maxLimit;
        }

        return {
            shouldAddComment,
            inputComment: createRandomString(500),
            inputDouble: String(generateDouble(maxLimit)),
            inputInteger: String(generateInteger(maxLimit)),
            inputTextArea: excelData?.textAreaInput ?? createRandomString(maxLimit, regex),
            inputTextField: excelData?.textFieldInput ?? createRandomString(maxLimit, regex),
            inputCheckBox: await multiOptionsSelect(child),
            inputDropdown: await singleOptionSelect(child),
            inputRadioButton: await singleOptionSelect(child),
            futureDate: getTomorrowDate(),
            presentDate: getTodayDate(),
            noOfRowsForGenericTabular: maxLimit,
            noOfRows: maxLimit,
            shouldFetchDiagnosis: 'no',
            mode
        };
    }

    // random input
    async fillSectionsWithRandomInput(sections, conditionalItems, shouldAddComment, options = { mode: 'less' }) {
        const { mode } = options;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section.conditionalItem === true) {
                const conditionMet = await evaluateCondition(
                    conditionalItems[section.code].condition,
                    FORM_INPUT.questionCodeInputValueObj
                );

                if (conditionMet) {
                    const isLastSection = i === sections.length - 1;
                    await this.fillChildrenWithRandomInput(section.children, conditionalItems, shouldAddComment, { mode });

                    if (!isLastSection) {
                        await this.commonButtons.clickButton('Update and Next');
                    }
                }
            } else {
                const isLastSection = i === sections.length - 1;
                await this.fillChildrenWithRandomInput(section.children, conditionalItems, shouldAddComment, { mode });

                if (!isLastSection) {
                    await this.commonButtons.clickButton('Update and Next');
                }
            }
        }
    }

    async fillChildrenWithRandomInput(children, conditionalItems, shouldAddComment, options = {}) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            try {
                if (child.conditionalItem) {
                    const cond = conditionalItems[code]?.condition;
                    if (!(await evaluateCondition(cond, FORM_INPUT.questionCodeInputValueObj))) continue;
                }

                const handler = this.factory.get(type);
                const params = await this.#generateInputParams(child, shouldAddComment, options);
                await handler.handle(child, params);

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.fillChildrenWithRandomInput(child.children, conditionalItems, shouldAddComment, options);
                }
            } catch (err) {
                console.error(`Error handling ${code}:`, err);
            }
        }
    }

    // excel input (text area & text field)
    async fillSectionsWithExcelInput(sections, conditionalItems, shouldAddComment, options = {}) {
        const { excelData } = options;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section.conditionalItem === true) {
                const conditionMet = await evaluateCondition(
                    conditionalItems[section.code].condition,
                    FORM_INPUT.questionCodeInputValueObj
                );

                if (conditionMet) {
                    const isLastSection = i === sections.length - 1;
                    await this.fillChildrenWithExcelInput(section.children, conditionalItems, shouldAddComment, { excelData });

                    if (!isLastSection) {
                        await this.commonButtons.clickButton('Update and Next');
                    }
                }
            } else {
                const isLastSection = i === sections.length - 1;
                await this.fillChildrenWithExcelInput(section.children, conditionalItems, shouldAddComment, { excelData });

                if (!isLastSection) {
                    await this.commonButtons.clickButton('Update and Next');
                }
            }
        }
    }

    async fillChildrenWithExcelInput(children, conditionalItems, shouldAddComment, options = {}) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            try {
                if (child.conditionalItem) {
                    const cond = conditionalItems[code]?.condition;
                    if (!(await evaluateCondition(cond, FORM_INPUT.questionCodeInputValueObj))) continue;
                }

                const handler = this.factory.get(type);
                const params = await this.#generateInputParams(child, shouldAddComment, options);
                await handler.handle(child, params);

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.fillChildrenWithExcelInput(child.children, conditionalItems, shouldAddComment, options);
                }
            } catch (err) {
                console.error(`Error handling ${code}:`, err);
            }
        }
    }

    // fill the comments
    async fillSectionsWithComment(sections, conditionalItems) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section.conditionalItem !== true) {
                const isLastSection = i === sections.length - 1;
                await this.fillChildrenWithComment(section.children, conditionalItems);

                if (!isLastSection) {
                    await this.commonButtons.clickButton('Update and Next');
                }

            } else {
                continue;
            }
        }
    }

    async fillChildrenWithComment(children, conditionalItems) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            const inputComment = createRandomString(500);

            try {
                if (child.conditionalItem) {
                    continue;
                }

                if (child.canComment === true && child.type != 'READONLY_TEXT') {
                    const commentBtn = this.page.locator(`#item-${code} [title="Comments"]`);
                    await commentBtn.click();

                    const textarea = this.page.locator(`#comment-${code} textarea.form-control`);
                    await textarea.fill(inputComment);

                    FORM_INPUT.questionCodeInputValueObj[code] = inputComment;
                }

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.fillChildrenWithComment(
                        child.children,
                        conditionalItems
                    );
                }
            }
            catch (err) {
                if (err.message.includes("waiting for")) {
                    console.log(`Skipping ${code} due to timeout: ${err.message}`);
                } else {
                    console.error(`Error handling ${code}:`, err);
                    throw err;
                }
            }
        }
    }

    //check section count
    async extractSectionCountValues(sectionCode) {
        const liLocator = this.page.locator(`#menu_${sectionCode}`).locator('..');
        const fullText = await liLocator.innerText();
        const anchorText = await this.page.locator(`#menu_${sectionCode}`).innerText();
        let extractedText = fullText.replace(anchorText, '').trim();
        extractedText = extractedText.replace(/[()]/g, '');

        const [givenStr, , totalStr] = extractedText.split(' ');
        const givenMandatoryChildInputCount = parseInt(givenStr, 10);
        const totalMandatoryChildInputCount = parseInt(totalStr, 10);

        return { givenMandatoryChildInputCount, totalMandatoryChildInputCount };
    }

    async iterateSectionsWithRandomInputEqualToMaxLimitCheckCount(sections, conditionalItems) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const isLastSection = i === sections.length - 1;

            if (section.conditionalItem) {
                const cond = conditionalItems[section.code]?.condition;
                if (!(await evaluateCondition(cond, FORM_INPUT.questionCodeInputValueObj))) {
                    console.log(`${code}: conditional not met, skipping`);
                    continue;
                }
            }

            await this.iterateChildrenWithRandomInputEqualToMaxLimitCheckCount(section.children, conditionalItems, 'yes');
            await this.commonButtons.clickButton('Update and Show');
            await this.page.waitForLoadState('domcontentloaded');
            const sectionCountValues = await this.extractSectionCountValues(section.code);

            await expect.soft(this.optionalFalseCount).toEqual(sectionCountValues.totalMandatoryChildInputCount);
            await expect.soft(sectionCountValues.totalMandatoryChildInputCount).toEqual(sectionCountValues.givenMandatoryChildInputCount);

            await this.commonButtons.clickButton('Edit');

            if (!isLastSection) {
                await this.commonButtons.clickButton('Update and Next');
            }

            this.optionalFalseCount = 0;
        }
    }

    async iterateChildrenWithRandomInputEqualToMaxLimitCheckCount(children, conditionalItems, shouldAddComment) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;

            try {
                if (child.conditionalItem) {
                    const cond = conditionalItems[code]?.condition;
                    if (!(await evaluateCondition(cond, FORM_INPUT.questionCodeInputValueObj))) continue;
                }

                const handler = this.factory.get(type);
                const params = await this.#generateInputParams(child, shouldAddComment, { mode: 'equal' });
                await handler.handle(child, params);

                if (child.optional === false && type !== "READONLY_TEXT") {
                    this.optionalFalseCount++;
                }

                if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                    await this.iterateChildrenWithRandomInputEqualToMaxLimitCheckCount(
                        child.children,
                        conditionalItems,
                        shouldAddComment
                    );
                }
            } catch (err) {
                console.error(`Error handling ${code}:`, err);
            }
        }
    }

}