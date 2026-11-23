/**
 * @author Sheikh Faiyaz Mahamud
 * @since 12/11/2025
 */

import { CommonButtons } from "../../commonUtility/commonButtons";

export class ClaimSubmission {

    constructor(page) {
        this.page = page;
        this.ddlPayer = page.locator(`[name='payer']`);
        this.txtIndividual = page.locator('#clientLookup');
        this.txtServiceDateFrom = page.locator(`[name='serviceDateFrom']`);
        this.txtServiceDateTo = page.locator(`[name='serviceDateTo']`);
        this.txtClaimFrequencyTypeCode = page.locator(`[name='claimFreqTypeCode']`);

        this.commonButtons = new CommonButtons(page);
    }

    async selectIndividual(individual) {
        await this.txtIndividual.click();
        await this.txtIndividual.fill(individual);
        await this.page.waitForTimeout(500);
        await this.txtIndividual.press('ArrowDown');
        await this.txtIndividual.press('Enter');
    }

    async fillUpClaimSubmissionForm(data) {
        await this.ddlPayer.selectOption(data.payer);
        await this.selectIndividual(data.individual);
        await this.txtServiceDateFrom.fill(data.serviceDateFrom);
        await this.txtServiceDateTo.fill(data.serviceDateTo);
        await this.txtClaimFrequencyTypeCode.selectOption(data.claimFreqTypeCode);
    }
}