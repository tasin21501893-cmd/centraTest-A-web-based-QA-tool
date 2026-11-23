/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class CheckboxHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputCheckBox } = params;
        const code = child.code;
        const childID = this.page.locator(`#item-${code}`);

        if (!Array.isArray(inputCheckBox)) {
            inputCheckBox = [inputCheckBox];
        }

        for (const inputValue of inputCheckBox) {
            const checkboxLocator = childID.locator(`#input-${code} input[type="checkbox"][id="checkbox-item-${code}-${inputValue}"]`);
            await checkboxLocator.check();
        }

        FORM_INPUT.questionCodeInputValueObj[code] = inputCheckBox;
        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}