/**
 * @author Maksuda Islam (Lima)
 * @author Emran Hossain Rabbi
 * @since 03/06/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { UserPrivilegePage } from '../userPrivilege/userPrivilegePage';
import { expect } from 'playwright/test';

export class SuperRolePage {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.btnCreateNewSuperRole = page.getByRole('button', { name: 'Create New Super Role' });
        this.txtSuperRoleNameField = page.locator('input#superRoleName');
        this.txtSuperRoleDescriptionField = page.locator('textarea#superRoleDescription');
        this.successAlert = page.locator('.ui-messages-info-summary');

        this.utils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.userPrivilegePage = new UserPrivilegePage(page);
    }

    async isSuperRoleAbsent(superRoleName) {
        const table = this.page.locator('#superRoleDataTable');
        const header = table.locator('[role="columnheader"][aria-label="Super Role"]');
        const input = header.locator('input[role="textbox"]');

        await input.fill(superRoleName);
        await input.press('Enter');

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.pi.pi-spin.pi-spinner').waitFor({ state: 'hidden' });
        await this.utils.waitForChangeInDOM('#superRoleDataTable');

        const isDataTableEmptyMsgExist = await this.utils.isElementAvailable(
            this.page.locator('#superRoleDataTable_data .ui-datatable-empty-message')
        );

        const isSuperRoleExist = await this.utils.isElementAvailable(
            this.page.locator('#superRoleDataTable_data').locator(`td[role="gridcell"]:text-is("${superRoleName}")`)
        );

        return isDataTableEmptyMsgExist || !isSuperRoleExist;
    }

    async selectAllVisibleSuperRole() {
        const rows = await this.page.$$('tbody > tr');

        for (const row of rows) {
            const checkbox = await row.$('input[type="checkbox"]');

            if (checkbox) {
                await checkbox.check();
            }
        }
    }

    async selectSuperRoleType(isShareableSuperRole) {
        await this.page.waitForLoadState('domcontentloaded');

        if (await this.utils.isElementAvailable(this.page.locator('#superRoleType'))) {
            await this.page.locator('#superRoleType_label').click();

            if (CommonUtils.isAffirmative(isShareableSuperRole)) {
                await this.page.getByRole('option', { name: 'Shareable Super Role', exact: true }).click();

            } else {
                await this.page.getByRole('option', { name: 'Super Role', exact: true }).click();
            }

        }
    }

    async assertDisplayedErrorOnSave() {
        if (await this.utils.isElementAvailable(this.page.locator('.ui-messages-error-summary'))) {
            const errorMsg = await this.page.locator('.ui-messages-error-summary').textContent();
            throw new Error(`${errorMsg}`);
        }
    }

    async createSuperRole(superRoleData, arrayOfSuperRoleListData, providerCode) {
        const { isShareableSuperRole, name, description, checkAll } = superRoleData;

        await this.btnCreateNewSuperRole.click();

        await this.selectSuperRoleType(isShareableSuperRole);
        await this.txtSuperRoleNameField.fill(name);
        await this.txtSuperRoleDescriptionField.fill(description);

        if (CommonUtils.isAffirmative(checkAll)) {
            await this.selectAllVisibleSuperRole();

        } else {
            await this.userPrivilegePage.checkModuleWiseRole(arrayOfSuperRoleListData, providerCode);
        }

        await this.commonButtons.clickButton('Save');

        await this.assertDisplayedErrorOnSave();
    }

    async selectRolePrivilegesForACF(PrivilegeNameList) {
        for (let i = 0; i < PrivilegeNameList.length; i++) {
            await this.page.getByText(PrivilegeNameList[i]).click()
        }
    }

    async createSuperRoleWithRolePrivilegeLabel(superRoleData, PrivilegeNameList) {
        const { isShareableSuperRole, name, description } = superRoleData;

        await this.btnCreateNewSuperRole.click();

        await this.selectSuperRoleType(isShareableSuperRole);
        await this.txtSuperRoleNameField.fill(name);
        await this.txtSuperRoleDescriptionField.fill(description);

        await this.selectRolePrivilegesForACF(PrivilegeNameList);
        await this.commonButtons.clickButton('Save');
    }

    /**
 * Handles checking and unchecking checkboxes for a given Super Role module section.
 * 
 * @async
 * @function checkAndUncheckSuperRole
 * @param {string} moduleTitle - The title of the module panel (e.g., "Induvidual", "MAR Data").
 * @param {string} roleString - A comma-separated string of roles or commands ("All", "Yes", "No", or specific role names - MAR Data Update, MAR Data View (Exact match)).
 * 
 * @description
 * - If `roleString` is "all" or "yes" → checks all checkboxes under the module.
 * - If `roleString` is "no" or empty → unchecks all checkboxes.
 * - Otherwise, unchecks all first, then checks only the specific roles mentioned.
 */
    async checkAndUncheckSuperRole(moduleTitle, roleString) {
        const panel = this.page.locator(`.ui-datagrid .ui-panel:has(:text("${moduleTitle}"))`);
        await panel.first().waitFor();
        let checkboxes = panel.locator('input[type="checkbox"]');
        let count = await checkboxes.count();
        const roles = roleString.split(',').map(v => v.trim());

        const uncheckAllRoleCheckboxes = async () => {
            for (let i = 0; i < count; i++) {
                const checkbox = checkboxes.nth(i);
                await checkbox.uncheck();
            }
        };

        if (roles.length === 1 && ['all', 'yes'].includes(roles[0].toLowerCase())) {
            for (let i = 0; i < count; i++) {
                const checkbox = checkboxes.nth(i);
                await checkbox.check();
            }
        }

        else if (roles.length === 1 && (roles[0].toLowerCase() === '' || roles[0].toLowerCase() === 'no')) {
            await uncheckAllRoleCheckboxes()
        }
        else {
            await uncheckAllRoleCheckboxes()

            for (const role of roles) {
                const label = panel.getByText(role, { exact: true });
                const linkedCheckboxId = await label.getAttribute('for');
                const checkbox = panel.locator(`[id="${linkedCheckboxId}"]`);
                await checkbox.check();
            }
        }
    }

    async checkUncheckAgainstData(data) {
        await this.utils.navigateToDashboardLink('Admin', 'Super Role', 'Manage');
        await this.page.fill('#superRoleDataTable\\:name\\:filter', data['Super Role Name']);
        await this.page.press('#superRoleDataTable\\:name\\:filter', 'Enter');
        await this.utils.waitForChangeInDOM('#superRoleDataTable_data');

        const targetedSuperRoleEditButtonRow = this.page.locator('tbody#superRoleDataTable_data tr').filter({ has: this.page.locator('td', { hasText: new RegExp(`^${data['Super Role Name']}$`) }) });
        await targetedSuperRoleEditButtonRow.locator('a:has-text("Edit")').click();

        for (let moduleTitle of Object.keys(data)) {
            moduleTitle = moduleTitle.trim();
            if (!moduleTitle || moduleTitle === 'testCaseNumber' || moduleTitle === 'testCaseName' || moduleTitle === 'Super Role Name') continue;
            const role = data[moduleTitle];
            await this.checkAndUncheckSuperRole(moduleTitle, role);
        }

        await this.commonButtons.clickButton('Save');
        await this.page.waitForLoadState('networkidle');
        const superRoleSavedText = await this.page.locator('.ui-messages-info-summary').innerText();
        expect(superRoleSavedText).toEqual(`Super Role '${data['Super Role Name']}' successfully saved.`);

        //Refreshing privilege of the user from user privilege page
        await Promise.any([
            this.commonButtons.clickButton('HomePage'),
            this.commonButtons.clickButton('Oversight HomePage')
        ]);
        let btnTabs = this.page.locator("[id='tabsNavbar']").locator("[class='navbar-toggler collapsed']");
        await this.page.waitForLoadState('networkidle');
        if (await btnTabs.isVisible()) {
            await btnTabs.click();
        }
        await this.page.locator('#tab_Settings').nth(0).click();
        await this.utils.navigateToDashboardLink('Settings', 'Personal Details', 'Edit');
        await this.commonButtons.clickButton('User Links');
        await this.commonButtons.clickButton('User Privilege');
        await this.commonButtons.clickButton('Save');

        const isOversight = await this.page.getByText('Oversight HomePage').isVisible();

        if (isOversight) {
            await this.commonButtons.clickButton('Oversight HomePage');
        }
        else {
            await this.commonButtons.clickButton('HomePage');
        }

        await this.commonButtons.clickButton('Settings');
        await this.commonButtons.clickButton('Refresh');
    }
}