/**
 * @author Sheikh Faiyaz Mahamud
 * @since 31/08/2026
 */

export class SearchInstitutionalClaim {
    constructor(page) {
        this.page = page;
        this.txtClaimId = page.locator('#claimId');
        this.dtpServiceDateFrom = page.locator('#serviceDateFrom');
        this.dtpServiceDateTo = page.locator('#serviceDateTo');
        this.dtpClaimCreateDateFrom = page.locator('#claimCreateDateFrom');
        this.dtpClaimCreateDateTo = page.locator('#claimCreateDateTo');
    }

    async searchInstitutionalClaimForm(instClaimId, data) {
        await this.txtClaimId.fill(instClaimId);
        await this.dtpClaimCreateDateFrom.clear();
        if (data.serviceDateFrom) { await this.dtpServiceDateFrom.fill(data.serviceDateFrom); }
        if (data.serviceDateTo) { await this.dtpServiceDateTo.fill(data.serviceDateTo); }
        if (data.claimCreateDateFrom) { await this.dtpClaimCreateDateFrom.fill(data.claimCreateDateFrom); }
        if (data.claimCreateDateTo) { await this.dtpClaimCreateDateTo.fill(data.claimCreateDateTo); }
    }
}
