/**
 * @author Abdullah Umar Nasib
 * @since 18/02/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { schedulingProviderFlags } from '../../../resources/scheduling/schedulingProviderFlags';

export class SchedulingProvConfigPage {
    
    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.buttons = new CommonButtons(page);
    }

    async checkConfigurationItems(data) {
        for (const [checkboxLabel, dataKey] of Object.entries(schedulingProviderFlags)) {
            await this.utils.toggleCheckboxUsingValue(this.page, checkboxLabel, data[dataKey]);
        }
    }

    async saveSchedulingProviderConfig() {
        await this.buttons.clickButton('Save');
    }
}