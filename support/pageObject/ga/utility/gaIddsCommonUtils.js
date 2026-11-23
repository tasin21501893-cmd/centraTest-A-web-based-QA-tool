/**
 * @author Shahil Azmayish
 * @since 04/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { GaIddsLabels } from '../utility/gaIddsLabels.js';

export class GaIddsCommonUtils {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
	}

	async clickSaveAndNext() {
		await this.commonButtons.clickButton(GaIddsLabels.SAVE_AND_NEXT);
	}

	async clickNext() {
		await this.commonButtons.clickButton(GaIddsLabels.NEXT);
	}

	/**
	 * Generates a random alphanumeric string of a given length.
	 * @param {number} length
	 * @returns {string}
	 */
	static getRandomAlphanumericString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	}
}
