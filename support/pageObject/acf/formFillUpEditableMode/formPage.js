/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { evaluateCondition } from '../../../helper/acfCore/conditionalItemsEvaluator.js';
import { FORM_INPUT } from '../../../../support/constants/acfCore/formInput.js';

import { HandlerFactory } from './handlers/handlerFactory.js';
import { CommonButtons } from "../../../commonUtility/commonButtons.js";
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommentHandler } from './commentHandler.js';
import { ExternalDataFetchComponentFactory } from './handlers/externalDataFetchComponents/externalDataFetchComponentFactory.js';

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
        this.commentHandler = new CommentHandler(page);
        this.fetchFactory = new ExternalDataFetchComponentFactory(page);

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

    #hasFetchConfig(child) {
        return !!(child.externalDataFetchProps?.componentType &&
            child.externalDataFetchProps?.fetchType);
    }

    #isFetchQuestion(child) {
        const fs = child.externalDataFetchProps?.fieldSelection;
        return typeof fs === 'string' && fs.trim() !== '';
    }

    async #handleFetch(child) {
        const { componentType } = child.externalDataFetchProps;

        try {
            const fetchComponent = this.fetchFactory.create(componentType);
            await fetchComponent.handle(child);

        } catch (error) {
            console.error(`Error handling fetch for ${componentType}:`, error);
            throw error;
        }
    }

    async #handleInput(child, shouldAddComment, options) {
        const handler = this.factory.get(child.type);
        const params = await this.#generateInputParams(child, shouldAddComment, options);

        await handler.handle(child, params);

        if (CommonUtils.isAffirmative(shouldAddComment) && child.canComment) {
            const code = child.code || child.itemKey;
            if (code && FORM_INPUT.questionCodeInputValueObj?.hasOwnProperty(code)) {
                await this.commentHandler.handleCommentInput(child, params.inputComment);
            }
        }
    }

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
                    await this.fillChildren(
                        section.children,
                        conditionalItems,
                        shouldAddComment,
                        { mode }
                    );

                    if (!isLastSection) {
                        await this.commonButtons.clickButton('Next');
                    }
                }
            } else {
                const isLastSection = i === sections.length - 1;
                await this.fillChildren(
                    section.children,
                    conditionalItems,
                    shouldAddComment,
                    { mode }
                );

                if (!isLastSection) {
                    await this.commonButtons.clickButton('Next');
                }
            }
        }
    }

    async fillChildren(children, conditionalItems, shouldAddComment, options = {}) {
        for (const child of children) {
            const code = child.code || child.itemKey;
            const type = child.type;
            const hasFetchComponent = this.#hasFetchConfig(child);
            const isFetchQ = this.#isFetchQuestion(child);

            try {
                if (child.conditionalItem) {
                    const cond = conditionalItems[code]?.condition;
                    if (!(await evaluateCondition(cond, FORM_INPUT.questionCodeInputValueObj))) {
                        continue;
                    }
                }

                if (child.externalDataFetchProps?.fetchType === 'LIVE') {
                    continue;
                }

                if (hasFetchComponent) {
                    await this.#handleFetch(child);

                    if (child.children && !["Q_GENERIC_TABULAR"].includes(type)) {
                        await this.fillChildren(
                            child.children,
                            conditionalItems,
                            shouldAddComment,
                            options
                        );
                    }

                } else {
                    if (!isFetchQ) {
                        await this.#handleInput(child, shouldAddComment, options);
                    }

                    if (child.children && !["Q_GENERIC_TABULAR", "Q_DIAGNOSIS"].includes(type)) {
                        await this.fillChildren(
                            child.children,
                            conditionalItems,
                            shouldAddComment,
                            options
                        );
                    }
                }
            } catch (err) {
                if (err.message?.includes('waiting for')) {
                    console.log(`Skipping child (timeout) -- code: ${code}, error: ${err.message}`);
                    continue;
                }
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
                    await this.fillChildren(
                        section.children,
                        conditionalItems,
                        shouldAddComment,
                        { excelData }
                    );

                    if (!isLastSection) {
                        await this.commonButtons.clickButton('Next');
                    }
                }
            } else {
                const isLastSection = i === sections.length - 1;
                await this.fillChildren(
                    section.children,
                    conditionalItems,
                    shouldAddComment,
                    { excelData }
                );

                if (!isLastSection) {
                    await this.commonButtons.clickButton('Next');
                }
            }
        }
    }

}