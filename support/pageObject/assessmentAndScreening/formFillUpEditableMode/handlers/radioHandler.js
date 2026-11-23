/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class RadioHandler extends BaseHandler {
    
    async handle(child, params) {
        const { shouldAddComment, inputComment, inputRadioButton } = params;
        const code = child.code || child.itemKey;
        const selector = `#item-${code} input[type="radio"][value="${inputRadioButton}"]`;
        const radio = this.page.locator(selector);

        await radio.waitFor({ state: 'visible', timeout: 5000 });
        await radio.check();

        FORM_INPUT.questionCodeInputValueObj[code] = inputRadioButton;
        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}