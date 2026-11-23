/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { BaseExternalDataFetchComponent } from "./baseExternalDataFetchComponent";

export class IndividualCarePlanFetchComponent extends BaseExternalDataFetchComponent {

    async handleCheckBox(child) {
        const checkboxes = this.page.locator('tbody .form-check-input');
        const checkboxCount = await checkboxes.count();
        const childMaxLimit = child.maxLimit;

        if ((childMaxLimit === 0) || (childMaxLimit > checkboxCount)) {
            await this.page.locator('#select-all-cp').click();

        } else if (childMaxLimit <= checkboxCount) {
            for (let i = 0; i < childMaxLimit; i++) {
                await checkboxes.nth(i).click();
            }
        }
    }

    async handleFetchGenericTabular(child) {
        let checkVisibilityOfStartDateFromField = await this.page.locator('[data-testid="START_DATE_FROM"]').count();
        if (checkVisibilityOfStartDateFromField > 0) {
            await this.page.locator('[data-testid="START_DATE_FROM"]').fill("");
            await this.page.locator('[data-testid="START_DATE_TO"]').fill("");

            await this.page.locator('[data-testid="END_DATE_FROM"]').fill("");
            await this.page.locator('[data-testid="END_DATE_TO"]').fill("");

            await this.page.getByRole('button', { name: 'Search' }).click();
            await this.page.waitForTimeout(1000);
            let selectAllCheckBoxCount = await this.page.locator('#select-all-cp').count();

            if (selectAllCheckBoxCount > 0) {
                await this.handleCheckBox(child);
                await this.page.getByRole('button', { name: 'Confirm' }).click();
            }
        }
    }

    async fetchData(child) {
        const childCode = child.code || child.itemKey;

        if (!childCode) {
            throw new Error('IndividualCarePlanFetchComponent: child.code or child.itemKey is required');
        }

        const fetchButton = this.page.locator(`#item-${childCode}`).locator('text=Fetch');
        await fetchButton.click();

        await this.page.waitForTimeout(1000);
        const modalVisible = await this.page.getByText('External Data Fetch').isVisible();
        if (!modalVisible) {
            return;
        }

        if (child.type === "Q_GENERIC_TABULAR") {
            await this.handleFetchGenericTabular(child)
        }
    }
}