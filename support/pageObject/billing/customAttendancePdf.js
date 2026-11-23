/**
 * @author Sheikh Faiyaz Mahamud
 * @since 18/05/25
*/

import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class CustomAttendancePdf {

    constructor(page) {
        this.page = page;
        this.txtPdfName = this.page.locator(`[name='name']`);
        this.txtHeader = this.page.locator(`[name='header']`);
        this.txtSubheader = this.page.locator(`[name='subheader']`);
        this.txtTitle = this.page.locator(`[name='title']`);
        this.txtFooter = this.page.locator(`[name='footer']`);
        this.chkShowTotalUnitsInfo = this.page.locator(`[name='showTotalUnitsInfo']`);
        this.chkShowMedicaidNumber = this.page.locator(`[name='showMedicaidNumber']`);
        this.chkShowIndividualMiddleName = this.page.locator(`[name='showIndividualMiddleName']`);

        this.commonUtils = new CommonUtils(page);
    }

    async checkShowTotalUnitsColumnRow(option) {
        if (option.trim().toLowerCase() === 'yes') {
            if (!await this.chkShowTotalUnitsInfo.isChecked()) {
                await this.chkShowTotalUnitsInfo.check();
            }
        }
    }

    async checkAlwaysShowMedicaidNumber(option) {
        if (option.trim().toLowerCase() === 'yes') {
            await this.chkShowMedicaidNumber.check();
        }
    }

    async checkShowIndividualMiddleName(option) {
        if (option.trim().toLowerCase() === 'yes') {
            if (!await this.chkShowIndividualMiddleName.isChecked()) {
                await this.chkShowIndividualMiddleName.check();
            }
        }
    }

    async fillUpCustomAttendancePdfForm(data) {
        await this.txtPdfName.fill(data.pdfName);
        await this.txtHeader.fill(data.header);
        await this.txtSubheader.fill(data.subheader);
        await this.txtTitle.fill(data.title);
        await this.txtFooter.fill(data.footer);
        await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Show Total Units Column/Row', data.showTotalUnitsInfo);
        await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Always Show Medicaid Number', data.showMedicaidNumber);
        await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Show Individual Middle Name', data.showIndividualMiddleName);
    }

    async updateCustomAttendancePdfForm(data) {
        await this.txtPdfName.fill(data.pdfNameUpdated);
        await this.txtHeader.fill(data.headerUpdated);
    }
}