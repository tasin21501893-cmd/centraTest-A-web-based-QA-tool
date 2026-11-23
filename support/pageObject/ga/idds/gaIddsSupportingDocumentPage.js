/**
 * @author Shahil Azmayish
 * @since 01/22/2026
 */

import { GaIddsAttachment } from '../utility/gaIddsAttachment.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { GaIddsLabels } from '../utility/gaIddsLabels.js';

export class GaIddsSupportingDocumentPage {
	constructor(page) {
		this.page = page;
		this.iddAttachment = new GaIddsAttachment(page);
		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.#initLocators(page);
	}

	async uploadSupportingDocuments(data) {
		const documentTypes = await this.commonUtils.parseCommaSeparatedList(data.documentType);
		const documentTitles = await this.commonUtils.parseCommaSeparatedList(data.documentTitle);
		const files = await this.commonUtils.parseCommaSeparatedList(data.fileName);
		const isLookups = await this.commonUtils.parseCommaSeparatedList(data.isDocumentLookup);
		const filterValues = await this.commonUtils.parseCommaSeparatedList(data.filterValue);
		const documentDescriptions = await this.commonUtils.parseCommaSeparatedList(data.description);

		const count = Math.max(documentTypes.length, documentTitles.length, files.length);

		for (let i = 0; i < count; i++) {
			const docType = documentTypes[i] || '';
			const title = documentTitles[i] || '';
			const file = files[i] || '';
			const isLookup = isLookups[i] || '';
			const filterVal = filterValues[i] || '';
			const documentDescription = documentDescriptions[i] || '';

			const docData = { docType, title, file, isLookup, filterVal, documentDescription };
			await this.iddAttachment.addDocument(docData);
		}
	}

	async addSupportingDocuments(data) {
		await this.commonButtons.clickButton(GaIddsLabels.ADD_EDIT_SUPPORTING_DOCUMENTS);
		await this.uploadSupportingDocuments(data);
	}

	async clickAddDocumentToDocStorage(fileName) {
		await this.tblAttachmentList.waitFor({ state: 'visible' });
		const row = this.tblAttachmentList.locator('tbody tr', { hasText: fileName });
		await row.locator('a.attachment-add-to-doc-storage').click();
	}

	async addDocumentViaDocStorage(data) {
		await this.commonButtons.clickButton(GaIddsLabels.ADD_EDIT_SUPPORTING_DOCUMENTS);
		await this.clickAddDocumentToDocStorage(data.fileName);
		await this.ddlDocStorageDocumentType.selectOption(data.docStorageType);
		await this.dtpDocumentReceivedDate.fill(data.receivedDate);
		await this.commonUtils.toggleCheckboxUsingLocator(
			this.page,
			this.chkShareableYes,
			data.shareable
		);
		await this.commonButtons.clickButton(GaIddsLabels.SAVE);
		await this.commonButtons.clickButton(GaIddsLabels.YES);
	}

	async removeDoc(data) {
		await this.commonButtons.clickButton(GaIddsLabels.ADD_EDIT_SUPPORTING_DOCUMENTS);
		await this.iddAttachment.removeDoc(data);
	}

	#initLocators(page) {
		this.tblAttachmentList = page.locator('#ga-attachment-list-table');
		this.ddlDocStorageDocumentType = page.locator('[name="type"]');
		this.dtpDocumentReceivedDate = page.locator('[id="receivedDate"]');
		this.chkShareableYes = page.locator('[name="shareable"]');
	}
}
