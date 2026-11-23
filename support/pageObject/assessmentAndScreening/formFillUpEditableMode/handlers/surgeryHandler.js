/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';
import { CommonButtons } from '../../../../commonUtility/commonButtons.js';

const PAST_YEAR = 1990;

export class SurgeryHandler extends BaseHandler {

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
            let incrementalYear = PAST_YEAR + i

            await this.commonButtons.clickButton('Add New Surgery');
            await this.page.locator(`#surgeryModal_${code}Surgery`).waitFor({ state: 'visible' });
            await this.page.locator(`#surgeryModal_${code}Surgery`).fill(`Surgery 0${i}`);
            await this.page.locator(`#surgeryModal_${code}Year`).fill(String(incrementalYear));
            await this.commonButtons.clickButton('Continue');
        }

        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}