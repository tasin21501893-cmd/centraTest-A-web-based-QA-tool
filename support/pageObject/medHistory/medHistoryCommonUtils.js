/**
 * @author Emran Hossain Rabbi
 * @since 09/17/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../../support/commonPages/listPage.js';

export class MedHistoryCommonUtils {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);

        this.infoIcon = page.locator('#info');
        this.popoverContent = page.locator('.popover-content');
        this.popoverClose = page.locator('.popover-content .info-close');
    }

    async fetchValueFromIBubbleByLabelName(label) {
        await this.infoIcon.click();
        await this.page.locator('.popover.fade.right.in').waitFor({ state: 'visible' });

        const value = await this.page.$eval(
            `.popover-content strong:has-text("${label}")`,
            (element) => element.nextSibling.textContent.trim()
        );

        await this.popoverClose.click();
        await this.popoverContent.waitFor({ state: 'detached' });
        return value;
    }

    async getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    async getValueByLabel(labelText) {
        const patterns = [
            `//label[normalize-space(text()) = "${labelText}"]/ancestor::div[contains(@class, "row")]//div[contains(@class, "col-sm-9")]`,

            `//label[normalize-space(text()) = "${labelText}"]/parent::div/following-sibling::div[contains(@class, "label-value")]`,

            `//label[normalize-space(text()) = "${labelText}"]/parent::div/following-sibling::div[contains(@class, "form-group")]`
        ];

        for (const xpath of patterns) {
            const el = this.page.locator(xpath);

            if (await el.count()) {
                return (await el.first().innerText()).trim();
            }
        }

        throw new Error(`Label "${labelText}" not found.`);
    }

}