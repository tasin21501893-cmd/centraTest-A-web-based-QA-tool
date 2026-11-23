/**
 * @author Sheikh Faiyaz Mahamud
 * @since 02/06/2025
 */

export class DailySupervisedIra {

    constructor(page) {
        this.page = page;
        this.ddlServiceDescriptionCode = page.locator('[name="descCodeId"]');
        this.ddlAttendanceTypeName = page.locator('[name="attTypeId"]');

        this.txtFaceToFaceCount = (index) => page.locator(`input[name="resHabAttendanceOptionSettingsList[${index}].faceToFaceCount"]`);
        this.txtRateCode = (index) => page.locator(`input[name="resHabAttendanceOptionSettingsList[${index}].rateCode"]`);
        this.txtRateValue = (index) => page.locator(`input[name="resHabAttendanceOptionSettingsList[${index}].rateValue"]`);
    }

    async fillUpDailySupervisedIraForm(data) {
        await this.ddlServiceDescriptionCode.selectOption(data.descriptionCode);
        await this.ddlAttendanceTypeName.selectOption(data.attendanceType);
    }

    async fillOptions(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtFaceToFaceCount(i).fill(data[i].faceToFaceData);
            await this.txtRateCode(i).fill(data[i].rateCode);
            await this.txtRateValue(i).fill(data[i].rateValue);
        }
    }

    async updateOptions(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtFaceToFaceCount(i).fill(data[i].updatedFaceToFaceData);
            await this.txtRateValue(i).fill(data[i].updatedRateValue);
        }
    }
}