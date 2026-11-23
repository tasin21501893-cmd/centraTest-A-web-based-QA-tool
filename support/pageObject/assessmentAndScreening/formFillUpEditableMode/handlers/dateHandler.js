/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class DateHandler extends BaseHandler {
    /**
     * @param {object} child
     */
    async handle(child, params) {
        const { shouldAddComment, inputComment, futureDate, presentDate } = params;
        const code = child.code || child.itemKey;
        const dateLocator = this.page.locator(`div#input-${code} input[placeholder="MM/DD/YYYY"]`);
        const dateValue = child.futureDateAllowed
            ? futureDate
            : presentDate;

        await dateLocator.fill(dateValue);

        FORM_INPUT.questionCodeInputValueObj[code] = {
            selected: dateValue,
            future: futureDate,
            present: presentDate
        };

        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}