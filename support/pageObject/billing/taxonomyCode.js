/**
 * @author Sheikh Faiyaz Mahamud
 * @since 25/05/25
*/

export class TaxonomyCode {

    constructor(page) {
        this.page = page;
        this.txtTaxonomyCode = page.locator(`[name='code']`);
        this.txtDescription = page.locator(`[name='description']`);
    }

    async fillUpTaxonomyCodeForm(data) {
        await this.txtTaxonomyCode.fill(data.taxonomyCode);
        await this.txtDescription.fill(data.description);
    }

    async updateTaxonomyCodeForm(data) {
        await this.txtDescription.fill(data.updatedDescription);
    }
}