/**
 * @author Sheikh Faiyaz Mahamud
 * @since 21/05/25
*/

export class RevenueCode {

    constructor(page) {
        this.page = page;
        this.txtCode = this.page.locator(`[name='code']`);
        this.txtDescription = this.page.locator(`[name='description']`);
    }

    async fillUpRevenueCodeForm(data) {
        await this.txtCode.fill(data.code);
        await this.txtDescription.fill(data.description);
    }

    async updateRevenueCodeForm(data) {
        await this.txtCode.fill(data.updatedCode);
        await this.txtDescription.fill(data.updatedDescription);
    }
}