/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { BaseExternalDataFetchComponent } from "./baseExternalDataFetchComponent";

export class IdfDetailFetchComponent extends BaseExternalDataFetchComponent {

    async fetchData(child) {
        const childCode = child.code || child.itemKey;

        if (!childCode) {
            throw new Error('IdfDetailFetchComponent: child.code or child.itemKey is required');
        }

        const fetchButton = this.page.locator(`#item-${childCode}`).locator('text=Fetch');
        await fetchButton.click();
    }
}