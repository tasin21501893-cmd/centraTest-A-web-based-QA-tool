/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

import { AttachmentUtils } from '../../../commonUtility/attachmentUtils.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { GaIddsLabels } from './gaIddsLabels.js';

export class GaIddsAttachment {
	constructor(page) {
		this.page = page;
		this.attachmentUtils = new AttachmentUtils(page);
		this.commonButtons = new CommonButtons(page);
		this.#initLocators(page);
	}

	async addDocument(docData) {
		if (docData.docType) {
			await this.ddlDocumentType.selectOption({ label: docData.docType });
		}

		if (docData.title) {
			await this.txtDocumentTitle.fill(docData.title);
		}

		if (await this.btnAddFile.isVisible()) {
			await this.commonButtons.clickButton(GaIddsLabels.ADD_FILE);
		}

		if (CommonUtils.isAffirmative(docData.isLookup)) {
			const lookupData = { filterValue: docData.filterVal };
			await this.attachmentUtils.selectDocumentLookup(lookupData);

		} else if (docData.file) {
			const uploadData = { fileName: docData.file };

			if (docData.documentDescription) {
				await this.txtDocumentDescription.fill(docData.documentDescription);
			}
			await this.attachmentUtils.attachFile(uploadData, this.btnBrowse);
			await this.commonButtons.clickButton(GaIddsLabels.UPLOAD);
		}
		await this.commonButtons.clickButton(GaIddsLabels.ADD_DOCUMENT);
		await this.btnAddFile.waitFor({ state: 'visible', timeout: 10000 });
	}

	async removeDoc(data) {
		await this.tblAttachmentList.waitFor({ state: 'visible' });
		await this.page.locator('tr', { hasText: data.fileName }).getByRole('link', { name: GaIddsLabels.REMOVE }).first().click();
		await this.commonButtons.clickButton(GaIddsLabels.YES);
	}

	#initLocators(page) {
		this.btnBrowse = page.getByText('Browse');
		this.tblAttachmentList = page.locator('#ga-attachment-list-table');
		this.btnAddFile = page.getByRole('button', { name: GaIddsLabels.ADD_FILE });
		this.btnAddDocument = page.locator('input[name="_action_attach"]');
		this.ddlDocumentType = page.locator('#attachment\\.documentTypeCode');
		this.txtDocumentTitle = page.getByRole('textbox', { name: GaIddsLabels.TITLE });
		this.txtDocumentDescription = page.getByRole('textbox', { name: GaIddsLabels.DESCRIPTION });
		this.btnClickYes = page.locator('.btn.btn-primary.btn-sm.btn-prompt-yes');
	}
}
