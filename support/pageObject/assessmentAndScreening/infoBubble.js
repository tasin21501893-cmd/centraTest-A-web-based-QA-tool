/**
 * @author Maksuda Islam (Lima)
 * @author Md Raihan Rahman (Raihan)
 * @since 01/08/2024
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { ListPage } from '../../commonPages/listPage';

export class InfoBubble {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.iBubble = page.locator('#info');

        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
    }

    async extractValueFromUser(loginName) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'User', 'List');
        await this.listPage.fillFilterFieldForPrimeFaceListPage("null", loginName);
        await this.page.locator('.pi.pi-spin.pi-spinner').waitFor({ state: 'hidden' });
        await this.commonUtils.waitForChangeInDOM('#userDataTable');

        const isUserExist = await this.commonUtils.isElementAvailable(
            this.page.locator(`td[role="gridcell"] a:text-is("${loginName}")`)
        );

        if (isUserExist) {
            await this.page.locator(`td[role="gridcell"] a:text-is("${loginName}")`).click();

            const firstName = await this.page.locator('[name="firstName"]').inputValue();
            const lastName = await this.page.locator('[name="lastName"]').inputValue();
            const timeZone = await this.page.locator('[data-id="preferredTz"]').getAttribute('title');

            return { firstName, lastName, timeZone };
        }

        return null;
    }

    async clickIBubble() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.iBubble.click();
    }

    async fetchValueByLabel(label) {
        await this.clickIBubble();

        return await this.page.$eval(
            `.popover-content strong:has-text("${label}")`,
            (element, labelText) => {
                const container = element.parentElement;
                let text = container.textContent;

                text = text.replace(new RegExp(`${labelText}\\s*:`), '');
                text = text.replace('×', '');
                text = text.replace('Copied!', '');

                return text.replace(/\s+/g, ' ').trim();
            },
            label
        );
    }

    async closeIBubble() {
        await this.page.locator('[class="close pull-right info-close"]').first().click();
    }

}