/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class DoubleHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputDouble } = params;
        const code = child.code || child.itemKey;
        const locator = this.page.locator(`#input-${code} input.form-control`);

        await locator.fill(inputDouble);
        
        FORM_INPUT.questionCodeInputValueObj[code] = inputDouble;
        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}