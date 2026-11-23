/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class GaIddsLegalStatusGuardianPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.#initLocators(page);
	}

	async fillupLegalStatusGuardian(data) {
		await this.fillGuardianDemographics(data);
		await this.fillGuardianPhoneDetails(data);
		await this.fillGuardianAddressDetails(data);
	}

	async fillGuardianDemographics(data) {
		data.legalStatus && await this.ddlLegalStatus.selectOption(data.legalStatus);
		data.guardianType && await this.ddlGuardianType.selectOption(data.guardianType);
		data.agencyName && await this.txtAgencyName.fill(data.agencyName);
		data.guardianFirstName && await this.txtGuardianFirstName.fill(data.guardianFirstName);
		data.guardianMiddleInitial && await this.txtGuardianMiddleInitial.fill(data.guardianMiddleInitial);
		data.guardianLastName && await this.txtGuardianLastName.fill(data.guardianLastName);
		data.guardianSuffix && await this.ddlGuardianSuffix.selectOption(data.guardianSuffix);
		data.guardianEmail && await this.txtGuardianEmail.fill(data.guardianEmail);
		data.guardianRelationship && await this.ddlGuardianRelationship.selectOption(data.guardianRelationship);
	}

	async fillGuardianPhoneDetails(data) {
		data.guardianPhoneSameAsApplicant && await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkGuardianPhoneSameAsApplicant,
			data.guardianPhoneSameAsApplicant
		);
		data.guardianNumber && await this.txtGuardianNumber.fill(data.guardianNumber);
		data.guardianExtension && await this.txtGuardianExtension.fill(data.guardianExtension);
	}

	async fillGuardianAddressDetails(data) {
		data.guardianAddressSameAsApplicant && await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkGuardianAddressSameAsApplicant,
			data.guardianAddressSameAsApplicant
		);
		data.guardianStreet1 && await this.txtGuardianStreet1.fill(data.guardianStreet1);
		data.guardianStreet2 && await this.txtGuardianStreet2.fill(data.guardianStreet2);
		data.guardianCity && await this.txtGuardianCity.fill(data.guardianCity);
		data.guardianState && await this.ddlGuardianState.selectOption(data.guardianState);
		data.guardianZip && await this.txtGuardianZip.fill(data.guardianZip);

	}

	#initLocators(page) {
		this.ddlLegalStatus = page.locator('#gaApplication\\.legalStatus');
		this.ddlGuardianType = page.locator('#gaApplication\\.legalGuardian\\.guardianType');
		this.txtAgencyName = page.locator('#gaApplication\\.legalGuardian\\.agencyName');
		this.txtGuardianFirstName = page.locator('#gaApplication\\.legalGuardian\\.firstName');
		this.txtGuardianMiddleInitial = page.locator('#gaApplication\\.legalGuardian\\.middleInitial');
		this.txtGuardianLastName = page.locator('#gaApplication\\.legalGuardian\\.lastName');
		this.ddlGuardianSuffix = page.locator('#gaApplication\\.legalGuardian\\.suffix');
		this.txtGuardianEmail = page.locator('#gaApplication\\.legalGuardian\\.email');
		this.ddlGuardianRelationship = page.locator('#gaApplication\\.legalGuardian\\.relationship');
		this.chkGuardianPhoneSameAsApplicant = page.locator('#gaApplication\\.legalGuardian\\.phoneSameAsApplicant');
		this.txtGuardianNumber = page.locator('#gaApplication\\.legalGuardian\\.phone\\.number');
		this.txtGuardianExtension = page.locator('#gaApplication\\.legalGuardian\\.phone\\.extension');
		this.chkGuardianAddressSameAsApplicant = page.locator('#gaApplication\\.legalGuardian\\.addressSameAsApplicant');
		this.txtGuardianStreet1 = page.locator('#gaApplication\\.legalGuardian\\.address\\.street1');
		this.txtGuardianStreet2 = page.locator('#gaApplication\\.legalGuardian\\.address\\.street2');
		this.txtGuardianCity = page.locator('#gaApplication\\.legalGuardian\\.address\\.city');
		this.ddlGuardianState = page.locator('#gaApplication\\.legalGuardian\\.address\\.state');
		this.txtGuardianZip = page.locator('#gaApplication\\.legalGuardian\\.address\\.zip');
	}
}
