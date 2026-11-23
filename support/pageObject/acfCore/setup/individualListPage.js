/**
 * @author Maksuda Islam (Lima)
 * @since 06/03/2025
 */

import { CommonUtils } from '../../../commonUtility/commonUtils';

export class IndividualListPage {
	/**
	 * @param {import('@playwright/test').Page} page
	 */

	constructor(page) {
		this.page = page;
		this.txtFilterField = page.locator('input[type="search"]').first();

		this.commonUtils = new CommonUtils(page);
	}

	async filterIndividual(individualLastName) {
		await this.txtFilterField.fill(individualLastName);
		await this.txtFilterField.press("Enter");
	}

	async selectFilteredIndividual(IndividualLastName, IndividualFirstName) {
		const combinedNameFormat = this.page.locator(`//table//tr[.//td[normalize-space(text())="${IndividualLastName}, ${IndividualFirstName}"]]`);
		const separateColumnsFormat = this.page.locator(`//table//tr[.//td[normalize-space(text())="${IndividualLastName}"] and .//td[normalize-space(text())="${IndividualFirstName}"]]`);
		const partialMatchFormat = this.page.locator(`//table//tr[.//td[contains(normalize-space(text()), "${IndividualLastName}")] and .//td[contains(normalize-space(text()), "${IndividualFirstName}")]]`);

		await this.txtFilterField.fill(IndividualLastName);
		await this.txtFilterField.press("Enter");

		if (await this.commonUtils.isElementAvailable(combinedNameFormat)) {
			await combinedNameFormat.click();
			return;
		}

		if (await this.commonUtils.isElementAvailable(separateColumnsFormat)) {
			await separateColumnsFormat.click();
			return;
		}

		if (await this.commonUtils.isElementAvailable(partialMatchFormat)) {
			await partialMatchFormat.click();
			return;
		}

		console.error(`Individual with last name "${IndividualLastName}" and first name "${IndividualFirstName}" not found in the table.`);
	}
}