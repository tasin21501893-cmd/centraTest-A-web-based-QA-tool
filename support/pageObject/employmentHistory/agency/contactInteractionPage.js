/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

export class ContactInteractionPage {

    constructor(page) {
        this.page = page;
        this.ddlContactPerson = this.page.locator("[name='contactPerson']");
        this.dtpContactDate = this.page.locator("[name='contactDate']");
        this.txtContactedBy = this.page.locator("[name='doneBy']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgContactPerson = this.page.locator("[id='contactPerson.errors']");
        this.errMsgContactDate = this.page.locator("[id='contactDate.errors']");
        this.errMsgContactedBy = this.page.locator("[id='doneBy.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");
    }

    async fillUpForm(data) {
        await this.page.waitForLoadState('domcontentloaded');
        data.contactPerson && await this.ddlContactPerson.selectOption(data.contactPerson);
        data.contactDate && await this.dtpContactDate.fill(data.contactDate);
        data.contactedBy && await this.txtContactedBy.fill(data.contactedBy);
        data.comments && await this.txtComments.fill(data.comments);
    }
}