/**
 * @author Sheikh Faiyaz Mahamud
 * @since 12/11/2025
 */

import { CommonButtons } from "../../commonUtility/commonButtons";

export class ProfessionalClaim {

    constructor(page) {
        this.page = page;
        this.modal = page.locator('.modal-content');
        this.ddlPayer = page.locator(`[name='payerId']`);
        this.ddlBillingProvider = page.locator(`[name='billingProviderId']`);
        this.ddlRenderingProvider = page.locator(`[name='renderingProviderId']`);
        this.ddlPlaceOfService = page.locator(`[name='placeOfService']`);
        this.txtServiceDateFrom = page.locator(`[name='serviceDateFrom']`);
        this.txtServiceDateTo = page.locator(`[name='serviceDateTo']`);
        this.ddlServiceDescCode = page.locator(`[name='checkedDescCodeIds']`);

        this.commonButtons = new CommonButtons(page);
    }

    async fillUpProfessionalClaimForm(data) {
        await this.ddlPayer.selectOption(data.payer);
        await this.ddlBillingProvider.selectOption(data.billingProvider);
        await this.modal.waitFor({ state: 'visible', timeout: 5000 });
        await this.commonButtons.clickButton('No', this.modal);
        await this.ddlRenderingProvider.selectOption(data.renderingProvider);
        await this.ddlPlaceOfService.selectOption(data.placeOfService);
        await this.txtServiceDateFrom.fill(data.serviceDateFrom);
        await this.txtServiceDateTo.fill(data.serviceDateTo);
        await this.ddlServiceDescCode.selectOption(data.serviceDescCode);
        await this.commonButtons.clickButton('Next >>');
        await this.commonButtons.clickButton('All');
    }

    async confirmDelete() {
        const btnYes = this.page.locator('button.btn-prompt-yes');
        await btnYes.waitFor({ state: 'visible', timeout: 10000 });
        await btnYes.click({ noWaitAfter: true });
        await this.page.waitForLoadState();
    }
}