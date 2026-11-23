/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class TextAreaHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputTextArea } = params;
        const code = child.code;
        const locator = this.page.locator(`#input-${code} textarea.form-control`);
        await locator.fill(inputTextArea);
        
        FORM_INPUT.questionCodeInputValueObj[code] = inputTextArea;
        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}