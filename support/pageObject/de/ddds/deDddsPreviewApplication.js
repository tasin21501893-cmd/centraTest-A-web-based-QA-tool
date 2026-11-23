/**
 * @author Rifat Ara
 * @since 02/08/2026
*/

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../../commonUtility/buttonLabels.js';

export class DeDddsPreviewApplication {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
    }

	async submitApplication() {
		await this.commonButtons.clickButton(ButtonLabels.SUBMIT);
		await this.commonButtons.clickButton(ButtonLabels.YES);
    }
}
