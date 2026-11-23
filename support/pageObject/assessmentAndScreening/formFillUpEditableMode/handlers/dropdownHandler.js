/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';

export class DropdownHandler extends BaseHandler {

    async handle(child, params) {
        const { shouldAddComment, inputComment, inputDropdown } = params;
        const code = child.code;
        const dataOriginalIndex = inputDropdown + 1;
        const childID = this.page.locator(`[id="input-${code}"]`);

        await childID.locator('button[data-toggle="dropdown"]').waitFor({ state: 'visible' });
        await childID.locator('button[data-toggle="dropdown"]').click();
        await childID.locator(`.dropdown-menu li[data-original-index="${dataOriginalIndex}"]`).waitFor({ state: 'visible' });
        await childID.locator(`.dropdown-menu li[data-original-index="${dataOriginalIndex}"]`).click();

        FORM_INPUT.questionCodeInputValueObj[code] = inputDropdown;
        await this.addComment(child, code, shouldAddComment, inputComment);
    }
}