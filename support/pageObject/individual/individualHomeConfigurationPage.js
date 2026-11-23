/**
 * @author Abdullah Umar Nasib
 * @since 09/04/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { individualHomeFlags } from '../../../resources/individual/individualHomeFlags';

export class IndividualHomeConfigurationPage {
    
    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
    }

    // Enables checkboxes based on 'items', 'selectAll', or individual field values
    async enableIndividualHomeItems(data) {
        if (data.items !== '') {
            const itemList = await this.utils.parseCommaSeparatedList(data.items);

            for (const item of itemList) {
                await this.utils.selectCheckboxUsingFieldName(this.page, item);
            }
        }

        else if (data.selectAll !== '') { 
            await this.utils.toggleCheckboxUsingValue(this.page, 'Select All', data.selectAll);
        } 

        else {
            for (const [checkboxLabel, dataKey] of Object.entries(individualHomeFlags)) {
                await this.utils.toggleCheckboxUsingValue(this.page, checkboxLabel, data[dataKey]);
            }
        }
    }

     async goToSelectItems() {
        const navigationOptions = [
            ["Admin", "Individual Home Page", "Select Items"],
            ["Individual Home Page", "Select Items"]
        ];

        for (const option of navigationOptions) {
            try {
                await this.utils.navigateToDashboardLink(...option);
                return;
            } catch (err) {
                console.warn(`Navigation failed for: ${option.join(" > ")}`);
            }
        }

        throw new Error("All navigation attempts to 'Select Items' failed.");
    }
}