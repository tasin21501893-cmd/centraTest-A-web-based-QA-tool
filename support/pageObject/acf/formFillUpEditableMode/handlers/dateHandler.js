/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class DateHandler extends BaseHandler {
    /**
     * @param {object} child
     */
    async handle(child, { futureDate, presentDate }) {
        const code = child.code || child.itemKey;
        const dateLocator = this.page.locator(
            `input[data-testid=${code}]`
        );

        const dateValue = child.futureDateAllowed
            ? futureDate
            : presentDate;

        await dateLocator.fill(dateValue);

        FORM_INPUT.questionCodeInputValueObj[code] = {
            selected: dateValue,
            future: futureDate,
            present: presentDate
        };
    }
}