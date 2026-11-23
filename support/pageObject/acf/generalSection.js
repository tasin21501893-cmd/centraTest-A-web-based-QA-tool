/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class GeneralSection {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.getFromDateOfGeneralSection = page.getByPlaceholder("MM/DD/YYYY").first();
        this.getToDateOfGeneralSection = page.getByPlaceholder("MM/DD/YYYY").nth(1);

        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
    }

    async clickNextBtn() {
        if (await this.page.locator('[name="_action_next"]').count() > 0) {
            await this.commonButtons.clickButton('Next');
        }
    }

    async fillUpGeneralSection(generalSectionFromDate, generalSectionToDate) {
        await this.page.waitForLoadState('domcontentloaded');
        await this.commonUtils.waitForChangeInDOM('.container-fluid');

        const countOfgetFromDateOfGeneralSection = await this.getFromDateOfGeneralSection.count();
        const countOfgetToDateOfGeneralSection = await this.getToDateOfGeneralSection.count();

        if (countOfgetFromDateOfGeneralSection > 0) {
            await this.getFromDateOfGeneralSection.fill(generalSectionFromDate);
        }
        if (countOfgetToDateOfGeneralSection > 0) {
            await this.getToDateOfGeneralSection.fill(generalSectionToDate);
        }

        await this.clickNextBtn();
    }

}