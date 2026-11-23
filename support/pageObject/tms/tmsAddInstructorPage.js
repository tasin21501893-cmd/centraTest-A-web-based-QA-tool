/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { tmsLabels } from './utility/tmsLabels.js';
import { tmsUtils } from './utility/tmsUtils.js';
import { DonePage } from '../../commonPages/donePage.js';

export class AddInstructorPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.#initLocators(page);
    }

    async fillAddInstructorForm(data) {
        if (data.className) {
            await this.listPage.fillFilterField(data.className);
            const targetRow = this.page.locator('td').filter({ hasText: data.className }).first();
            await targetRow.click();
        }

        if (data.instructor) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnInstructorDropdown, data.instructor);
        } else {
            await tmsUtils.selectFirstInstructor(this.btnInstructorDropdown, this.ddlInstructorList);
        }

        if (data.fileAttachment) {
            await this.attachmentUtils.addImage({ fileName: data.fileAttachment });
        }
    }

    async verifySuccessMessage() {
        await this.donePage.verifyPartialDoneMessage(tmsLabels.SAVED_SUCCESSFULLY);
    }

    async clickSave() {
        await this.commonButtons.clickButton(tmsLabels.SAVE);
    }

    async clickCancel() {
        await this.commonButtons.clickButton(tmsLabels.CANCEL);
    }

    #initLocators(page) {
        this.btnInstructorDropdown = page.locator('button[data-id="login"]');
        this.ddlInstructorList = page.locator('.dropdown-menu.open:visible');
        this.btnAddImage = page.locator('#imageId-image-upload .add-image-button');
    }
}
