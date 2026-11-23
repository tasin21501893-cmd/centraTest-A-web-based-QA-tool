/**
 * @author Ishraq Ahmed Esha
 * @since 01/11/2026
 */

export class TradingPartner {

    constructor(page) {
        this.page = page;
        this.ddlPayer = page.locator('select[name="payerId"]');
        this.txtIdNumber = page.locator('input[name="idNumber"]');
        this.txtName = page.locator('input[name="name"]');
        this.txtInterchangeSenderId = page.locator('input[name="interchangeSenderId"]');
        this.txtAppSenderCode = page.locator('input[name="applicationSenderCode"]');
        this.txtContactName = page.locator('input[name="contactName"]');
        this.txtPhone = page.locator('input[name="contactPhone"]');
        this.txtEmail = page.locator('input[name="contactEmail"]');
    }

    async fillUpTradingPartnerForm(data) {
        await this.ddlPayer.selectOption(data.payer);
        await this.txtIdNumber.fill(data.idNumber);
        await this.txtName.fill(data.name);
        await this.txtInterchangeSenderId.fill(data.interchangeSenderId);
        await this.txtAppSenderCode.fill(data.appSenderCode);
        await this.txtContactName.fill(data.contactName);
        await this.txtPhone.fill(data.phone);
        await this.txtEmail.fill(data.email);
    }

    async updateTradingPartnerForm(data) {
        await this.txtContactName.fill(data.updatedContactName);
        await this.txtPhone.fill(data.updatedPhone);
    }
}