/**
 * @author Rifat Ara
 * @since 02/08/2026
*/

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { DeLabels } from '../utility/deLabels.js';

export class DeDddsFinancialResponsibility {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
	}

	async fillFinancialResponsibility() {
		await this.commonButtons.clickButton(DeLabels.SAVE_AND_NEXT);
	}
}
