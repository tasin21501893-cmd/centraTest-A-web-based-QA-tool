/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class GaIddsReferralResourcesPhysicianPage {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.#initLocators(page);
	}

	async fillupReferralResourcesPhysician(data) {
		data.referralSource && await this.ddlReferralSource.selectOption(data.referralSource);
		await this.fillUpResourceCategoryList(data);
		await this.fillUpPhysicianDetails(data);
	}

	async fillUpResourceCategoryList(data) {
		if (data.resourceCategoryList) {
			const resourceCategoryArray = await this.commonUtils.parseCommaSeparatedList(data.resourceCategoryList);
			await this.ddlResourceCategoryList.selectOption(resourceCategoryArray.map(category => ({ label: category })));
		}
	}

	async fillUpPhysicianDetails(data) {
		data.physicianFirstName && await this.txtPhysicianFirstName.fill(data.physicianFirstName);
		data.physicianMiddleName && await this.txtPhysicianMiddleName.fill(data.physicianMiddleName);
		data.physicianLastName && await this.txtPhysicianLastName.fill(data.physicianLastName);
		data.physicianEmail && await this.txtPhysicianEmail.fill(data.physicianEmail);
		data.physicianStreet1 && await this.txtPhysicianStreet1.fill(data.physicianStreet1);
		data.physicianStreet2 && await this.txtPhysicianStreet2.fill(data.physicianStreet2);
		data.physicianCity && await this.txtPhysicianCity.fill(data.physicianCity);
		data.physicianState && await this.ddlPhysicianState.selectOption(data.physicianState);
		data.physicianZip && await this.txtPhysicianZip.fill(data.physicianZip);
		data.physicianNumber && await this.txtPhysicianNumber.fill(data.physicianNumber);
		data.physicianExtension && await this.txtPhysicianExtension.fill(data.physicianExtension);
		data.physicianFaxNumber && await this.txtPhysicianFaxNumber.fill(data.physicianFaxNumber);
	}

	#initLocators(page) {
		this.ddlReferralSource = page.locator('#gaApplication\\.individualReferral\\.referralSource');
		this.ddlResourceCategoryList = page.locator('#gaApplication\\.individualReferral\\.resourceCategoryList');
		this.txtPhysicianFirstName = page.locator('#gaApplication\\.physician\\.firstName');
		this.txtPhysicianMiddleName = page.locator('#gaApplication\\.physician\\.middleName');
		this.txtPhysicianLastName = page.locator('#gaApplication\\.physician\\.lastName');
		this.txtPhysicianEmail = page.locator('#gaApplication\\.physician\\.email');
		this.txtPhysicianStreet1 = page.locator('#gaApplication\\.physician\\.address\\.street1');
		this.txtPhysicianStreet2 = page.locator('#gaApplication\\.physician\\.address\\.street2');
		this.txtPhysicianCity = page.locator('#gaApplication\\.physician\\.address\\.city');
		this.ddlPhysicianState = page.locator('#gaApplication\\.physician\\.address\\.state');
		this.txtPhysicianZip = page.locator('#gaApplication\\.physician\\.address\\.zip');
		this.txtPhysicianNumber = page.locator('#gaApplication\\.physician\\.phone\\.number');
		this.txtPhysicianExtension = page.locator('#gaApplication\\.physician\\.phone\\.extension');
		this.txtPhysicianFaxNumber = page.locator('#gaApplication\\.physician\\.faxNumber');
	}
}
