/**
 * @author Kashshaf Mahbub sakif
 * @since 30/12/2025
 */

export class WriteOffReason {

    constructor(page) {
        this.page = page;
        this.txtCode = page.locator('[name="code"]');
        this.txtDescription = page.locator('[name="description"]');
        this.txtGLSegment = page.locator('[name="glSegment"]');
    }

    async fillUpWriteOffReasonForm(data) {
        await this.txtCode.fill(data.code);
        await this.txtDescription.fill(data.description);
        await this.txtGLSegment.fill(data.glSegment);
    }

    async updateWriteOffReasonForm(data) {
        await this.txtDescription.fill(data.updatedDescription);
        await this.txtGLSegment.fill(data.updatedGLSegment);
    }
}