/**
 * @author Sayed Ahmed Tasin
 * @since 10/29/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { ListPage } from '../../../commonPages/listPage.js';

export class ImmunizationSearchPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);

        this.txtFormId = page.locator('#formId');
        this.txtIndividual = page.locator('#clientLookup');
        this.firstLookupResult = page.locator('.ui-menu-item > .ui-menu-item-wrapper:visible');
        this.txtEnteredBy = page.locator('#enteredByIdLookup');
        this.dtpStartDate = page.locator('#startDate');
        this.dtpEndDate = page.locator('#endDate');
        this.rdoRefusedYes = page.locator('#refused1');
        this.rdoRefusedNo = page.locator('#refused2');
        this.btnSearch = page.locator('input[name="_action_search"]');
        this.btnCancel = page.locator('input[name="_action_cancel"]');
        this.btnClearSelection = page.locator('#clearSelectionLink');
        this.tblResults = page.locator('table.table, table');
        this.tblResultRows = page.locator('table tbody tr');
        this.lnkNewSearch = page.locator('a:text-is("New Search")');
    }

    /**
     * Enters Form ID into the search input.
     * @param {string} formId
     */
    async enterFormId(formId) {
        if (CommonUtils.isValueValid(formId)) {
            await this.txtFormId.fill(formId);
        }
    }

    /**
     * Enters Individual name and selects from auto-suggest lookup.
     * @param {string} individual
     */
    async enterIndividual(individual) {
        if (CommonUtils.isValueValid(individual)) {
            await this.txtIndividual.fill(individual);
            await this.firstLookupResult.first().click();
        }
    }

    /**
     * Clicks the Search submit button.
     */
    async clickSearch() {
        await this.btnSearch.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Searches immunization records by Form ID.
     * @param {string} formId
     */
    async searchByFormId(formId) {
        await this.enterFormId(formId);
        await this.clickSearch();
    }

    /**
     * Verifies that the specified Form ID is displayed in the search result table.
     * @param {string} formId
     */
    async verifyFormIdInResults(formId) {
        const matchingCell = this.page.locator(`table tbody tr td:text-is("${formId}")`).first();
        await expect(matchingCell).toBeVisible();
    }

    /**
     * Clicks the matching Form ID cell from the results table to navigate into the form.
     * @param {string} formId
     */
    async clickFormIdInResults(formId) {
        const matchingCell = this.page.locator(`table tbody tr td:text-is("${formId}")`).first();
        await matchingCell.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
