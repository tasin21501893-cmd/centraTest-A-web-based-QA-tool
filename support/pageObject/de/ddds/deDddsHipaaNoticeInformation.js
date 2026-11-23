/**
 * @author Rifat Ara
 * @since 02/25/2026
*/

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { DeLabels } from '../utility/deLabels.js';

export class DeDddsHipaaNoticeInformation {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
	}

	async fillHipaaNoticeInformation() {
		await this.commonButtons.clickButton(DeLabels.SAVE_AND_NEXT);
	}
}
