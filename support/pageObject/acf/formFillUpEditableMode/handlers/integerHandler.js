/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class IntegerHandler extends BaseHandler {

    async handle(child, { inputInteger }) {
        const code = child.code || child.itemKey;
        const locator = this.page.locator(`input[data-testid=${code}]`);

        await locator.fill(inputInteger);
        FORM_INPUT.questionCodeInputValueObj[code] = inputInteger;
    }
}