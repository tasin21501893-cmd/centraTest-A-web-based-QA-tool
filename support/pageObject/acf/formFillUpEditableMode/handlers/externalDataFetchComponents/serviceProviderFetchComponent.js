/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { BaseExternalDataFetchComponent } from "./baseExternalDataFetchComponent";

export class ServiceProviderFetchComponent extends BaseExternalDataFetchComponent {

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
        await this.page.waitForTimeout(500);
        await this.page.getByTestId('CODE').fill('');
        await this.page.getByTestId('NAME').fill('');
        await this.page.getByTestId('MPD_TH_PROV_CODE').fill('');

        await this.page.getByRole('button', { name: 'Search' }).click();
        let selectAllCheckBoxCount = await this.page.locator('#select-all-cp').count();
        await this.page.waitForTimeout(1000);

        if (selectAllCheckBoxCount > 0) {
            await this.handleCheckBox(child)
            await this.page.getByRole('button', { name: 'Confirm' }).click();

        } else {
            await this.page.getByLabel('Close').click();
        }
    }

    async fetchData(child) {
        const childCode = child.code || child.itemKey;

        if (!childCode) {
            throw new Error('ServiceProviderFetchComponent: child.code or child.itemKey is required');
        }

        const fetchButton = this.page.locator(`#item-${childCode}`).locator('text=Fetch');
        await fetchButton.click();

        await this.commonUtils.waitForChangeInDOM('div.modal.show .table-responsive', { timeout: 1500 });
        const modalVisible = await this.page.getByText('External Data Fetch').isVisible();
        if (!modalVisible) {
            return;
        }

        if (child.type === "Q_GENERIC_TABULAR") {
            await this.handleFetchGenericTabular(child);

        } else {
            await this.page.waitForTimeout(500);
            await this.page.getByTestId('CODE').fill('');
            await this.page.getByTestId('NAME').fill('');
            await this.page.getByTestId('MPD_TH_PROV_CODE').fill('');

            await this.page.getByRole('button', { name: 'Search' }).click();

            if (await this.page.getByRole('cell', { name: 'No data found' }).count() == 0) {
                await this.page.locator('input[name="0"]').click();

            } else {
                await this.page.getByLabel('Close').click();
            }
        }
    }
}