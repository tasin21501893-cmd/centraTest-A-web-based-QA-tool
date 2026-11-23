/**
 * @author Maksuda Islam (Lima)
 * @since 05/18/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class ACFSearchPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.txtFormIDSearchField = page.locator('[name="formId"]');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    async searchByFormID(formID) {
        await this.txtFormIDSearchField.fill(formID);
        await this.commonButtons.clickButton('Search');
        await this.commonUtils.waitForChangeInDOM('.panel.panel-info');

        const formIdRow = this.page.locator('td', { hasText: formID });
        await formIdRow.locator('..').click();
    }

}