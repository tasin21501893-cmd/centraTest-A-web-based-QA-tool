/**
 * @author Rifat Ara
 * @since 02/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { DeLabels } from '../utility/deLabels.js';

export class DeDddsConsentForPhi {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.#initLocators();
	}

	async fillPhiConsent(data) {
		await this.fillOrganizationInfo(data);
		await this.fillReportSection(data);
		await this.commonButtons.clickButton(DeLabels.SAVE_AND_NEXT);
	}

	async fillOrganizationInfo(data) {
		if (data.dddsOrganizationName) {
			await this.commonUtils.selectBootstrapCustomDropdown(this.ddlDddsOrganizationName, data.dddsOrganizationName);
		}

		data.vrLocation && await this.txtVrLocation.fill(data.vrLocation);
		data.otherOrganizationName && await this.txtOtherOrganizationName.fill(data.otherOrganizationName);
		data.otherOrganizationContactInfo &&
			await this.txtOtherOrganizationContactInfo.fill(data.otherOrganizationContactInfo);

		if (CommonUtils.isAffirmative(data.studyingInCurrentSchool)) {
			await this.commonUtils.toggleCheckboxUsingLocator(
				this.page,
				this.chkStudyingInCurrentSchool,
				data.studyingInCurrentSchool,
			);
			data.currentSchoolName && await this.txtCurrentSchoolName.fill(data.currentSchoolName);
			data.currentSchoolCity && await this.txtCurrentSchoolCity.fill(data.currentSchoolCity);
			data.currentSchoolState && await this.ddlCurrentSchoolState.selectOption({ label: data.currentSchoolState });
		}

		if (CommonUtils.isAffirmative(data.studyingInFormerSchool)) {
			await this.commonUtils.toggleCheckboxUsingLocator(
				this.page,
				this.chkStudyingInFormerSchool,
				data.studyingInFormerSchool,
			);
			data.formerSchoolName && await this.txtFormerSchoolName.fill(data.formerSchoolName);
			data.formerSchoolCity && await this.txtFormerSchoolCity.fill(data.formerSchoolCity);
			data.formerSchoolState && await this.ddlFormerSchoolState.selectOption({ label: data.formerSchoolState });
			data.formerSchoolStartDate && await this.dtpFormerSchoolStartDate.fill(data.formerSchoolStartDate);
			data.formerSchoolEndDate && await this.dtpFormerSchoolEndDate.fill(data.formerSchoolEndDate);
		}
	}

	async fillReportSection(data) {
		if (CommonUtils.isAffirmative(data.selectAllReports)) {
			await this.commonButtons.clickButton(DeLabels.SELECT_ALL);
		}

		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkComprehensiveEvaluationReports,
			data.comprehensiveEvaluationReports,
		);
		await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkIepReports, data.iEPReports);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkPsychologicalEvaluationsReports,
			data.psychologicalEvaluationsReports,
		);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkBehaviorAssessmentsReports,
			data.behaviorAssessmentsReports,
		);
		await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkMedicalReports, data.medicalReports);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkEvaluationSummaryReports,
			data.evaluationSummaryReports,
		);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkPsychoEducationalEvaluationsReports,
			data.psychoEducationalEvaluationsReports,
		);
		await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkIqAssessmentReports, data.iqAssessmentReports);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkAsdEvaluationAssessmentReports,
			data.asdEvaluationAssessmentReports,
		);

		if (CommonUtils.isAffirmative(data.otherEvaluations)) {
			await this.chkOtherEvaluations.check();
			await this.txtOtherEvaluationDetails.fill(data.otherEvaluationDetails);
		}
	}

	#initLocators() {
		this.ddlDddsOrganizationName = this.page.locator(
			'button[data-id="deApplication.deDddsOrganization.deDddsOrganizationName"]',
		);
		this.txtVrLocation = this.page.locator('#deApplication\\.deDddsOrganization\\.vrLocation');
		this.txtOtherOrganizationName = this.page.locator('[name="deApplication.deDddsOrganization.otherOrganizationName"]');
		this.txtOtherOrganizationContactInfo = this.page.locator(
			'[name="deApplication.deDddsOrganization.otherOrganizationContactInfo"]',
		);
		this.chkStudyingInCurrentSchool = this.page.locator(
			'[name="deApplication.deDddsOrganization.studyingInCurrentSchool"]',
		);
		this.txtCurrentSchoolName = this.page.locator('[name="deApplication.deDddsOrganization.currentSchoolName"]');
		this.txtCurrentSchoolCity = this.page.locator('[name="deApplication.deDddsOrganization.currentSchoolCity"]');
		this.ddlCurrentSchoolState = this.page.locator('[name="deApplication.deDddsOrganization.currentSchoolState"]');
		this.chkStudyingInFormerSchool = this.page.locator(
			'[name="deApplication.deDddsOrganization.studyingInFormerSchool"]',
		);
		this.txtFormerSchoolName = this.page.locator('[name="deApplication.deDddsOrganization.formerSchoolName"]');
		this.txtFormerSchoolCity = this.page.locator('[name="deApplication.deDddsOrganization.formerSchoolCity"]');
		this.ddlFormerSchoolState = this.page.locator('[name="deApplication.deDddsOrganization.formerSchoolState"]');
		this.dtpFormerSchoolStartDate = this.page.locator('[name="deApplication.deDddsOrganization.formerSchoolStartDate"]');
		this.dtpFormerSchoolEndDate = this.page.locator('[name="deApplication.deDddsOrganization.formerSchoolEndDate"]');
		this.chkComprehensiveEvaluationReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.comprehensiveEvaluationReports"]',
		);
		this.chkIepReports = this.page.locator('[name="deApplication.deDddsEvaluation.iepReports"]');
		this.chkPsychologicalEvaluationsReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.psychologicalEvaluations"]',
		);
		this.chkBehaviorAssessmentsReports = this.page.locator('[name="deApplication.deDddsEvaluation.behaviorAssessments"]');
		this.chkMedicalReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.medicalRecordsToConfirmDiagnosis"]',
		);
		this.chkEvaluationSummaryReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.evaluationSummaryReports"]',
		);
		this.chkPsychoEducationalEvaluationsReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.psychoEducationalEvaluations"]',
		);
		this.chkIqAssessmentReports = this.page.locator('[name="deApplication.deDddsEvaluation.iqAssessment"]');
		this.chkAsdEvaluationAssessmentReports = this.page.locator(
			'[name="deApplication.deDddsEvaluation.asdEvaluationAssessment"]',
		);
		this.chkOtherEvaluations = this.page.locator('[name="deApplication.deDddsEvaluation.otherEvaluations"]');
		this.txtOtherEvaluationDetails = this.page.locator('[name="deApplication.deDddsEvaluation.otherEvaluationDetails"]');
	}
}
