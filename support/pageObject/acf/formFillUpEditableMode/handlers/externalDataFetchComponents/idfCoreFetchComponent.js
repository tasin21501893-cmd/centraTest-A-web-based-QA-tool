/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { BaseExternalDataFetchComponent } from "./baseExternalDataFetchComponent";

export class IdfCoreFetchComponent extends BaseExternalDataFetchComponent {

    async fetchData(child) {
        const childCode = child.code || child.itemKey;

        if (!childCode) {
            throw new Error('IdfCoreFetchComponent: child.code or child.itemKey is required');
        }

        const fetchButton = this.page.locator(`#item-${childCode}`).locator('text=Fetch');
        await fetchButton.click();
    }
}