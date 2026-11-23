/**
 * @author Timon Protik Mondal
 * @since 03/27/2026
 */

import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../../support/commonUtility/attachmentUtils.js';

export class ConsentTypePage {
    
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);

        this.txtDescription = page.locator('input[name="description"]');
    }

    async processConsentType(data, action) {
        await this.txtDescription.fill(data.description);
        await this.addAttachmentIfAvailable(data);
        await this.commonButtons.clickButton(action);
    }

    async addAttachmentIfAvailable(data) {
        if (data.fileName) {
            await this.attachmentUtils.addAttachment(data); 
        }
    }
}