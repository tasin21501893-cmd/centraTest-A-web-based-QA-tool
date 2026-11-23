/**
 * @author Sheikh Faiyaz Mahamud
 * @since 31/08/2026
 */

import { CommonButtons } from "../../commonUtility/commonButtons.js";
import { CommonUtils } from "../../commonUtility/commonUtils.js";

export class InstitutionalClaim {

    constructor(page) {
        this.page = page;
        this.btnServiceDescCode = page.locator('#descCodeFormIdListPickerBtn');
        this.rdoTemplateGroupYes = page.locator('#type1');
        this.rdoTemplateGroupNo = page.locator('#type2');
        this.btnTemplateGroupName = page.locator('#groupFormIdPickerBtn');
        this.dtpServiceDateFrom = page.locator('#serviceDateFrom');
        this.dtpServiceDateTo = page.locator('#serviceDateTo');
        this.chkAddOneServiceLinePerClaim = page.locator('#singleServiceLinePerClaim');
        this.btnPromptYes = page.locator('button.btn-prompt-yes');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    async fillUpInstitutionalClaimForm(data) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnServiceDescCode, data.serviceDescCode);

        await this.dtpServiceDateFrom.fill(data.serviceDateFrom);
        await this.dtpServiceDateTo.fill(data.serviceDateTo);

        const isTemplateGroup = data.templateGroup && data.templateGroup.trim().toLowerCase() === 'yes';
        if (isTemplateGroup) {
            await this.rdoTemplateGroupYes.click();
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnTemplateGroupName, data.templateGroupName);
        } else {
            await this.rdoTemplateGroupNo.click();
        }

        if (data.singleServiceLinePerClaim.trim().toLowerCase() === 'yes') {
            await this.chkAddOneServiceLinePerClaim.click();
        }
    }

    async confirmDelete() {
        await this.btnPromptYes.waitFor({ state: 'visible', timeout: 10000 });
        await this.btnPromptYes.click({ noWaitAfter: true });
        await this.page.waitForLoadState();
    }
}
