/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class TextAreaHandler extends BaseHandler {

    async handle(child, { inputTextArea }) {
        const code = child.code || child.itemKey;;
        const locator = this.page.locator(`textarea[data-testid=${code}]`);

        await locator.fill(inputTextArea);
        FORM_INPUT.questionCodeInputValueObj[code] = inputTextArea;
    }
}