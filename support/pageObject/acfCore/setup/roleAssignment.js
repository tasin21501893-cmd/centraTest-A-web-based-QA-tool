/**
 * @author Maksuda Islam (Lima)
 * @since 08/07/2025
 */

import { UserPrivilegePage } from '../../userPrivilege/userPrivilegePage';
import { CommonUtils } from '../../../commonUtility/commonUtils';

export class RoleAssignemnt {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.lnkAddSuperRoleField = page.getByRole('link', { name: 'Super Role :' });

        this.utils = new CommonUtils(page);
        this.userPrivilege = new UserPrivilegePage(page);
    }

    async extractCurrentSuperRoleName(tableRowNo) {
        const text = await this.lnkAddSuperRoleField.nth(tableRowNo)
            .locator('..')
            .evaluate(node => {
                const clone = node.cloneNode(true);
                const a = clone.querySelector('a');
                if (a) a.remove();
                return clone.textContent.trim();
            });

        return text;
    }

    async addSuperRole(superRoleName) {
        const tableRowNo = 0;
        const tableRowSelector = `#superRoleDataTable_data tr:has(td:text-is("${superRoleName}"))`;

        if (await this.extractCurrentSuperRoleName(tableRowNo) === superRoleName) {
            console.log(`SuperRole '${superRoleName}' already assigned.`);
            return;
        }

        await this.lnkAddSuperRoleField.nth(tableRowNo).click();
        await this.userPrivilege.txtSearchSuperRoleByNameField.fill(superRoleName);
        await this.userPrivilege.txtSearchSuperRoleByNameField.press('Enter');
        await this.utils.waitForChangeInDOM('#superRoleDataTable');

        if (await this.utils.isElementAvailable(this.page.locator(tableRowSelector))) {
            await this.page.locator(tableRowSelector).getByRole('link', { name: 'Choose' }).click();

        } else {
            throw new Error(`SuperRole '${superRoleName}' doesn't exist.`);
        }
    }
}