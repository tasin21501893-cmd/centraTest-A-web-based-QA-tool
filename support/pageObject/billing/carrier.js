/**
 * @author Sheikh Faiyaz Mahamud
 * @since 26/05/25
*/

export class Carrier {
    
    constructor(page) {
        this.page = page;
        this.txtName = page.locator(`[name='name']`);
        this.txtCode = page.locator(`[name='code']`);
        this.ddlInsuranceType = page.locator("[name='insuranceType']");
    }

    async fillUpCarrierForm(data) {
        await this.txtName.fill(data.name);
        await this.txtCode.fill(data.code);
        await this.ddlInsuranceType.selectOption(data.insuranceType);
    }

    async updatedCarrierForm(data) {
        await this.txtName.fill(data.updatedName);
    }
}