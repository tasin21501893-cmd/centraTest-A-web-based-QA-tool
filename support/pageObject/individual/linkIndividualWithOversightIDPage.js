/**
* @author Md. Ragib Aunjum
* @since 02/14/2026
*/

import { ListPage } from '../../commonPages/listPage';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class LinkIndividualWithOversightIDPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);

        this.txtLastNameSearch = page.locator('[name="lastName"]');
        this.txtFirstNameSearch = page.locator('[name="firstName"]');
        this.txtMedicaidNumberSearch = page.locator('[name="medicaidNumber"]');
        this.txtIndividualIdNumberSearch = page.locator('[name="idNumber"]');
        this.txtOversightIDSearch = page.locator('[name="oversightId"]');
        this.ddlProvider = page.locator('div#provider');
        this.lstProviderItems = page.locator('li.ui-selectonemenu-item');
        this.ddlSortOn = page.locator('div#sortColumn');
        this.ddlSortOrder = page.locator('div#sortOrder');
        this.lblBirthDateHeader = page.locator('th[role="columnheader"]').filter({ hasText: 'Birth Date' });
        this.btnRemove = page.locator('button.ui-button-delete').filter({ hasText: 'Remove' });
        this.tblResults = page.locator('div#searchResultList');
        this.tblHeader = page.locator('thead#searchResultList_head');
        this.tblDataRows = page.locator('tbody#searchResultList_data tr');
        this.txtOversightIDInput = page.locator('input[id$="oversightId"]');
        this.alrtSuccessAlert = page.locator('.ui-messages-info-summary');
    }

    async navigateToLinkOversightIDPage() {
        await this.commonUtils.navigateToDashboardLink('Intake', 'Multi-Provider Individual', 'Link Individuals with Oversight ID');
        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
    }

    async searchForIndividual(testcase) {
        const lastName = String(testcase.lastName || '');
        const firstName = String(testcase.firstName || '');
        const medicaidNumber = String(testcase.medicaidNumber || '');
        const individualID = String(testcase.individualID || '');
        const oversightID = String(testcase.oversightIDSearch || '');

        await this.txtLastNameSearch.fill(lastName);

        if (firstName) {
            await this.txtFirstNameSearch.fill(firstName);
        }

        if (medicaidNumber) {
            await this.txtMedicaidNumberSearch.fill(medicaidNumber);
        }

        if (individualID) {
            await this.txtIndividualIdNumberSearch.fill(individualID);
        }

        if (oversightID) {
            await this.txtOversightIDSearch.fill(oversightID);
        }

        if (testcase.providerName) {
            await this.ddlProvider.click();
            await this.lstProviderItems
                .filter({ hasText: String(testcase.providerName) })
                .click();
        }

        await Promise.all([
            this.page.waitForResponse(resp => resp.status() === 200),
            this.commonButtons.clickButton('Search'),
        ]);

        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
    }

    async clickEditByUniqueRow(testcase) {

        let uniqueRow = this.tblDataRows
            .filter({ hasText: testcase.lastName })
            .filter({ hasText: testcase.firstName })
            .filter({ hasText: testcase.providerName })
            .filter({ hasText: testcase.birthDate })
            .filter({ hasText: testcase.oversightIDSearch })

        if (testcase.medicaidNumber) {
            uniqueRow = uniqueRow.filter({ hasText: testcase.medicaidNumber });
        }

        if (testcase.individualID) {
            uniqueRow = uniqueRow.filter({ hasText: testcase.individualID });
        }

        const editLink = uniqueRow.first().getByRole('link', { name: 'Edit' });

        await editLink.waitFor({ state: 'attached' }).catch(() => {
            throw new Error(`Individual not found. Please verify the data discrepancies between the test data and the UI.`);
        });

        await editLink.scrollIntoViewIfNeeded();

        await Promise.all([
            this.page.waitForResponse(resp => resp.status() === 200).catch(() => { }),
            editLink.click(),
        ]);

        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();

        await Promise.race([
            this.txtOversightIDInput.first().waitFor({ state: 'visible' }).catch(() => { }),
            this.btnRemove.first().waitFor({ state: 'visible' }).catch(() => { })
        ]);
    }

    async performOversightAction(testcase) {

        if (String(testcase.action).toLowerCase() === 'assign') {
            const isInputVisible = await this.txtOversightIDInput.first().isVisible();

            if (isInputVisible) {
                await this.txtOversightIDInput.fill(String(testcase.newOversightID || ''));

                await Promise.all([
                    this.page.waitForResponse(r => r.url().includes('editId.xhtml') && r.status() === 200),
                    this.commonButtons.clickButton('Assign')
                ]);
            }
        }
        else if (String(testcase.action).toLowerCase() === 'remove') {
            const isRemoveVisible = await this.btnRemove.first().isVisible();
            
            if (isRemoveVisible) {
                await this.commonButtons.clickButton('Remove');

                const btnYes = this.page.locator('button.ui-confirmdialog-yes');

                await btnYes.waitFor({ state: 'attached' });

                await Promise.all([
                    this.page.waitForResponse(r => r.url().includes('editId.xhtml') && r.status() === 200),
                    btnYes.dispatchEvent('click')
                ]);
            }
        }

        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
        await this.alrtSuccessAlert.first().waitFor({ state: 'attached' }).catch(() => { });
    }
}