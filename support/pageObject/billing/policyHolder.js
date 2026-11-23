/**
 * @author Sheikh Faiyaz Mahamud
 * @since 16/06/2025
 */

export class PolicyHolder {

    constructor(page) {
        this.page = page;
        this.ddlIndividualName = page.locator(`[name='clientId']`);
        this.ddlCarrier = page.locator(`[name='carrierId']`);
        this.txtGroupNumber = page.locator(`[name='groupNumber']`);
        this.ddlRelationship = page.locator(`[name='relationship']`);
        this.txtLastName = page.locator(`[name='lastName']`);
        this.txtFirstName = page.locator(`[name='firstName']`);
        this.txtPolicyNumber = page.locator(`[name='policyNumber']`);
        this.txtAddress1 = page.locator(`[name='address1']`);
        this.txtCity = page.locator(`[name='city']`);
        this.ddlState = page.locator(`[name='state']`);
        this.txtZip = page.locator(`[name='zip']`);
    }

    async fillUpPolicyHolderForm(data) {
        await this.ddlIndividualName.selectOption(data.individualName);
        await this.ddlCarrier.selectOption(data.carrier);
        await this.txtGroupNumber.fill(data.groupNumber);
        await this.ddlRelationship.selectOption(data.relationship);
        await this.txtLastName.fill(data.lastName);
        await this.txtFirstName.fill(data.firstName);
        await this.txtPolicyNumber.fill(data.policyNumber);
        await this.txtAddress1.fill(data.address1);
        await this.txtCity.fill(data.city);
        await this.ddlState.selectOption(data.state);
        await this.txtZip.fill(data.zip);
    }

    async updatePolicyHolderForm(data) {
        await this.txtGroupNumber.fill(data.updatedGroupNumber);
        await this.txtLastName.fill(data.updatedLastName);
    }
}