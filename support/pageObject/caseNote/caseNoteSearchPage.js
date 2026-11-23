/**
 * @author Sunjare Zulfiker
 * @since 03/01/26
 */
import { expect } from '@playwright/test';

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { DateTimeUtils } from '../../commonUtility/dateTimeUtils.js';
import { SearchPage } from '../../commonPages/searchPage.js';
import { CaseNotePage } from './caseNotePage.js';

export class CaseNoteSearchPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.dateTimeUtils = new DateTimeUtils(page);
        this.searchPage = new SearchPage(page);
        this.caseNotePage = new CaseNotePage(page);

        this.alertDanger = page.locator('div.alert.alert-danger');
        this.iframe = page.locator('iframe').contentFrame();
        this.iframeWarningMsg = this.iframe.locator('div.alert.alert-danger');
        this.tblCaseNoteSearch = page.locator('#dataList');
        this.ddlCaseNoteSearchRecords = this.page.locator('.dataTables_length select');
        this.caseNoteSearchResultRows = this.page.locator('#dataList tbody tr');
        this.caseNoteEmptyTableMessage = this.page.locator('.empty-table-message');
    }

    /**
     * Grabs the Form ID from the first row of the search results table
     */
    async getFormIdFromFirstRow() {
        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();

        if (await this.caseNoteEmptyTableMessage.isVisible()) {
            throw new Error('Cannot fetch Form ID: The initial search returned no results within the 7-day range.');
        }

        await this.tblCaseNoteSearch.waitFor({ state: 'visible' });

        const colFormId = await this.listPage.getColumnIndexByName('Form ID');
        const firstRow = this.caseNoteSearchResultRows.first();
        const formIdText = await firstRow.locator(`td:nth-child(${colFormId})`).innerText();

        return formIdText.trim();
    }

    /**
     * Transforms raw testcase data into a structured payload for the label search.
     * @param {Object} testcase - The raw data row from the test execution
     * @returns {Object} The formatted search payload
     */
    async buildCaseNoteSearchPayload(testcase) {
        const searchPayload = {};

        if (testcase.individual && !CommonUtils.isAffirmative(testcase.advancedSearch)) searchPayload['Individual'] = testcase.individual;
        if (testcase.oversightId) searchPayload['Oversight ID'] = testcase.oversightId;
        if (testcase.serviceProvider) searchPayload['Service Provider'] = testcase.serviceProvider;
        if (testcase.formId) searchPayload['Form ID'] = testcase.formId;
        if (testcase.medicaidNumber) searchPayload['Medicaid Number'] = testcase.medicaidNumber;
        if (testcase.serviceDateFrom) searchPayload['Service Date From'] = await this.dateTimeUtils.getDate(testcase.serviceDateFrom);
        if (testcase.serviceDateTo) searchPayload['To'] = await this.dateTimeUtils.getDate(testcase.serviceDateTo);
        if (testcase.status) searchPayload['Status'] = testcase.status.split(',').map(s => s.trim());
        if (testcase.templateName) searchPayload['Template Name'] = testcase.templateName.split(',').map(t => t.trim());

        return searchPayload;
    }

    async searchCaseNoteForm(data) {
        await this.caseNotePage.navigateToCaseNote(data.isOversight, 'Search');

        const searchPayload = await this.buildCaseNoteSearchPayload(data);
        await this.searchPage.fillUpFormByLabels(searchPayload);

        if (CommonUtils.isAffirmative(data.advancedSearch)) {
            await this.searchPage.addIndividualFromAdvancedSearch(data);
        }

        await this.commonButtons.clickButton('Search');
    }

    /**
     * Dynamically verifies that all rows in the search results match the provided search criteria.
     * Maps all fields from the Case Note Search form to the DataList table.
     */
    async verifyCaseNoteSearchResultsMatchCriteria(data) {

        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();

        if (!await this.caseNoteEmptyTableMessage.isVisible()) {
            await this.tblCaseNoteSearch.waitFor({ state: 'visible' });

            if (await this.ddlCaseNoteSearchRecords.isVisible()) {
                await this.ddlCaseNoteSearchRecords.selectOption('100');
            }

            const colFormId = await this.listPage.getColumnIndexByName('Form ID');
            const colTemplate = await this.listPage.getColumnIndexByName('Template Name');
            const colIndividual = await this.listPage.getColumnIndexByName('Individual');
            const colMedicaid = await this.listPage.getColumnIndexByName('Medicaid Number');

            let colOversightId, colProvider;
            if (CommonUtils.isAffirmative(data.isOversight)) {
                colOversightId = await this.listPage.getColumnIndexByName('Oversight ID');
                colProvider = await this.listPage.getColumnIndexByName('Provider');
            }

            const colServiceDate = await this.listPage.getColumnIndexByName('Service Date');
            const colServiceProvider = await this.listPage.getColumnIndexByName('Service Provider');
            const colStatus = await this.listPage.getColumnIndexByName('Status');

            const rowCount = await this.caseNoteSearchResultRows.count();

            for (let i = 0; i < rowCount; i++) {
                const currentRow = this.caseNoteSearchResultRows.nth(i);

                if (data.formId) {
                    const formIdCellText = await currentRow.locator(`td:nth-child(${colFormId})`).innerText();

                    expect(formIdCellText.trim()).toBe(data.formId);
                }

                if (data.templateName) {
                    const templateCellText = await currentRow.locator(`td:nth-child(${colTemplate})`).innerText();
                    const expectedTemplates = data.templateName.split(',').map(t => t.split('/')[0].trim().toLowerCase());

                    expect.soft(expectedTemplates).toContain(templateCellText.trim().toLowerCase());
                }

                if (data.firstName || data.lastName || data.individual) {

                    const individualCellText = await currentRow.locator(`td:nth-child(${colIndividual})`).innerText();

                    if (data.firstName && data.lastName) {
                        const expectedFullName = `${data.lastName}, ${data.firstName}`;

                        expect(individualCellText.trim().toLowerCase()).toBe(expectedFullName.toLowerCase());
                    } else if (data.firstName || data.lastName) {
                        const searchName = data.firstName ? data.firstName : data.lastName;

                        expect(individualCellText.trim().toLowerCase()).toContain(searchName.toLowerCase());
                    } else if (data.individual) {
                        const searchNames = data.individual.split('/')[0].trim().split(/\s+/);

                        for (const name of searchNames) {
                            expect.soft(individualCellText.toLowerCase()).toContain(name.toLowerCase());
                        }
                    }
                }

                if (data.medicaidNumber) {
                    const medicaidCellText = await currentRow.locator(`td:nth-child(${colMedicaid})`).innerText();

                    expect(medicaidCellText.trim().toLowerCase()).toBe(data.medicaidNumber.toString().toLowerCase());
                }

                if (CommonUtils.isAffirmative(data.isOversight)) {
                    if (data.oversightId) {
                        const oversightCellText = await currentRow.locator(`td:nth-child(${colOversightId})`).innerText();
                        
                        expect.soft(oversightCellText).toContain(data.oversightId.toString());
                    }

                    if (data.linkedProvider) {
                        const providerCellText = await currentRow.locator(`td:nth-child(${colProvider})`).innerText();
                        const providerCode = data.linkedProvider.split('||');

                        expect.soft(providerCellText.trim()).toBe(providerCode[1].trim());
                    }
                }

                if (data.serviceDateFrom && data.serviceDateTo) {
                    const dateCellText = await currentRow.locator(`td:nth-child(${colServiceDate})`).innerText();
                    const actualTableDate = DateTimeUtils.convertDateTimeToEpoch(dateCellText.trim());

                    const fromDateStr = await this.dateTimeUtils.getDate(data.serviceDateFrom);
                    const fromDate = DateTimeUtils.convertDateTimeToEpoch(fromDateStr);
                    const toDateStr = await this.dateTimeUtils.getDate(data.serviceDateTo);
                    const toDate = DateTimeUtils.convertDateTimeToEpoch(toDateStr);

                    expect(actualTableDate).toBeLessThanOrEqual(toDate);
                    expect(actualTableDate).toBeGreaterThanOrEqual(fromDate);
                }

                if (data.serviceProvider) {
                    const providerCellText = await currentRow.locator(`td:nth-child(${colServiceProvider})`).innerText();
                    const serviceProviderParts = data.serviceProvider.split(/[\s/]+/);

                    for (const part of serviceProviderParts) {
                        expect.soft(providerCellText.toLowerCase()).toContain(part.toLowerCase());
                    }
                }

                if (data.status) {
                    const statusCellText = await currentRow.locator(`td:nth-child(${colStatus})`).innerText();
                    const expectedStatuses = data.status.split(',').map(s => s.trim().toLowerCase());

                    expect.soft(expectedStatuses).toContain(statusCellText.trim().toLowerCase());
                }
            }
        } else {
            throw new Error(`The search returned no results. Found message: '${await this.caseNoteEmptyTableMessage.innerText()}'`);
        }
    }
}