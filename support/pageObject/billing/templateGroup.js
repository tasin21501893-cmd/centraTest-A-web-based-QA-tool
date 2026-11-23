/**
 * @author MD. Tabiul Hasan
 * @since 01/07/2026
 */

export class TemplateGroup {

    constructor(page) {
        this.page = page;
        this.txtName = page.locator(`[name='name']`);
        this.txtDescription = page.locator(`[name='description']`);
        this.rdoClaimTypeProf = page.locator('#claimType1');
        this.rdoClaimTypeInst = page.locator('#claimType2');
    }

    async fillUpTemplateGroupForm(data) {
        await this.txtName.fill(data.name);
        await this.txtDescription.fill(data.description);
        if (data.claimType.toLowerCase() === 'professional') {
            await this.rdoClaimTypeProf.click();
        } else if (data.claimType.toLowerCase() === 'institutional') {
            await this.rdoClaimTypeInst.click();
        }
    }

    async updateTemplateGroupForm(data) {
        await this.txtName.fill(data.updatedName);
        await this.txtDescription.fill(data.updatedDescription);
    }

    async selectItem(itemName) {
        await this.page.getByText(itemName).first().click();
    }
}