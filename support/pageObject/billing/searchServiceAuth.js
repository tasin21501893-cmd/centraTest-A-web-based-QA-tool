/**
 * @author Sheikh Faiyaz Mahamud
 * @since 22/06/2026
 */

export class SearchServiceAuth {

    constructor(page) {
        this.page = page;
        this.lnkNewSearch = page.getByRole('link', { name: 'New Search' });
        this.btnFundingSourcePicker = page.locator('#fundingSourcePickerBtn');
        this.txtFundingSourceSearchInput = page.locator('.th-sp-container').filter({ has: page.locator('#fundingSourcePickerBtn') }).locator('input.search-input');
        this.dtpBeginDateFrom = page.locator('#beginDateFrom');
        this.dtpBeginDateTo = page.locator('#beginDateTo');
        this.dtpEndDateFrom = page.locator('#endDateFrom');
        this.dtpEndDateTo = page.locator('#endDateTo');
        this.txtServiceCode = page.locator('#serviceCode');
        this.txtServiceDesc = page.locator('#serviceDesc');
        this.ddlMethodOfDataCollection = page.locator('#dataCollectionMethodPickerBtn');
        this.methodOfDataCollectionSearchInput = page.locator('.th-sp-container').filter({ has: page.locator('#dataCollectionMethodPickerBtn') }).locator('input.search-input');
        this.txtIndividual = page.locator('#clientLookup');
        this.firstVisibleMenuItem = page.locator('.ui-menu-item > .ui-menu-item-wrapper:visible');
    }

    async selectOptionFromContainer(pickerLocator, optionName) {
        const option = this.page.locator('.th-sp-container').filter({ has: pickerLocator }).getByRole('option', { name: optionName, exact: true });
        await option.click();
    }

    async fillUpSearchForm(data) {
        const individualVal = data.individual || data.client;

        if (individualVal) {
            await this.txtIndividual.focus();
            await this.txtIndividual.pressSequentially(individualVal, { delay: 100 });
            await this.firstVisibleMenuItem.first().click();
        }

        if (data.fundingSource) {
            await this.btnFundingSourcePicker.click();
            await this.txtFundingSourceSearchInput.waitFor({ state: 'visible', timeout: 5000 });
            await this.txtFundingSourceSearchInput.fill(data.fundingSource);
            await this.selectOptionFromContainer(this.btnFundingSourcePicker, data.fundingSource);
        }

        if (data.beginDate) {
            await this.dtpBeginDateFrom.fill(data.beginDate);
            await this.dtpBeginDateTo.fill(data.beginDate);
        }

        if (data.endDate) {
            await this.dtpEndDateFrom.fill(data.endDate);
            await this.dtpEndDateTo.fill(data.endDate);
        }

        if (data.serviceCode) {
            await this.txtServiceCode.fill(data.serviceCode);
        }

        if (data.serviceDescription) {
            await this.txtServiceDesc.fill(data.serviceDescription);
        }

        const methodVal = data.methodOfDataCollection || data.dataCollectionMethod;

        if (methodVal) {
            await this.ddlMethodOfDataCollection.click();

            const methodsArray = Array.isArray(methodVal)
                ? methodVal
                : typeof methodVal === 'string'
                    ? methodVal.split(',').map(item => item.trim())
                    : [methodVal];

            for (const method of methodsArray) {
                await this.methodOfDataCollectionSearchInput.fill(method);
                await this.selectOptionFromContainer(this.ddlMethodOfDataCollection, method);
            }
            await this.ddlMethodOfDataCollection.click();
        }
    }
}
