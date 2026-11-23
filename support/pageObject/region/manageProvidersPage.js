/**
 * @author Tarikul Islam
 * @since 10/01/25
*/

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class ManageProvidersPage {

    constructor(page) {
        this.page = page;
        this.assignableProvidersFilterField = page.locator('[id="dt-search-1"]');
        this.utils = new CommonUtils(this.page);
    }

    async assignProviderToRegion(linkedProviderCodes) {
        const linkedProviderList = linkedProviderCodes.split(",");

        for (const provider of linkedProviderList) {
            const trimmedProvider = provider.trim();

            const isNoAssignableProvidersDisplayed = await this.utils.isElementAvailable(
                this.page.locator(".empty-table-message", {
                    hasText: /No assignable Provider\(s\)!/
                })
            );

            if (isNoAssignableProvidersDisplayed) {
                console.log('No selectable Provider found!');
                break;
            }

            await this.assignableProvidersFilterField.waitFor();

            if (await this.utils.isElementAvailable(this.assignableProvidersFilterField)) {
                await this.assignableProvidersFilterField.fill("");
                await this.assignableProvidersFilterField.fill(trimmedProvider);

                const rowSelector = this.page.locator("tbody tr", {
                    has: this.page.locator("td", {
                        hasText: new RegExp(`^${trimmedProvider}$`)
                    })
                });

                // Fail safe if row does not appear
                await rowSelector.first().waitFor({ timeout: 1000 }).catch(() => {
                    console.log(`Timed out waiting for provider row: '${trimmedProvider}'`);
                });

                const lnkAdd = rowSelector.getByRole("link", { name: "Add" });

                if (await this.utils.isElementAvailable(lnkAdd)) {
                    await lnkAdd.click();

                    await expect(lnkAdd).toHaveCount(0);
                }
                else {
                    console.log(`Provider '${trimmedProvider}' does not exist!`);
                }
            }
        }
    }
}