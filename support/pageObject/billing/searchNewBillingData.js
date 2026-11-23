/**
 * @author Sheikh Faiyaz Mahamud
 * @since 24/06/2026
 */

export class SearchNewBillingData {
    constructor(page) {
        this.page = page;
        this.txtAuthorizationId = page.locator('#authorizationId');
        this.btnSearch = page.locator("input[name='_action_search']");
        this.dtpEndDateFrom = page.locator('#endDateFrom');
        this.firstRow = page.locator('#dataList tbody tr, .dataTable tbody tr').locator('visible=true').first();
    }

    async fillSearchServiceForNewBillingData(serviceAuthFormID) {
        await this.txtAuthorizationId.waitFor({ state: 'visible', timeout: 5000 });
        await this.txtAuthorizationId.fill(serviceAuthFormID);
        await this.dtpEndDateFrom.clear();
    }

    async clickFirstResultRow() {
        await this.firstRow.waitFor({ state: 'visible', timeout: 5000 });
        await this.firstRow.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
    }
}
