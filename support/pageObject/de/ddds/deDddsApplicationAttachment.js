/**
 * @author Rifat Ara
 * @since 02/08/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { DeAttachment } from '../utility/deAttachment.js';
import { DeLabels } from '../utility/deLabels.js';

export class DeDddsApplicationAttachment {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.deAttachment = new DeAttachment(page);
	}

	async fillAttachmentPage(data) {
		if (data.hasAttachment?.toLowerCase() === 'yes') {
			await this.deAttachment.addAttachments(data);
		}
	}

	async saveAttachmentPage() {
		await this.commonButtons.clickButton(DeLabels.NEXT_PREVIEW_APPLICATION);
	}
}
