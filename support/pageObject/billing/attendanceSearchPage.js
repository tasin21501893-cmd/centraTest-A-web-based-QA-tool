/**
 * @author Sheikh Faiyaz Mahamud
 * @since 04/09/25
 */

export class AttendanceSearchPage {

    constructor(page) {
        this.page = page;
        this.dtpStartDate = page.locator(`[name='startDate']`);
        this.dtpEndDate = page.locator(`[name='endDate']`);
        this.txtIndividual = page.locator(`#clientLookup`);
        this.individualDropdownOption = page.locator(`.ui-menu-item > .ui-menu-item-wrapper:visible`);
        this.ddlServiceDescriptionCode = page.locator(`[name='serviceDescCodeId']`);
        this.ddlProgram = page.locator(`[name='programId']`);
        this.ddlAttendanceType = page.locator(`[name='attTypeId']`);
        this.ddlServiceAuthorizationStatus = page.locator(`[name='serviceAuthStatus']`);
    }

    async fillUpAttendanceSearchPage(data) {
        await this.dtpStartDate.fill(data.startDate);
        if (data.endDate) await this.dtpEndDate.fill(data.endDate);
        await this.txtIndividual.focus();
        await this.txtIndividual.pressSequentially(data.individual, { delay: 100 });
        await this.individualDropdownOption.first().waitFor({ state: 'visible', timeout: 5000 });
        await this.individualDropdownOption.first().click();
        await this.ddlServiceDescriptionCode.selectOption(data.serviceDescriptionCode);
        await this.ddlProgram.selectOption(data.program);
        await this.ddlAttendanceType.selectOption(data.attendanceType);
    }
}
