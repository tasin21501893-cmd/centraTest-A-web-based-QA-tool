/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

export class GeneralSection {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.txtAssessmentDate = page.locator('[id="assessment.assessmentData.assessmentDate"]');
        this.txtNextAssessmentDate = page.locator('[id="assessment.assessmentData.nextAssessmentDate"]');

        this.errMsgAssessmentDate = page.locator('span[id="assessment.assessmentData.assessmentDate.errors"]');
        this.errMsgNextAssessmentDate = page.locator('span[id="assessment.assessmentData.nextAssessmentDate.errors"]');
    }

    async fillUpGeneralSection(assessmentDate, nextAssessmentDate) {
        await this.txtAssessmentDate.fill(assessmentDate);
        await this.txtNextAssessmentDate.fill(nextAssessmentDate);
    }

}