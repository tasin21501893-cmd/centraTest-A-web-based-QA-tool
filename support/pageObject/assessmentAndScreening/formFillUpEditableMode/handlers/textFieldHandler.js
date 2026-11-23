/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

const POSTAL_CODE = '31905';
const SSN = '345-32-1111';

export class TextFieldHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputTextField} = params;
        const code = child.code || child.itemKey;
        const field = this.page.locator(`#input-${code}`).locator('input[input-type="TEXT"]');
        const current = await field.inputValue();

        if (code === 'iA10' && !child.regExPattern) { //Postal code & ssn is handled using regex for Canada; for the USA, it's hardcoded with an empty regex
            if (!current) {
                await field.fill(POSTAL_CODE);
                FORM_INPUT.questionCodeInputValueObj[code] = POSTAL_CODE;
            }
        } else if (code === 'iA5a' && !child.regExPattern) {
            if (!current) {
                await field.fill(SSN);
                FORM_INPUT.questionCodeInputValueObj[code] = SSN;
            }
        } else {
            await field.fill(inputTextField);
            FORM_INPUT.questionCodeInputValueObj[code] = inputTextField;
        }

        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}