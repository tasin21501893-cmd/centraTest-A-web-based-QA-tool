/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { GaIddsLabels } from '../utility/gaIddsLabels.js';

const SUBMIT_CONFIRMATION_TIMEOUT = 120000;

export class GaIddsPreviewPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
	}

	async clickSubmit() {
		await this.commonButtons.clickButton(GaIddsLabels.SUBMIT);
		const yesButtonLocator = this.commonButtons.getButtonLocator(GaIddsLabels.YES);
		await yesButtonLocator.click({ timeout: SUBMIT_CONFIRMATION_TIMEOUT });
	}
}
