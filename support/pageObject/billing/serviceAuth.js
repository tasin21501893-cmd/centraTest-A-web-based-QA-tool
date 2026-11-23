/**
 * @author Sheikh Faiyaz Mahamud
 * @since 10/07/25
*/

import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class ServiceAuth {
    constructor(page) {
        this.page = page;
        this.btnIndividualIdType = page.locator(`#clientIdTypePickerBtn`);
        this.btnFundingSource = page.locator(`#fundingSourceIdPickerBtn`);
        this.txtAccountingNumber = page.locator(`[name='accountingNumber']`);
        this.dtpBeginDate = page.locator(`[name='beginDate']`);
        this.dtpEndDate = page.locator(`[name='endDate']`);
        this.firstSearchResultRow = page.locator('.dataTable tbody tr, #dataList tbody tr, table tbody tr').first();

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    /**
     * Extracts the Service Authorization Form ID (e.g. SA-XXXX-XXXX) from the first search result row in the list.
     * @returns {Promise<string>} Service Authorization Form ID
     */
    async extractServiceAuthFormId() {
        const rowText = await this.firstSearchResultRow.innerText();
        const match = rowText.match(/SA-[A-Z0-9-]+/);

        if (match) {
            return match[0];
        }
        throw new Error('Failed to find Service Authorization Form ID in the list');
    }

    async fillUpServiceAuthForm(data) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnIndividualIdType, data.indIdType);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnFundingSource, data.fundingSource);
        await this.dtpBeginDate.fill(data.beginDate);
        await this.dtpEndDate.fill(data.endDate);
        await this.commonButtons.clickButton('Add New Service');
    }

    async updateServiceAuthForm(data) {
        await this.txtAccountingNumber.fill(data.accountingNumber);
    }
}