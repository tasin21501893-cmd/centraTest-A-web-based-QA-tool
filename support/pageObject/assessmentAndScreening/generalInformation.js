/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

export class GeneralInformation {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ddlAssessmentType = page.locator('[id="assessment\\.assessmentData\\.type"]');
        this.ddlAssessmentVersion = page.locator('#assessment\\.assessmentData\\.assessmentVersion');
        this.txtAssessmentDate = page.locator('#assessment\\.assessmentData\\.assessmentDate');

        this.errMsgAssessmentType = page.locator('span[id="assessment.assessmentData.type.errors"]');
        this.errMsgAssessmentVersion = page.locator('span[id="assessment.assessmentData.assessmentVersion.errors"]');
        this.errMsgAssessmentDate = page.locator('span[id="assessment.assessmentData.assessmentDate.errors"]');
    }

    async fillUpGeneralInfoSection(assessmentType, assessmentVersion, assessmentDate) {
        await this.ddlAssessmentType.selectOption(assessmentType);
        await this.ddlAssessmentVersion.selectOption(assessmentVersion);
        await this.txtAssessmentDate.fill(assessmentDate);
    }

}