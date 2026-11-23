/**
 * @author Sheikh Faiyaz Mahamud
 * @since 03/08/2026
 */
import { CommonButtons } from "../../commonUtility/commonButtons.js";

export class SearchBillingData {

    constructor(page) {
        this.page = page;
        this.txtProgram = page.locator('#programLookup');
        this.txtIndividual = page.locator('#clientLookup');
        this.txtAuthorizationId = page.locator('#authorizationId');
        this.txtFundingSource = page.locator('#fundingSource');
        this.dtpBeginDateFrom = page.locator('#beginDateFrom');
        this.dtpBeginDateTo = page.locator('#beginDateTo');
        this.dtpEndDateFrom = page.locator('#endDateFrom');
        this.dtpEndDateTo = page.locator('#endDateTo');
        this.txtServiceCode = page.locator('#serviceCode');
        this.txtServiceDesc = page.locator('#serviceDesc');
        this.dtpServiceDateFrom = page.locator('#serviceDateFrom');
        this.dtpServiceDateTo = page.locator('#serviceDateTo');
        this.dtpCreateDateFrom = page.locator('#createDateFrom');
        this.ddlMethodOfDataCollection = page.locator('#dataCollectionMethodPickerBtn');
        this.firstRow = page.locator('#dataList tbody tr, .dataTable tbody tr').locator('visible=true').first();

        this.commonButtons = new CommonButtons(page);
    }

    getServiceDates(serviceDateFrom, serviceDateTo) {
        const dates = [];
        const current = new Date(serviceDateFrom);
        const end = new Date(serviceDateTo);

        while (current <= end) {
            dates.push(
                `${String(current.getMonth() + 1).padStart(2, '0')}/` +
                `${String(current.getDate()).padStart(2, '0')}/` +
                `${current.getFullYear()}`
            );

            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    async selectIndividual(ind) {
        await this.txtIndividual.click();
        await this.txtIndividual.fill(ind);
        await this.page.locator('.ui-menu-item:visible').first().waitFor();
        await this.txtIndividual.press('ArrowDown');
        await this.txtIndividual.press('Enter');
    }

    async selectProgram(prog) {
        await this.txtProgram.click();
        await this.txtProgram.fill(prog);
        await this.page.locator('.ui-menu-item:visible').first().waitFor();
        await this.txtProgram.press('ArrowDown');
        await this.txtProgram.press('Enter');
    }

    async clickFirstResultRow() {
        await this.firstRow.waitFor({ state: 'visible', timeout: 5000 });
        await this.firstRow.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchBillingDataForm(data, serviceDateFrom) {
        if (data.program) { await this.selectProgram(data.program); }
        if (data.individual) { await this.selectIndividual(data.individual); }
        if (data.fundingSource) { await this.txtFundingSource.fill(data.fundingSource); }
        if (data.serviceAuthBeginDate) {
            await this.dtpBeginDateFrom.fill(data.serviceAuthBeginDate);
            await this.dtpBeginDateTo.fill(data.serviceAuthBeginDate);
        }
        if (data.serviceAuthEndDate) {
            await this.dtpEndDateFrom.fill(data.serviceAuthEndDate);
            await this.dtpEndDateTo.fill(data.serviceAuthEndDate);
        }
        if (data.serviceCode) { await this.txtServiceCode.fill(data.serviceCode); }
        if (data.serviceDesc) { await this.txtServiceDesc.fill(data.serviceDesc); }
        if (serviceDateFrom) {
            await this.dtpServiceDateFrom.fill(serviceDateFrom);
            await this.dtpServiceDateTo.fill(serviceDateFrom);
        }
        await this.dtpCreateDateFrom.clear();
        if (data.methodOfDataCollection) {
            await this.ddlMethodOfDataCollection.click();
            await this.page.getByText(data.methodOfDataCollection, { exact: true }).click();
        }
    }
}