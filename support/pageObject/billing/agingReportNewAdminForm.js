/**
 * @author Kashshaf Mahbub sakif
 * @since 01/07/2025
 */

export class AgingReportNewAdminForm {

    constructor(page) {
        this.page = page;
        this.ddlInitialPostingDateType = page.locator('[name="initialPostingDateType"]');
    }

    async fillUpAgingReportNewAdminForm(optionStr) {
        await this.ddlInitialPostingDateType.selectOption(optionStr);
    }
}