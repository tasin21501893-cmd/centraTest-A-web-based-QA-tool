/**
 * @author Muhammad Muntasir Mamoor
 * @since 08/25/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { DonePage } from '../../commonPages/donePage.js';
import { IdfPage } from './idfPage.js';

export class AttachedFilesPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachment = new AttachmentUtils(page);
        this.donePage = new DonePage(page);
        this.idfPage = new IdfPage(page);

        this.secAttachments = page.locator('section', {
            has: page.locator('h2', { hasText: 'Attachment(s)' })
        });
    }

    async navigateToAttachedFiles(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Attached Files cannot be saved or updated for Deleted individuals');
        }

        await this.donePage.clickLinkByText('Attached Files');
    }

    async fillAttachedFilesForm(data, attachmentData) {
        await this.attachment.addFile(data.testCaseNumber, attachmentData, null, this.secAttachments);
    }
}