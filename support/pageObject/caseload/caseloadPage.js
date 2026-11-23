/**
 * @author Maksuda Islam (Lima)
 * @since 03/06/2025
 */

const OS_PROVIDER = 'os';

const INDIVIDUAL = 'individual';
const GROUP = 'group';
const CASE_MANAGER_GROUP = 'cmgroup';
const CASE_MANAGER_PROVIDER_GROUP = 'cmprovidergroup';

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { ListPage } from '../../commonPages/listPage';

export class CaseloadPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.btnCreateNewCaseload = page.getByRole('button', { name: 'Create New Caseload' });
        this.txtNameField = page.locator('[name="caseloadName"]');
        this.txtFirstNameSearchFieldChild = page.locator(".ui-column-filter.ui-inputfield.ui-inputtext.ui-widget.ui-state-default.ui-corner-all").nth(6);
        this.txtLastNameSearchFieldChild = page.locator(".ui-column-filter.ui-inputfield.ui-inputtext.ui-widget.ui-state-default.ui-corner-all").nth(8);
        this.txtFormIdSearchField = page.locator('th:has(span:text("Form ID")) input.ui-column-filter').nth(0);
        this.txtLastNameSearchFieldForOS = page.locator('[name="lastName"]');
        this.txtFirstNameSearchFieldForOS = page.locator('[name="firstName"]');
        this.successAlert = page.locator('.ui-messages-info-summary');

        this.utils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
    }

    async navigateToCaseloadPage(providerType) {
        if (providerType === 'os') {
            await this.utils.navigateToDashboardLink('Access Control', 'Manage Caseload');
        } else {
            await this.utils.navigateToDashboardLink('Admin', 'Caseload', 'Manage');
        }
    }

    async isCaseloadAbsent(caseloadName) {
        await this.listPage.fillFilterFieldForPrimeFaceListPage("Caseload", caseloadName);
        await this.page.locator('.pi.pi-spin.pi-spinner').waitFor({ state: 'hidden' });

        const isDataTableEmptyMsgExist = await this.utils.isElementAvailable(
            this.page.locator('#caseloadDataTable_data .ui-datatable-empty-message')
        );
        const isCaseloadExist = await this.utils.isElementAvailable(
            await this.page.locator('[id="caseloadDataTable_data"]').locator(`td[role="gridcell"]:text-is("${caseloadName}")`)
        );

        return (isDataTableEmptyMsgExist) || (!isCaseloadExist)
    }

    async waitForSpinnerToHideAndLoadDOM() {
        await this.page.locator('.pi.pi-spin.pi-spinner').waitFor({ state: 'hidden' });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickAddInRowByText(tableId, textSelectors) {
        let tableRowLocator = this.page.locator(`tbody#${tableId}_data tr`);

        for (const text of textSelectors) {
            tableRowLocator = tableRowLocator.filter({ has: this.page.locator(`td:text-is("${text}")`) });
        }

        if (await this.utils.isElementAvailable(tableRowLocator)) {
            await tableRowLocator.locator('a:has-text("Add")').click();

        } else {
            throw new Error(`Caseload or Individual doesn't exist.`)
        }

    }

    async searchAssignableIndividual(firstName, lastName, providerType) {
        if (providerType === OS_PROVIDER) {
            await this.txtFirstNameSearchFieldForOS.fill(firstName);
            await this.txtLastNameSearchFieldForOS.fill(lastName);

            await this.page.getByRole('button', { name: 'Search' }).click();

        } else {
            await this.txtFirstNameSearchFieldChild.fill(firstName);
            await this.txtLastNameSearchFieldChild.fill(lastName);
        }

        await this.waitForSpinnerToHideAndLoadDOM();

        const tableSelector = 'tbody#assignableClientsDataTable_data td';
        const isEmpty = await this.utils.isElementAvailable(this.page.locator(tableSelector).filter({ hasText: 'No Caseload found with given criteria' }));

        if (isEmpty) {
            throw new Error(`No Caseload Found with given name: ${firstName} ${lastName}.`);
        }

        await this.clickAddInRowByText("assignableClientsDataTable", [firstName, lastName]);
    }

    async searchAssignableCaseloadByFormID(formID) {
        await this.txtFormIdSearchField.fill(formID);
        await this.waitForSpinnerToHideAndLoadDOM();

        const isEmpty = await this.utils.isElementAvailable(this.page.locator('tbody#assignableCaseloadsDataTable_data td')
            .filter({ hasText: 'No Caseload found with given criteria' }));

        if (isEmpty) {
            throw new Error(`No Caseload Found with given ${formID}.`);
        }

        await this.clickAddInRowByText("assignableCaseloadsDataTable", [formID]);
    }

    async assertDisplayedErrorOnSave() {
        if (await this.utils.isElementAvailable(this.page.locator('.ui-messages-error-summary'))) {
            const errorMsg = await this.page.locator('.ui-messages-error-summary').textContent();
            throw new Error(`${errorMsg}`);
        }
    }

    async createCaseload(caseloadCreationData) {
        const { caseloadType, providerType, name, firstNameofAssignableIndividuals, lastNameofAssignableIndividuals, formIDofAssignableCaseloads } = caseloadCreationData;
        const type = caseloadType.toLowerCase();

        await this.btnCreateNewCaseload.click();
        await this.page.waitForResponse(resp => resp.status() === 200);
        await this.page.waitForLoadState('domcontentloaded');

        await this.page.locator('#caseloadType_label').click();

        if (await this.utils.isElementAvailable(this.page.locator('[id="caseloadType_label"]'))) {
            if (type === INDIVIDUAL) {
                await this.page.click('ul#caseloadType_items li[data-label="Individual"]');

                await this.page.waitForResponse(resp => resp.status() === 200);
                await this.txtNameField.fill(name);

                const individualsFirstName = firstNameofAssignableIndividuals.split(',').map(name => name.trim());
                const individualsLastName = lastNameofAssignableIndividuals.split(',').map(name => name.trim());

                for (let index = 0; index < individualsFirstName.length; index++) {
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.searchAssignableIndividual(
                        individualsFirstName[index],
                        individualsLastName[index],
                        providerType
                    );
                }

            } else if (type === GROUP) {
                await this.page.click('ul#caseloadType_items li[data-label="Group"]');

                await this.page.waitForResponse(resp => resp.status() === 200);
                await this.txtNameField.fill(name);

                const caseloads = formIDofAssignableCaseloads.split(',');
                for (const formID of caseloads) {
                    await this.page.waitForLoadState('domcontentloaded');

                    await this.searchAssignableCaseloadByFormID(formID.trim());
                }

            } else if (type === CASE_MANAGER_GROUP) {
                await this.page.click('ul#caseloadType_items li[data-label="Case Manager Group"]');

                await this.page.waitForResponse(resp => resp.status() === 200);
                await this.txtNameField.fill(name);

                const caseloads = formIDofAssignableCaseloads.split(',');
                for (const formID of caseloads) {
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.searchAssignableCaseloadByFormID(formID.trim());
                }

            } else if (type === CASE_MANAGER_PROVIDER_GROUP) {
                await this.page.click('ul#caseloadType_items li[data-label="Case Manager Provider Group"]');

                await this.page.waitForResponse(resp => resp.status() === 200);
                await this.txtNameField.fill(name);

                const caseloads = formIDofAssignableCaseloads.split(',');
                for (const formID of caseloads) {
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.searchAssignableCaseloadByFormID(formID.trim());
                }

            } else {
                throw new Error(`Caseload type '${caseloadType}' doesn't exists.`)
            }
        }

        await this.commonButtons.clickButton('Save');
        await this.assertDisplayedErrorOnSave();
    }
}