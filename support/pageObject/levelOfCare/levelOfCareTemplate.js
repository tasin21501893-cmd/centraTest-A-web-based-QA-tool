/**
 * @author Emran Hosssain Rabbi
 * @since 10/08/2026
 */

import { writeExcelCell } from '../../commonUtility/write-xlsx';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class LevelOfCareTemplate {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);

        this.nameInput = page.locator('#template\\.name');
        this.checklist1Select = page.locator('#template\\.checklist1Conf');
        this.checklist2Select = page.locator('#template\\.checklist2Conf');
        this.checklist3Select = page.locator('#template\\.checklist3Conf');
        this.questionnaireSelect = page.locator('#template\\.questionnaire');
    }

    /**
     * Fills all form fields directly using data[Label Name]
     * @param {Object} data 
     */
    async fillForm(data) {
        await this.page.waitForLoadState('load');
        if (await this.nameInput.isVisible()) {
            await this.nameInput.fill(data['Name']);
        }

        await this.checklist1Select.selectOption({ label: data['Section 1: Document Checklist'] });
        await this.checklist2Select.selectOption({ label: data['Section 2: Document Checklist'] });
        await this.checklist3Select.selectOption({ label: data['Section 3: Document Checklist'] });

        if (data['Questionnaire']) {
            await this.questionnaireSelect.selectOption({ label: data['Questionnaire'] });
        }
    }

    async addReasonForLoc(values) {
        const inputItems = Array.isArray(values)
            ? values.map(item => String(item ?? '').trim()).filter(Boolean)
            : String(values ?? '').split(',').map(item => item.trim()).filter(Boolean);

        for (const item of inputItems) {
            await this.commonButtons.clickButton('Add New');
            await this.page.locator('#waiver\\.name').fill(item);
            await this.commonButtons.clickButton('Save');
        }
    }

    async writeTemplateFormIds(rowIndex, sheetName) {
        const formID = await this.donePage.fetchFormIdFromDoneMessage();
        const filePath = 'resources/levelOfCare/levelOfCare.xlsx';
        writeExcelCell({ filePath, sheetName, row: rowIndex, col: 'templateFormId', value: formID });
    }
}
