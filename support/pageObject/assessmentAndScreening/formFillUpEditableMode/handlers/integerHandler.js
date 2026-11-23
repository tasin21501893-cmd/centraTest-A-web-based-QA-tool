/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class IntegerHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputInteger } = params;
        const code = child.code || child.itemKey;
        const locator = this.page.locator(`#input-${code} input.form-control`);

        await locator.fill(inputInteger);
        FORM_INPUT.questionCodeInputValueObj[code] = inputInteger;

        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}