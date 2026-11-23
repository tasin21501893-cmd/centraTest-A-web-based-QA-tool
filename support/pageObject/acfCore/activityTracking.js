/**
 * @author Maksuda Islam (Lima)
 * @since 01/02/2025
 */

import { expect } from '@playwright/test';

export class ActivityTrackingPage {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlModule = page.locator('[data-id="module"]');
        this.ddlAction = page.locator('[data-id="moduleAction"]');
        this.tblRowActivityTracking = page.locator('#dataList tbody tr');
    }

    async selectModule(module) {
        await this.ddlModule.click();
        await this.page.getByRole('listbox').getByRole('option', { name: `${module}`, exact: true }).click();
    }

    async selectAction(action) {
        await this.ddlAction.click();
        await this.page.getByRole('listbox').getByRole('option', { name: `${action}`, exact: true }).click();
    }

    async ValidateActivityTrackingTable(loginName, expectedModule, action, formID, expectedComment, expectedRequestSourceText, timeZone) {
        const rows = this.tblRowActivityTracking;
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);

            const loginNameText = await row.locator('td:nth-child(2)').textContent();
            expect.soft(loginNameText?.trim()).toBe(loginName);

            const moduleText = await row.locator('td:nth-child(5)').textContent();
            expect.soft(moduleText?.trim()).toBe(expectedModule);

            const actionText = await row.locator('td:nth-child(6)').textContent();
            expect.soft(actionText?.trim()).toBe(action);

            const formIDText = await row.locator('td:nth-child(8)').textContent();
            expect.soft(formIDText?.trim()).toBe(formID);

            const commentText = await row.locator('td:nth-child(11)').textContent();
            expect.soft(commentText?.trim()).toBe(expectedComment);

            const requestSourceText = await row.locator('td:nth-child(12)').textContent();
            expect.soft(requestSourceText?.trim()).toBe(expectedRequestSourceText);

            const timeZoneText = await row.locator('td:nth-child(13)').textContent();
            expect.soft(timeZoneText?.trim()).toBe(timeZone);
        }
    }
}