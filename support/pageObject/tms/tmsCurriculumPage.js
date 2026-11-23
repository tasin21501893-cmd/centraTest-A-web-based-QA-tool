/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { tmsLabels } from './utility/tmsLabels.js';

export class CurriculumPage {
    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.#initLocators(page);
    }

    async fillCurriculumForm(data) {
        if (data.curriculumName) {
            await this.txtName.fill(`${data.curriculumName}_${Date.now()}`);
        }

        if (data.description) {
            await this.txtDescription.fill(data.description);
        }

        if (data.courseName) {
            await this.listPage.fillFilterField(data.courseName);
            const targetRow = this.page.locator('tr').filter({ hasText: data.courseName }).first();
            await targetRow.locator('input.select-action').check();

        } else if (data.noOfCourses) {
            await this.ddlTableLength.selectOption({ label: data.noOfCourses });
            await this.chkSelectAllCourses.check();
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
        this.chkSelectAllCourses = page.locator('input.select-all');
    }
}
