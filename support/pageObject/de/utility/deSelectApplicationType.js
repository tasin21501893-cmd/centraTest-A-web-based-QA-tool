/**
 * @author Rifat Ara
 * @since 02/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { DeLabels } from './deLabels.js';

export class DeSelectApplicationType {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.#initLocators();
    }

    async selectApplicationType(data) {
        if (data.applicationType === 'DDDS') {
            await this.rdoDddsSelect.check();
        }

        await this.commonButtons.clickButton(DeLabels.NEXT);
    }
    
    #initLocators() {
        this.rdoDddsSelect = this.page.locator('input[name="deApplicationType"][value="DDDS"]');
    }
}
