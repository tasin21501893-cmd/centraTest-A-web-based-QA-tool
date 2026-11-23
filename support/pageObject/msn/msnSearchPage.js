/**
 * @author M M Kabid Hasan
 * @since 08/13/2026
 */

import { SearchPage } from '../../commonPages/searchPage.js';

export class MsnSearchPage extends SearchPage {
    constructor(page) {
        super(page);
        this.txtProgramField = page.locator('#programLookup');
        this.btnMonthPicker = page.locator('#monthPickerBtn');
        this.cntMonthPicker = page.locator('#monthPicker');
        this.btnYearPicker = page.locator('#yearPickerBtn');
        this.cntYearPicker = page.locator('#yearPicker');
        this.btnStatusPicker = page.locator('#statusPickerBtn');
        this.cntStatusPicker = page.locator('#statusPicker');
    }

    async fillUpForm(data) {
        await super.fillUpForm(data);
        data.program && (await this.setProgramField(data.program));
        data.month && (await this.setMonth(data.month));
        data.year && (await this.setYear(data.year));
    }

    async setStatusField(statuses) {
        await this.btnStatusPicker.click();
        const statusArray = Array.isArray(statuses) ? statuses : [statuses];

        for (const status of statusArray) {
            await this.cntStatusPicker.getByText(status, { exact: true }).click();
        }

        await this.btnStatusPicker.click(); 
    }

    async setProgramField(programName) {
        await this.txtProgramField.fill(programName);
        await this.firstLookupResult.click(); 
    }

    async setMonth(month) {
        await this.btnMonthPicker.click();
        await this.cntMonthPicker
            .getByRole('option', { name: month, exact: true })
            .click();
    }

    async setYear(year) {
        await this.btnYearPicker.click();
        await this.cntYearPicker
            .getByRole('option', { name: year.toString(), exact: true })
            .click();
    }
}
