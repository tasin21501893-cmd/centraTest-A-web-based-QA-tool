/**
 * @author Maksuda Islam (Lima)
 * @since 05/18/2025
 */
import { CommonUtils } from '../../commonUtility/commonUtils';
import { SearchPage } from '../../commonPages/searchPage';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class AssessmentDocumentSearchPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.commonUtils = new CommonUtils(page);
        this.searchPage = new SearchPage(page);
        this.commonButtons = new CommonButtons(page);
    }

    async searchByFormID(formID) {
        await this.searchPage.setFormIdField(formID);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForTimeout(500);

        await this.page.locator(`td:text-is("${formID}")`).locator("..").click();
    }
}