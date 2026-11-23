/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { NumberUtils } from '../../../commonUtility/numberUtils.js';
import { DateTimeUtils } from '../../../commonUtility/dateTimeUtils.js';
import { GaIddsCommonUtils } from '../utility/gaIddsCommonUtils.js';

export class GaIddsPersonalPrimaryDetailsPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.#initLocators(page);
	}

	async fillupPersonalPrimaryContact(data) {
		await this.fillupPersonalDetails(data);
		await this.fillUpPrimaryContact(data);
	}

	async fillupPersonalDetails(data) {
		await this.fillDemographicDetails(data);
		await this.fillContactInfo(data);
		await this.fillResidentialAddress(data);
		await this.fillMailingAddress(data);
	}

	async fillDemographicDetails(data) {
		const { firstName, lastName, dob, ssn, medicaid, medicare } = this.resolveUniqueIdentityFields(data);

		firstName && await this.txtFirstName.fill(firstName);
		lastName && await this.txtLastName.fill(lastName);
		dob && await this.dtpDOB.fill(dob);
		ssn && await this.txtSsn.fill(ssn);
		medicaid && await this.txtMedicaid.fill(medicaid);
		medicare && await this.txtMedicare.fill(medicare);

		data.middleName && await this.txtMiddleName.fill(data.middleName);
		data.suffix && await this.ddlSuffix.selectOption(data.suffix);
		data.maidenName && await this.txtMaidenName.fill(data.maidenName);
		data.preferredName && await this.txtPreferredName.fill(data.preferredName);
		data.gender && await this.ddlGender.selectOption(data.gender);
		data.maritalStatus && await this.ddlMaritalStatus.selectOption(data.maritalStatus);
		data.race && await this.ddlRace.selectOption(data.race);
		data.hispanicOrigin && await this.ddlHispanicOrigin.selectOption(data.hispanicOrigin);
		data.applicationDate && await this.dtpApplicationDate.fill(data.applicationDate);
		data.currentLivingSituation && await this.ddlCurrentLivingSituation.selectOption(data.currentLivingSituation);
	}

	resolveUniqueIdentityFields(data) {
		const isAuto = CommonUtils.isAffirmative(data.autoValueDecider);
		return {
			firstName: isAuto ? GaIddsCommonUtils.getRandomAlphanumericString(8) : data.firstName,
			lastName: isAuto ? GaIddsCommonUtils.getRandomAlphanumericString(8) : data.lastName,
			dob: isAuto ? DateTimeUtils.getFormattedDate(-NumberUtils.getRandomInt(6570, 25550)) : data.dob,
			ssn: isAuto ? String(NumberUtils.getRandomInt(100000000, 999999999)) : data.ssn,
			medicaid: isAuto ? String(NumberUtils.getRandomInt(100000000, 999999999)) : data.medicaid,
			medicare: isAuto ? String(NumberUtils.getRandomInt(100000000, 999999999)) : data.medicare
		};
	}

	async fillContactInfo(data) {
		data.primaryPhone && await this.txtPrimaryPhone.fill(data.primaryPhone);
		data.primaryPhoneType && await this.ddlPrimaryPhoneType.selectOption(data.primaryPhoneType);
		data.secondaryPhone && await this.txtSecondaryPhone.fill(data.secondaryPhone);
		data.secondaryPhoneType && await this.ddlSecondaryPhoneType.selectOption(data.secondaryPhoneType);
		data.email && await this.txtEmail.fill(data.email);
	}

	async fillResidentialAddress(data) {
		if (data.street1 || data.city || data.zip) {
			const residentialAddressPath = 'gaApplication.coreApplication.individualDemographic' +
				'.reachabilityDetails.address';
			await this.commonUtils.fillUpAddressWithLocator(residentialAddressPath, {
				street1: data.street1 || '',
				street2: data.street2 || '',
				city: data.city || '',
				zip: data.zip || ''
			});
		}
		data.state && await this.ddlState.selectOption(data.state);
		data.county && await this.ddlCounty.selectOption(data.county);
	}

	async fillMailingAddress(data) {
		if (data.mailingStreet || data.mailingCity || data.mailingZip) {
			const mailingAddressPath = 'gaApplication.coreApplication.individualDemographic' +
				'.reachabilityDetails.mailingAddress';
			await this.commonUtils.fillUpAddressWithLocator(mailingAddressPath, {
				street1: data.mailingStreet || '',
				street2: data.mailingApt || '',
				city: data.mailingCity || '',
				zip: data.mailingZip || ''
			});
		}
		data.mailingState && await this.ddlMailingState.selectOption(data.mailingState);
		data.applicantLawfully && await this.ddlApplicantLawfully.selectOption(data.applicantLawfully);
	}

	async fillUpPrimaryContact(data) {
		data.primaryContactSameApplicant && await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkPrimaryContactSameApplicant,
			data.primaryContactSameApplicant
		);

		if (CommonUtils.isAffirmative(data.primaryContactSameApplicant)) {
			data.primaryRelationship && await this.ddlPrimaryRelationship.selectOption(data.primaryRelationship);

		} else {
			data.primaryFName && await this.txtPrimaryFName.fill(data.primaryFName);
			data.primaryMiddleInitial && await this.txtPrimaryMiddleInitial.fill(data.primaryMiddleInitial);
			data.primaryLName && await this.txtPrimaryLName.fill(data.primaryLName);
			data.primarySuffix && await this.ddlPrimarySuffix.selectOption(data.primarySuffix);
			data.primaryRelationship && await this.ddlPrimaryRelationship.selectOption(data.primaryRelationship);
			data.primaryContactEmail && await this.txtPrimaryEmail.fill(data.primaryContactEmail);
			data.primaryContactPrimaryPhone && await this.txtPrimaryPrimaryPhone.fill(data.primaryContactPrimaryPhone);
			data.primaryContactSecondaryPhone && await this.txtPrimarySecondaryPhone.fill(data.primaryContactSecondaryPhone);
			if (data.primaryStreet1 || data.primaryCity || data.primaryZip) {
				await this.commonUtils.fillUpAddressWithLocator('gaApplication.primaryContactPerson.address', {
					street1: data.primaryStreet1 || '',
					street2: data.primaryStreet2 || '',
					city: data.primaryCity || '',
					zip: data.primaryZip || ''
				});
			}
			data.primaryState && await this.ddlPrimaryState.selectOption(data.primaryState);
		}
	}

	#initLocators(page) {
		const baseDemographic = '#gaApplication\\.coreApplication\\.individualDemographic';
		const baseReachability = `${baseDemographic}\\.reachabilityDetails`;
		const basePrimary = '#gaApplication\\.primaryContactPerson';

		this.txtFirstName = page.locator(`${baseDemographic}\\.firstName`);
		this.txtMiddleName = page.locator(`${baseDemographic}\\.middleInitial`);
		this.txtLastName = page.locator(`${baseDemographic}\\.lastName`);
		this.ddlSuffix = page.locator(`${baseDemographic}\\.suffix`);
		this.txtMaidenName = page.locator(`${baseDemographic}\\.birthSurname`);
		this.txtPreferredName = page.locator(`${baseDemographic}\\.preferredName`);
		this.dtpDOB = page.locator(`${baseDemographic}\\.dateOfBirth`);
		this.ddlGender = page.locator(`${baseDemographic}\\.gender`);
		this.ddlMaritalStatus = page.locator(`${baseDemographic}\\.maritalStatus`);
		this.ddlRace = page.locator(`${baseDemographic}\\.race`);
		this.ddlHispanicOrigin = page.locator(`${baseDemographic}\\.hispanicLatinoOrigin`);
		this.txtSsn = page.locator(`${baseDemographic}\\.ssn`);
		this.txtMedicaid = page.locator(`${baseDemographic}\\.medicaid`);
		this.txtMedicare = page.locator(`${baseDemographic}\\.medicare`);
		this.dtpApplicationDate = page.locator('#gaApplication\\.applicationDate');
		this.ddlCurrentLivingSituation = page.locator('#gaApplication\\.currentLivingSituation');
		this.txtPrimaryPhone = page.locator(`${baseReachability}\\.primaryPhone\\.number`);
		this.ddlPrimaryPhoneType = page.locator(`${baseReachability}\\.primaryPhone\\.type`);
		this.txtSecondaryPhone = page.locator(`${baseReachability}\\.secondaryPhone\\.number`);
		this.ddlSecondaryPhoneType = page.locator(`${baseReachability}\\.secondaryPhone\\.type`);
		this.txtEmail = page.locator(`${baseReachability}\\.email`);
		this.ddlState = page.locator(`${baseReachability}\\.address\\.state`);
		this.ddlCounty = page.locator(`${baseReachability}\\.county`);
		this.chkMailingAddressSame = page.locator(
			'#individualDemographic\\.reachabilityDetails\\.mailingAddressSameAsResidential'
		);
		this.ddlMailingState = page.locator(`${baseReachability}\\.mailingAddress\\.state`);
		this.ddlApplicantLawfully = page.locator('#gaApplication\\.citizenshipInfo\\.lawfullyPresent');
		this.chkPrimaryContactSameApplicant = page.locator(`${basePrimary}\\.sameAsApplicant`);
		this.txtPrimaryFName = page.locator(`${basePrimary}\\.firstName`);
		this.txtPrimaryMiddleInitial = page.locator(`${basePrimary}\\.middleInitial`);
		this.txtPrimaryLName = page.locator(`${basePrimary}\\.lastName`);
		this.ddlPrimarySuffix = page.locator(`${basePrimary}\\.suffix`);
		this.ddlPrimaryRelationship = page.locator(`${basePrimary}\\.relationToApplicant`);
		this.txtPrimaryEmail = page.locator(`${basePrimary}\\.email`);
		this.txtPrimaryPrimaryPhone = page.locator(`${basePrimary}\\.primaryPhone\\.number`);
		this.txtPrimarySecondaryPhone = page.locator(`${basePrimary}\\.secondaryPhone\\.number`);
		this.ddlPrimaryState = page.locator(`${basePrimary}\\.address\\.state`);
	}
}
