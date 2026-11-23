/**
 * @author Sayed Ahmed Tasin
 * @since 08/10/2026
 */

import { ListPage } from '../../../commonPages/listPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class HealthTrackingUtils {
    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
    }

    /**
     * Common method to select Program and Individual across Health Tracking forms.
     */
    async selectProgramAndIndividual(program, individual) {
        if (CommonUtils.isValueValid(program)) {
            await this.listPage.selectFilteredFirstItem(program);
        }
        if (CommonUtils.isValueValid(individual)) {
            await this.listPage.selectFilteredFirstItem(individual);
        }
    }

    /**
     * Helper to handle input fields supporting 'EMPTY', blank cells, or populated values.
     */
    async fillOrClearInput(locator, value) {
        if (value?.toString().toUpperCase() === 'AUTO') {
            return;
        }
        if (value === 'EMPTY') {
            await locator.clear();
        } else if (CommonUtils.isValueValid(value)) {
            await locator.fill(value.toString());
        }
    }
}
