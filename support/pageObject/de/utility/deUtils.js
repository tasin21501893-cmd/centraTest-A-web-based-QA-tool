/**
 * @author Rifat Ara
 * @since 08/17/2026
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class DeUtils {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
	}

	/**
	 * Selects a phone type radio button based on the provided phone type string.
	 * @param {string} phoneType - The type of phone ('Cell', 'Home', 'Work')
	 * @param {import('@playwright/test').Locator} cellLocator - The locator for the 'Cell' radio button
	 * @param {import('@playwright/test').Locator} homeLocator - The locator for the 'Home' radio button
	 * @param {import('@playwright/test').Locator} workLocator - The locator for the 'Work' radio button
	 */
	async selectPhoneType(phoneType, cellLocator, homeLocator, workLocator) {
		if (!phoneType || typeof phoneType !== 'string') {
			return;
		}

		const phoneTypeMap = {
			'Cell': cellLocator,
			'Home': homeLocator,
			'Work': workLocator
		};

		const targetLocator = phoneTypeMap[phoneType.trim()];
		targetLocator && await this.commonUtils.selectRadioButton(targetLocator);
	}
}
