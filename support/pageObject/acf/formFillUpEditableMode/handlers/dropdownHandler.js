/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class DropdownHandler extends BaseHandler {

    async handle(child, { inputDropdown }) {
        const code = child.code; 
        const container = this.page.locator(`#item-${code}`);

        const selectInput = container.getByTestId(`${code}-select`);
        await selectInput.waitFor({ state: 'visible' });
        await selectInput.click();

        const list = container.getByTestId('dropdown-list');
        await list.waitFor({ state: 'visible' });

        const option = container.getByTestId(`${code}-${inputDropdown}`);
        await option.waitFor({ state: 'visible' });
        await option.click();

        FORM_INPUT.questionCodeInputValueObj[code] = inputDropdown;
    }
}