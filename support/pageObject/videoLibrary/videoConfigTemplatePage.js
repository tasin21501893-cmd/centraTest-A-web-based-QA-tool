/**
 * @author Shahil Azmayish
 * @since 08/10/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { VideoTagConfigBasePage } from './videoTagConfigBasePage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class VideoConfigTemplatePage extends VideoTagConfigBasePage {
	constructor(page) {
		super(page, {
			modalSelector: '#video-tag-config-template-modal',
			tableSelector: '#videoTagConfigTemplateTable'
		});
		this.commonButtons = new CommonButtons(page);
		this.#initializeLocators(page);
	}

	async fillTemplateTitle(data) {
		if (data.title) {
			const titleToFill = this.#generateTitleWithSuffix(data);
			await this.txtTitle.fill(titleToFill);
		}
	}

	#generateTitleWithSuffix(data) {
		if (CommonUtils.isAffirmative(data.addSuffix)) {
			return `${data.title} ${Date.now()}`;
		}
		return data.title;
	}

	#initializeLocators(page) {
		this.txtTitle = page.locator('#title');
	}
}
