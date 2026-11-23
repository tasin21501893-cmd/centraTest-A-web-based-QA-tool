/**
 * @author Muhammad Muntasir Mamoor
 * @author Emran Hossain Rabbi
 * @since 17/08/24
*/
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';

export class ProgramPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);

        this.txtProgramName = page.locator('[name="name"]');
        this.btnProgramType = page.locator('button[data-id="programType"]');
        this.btnSiteName = page.locator('button[data-id="site"]');
        this.txtProgramId = page.locator('[name="rdid"]');
        this.txtProgramTabsId = page.locator('[name="programTabsId"]');
        this.txtProgramCode = page.locator('[name="programCode"]');
        this.txtProgramCostCenterNumber = page.locator('[name="programCostCenterNumber"]');
        this.txtCapacity = page.locator('[name="capacity"]');

        this.txtPrimaryContactName = page.locator('[name="pcName"]');
        this.txtPrimaryContactPhone1 = page.locator('[name="pcPhone1"]');
        this.txtPrimaryContactPhone1Ext = page.locator('[name="pcPhone1Ext"]');
        this.txtPrimaryContactPhone2 = page.locator('[name="pcPhone2"]');
        this.txtPrimaryContactPhone2Ext = page.locator('[name="pcPhone2Ext"]');

        this.txtSecondaryContactName = page.locator('[name="scName"]');
        this.txtSecondaryContactPhone1 = page.locator('[name="scPhone1"]');
        this.txtSecondaryContactPhone1Ext = page.locator('[name="scPhone1Ext"]');
        this.txtSecondaryContactPhone2 = page.locator('[name="scPhone2"]');
        this.txtSecondaryContactPhone2Ext = page.locator('[name="scPhone2Ext"]');

        this.txtEnrollmentDate = page.getByRole('textbox', { name: 'Enrollment Date *' });

        this.getProgramAndSiteName = (programName, siteName) =>
            page.getByRole('row')
                .filter({ has: page.getByText(programName, { exact: true }) })
                .filter({ has: page.getByText(siteName, { exact: true }) })
                .getByText(programName, { exact: true });
        this.getTableRows = (tableId) => page.locator(`${tableId}_data tr`);
        this.getTableColumnFilter = (tableId, columnName) => page.locator(`${tableId} th`).filter({ hasText: columnName }).locator('input.ui-column-filter');
        this.getEnrollLink = (rowIndex) => page.locator('#enrollableClientsTable_data tr').nth(rowIndex).locator('a', { hasText: 'Enroll' });
        this.getReEnrollLink = (rowIndex) => page.locator('#enrolledClientsTable_data tr').nth(rowIndex).locator('a', { hasText: 'Re-Enroll' });
    }

    async isProgramExist(programName, siteName) {
        const tblProgramList = this.page.locator('table#dataList');
        const tblRows = tblProgramList.locator('tbody tr');
        
        if (!programName || !siteName) {
            throw new Error(`Program and Site can not be null`);
        }

        await this.page.waitForLoadState('domcontentloaded');

        if(await this.listPage.isItemExist(programName)) {
            let exactRow = await tblRows
            .filter({ has: this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Program Name')}):text-is("${programName}")`) })
            .filter({ has: this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Site Name')}):text-is("${siteName}")`) });

            if (await exactRow.count() > 0) {
                throw new Error(`Program : "${programName}" with Site : "${siteName}" already exists`);
            }
        }
    }

    async programDetailsFillUp(data) {
        await this.txtProgramName.fill(data.programName);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnProgramType, data.programType);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnSiteName, data.siteName);
        await this.txtProgramId.fill(data.programId);

        if (await this.txtProgramTabsId.count() > 0) {
            await this.txtProgramTabsId.fill(data.programTabsId);
        }
        await this.txtProgramCode.fill(data.programCode);
        await this.txtProgramCostCenterNumber.fill(data.programCostCenterNumber);
        await this.txtCapacity.fill(data.capacity);
    }

    async programContactFillUp(data) {
        await this.txtPrimaryContactName.fill(data.primaryContactName);
        await this.txtPrimaryContactPhone1.fill(data.primaryContactPhone1);
        await this.txtPrimaryContactPhone1Ext.fill(data.primaryContactPhone1Ext);
        await this.txtPrimaryContactPhone2.fill(data.primaryContactPhone2);
        await this.txtPrimaryContactPhone2Ext.fill(data.primaryContactPhone2Ext);

        await this.txtSecondaryContactName.fill(data.secondaryContactName);
        await this.txtSecondaryContactPhone1.fill(data.secondaryContactPhone1);
        await this.txtSecondaryContactPhone1Ext.fill(data.secondaryContactPhone1Ext);
        await this.txtSecondaryContactPhone2.fill(data.secondaryContactPhone2);
        await this.txtSecondaryContactPhone2Ext.fill(data.secondaryContactPhone2Ext);
    }

    async programFormFillUp(data) {
        await this.programDetailsFillUp(data);
        await this.programContactFillUp(data);
    }

    //enroll all indi of a prog
    async programEnrollment(programName) {
        await this.page.getByText(programName, { exact: true }).click();
        await this.page.getByRole('button', { name: 'Save And Add Individual(s)' }).click();

        const rows = this.page.locator('#enrollableClientsTable_data tr[role="row"]');
        const count = await rows.count();

        for (let i = 0; i < count; i++) {
            await this.page.getByRole('link', { name: 'Enroll' }).first().click();
            await this.page.getByRole('button', { name: 'Enroll' }).click();
        }

        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    /**
     * Finds the exact row index of an individual based on their full name and Date of Birth.
     * @param {string} tableId - The ID of the table to search.
     * @param {string} expectedFirstName - The expected first name.
     * @param {string} expectedMiddleName - The expected middle name.
     * @param {string} expectedLastName - The expected last name.
     * @param {string} expectedDob - The expected Date of Birth (MM/DD/YYYY).
     * @returns {Promise<number>} - The row index if found, otherwise -1.
     */
    async getExactIndividualRowIndex(
        tableId,
        expectedFirstName,
        expectedMiddleName,
        expectedLastName,
        expectedDateOfBirth
    ) {
        const rows = this.getTableRows(tableId);

        await rows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

        const normalize = (value) => (value ?? '').trim().toLowerCase();

        const expFirst = normalize(expectedFirstName);
        const expMiddle = normalize(expectedMiddleName);
        const expLast = normalize(expectedLastName);
        const expDob = expectedDateOfBirth ?? '';

        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const classAttr = await rows.nth(i).getAttribute('class');
            if (classAttr?.includes('ui-datatable-empty-message')) {
                continue;
            }

            const cells = rows.nth(i).locator('td');

            const actualFirst = normalize(await cells.nth(0).textContent());
            const actualMiddle = normalize(await cells.nth(1).textContent());
            const actualLast = normalize(await cells.nth(2).textContent());
            const actualDob = await cells.nth(3).textContent() ?? '';

            if (
                actualFirst === expFirst &&
                actualMiddle === expMiddle &&
                actualLast === expLast &&
                actualDob === expDob
            ) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Enrolls an individual into a specified program.
     * @param {Object} testcase - Enrollment testcase data.
     * @throws {Error} If already enrolled or not found in enrollable list.
     */
    async enrollmentByProgram(testcase) {
        await this.getProgramAndSiteName(testcase.programName, testcase.siteName).click();
        await this.commonButtons.clickButton('Save And Add Individual(s)');

        const filterTable = async (tableId) => {
            await this.getTableColumnFilter(tableId, 'First Name').fill(testcase.firstName || '');
            await this.getTableColumnFilter(tableId, 'Middle Name').fill(testcase.middleName || '');

            const lastNameInput = this.getTableColumnFilter(tableId, 'Last Name');
            await lastNameInput.fill(testcase.lastName || '');
            await lastNameInput.press('Enter');

            await this.commonUtils.waitForChangeInDOM(tableId);
        };

        await filterTable('#enrolledClientsTable');

        const enrolledRowIndex = await this.getExactIndividualRowIndex(
            '#enrolledClientsTable',
            testcase.firstName,
            testcase.middleName,
            testcase.lastName,
            testcase.dateOfBirth
        );

        if (enrolledRowIndex !== -1) {
            const fullName = [
                testcase.firstName,
                testcase.middleName,
                testcase.lastName
            ].filter(Boolean).join(' ');

            const rowLocator = this.page.locator(
                `#enrolledClientsTable tr[data-ri="${enrolledRowIndex}"]`
            );

            const actionCell = rowLocator.locator('td', { hasText: 'Re-Enroll' });

            if (await actionCell.count() > 0) {
                await this.getReEnrollLink(enrolledRowIndex).click();
                await this.txtEnrollmentDate.fill(testcase.enrollmentDate);
                await this.commonButtons.clickButton('Enroll');
                await this.commonButtons.clickButton('Save');
                await this.commonButtons.clickButton('Update');
                return;
            }

            throw new Error(`Individual with Name: ${fullName} already Enrolled`);
        }

        await filterTable('#enrollableClientsTable');

        const enrollableRowIndex = await this.getExactIndividualRowIndex(
            '#enrollableClientsTable',
            testcase.firstName,
            testcase.middleName,
            testcase.lastName,
            testcase.dateOfBirth
        );

        if (enrollableRowIndex === -1) {
            const fullName = [
                testcase.firstName,
                testcase.middleName,
                testcase.lastName
            ].filter(Boolean).join(' ');

            throw new Error(`Individual with Name: ${fullName} not found in enrollable list.`);
        }

        await this.getEnrollLink(enrollableRowIndex).click();
        await this.txtEnrollmentDate.fill(testcase.enrollmentDate);
        await this.commonButtons.clickButton('Enroll');
        await this.commonButtons.clickButton('Save');
        await this.commonButtons.clickButton('Update');
    }
}