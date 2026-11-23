/**
 * @author Rifat Ara
 * @since 02/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { DeLabels } from '../utility/deLabels.js';
import { DeUtils } from '../utility/deUtils.js';

export class DeDddsAuthorizationToAssist {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.deUtils = new DeUtils(page);
		this.#initLocators();
	}
	
	async fillAuthorizedAssistants(data) {
		await this.fillAuthorizedAssistant(data);
		await this.fillAuthorizedAssistantAdditional(data);

		await this.commonButtons.clickButton(DeLabels.SAVE_AND_NEXT);
	}

	async fillAuthorizedAssistant(data) {
		if (CommonUtils.isAffirmative(data.hasAuthorizedAssistant)) {
			await this.rdoHasAuthorizedAssistPositive.check();
			await this.txtAuthorizedAssistantFirstName.waitFor({ state: 'visible' });
			data.authorizedAssistantFirstName &&
				await this.txtAuthorizedAssistantFirstName.fill(data.authorizedAssistantFirstName);
			data.authorizedAssistantLastName &&
				await this.txtAuthorizedAssistantLastName.fill(data.authorizedAssistantLastName);
			data.authorizedAssistantPhoneNo &&
				await this.txtAuthorizedAssistantPhoneNo.fill(data.authorizedAssistantPhoneNo);
			await this.deUtils.selectPhoneType(
				data.authorizedAssistantPhoneNoType,
				this.rdoAuthorizedAssistantPhoneTypeCell,
				this.rdoAuthorizedAssistantPhoneTypeHome,
				this.rdoAuthorizedAssistantPhoneTypeWork
			);
			data.authorizedAssistantEmail && await this.txtAuthorizedAssistantEmail.fill(data.authorizedAssistantEmail);
			data.authorizedAssistantStreet1 &&
				await this.txtAuthorizedAssistantStreet1.fill(data.authorizedAssistantStreet1);
			data.authorizedAssistantStreet2 &&
				await this.txtAuthorizedAssistantStreet2.fill(data.authorizedAssistantStreet2);
			data.authorizedAssistantCity && await this.txtAuthorizedAssistantCity.fill(data.authorizedAssistantCity);
			data.authorizedAssistantState &&
				await this.ddlAuthorizedAssistantState.selectOption({ label: data.authorizedAssistantState });
			data.authorizedAssistantZip && await this.txtAuthorizedAssistantZip.fill(data.authorizedAssistantZip);
			data.authorizedAssistantCounty &&
				await this.ddlAuthorizedAssistantCounty.selectOption({ label: data.authorizedAssistantCounty });

		} else if (CommonUtils.isNegative(data.hasAuthorizedAssistant)) {
			await this.rdoHasAuthorizedAssistNegative.check();
		}
	}

	async fillAuthorizedAssistantAdditional(data) {
		if (CommonUtils.isAffirmative(data.hasAuthorizedAssistantAdditional)) {
			await this.rdoHasAuthorizedAssistantAdditionalPositive.check();
			data.authorizedAssistantAdditionalFirstName &&
				await this.txtAuthorizedAssistantAdditionalFirstName.fill(data.authorizedAssistantAdditionalFirstName);
			data.authorizedAssistantAdditionalLastName &&
				await this.txtAuthorizedAssistantAdditionalLastName.fill(data.authorizedAssistantAdditionalLastName);
			data.authorizedAssistantAdditionalPhoneNo &&
				await this.txtAuthorizedAssistantAdditionalPhoneNo.fill(data.authorizedAssistantAdditionalPhoneNo);
			await this.deUtils.selectPhoneType(
				data.authorizedAssistantAdditionalPhoneNoType,
				this.rdoAuthorizedAssistantAdditionalPhoneTypeCell,
				this.rdoAuthorizedAssistantAdditionalPhoneTypeHome,
				this.rdoAuthorizedAssistantAdditionalPhoneTypeWork
			);
			data.authorizedAssistantAdditionalEmail &&
				await this.txtAuthorizedAssistantAdditionalEmail.fill(data.authorizedAssistantAdditionalEmail);
			data.authorizedAssistantAdditionalStreet1 &&
				await this.txtAuthorizedAssistantAdditionalStreet1.fill(data.authorizedAssistantAdditionalStreet1);
			data.authorizedAssistantAdditionalStreet2 &&
				await this.txtAuthorizedAssistantAdditionalStreet2.fill(data.authorizedAssistantAdditionalStreet2);
			data.authorizedAssistantAdditionalCity &&
				await this.txtAuthorizedAssistantAdditionalCity.fill(data.authorizedAssistantAdditionalCity);
			data.authorizedAssistantAdditionalState &&
				await this.ddlAuthorizedAssistantAdditionalState.selectOption({
					label: data.authorizedAssistantAdditionalState,
				});
			data.authorizedAssistantAdditionalZip &&
				await this.txtAuthorizedAssistantAdditionalZip.fill(data.authorizedAssistantAdditionalZip);
			data.authorizedAssistantAdditionalCounty &&
				await this.ddlAuthorizedAssistantAdditionalCounty.selectOption({
					label: data.authorizedAssistantAdditionalCounty,
				});

		} else if (CommonUtils.isNegative(data.hasAuthorizedAssistantAdditional)) {
			await this.rdoHasAuthorizedAssistantAdditionalNegative.check();
		}
	}

	#initLocators() {
		this.rdoHasAuthorizedAssistPositive = this.page.locator('label[for="deApplication.hasAuthorizedToAssist11"]');
		this.rdoHasAuthorizedAssistNegative = this.page.locator('label[for="deApplication.hasAuthorizedToAssist12"]');
		this.txtAuthorizedAssistantFirstName = this.page.locator('[name="deApplication.assistingPerson1.firstName"]');
		this.txtAuthorizedAssistantLastName = this.page.locator('[name="deApplication.assistingPerson1.lastName"]');
		this.txtAuthorizedAssistantPhoneNo = this.page.locator(
			'[name="deApplication.assistingPerson1.dePhoneNumber.phoneNo"]',
		);
		this.rdoAuthorizedAssistantPhoneTypeCell = this.page.locator(
			'input[id="deApplication.assistingPerson1.dePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoAuthorizedAssistantPhoneTypeHome = this.page.locator(
			'input[id="deApplication.assistingPerson1.dePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoAuthorizedAssistantPhoneTypeWork = this.page.locator(
			'input[id="deApplication.assistingPerson1.dePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtAuthorizedAssistantEmail = this.page.locator('[name="deApplication.assistingPerson1.email"]');
		this.txtAuthorizedAssistantStreet1 = this.page.locator('[name="deApplication.assistingPerson1.address.street1"]');
		this.txtAuthorizedAssistantStreet2 = this.page.locator('[name="deApplication.assistingPerson1.address.street2"]');
		this.ddlAuthorizedAssistantState = this.page.locator('[name="deApplication.assistingPerson1.address.state"]');
		this.txtAuthorizedAssistantCity = this.page.locator('[name="deApplication.assistingPerson1.address.city"]');
		this.txtAuthorizedAssistantZip = this.page.locator('[name="deApplication.assistingPerson1.address.zip"]');
		this.ddlAuthorizedAssistantCounty = this.page.locator('[name="deApplication.assistingPerson1.county"]');
		this.rdoHasAuthorizedAssistantAdditionalPositive = this.page.locator(
			'label[for="deApplication.hasAuthorizedToAssist21"]',
		);
		this.rdoHasAuthorizedAssistantAdditionalNegative = this.page.locator(
			'label[for="deApplication.hasAuthorizedToAssist22"]',
		);
		this.txtAuthorizedAssistantAdditionalFirstName = this.page.locator(
			'[name="deApplication.assistingPerson2.firstName"]',
		);
		this.txtAuthorizedAssistantAdditionalLastName = this.page.locator('[name="deApplication.assistingPerson2.lastName"]');
		this.txtAuthorizedAssistantAdditionalPhoneNo = this.page.locator(
			'[name="deApplication.assistingPerson2.dePhoneNumber.phoneNo"]',
		);
		this.rdoAuthorizedAssistantAdditionalPhoneTypeCell = this.page.locator(
			'input[id="deApplication.assistingPerson2.dePhoneNumber.dePhoneNumberType1"]',
		);
		this.rdoAuthorizedAssistantAdditionalPhoneTypeHome = this.page.locator(
			'input[id="deApplication.assistingPerson2.dePhoneNumber.dePhoneNumberType2"]',
		);
		this.rdoAuthorizedAssistantAdditionalPhoneTypeWork = this.page.locator(
			'input[id="deApplication.assistingPerson2.dePhoneNumber.dePhoneNumberType3"]',
		);
		this.txtAuthorizedAssistantAdditionalEmail = this.page.locator('[name="deApplication.assistingPerson2.email"]');
		this.txtAuthorizedAssistantAdditionalStreet1 = this.page.locator(
			'[name="deApplication.assistingPerson2.address.street1"]',
		);
		this.txtAuthorizedAssistantAdditionalStreet2 = this.page.locator(
			'[name="deApplication.assistingPerson2.address.street2"]',
		);
		this.ddlAuthorizedAssistantAdditionalState = this.page.locator(
			'[name="deApplication.assistingPerson2.address.state"]',
		);
		this.txtAuthorizedAssistantAdditionalCity = this.page.locator('[name="deApplication.assistingPerson2.address.city"]');
		this.txtAuthorizedAssistantAdditionalZip = this.page.locator('[name="deApplication.assistingPerson2.address.zip"]');
		this.ddlAuthorizedAssistantAdditionalCounty = this.page.locator('[name="deApplication.assistingPerson2.county"]');
	}
}
