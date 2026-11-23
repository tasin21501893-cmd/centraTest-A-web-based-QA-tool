/**
 * @author Abdullah Umar Nasib
 * @since 27/04/2025
 */

import { ListPage } from '../../commonPages/listPage';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class SchedulingIndividualSetupPage {
    
    constructor(page) {
        this.page = page;
        this.list = new ListPage(page);
        this.utils = new CommonUtils(page);
        this.button = new CommonButtons(page);
    }

    async removeAllIndividual(removeAll) {
        const validValues = ['y', 'yes'];

        if (validValues.includes(removeAll?.toLowerCase())) {
            this.button.clickButton('Remove All');

            this.button.clickButton('Yes');
        }
    }

    async selectAllIndividual(selectAll) {
        const validValues = ['y', 'yes'];

        if (validValues.includes(selectAll?.toLowerCase())) {
            this.button.clickButton('Select All');

            this.button.clickButton('Yes');
        }
    }

    async selectIndividuals(individualsInput) {
        if (individualsInput) {
            const individualList = await this.utils.parseCommaSeparatedList(individualsInput);

            for (const individual of individualList) {
                if (await this.list.isItemExist(individual)) {
                    await this.list.clickFirstListItem();
                } else {
                    console.error(`[ERROR] Individual "${individual}" does not exist!`);
                }
            }

            this.button.clickButton('Save');
        }
    }

    async configureIndividualSetup(data) {
        const { selectAll, removeAll, individuals } = data;
    
        if (selectAll && removeAll) {
            console.error('[ERROR] Cannot select all and remove all at the same time.');
            return;
        }
    
        const tasks = [
            selectAll && this.selectAllIndividual(selectAll),
            removeAll && this.removeAllIndividual(removeAll),
            individuals && this.selectIndividuals(individuals)
        ].filter(Boolean);
    
        for (const task of tasks) {
            await task;
        }
    }
}