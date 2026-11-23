/**
 * @author Emran Hossain Rabbi
 * @since 10/09/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CreateMHForm } from '../medHistory/createMHForm.js';
import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';

export class MarConfigPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page)

        this.createMHForm = new CreateMHForm(page);
        this.txtFilter = page.getByPlaceholder('Filter');
        this.programList = page.locator('#programList');
        this.programListRows = page.locator('#programList td');
        this.ddlIndividualId = page.locator('#individualId');
        this.alertSuccess = page.locator('[class="alert alert-success text-center"]');
        this.dataCellToday = page.locator('.dataCell.today');
    }

    async selectProgram(programName) {
        await this.page.waitForLoadState('load');
        const programListCount = await this.programList.count();

        if (programListCount > 0) {
            await this.listPage.selectFilteredFirstItem(programName)
        }
    }

    async marConfig(data, medicationName) {
        await this.selectProgram(data['Program Name'])
        await this.page.selectOption('#individualId', await this.page.locator(`#individualId option:has-text("${data["IndividualName"]}")`).getAttribute('value'));
        await this.commonButtons.clickButton('Submit')
        await this.page.waitForLoadState('domcontentloaded')
        const medContainer = this.page.locator(`.configMedContainer:has(.medName:text-is("${medicationName}"))`);
        const targetCells = medContainer.locator('table.adminTable.quick td.dataCell:is(.today, .odd, .even)');
        const cellArray = await targetCells.elementHandles();

        for (const cell of cellArray) {
            await cell.click({ force: true });
        }

        await this.commonButtons.clickButton('Approve');
        await this.donePage.verifyPartialDoneMessage('has been successfully approved');
    }
}