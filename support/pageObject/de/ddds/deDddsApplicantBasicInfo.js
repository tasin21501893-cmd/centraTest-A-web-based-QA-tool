/**
 * @author Rifat Ara
 * @since 02/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { SignatureUtils } from '../../../commonUtility/signatureUtils.js';
import { ButtonLabels } from '../../../commonUtility/buttonLabels.js';
import { DeLabels } from '../utility/deLabels.js';
import { DeUtils } from '../utility/deUtils.js';

export class DeDddsApplicantBasicInfo {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.signatureUtils = new SignatureUtils(page);
		this.deUtils = new DeUtils(page);
		this.#initLocators();
	}

	async fillApplicantPageSections(data) {
		await this.fillApplicantInfo(data);
		await this.fillGuardianContactInfo(data);
		await this.fillDiagnosticsInfo(data);
		await this.fillCitizenshipInfo(data);
		await this.fillAdditionalQuestions(data);
	}

	async fillApplicantInfo(data) {
		await this.selectICertify(data);
		await this.checkIfPreviouslyApplied(data);
		await this.fillApplicantDemographicInfo(data);
		await this.fillApplicantContactInfo(data);
	}

	async selectICertify(data) {
		if (data.iCertify === 'Applicant, age 18 or older without a legal guardian') {
			await this.rdoICertify1.check({ force: true });

		} else if (data.iCertify === 'Legal parent or guardian of the applicant, under age 18') {
			await this.rdoICertify2.check({ force: true });

		} else if (data.iCertify === 'Legal guardian of the adult applicant, age 18 or older') {
			await this.rdoICertify3.check({ force: true });
		}

		if (data.iCertify !== 'Applicant, age 18 or older without a legal guardian') {
			data.parentFirstName && await this.txtParentFirstName.fill(data.parentFirstName);
			data.parentLastName && await this.txtParentLastName.fill(data.parentLastName);
		}
	}

	async checkIfPreviouslyApplied(data) {
		if (data.previouslyApplied) {
			if (CommonUtils.isAffirmative(data.previouslyApplied)) {
				await this.rdoPreviouslyAppliedYes.check({ force: true });

			} else if (CommonUtils.isNegative(data.previouslyApplied)) {
				await this.rdoPreviouslyAppliedNo.check({ force: true });

			} else if (data.previouslyApplied === "I don't know") {
				await this.rdoPreviouslyAppliedDontKnow.check({ force: true });
			}
		}
	}

	async fillApplicantDemographicInfo(data) {
		data.firstName && await this.txtFirstName.fill(data.firstName);
		data.middleName && await this.txtMiddleName.fill(data.middleName);
		data.lastName && await this.txtLastName.fill(data.lastName);
		data.suffix && await this.ddlSuffix.selectOption({ label: data.suffix });
		data.preferredName && await this.txtPreferredName.fill(data.preferredName);
		data.ssn && await this.txtSsn.fill(data.ssn);

		if (data.gender === 'Male') {
			await this.rdoGenderMale.check();

		} else if (data.gender === 'Female') {
			await this.rdoGenderFemale.check();
		}

		data.genderIdentity && await this.ddlGenderIdentity.selectOption({ label: data.genderIdentity });
		data.race && await this.ddlRace.selectOption({ label: data.race });
		data.ethnicity && await this.ddlEthnicity.selectOption({ label: data.ethnicity });
		data.dateOfBirth && await this.dtpDateOfBirth.fill(data.dateOfBirth);
	}

	async fillApplicantContactInfo(data) {
		data.street1 && await this.txtStreet1.fill(data.street1);
		data.street2 && await this.txtStreet2.fill(data.street2);
		data.city && await this.txtCity.fill(data.city);
		data.state && await this.ddlState.selectOption({ label: data.state });
		data.county && await this.ddlCounty.selectOption({ label: data.county });
		data.zip && await this.txtZip.fill(data.zip);
		data.phoneNo && await this.txtPhoneNo.fill(data.phoneNo);
		await this.deUtils.selectPhoneType(
			data.phoneType,
			this.rdoPhoneTypeCell,
			this.rdoPhoneTypeHome,
			this.rdoPhoneTypeWork
		);
		data.alterPhoneNo && await this.txtAlterPhoneNo.fill(data.alterPhoneNo);
		await this.deUtils.selectPhoneType(
			data.alterPhoneType,
			this.rdoAltPhoneTypeCell,
			this.rdoAltPhoneTypeHome,
			this.rdoAltPhoneTypeWork
		);
		data.applicantEmail && await this.txtApplicantEmail.fill(data.applicantEmail);
	}

	async fillGuardianContactInfo(data) {
		if (CommonUtils.isAffirmative(data.sameAsAbove)) {
			await this.commonButtons.clickButton(DeLabels.SAME_AS_ABOVE);

		} else {
			data.guardianStreet1 && await this.txtGuardianStreet1.fill(data.guardianStreet1);
			data.guardianStreet2 && await this.txtGuardianStreet2.fill(data.guardianStreet2);
			data.guardianCity && await this.txtGuardianCity.fill(data.guardianCity);
			data.guardianState && await this.ddlGuardianState.selectOption({ label: data.guardianState });
			data.guardianCounty && await this.ddlGuardianCounty.selectOption({ label: data.guardianCounty });
			data.guardianZip && await this.txtGuardianZip.fill(data.guardianZip);
			data.guardianPhoneNo && await this.txtGuardianPhoneNo.fill(data.guardianPhoneNo);
			await this.deUtils.selectPhoneType(
				data.guardianPhoneType,
				this.rdoGuardianPhoneTypeCell,
				this.rdoGuardianPhoneTypeHome,
				this.rdoGuardianPhoneTypeWork
			);
			data.guardianAlterPhoneNo && await this.txtGuardianAlterPhoneNo.fill(data.guardianAlterPhoneNo);
			await this.deUtils.selectPhoneType(
				data.guardianAlterPhoneType,
				this.rdoGuardianAlterPhoneTypeCell,
				this.rdoGuardianAlterPhoneTypeHome,
				this.rdoGuardianAlterPhoneTypeWork
			);
			data.guardianApplicantEmail && await this.txtGuardianApplicantEmail.fill(data.guardianApplicantEmail);
		}
	}

	async fillDiagnosticsInfo(data) {
		data.decisionMaker &&
			await this.commonUtils.selectRadioOption(
				data.decisionMaker,
				this.rdoDecisionMakerContactYes,
				this.rdoDecisionMakerContactNo,
			);
		data.decisionMakerContact && await this.txtDecisionMakerContact.fill(data.decisionMakerContact);
		data.intellectualDisability &&
			await this.commonUtils.selectRadioOption(
				data.intellectualDisability,
				this.rdoIntellectualDisabilityPositive,
				this.rdoIntellectualDisabilityNegative,
			);
		data.autismSpectrumDisorder &&
			await this.commonUtils.selectRadioOption(
				data.autismSpectrumDisorder,
				this.rdoAutismSpectrumDisorderPositive,
				this.rdoAutismSpectrumDisorderNegative,
			);
		data.praderWillliSyndrome &&
			await this.commonUtils.selectRadioOption(
				data.praderWillliSyndrome,
				this.rdoPraderWillliSyndromePositive,
				this.rdoPraderWillliSyndromeNegative,
			);
		data.brainInjuryBefore &&
			await this.commonUtils.selectRadioOption(
				data.brainInjuryBefore,
				this.rdoBrainInjuryBeforePositive,
				this.rdoBrainInjuryBeforeNegative,
			);
	}

	async fillCitizenshipInfo(data) {
		data.citizenOfUsa &&
			await this.commonUtils.selectRadioOption(
				data.citizenOfUsa,
				this.rdoCitizenOfUsaPositive,
				this.rdoCitizenOfUsaNegative,
			);
		data.lawfulAlienOfUsa &&
			await this.commonUtils.selectRadioOption(
				data.lawfulAlienOfUsa,
				this.rdoLawfulAlienOfUsaPositive,
				this.rdoLawfulAlienOfUsaNegative,
			);

		if (data.residentOfDe === 'Yes') {
			await this.rdoResidentOfDePositive.check();

		} else if (data.residentOfDe === 'No') {
			await this.rdoResidentOfDeNegative.check();
		
		} else if (data.residentOfDe === 'N/A') {
			await this.rdoResidentOfDeNa.check();
		}
	}

	async fillAdditionalQuestions(data) {
		data.preferredLanguage && await this.ddlPreferredLanguage.selectOption({ label: data.preferredLanguage });
		data.preferredLanguageFamily &&
			await this.ddlPreferredLanguageFamily.selectOption({ label: data.preferredLanguageFamily });
		data.interpreterServiceNeeded &&
			await this.commonUtils.selectRadioOption(
				data.interpreterServiceNeeded,
				this.rdoInterpreterServiceNeededPositive,
				this.rdoInterpreterServiceNeededNegative,
			);
		data.verbalCommunication &&
			await this.commonUtils.selectRadioOption(
				data.verbalCommunication,
				this.rdoVerbalCommunicationPositive,
				this.rdoVerbalCommunicationNegative,
			);
		data.writtenCommunication &&
			await this.commonUtils.selectRadioOption(
				data.writtenCommunication,
				this.rdoWrittenCommunicationPositive,
				this.rdoWrittenCommunicationNegative,
			);

		if (data.sourceOfKnowledge) {
			await this.commonUtils.selectBootstrapCustomDropdown(this.ddlSourceOfKnowledge, data.sourceOfKnowledge);
		}

		if (data.ifOther) {
			await this.txtIfOther.waitFor({ state: 'visible' });
			await this.txtIfOther.fill(data.ifOther);
		}

		data.dddsLeaveVoiceMessage &&
			await this.commonUtils.selectRadioOption(
				data.dddsLeaveVoiceMessage,
				this.rdoDddsLeaveVoiceMessagePositive,
				this.rdoDddsLeaveVoiceMessageNegative,
			);
		data.dddsContactViaEmail &&
			await this.commonUtils.selectRadioOption(
				data.dddsContactViaEmail,
				this.rdoDddsContactViaEmailPositive,
				this.rdoDddsContactViaEmailNegative,
			);
	}

	async addSignature() {
		await this.commonButtons.clickButton(ButtonLabels.ADD);
		await this.signatureUtils.drawOnSignaturePad(this.signaturePad);
		await this.commonButtons.clickButton(ButtonLabels.SAVE);
	}

	async saveApplicantInfo() {
		await this.commonButtons.clickButton(DeLabels.SAVE_AND_NEXT);
	}

	#initLocators() {
		this.rdoICertify1 = this.page.locator('input[id="deApplication.deDddsDataSubmitterType1"]');
		this.rdoICertify2 = this.page.locator('input[id="deApplication.deDddsDataSubmitterType2"]');
		this.rdoICertify3 = this.page.locator('input[id="deApplication.deDddsDataSubmitterType3"]');
		this.txtParentFirstName = this.page.locator('[name="deApplication.deDddsGuardian.firstName"]');
		this.txtParentLastName = this.page.locator('[name="deApplication.deDddsGuardian.lastName"]');
		this.rdoPreviouslyAppliedYes = this.page.locator('input[id="deApplication.alreadyAppliedForDdds1"]');
		this.rdoPreviouslyAppliedNo = this.page.locator('input[id="deApplication.alreadyAppliedForDdds2"]');
		this.rdoPreviouslyAppliedDontKnow = this.page.locator('input[id="deApplication.alreadyAppliedForDdds3"]');
		this.txtFirstName = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.firstName"]');
		this.txtMiddleName = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.middleName"]');
		this.txtLastName = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.lastName"]');
		this.ddlSuffix = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.suffix"]');
		this.txtPreferredName = this.page.locator('[name="deApplication.preferredName"]');
		this.txtSsn = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.ssn"]');
		this.rdoGenderMale = this.page.locator('input[id="deApplication.deCoreApplication.deIndividualDemographic.gender1"]');
		this.rdoGenderFemale = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.gender2"]',
		);
		this.ddlGenderIdentity = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.genderIdentity"]',
		);
		this.ddlRace = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.race"]');
		this.ddlEthnicity = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.ethnicity"]');
		this.dtpDateOfBirth = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.dateOfBirth"]',
		);
		this.txtStreet1 = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.address.street1"]',
		);
		this.txtStreet2 = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.address.street2"]',
		);
		this.txtCity = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.address.city"]');
		this.ddlState = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.address.state"]');
		this.ddlCounty = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.county"]');
		this.txtZip = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.address.zip"]');
		this.txtPhoneNo = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.dePhoneNumber.phoneNo"]',
		);
		this.rdoPhoneTypeCell = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.dePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoPhoneTypeHome = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.dePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoPhoneTypeWork = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.dePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtAlterPhoneNo = this.page.locator(
			'[name="deApplication.deCoreApplication.deIndividualDemographic.alternativeDePhoneNumber.phoneNo"]',
		);
		this.rdoAltPhoneTypeCell = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.alternativeDePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoAltPhoneTypeHome = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.alternativeDePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoAltPhoneTypeWork = this.page.locator(
			'input[id="deApplication.deCoreApplication.deIndividualDemographic.alternativeDePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtApplicantEmail = this.page.locator('[name="deApplication.deCoreApplication.deIndividualDemographic.email"]');
		this.txtGuardianStreet1 = this.page.locator('[name="deApplication.deDddsGuardian.address.street1"]');
		this.txtGuardianStreet2 = this.page.locator('[name="deApplication.deDddsGuardian.address.street2"]');
		this.txtGuardianCity = this.page.locator('[name="deApplication.deDddsGuardian.address.city"]');
		this.ddlGuardianState = this.page.locator('[name="deApplication.deDddsGuardian.address.state"]');
		this.ddlGuardianCounty = this.page.locator('[name="deApplication.deDddsGuardian.county"]');
		this.txtGuardianZip = this.page.locator('[name="deApplication.deDddsGuardian.address.zip"]');
		this.txtGuardianPhoneNo = this.page.locator('[name="deApplication.deDddsGuardian.dePhoneNumber.phoneNo"]');
		this.rdoGuardianPhoneTypeCell = this.page.locator(
			'input[id="deApplication.deDddsGuardian.dePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoGuardianPhoneTypeHome = this.page.locator(
			'input[id="deApplication.deDddsGuardian.dePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoGuardianPhoneTypeWork = this.page.locator(
			'input[id="deApplication.deDddsGuardian.dePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtGuardianAlterPhoneNo = this.page.locator(
			'[name="deApplication.deDddsGuardian.alternativeDePhoneNumber.phoneNo"]',
		);
		this.rdoGuardianAlterPhoneTypeCell = this.page.locator(
			'input[id="deApplication.deDddsGuardian.alternativeDePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoGuardianAlterPhoneTypeHome = this.page.locator(
			'input[id="deApplication.deDddsGuardian.alternativeDePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoGuardianAlterPhoneTypeWork = this.page.locator(
			'input[id="deApplication.deDddsGuardian.alternativeDePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtGuardianApplicantEmail = this.page.locator('[name="deApplication.deDddsGuardian.email"]');
		this.rdoDecisionMakerContactYes = this.page.locator(
			'input[id="deApplication.deDddsGuardian.substituteDecisionMakerAvailable1"]',
		);
		this.rdoDecisionMakerContactNo = this.page.locator(
			'input[id="deApplication.deDddsGuardian.substituteDecisionMakerAvailable2"]',
		);
		this.txtDecisionMakerContact = this.page.locator(
			'[name="deApplication.deDddsGuardian.substituteDecisionMakerContact"]',
		);
		this.rdoIntellectualDisabilityPositive = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.intellectualDisability1"]',
		);
		this.rdoIntellectualDisabilityNegative = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.intellectualDisability2"]',
		);
		this.rdoAutismSpectrumDisorderPositive = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.autismSpectrumDisorder1"]',
		);
		this.rdoAutismSpectrumDisorderNegative = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.autismSpectrumDisorder2"]',
		);
		this.rdoPraderWillliSyndromePositive = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.praderWillliSyndrome1"]',
		);
		this.rdoPraderWillliSyndromeNegative = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.praderWillliSyndrome2"]',
		);
		this.rdoBrainInjuryBeforePositive = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.brainInjuryBefore221"]',
		);
		this.rdoBrainInjuryBeforeNegative = this.page.locator(
			'input[id="deApplication.deDddsDiagnostics.brainInjuryBefore222"]',
		);
		this.rdoCitizenOfUsaPositive = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isCitizenOfUSA1"]',
		);
		this.rdoCitizenOfUsaNegative = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isCitizenOfUSA2"]',
		);
		this.rdoLawfulAlienOfUsaPositive = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isALawfulAlienOfUSA1"]',
		);
		this.rdoLawfulAlienOfUsaNegative = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isALawfulAlienOfUSA2"]',
		);
		this.rdoResidentOfDePositive = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isResidentOfDE1"]',
		);
		this.rdoResidentOfDeNegative = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isResidentOfDE2"]',
		);
		this.rdoResidentOfDeNa = this.page.locator(
			'input[id="deApplication.deDddsCitizenshipAndResidencyInfo.isResidentOfDE3"]',
		);
		this.ddlPreferredLanguage = this.page.locator('[name="deApplication.deDddsAdditionalQuestions.preferredLanguage"]');
		this.ddlPreferredLanguageFamily = this.page.locator(
			'[name="deApplication.deDddsAdditionalQuestions.preferredLanguageOfFamily"]',
		);
		this.rdoInterpreterServiceNeededPositive = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.interpreterServiceNeeded1"]',
		);
		this.rdoInterpreterServiceNeededNegative = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.interpreterServiceNeeded2"]',
		);
		this.rdoVerbalCommunicationPositive = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.communicationMedium.verbalCommunication1"]',
		);
		this.rdoVerbalCommunicationNegative = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.communicationMedium.verbalCommunication2"]',
		);
		this.rdoWrittenCommunicationPositive = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.communicationMedium.writtenCommunication1"]',
		);
		this.rdoWrittenCommunicationNegative = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.communicationMedium.writtenCommunication2"]',
		);
		this.ddlSourceOfKnowledge = this.page.locator(
			'button[data-id="deApplication.deDddsAdditionalQuestions.sourceOfKnowledgeAboutDdds"]',
		);
		this.txtIfOther = this.page.locator('[name="deApplication.deDddsAdditionalQuestions.otherSourceOfKnowledge"]');
		this.rdoDddsLeaveVoiceMessagePositive = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.mayDddsLeaveVoiceMessage1"]',
		);
		this.rdoDddsLeaveVoiceMessageNegative = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.mayDddsLeaveVoiceMessage2"]',
		);
		this.rdoDddsContactViaEmailPositive = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.mayDddsContactViaEmail1"]',
		);
		this.rdoDddsContactViaEmailNegative = this.page.locator(
			'input[id="deApplication.deDddsAdditionalQuestions.mayDddsContactViaEmail2"]',
		);
		this.signaturePad = this.page.locator('#signature-pad');
	}
}
