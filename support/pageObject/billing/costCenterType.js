/**
 * @author Sheikh Faiyaz Mahamud
 * @since 15/06/2025
 */

export class CostCenterType {
    
    constructor(page) {
        this.page = page;
        this.txtTypeName = page.locator(`[name='typeName']`);
        this.txtCostCenterName = (index) => page.locator(`input[name="costCenterList[${index}].costCenterName"]`);
        this.txtCode = (index) => page.locator(`input[name="costCenterList[${index}].code"]`);
        this.txtIdNumber = (index) => page.locator(`input[name="costCenterList[${index}].idNumber"]`);
        this.chkActive = (index) => page.locator(`input[name="costCenterList[${index}].active"]`);
    }

    async fillUpCostCenterTypeForm(data) {
        await this.txtTypeName.fill(data.typeName);
    }

    async updateCostCenterTypeForm(data) {
        await this.txtTypeName.fill(data.updatedTypeName);
    }

    async fillOptions(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtCostCenterName(i).fill(data[i].costCenterName);
            await this.txtCode(i).fill(data[i].code);
            await this.txtIdNumber(i).fill(data[i].idNumber);
        }
    }
}