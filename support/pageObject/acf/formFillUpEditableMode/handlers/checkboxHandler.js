/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class CheckboxHandler extends BaseHandler {

    async handle(child, { inputCheckBox }) {
        const code = child.code;

        if (!Array.isArray(inputCheckBox)) {
            inputCheckBox = [inputCheckBox];
        }

        const childID = this.page.locator(`#item-${code}`);

        for (const inputValue of inputCheckBox) {
            const checkboxLocator = childID.locator(`[name="${code}"][value="${inputValue}"]`);
            await checkboxLocator.check();
        }

        FORM_INPUT.questionCodeInputValueObj[code] = inputCheckBox;
    }
}