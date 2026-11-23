/**
 * @author Rifat Ara
 * @since 03/30/2026
 */

import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { DeLabels } from './deLabels.js';
import { AttachmentUtils } from '../../../commonUtility/attachmentUtils.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class DeAttachment {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.attachmentUtils = new AttachmentUtils(page);
		this.commonUtils = new CommonUtils(page);
		this.#initLocators();
	}

	async fillDocumentDetails(data) {
		if (data.documentType) {
			await this.ddlDocumentType.selectOption({ label: data.documentType }, { force: true });
			await this.ddlDocumentType.evaluate((node) => {
				
				if (typeof $ !== 'undefined') {
					$(node).trigger('change');

					if ($(node).hasClass('selectpicker')) {
						$(node).selectpicker('refresh');
					}

				} else {
					node.dispatchEvent(new Event('change', { bubbles: true }));
				}
			});
		}

		data.fileTitle && await this.txtTitle.fill(data.fileTitle);
		data.fileName && await this.attachmentUtils.addAttachment(data);
	}

	async addAttachments(data) {
		const documentTypes = this.commonUtils._parseOptionList(data.documentType);
		const fileTitles = this.commonUtils._parseOptionList(data.fileTitle);
		const fileNames = this.commonUtils._parseOptionList(data.fileName);
		const fileDescriptions = this.commonUtils._parseOptionList(data.fileDescription);
		const length = Math.max(
			documentTypes.length,
			fileTitles.length,
			fileNames.length,
			fileDescriptions.length
		);

		for (let i = 0; i < length; i++) {
			const rowData = {
				documentType: documentTypes[i] || '',
				fileTitle: fileTitles[i] || '',
				fileName: fileNames[i] || '',
				fileDescription: fileDescriptions[i] || '',
			};

			await this.fillDocumentDetails(rowData);
			await this.commonButtons.clickButton(DeLabels.ADD_DOCUMENT);
		}
	}

	#initLocators() {
		this.ddlDocumentType = this.page.locator('[name="documentType"]');
		this.txtTitle = this.page.locator('[name="fileTitle"]');
	}
}
