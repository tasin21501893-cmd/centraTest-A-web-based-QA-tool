/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';
import { tmsLabels } from './utility/tmsLabels.js';
import { DonePage } from '../../commonPages/donePage.js';

export class CoursePage {
    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.#initLocators(page);
    }

    async fillCourseForm(data) {
        if (data.courseName) {
            await this.txtName.fill(`${data.courseName}_${Date.now()}`);
        }

        if (data.description) {
            await this.txtDescription.fill(data.description);
        }

        if (data.className) {
            await this.listPage.fillFilterField(data.className);
            const targetRow = this.page.locator('tr').filter({ hasText: data.className }).first();
            await targetRow.locator('input.select-action').check();

        } else if (data.noOfClasses) {
            await this.ddlTableLength.selectOption({ label: data.noOfClasses });
            await this.chkSelectAllTrainingClasses.check();
        }
    }

    async clickSave() {
        await this.commonButtons.clickButton(tmsLabels.SAVE);
    }

    async clickCancel() {
        await this.commonButtons.clickButton(tmsLabels.CANCEL);
    }

    async verifySuccessMessage() {
        await this.donePage.verifyPartialDoneMessage(tmsLabels.SAVED_SUCCESSFULLY);
    }

    #initLocators(page) {
        this.txtName = page.locator('input[id="name"]');
        this.txtDescription = page.locator('textarea[id="description"]');
        this.ddlTableLength = page.locator('select#dt-length-0');
        this.chkSelectAllTrainingClasses = page.locator('input.select-all');
    }
}
