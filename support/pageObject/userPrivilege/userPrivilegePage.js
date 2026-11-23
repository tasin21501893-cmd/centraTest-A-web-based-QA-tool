/**
 * @author Maksuda Islam (Lima)
 * @since 03/06/2025
 */

import { ListPage } from '../../../support/commonPages/listPage';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';

const CASELOAD_AIC = "AIC";
const CASELOAD_AAIC = "AAIC";
const INDIVIDUAL_PROFILE_TYPE = 'Individual';

export class UserPrivilegePage {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.lnkAddProfile = page.getByRole('link', { name: 'Add Profile' });
        this.lnkProfileNameUpdate = page.locator('a[class="ui-commandlink ui-widget"]').nth(1);
        this.txtProfileNameUpdateField = page.locator('input#existingProfileName');
        this.btnProfileNameUpdate = page.locator('span[class="ui-button-text ui-c"]').nth(2);
        this.ddlProfileType = page.locator('[id="profileType_label"]');
        this.lnkAddSuperRoleField = page.getByRole('link', { name: 'Super Role :' });
        this.txtSearchSuperRoleByNameField = page.locator('input[id="superRoleDataTable:name:filter"]');
        this.lnkAddCaseloadField = page.getByRole('link', { name: 'Add Caseload' });
        this.txtSearchByCaseloadName = page.locator('.ui-column-filter.ui-inputfield.ui-inputtext.ui-widget.ui-state-default.ui-corner-all').nth(1);
        this.doneMsg = page.locator('[class="messageBar"]');
        this.alertMsg = page.locator('[class="ui-messages-info-summary"]');

        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.utils = new CommonUtils(page);
    }

    async selectProfileType(profileType, providerType) {
        if (providerType === 'child') {
            return;
        }

        if (await this.utils.isElementAvailable(this.ddlProfileType)) {
            await this.ddlProfileType.click();
            await this.page.locator('#profileType_items li').getByText(profileType, { exact: true }).click();

        } else {
            console.log(`Profile Type Dropdown is not available.`)
        }
    }

    async updateProfileName(profileName, profileType, providerType) {
        await this.lnkProfileNameUpdate.click()
        await this.txtProfileNameUpdateField.fill(profileName);
        await this.selectProfileType(profileType, providerType);
        await this.btnProfileNameUpdate.click({ force: true });
    }

    async addProfileName(profileName, profileType, providerType) {
        await this.lnkAddProfile.click();
        await this.page.getByRole('textbox', { name: 'Name *' }).fill(profileName);
        await this.selectProfileType(profileType, providerType);
        await this.commonButtons.clickButton('Add');
    }

    async addSuperRole(superRoleName, tableRowNo) {
        const tableRowSelector = `#superRoleDataTable_data tr:has(td:text-is("${superRoleName}"))`;

        await this.lnkAddSuperRoleField.nth(tableRowNo).click();
        await this.txtSearchSuperRoleByNameField.fill(superRoleName);
        await this.txtSearchSuperRoleByNameField.press('Enter');
        await this.utils.waitForChangeInDOM('#superRoleDataTable');

        if (await this.utils.isElementAvailable(this.page.locator(tableRowSelector))) {
            await this.page.locator(tableRowSelector).getByRole('link', { name: 'Choose' }).click();

        } else {
            throw new Error(`SuperRole '${superRoleName}' doesn't exist or already assigned.`)
        }
    }

    #getFormattedCaseload(caseloadName, providerCode) {
        const upper = caseloadName.trim().toUpperCase();

        if (upper === CASELOAD_AIC) {
            return `::AIC:: All Individual Caseload (${providerCode})`;
        }

        if (upper === CASELOAD_AAIC) {
            return `::AAIC:: All Admitted Individual Caseload (${providerCode})`;
        }

        return caseloadName.trim();
    }

    async addCaseload(profileType, caseloadName, indexOfAddCaseloadLink, providerCode) {
        const profileDetails = await this.extractExistingProfileDetails();
        const individualProfileCount = profileDetails.filter(p => p.profileType === INDIVIDUAL_PROFILE_TYPE.toLowerCase()).length;

        if (profileType === INDIVIDUAL_PROFILE_TYPE && individualProfileCount === 1) {
            return;
        }

        let caseloadNameArray = await this.utils.parseCommaSeparatedList(caseloadName);

        for (const rawCaseloadName of caseloadNameArray) {
            const formattedCaseloadName = this.#getFormattedCaseload(rawCaseloadName, providerCode);

            await this.lnkAddCaseloadField.nth(indexOfAddCaseloadLink).click();
            await this.txtSearchByCaseloadName.fill(formattedCaseloadName);
            await this.txtSearchByCaseloadName.press('Enter');

            await this.listPage.waitForAriaFalse();
            await this.page.waitForLoadState('domcontentloaded');

            const tableRow = this.page.locator('#caseloadDataTable_data tr', {
                has: this.page.locator('td', { hasText: formattedCaseloadName })
            });
            await this.page.waitForTimeout(2000)
            if (await this.utils.isElementAvailable(tableRow)) {
                await tableRow.getByRole('link', { name: 'Add' }).nth(0).click();
                await this.listPage.waitForAriaFalse();

            } else {
                throw new Error(`Caseload, '${formattedCaseloadName}', doesn't exist.`);
            }

            const closeBtn = this.page.getByRole('button', { name: 'Close' });

            if (await this.utils.isElementAvailable(closeBtn)) {
                await this.commonButtons.clickButton('Close').click();
            } else {
                break;
            }
        }
    }

    async checkAllVisibleRole() {
        await this.page.waitForSelector('.ui-datagrid.ui-widget');
        const panels = await this.page.$$('.ui-panel.category-container');

        for (const panel of panels) {
            const checkboxes = await panel.$$('input[type="checkbox"]');
            for (const checkbox of checkboxes) {
                if (await checkbox.isVisible()) {
                    await checkbox.check();
                }
            }
        }
    }

    async assignAdminRolePrivilegesUsingLabel(privilegeNames) {
        let privilegeNameArray = await this.utils.parseCommaSeparatedList(privilegeNames);
        await this.page.waitForSelector('.ui-datagrid.ui-widget');

        for (let i = 0; i < privilegeNameArray.length; i++) {
            await this.page.getByText(privilegeNameArray[i]).check();
        }

        await this.commonButtons.clickButton('Save');
    }

    async checkIfModuleEnabled(arrayOfRoleListData, providerCode) {
        const disabledModules = new Set();

        for (const roleData of arrayOfRoleListData) {
            for (const moduleTitle in roleData) {
                if (moduleTitle !== 'testCaseNumber') {
                    const sectionRoot = this.page.locator(`.ui-panel:has(.ui-panel-title:text-is("${moduleTitle}"))`);
                    const sectionCount = await this.utils.isElementAvailable(sectionRoot);

                    if (!sectionCount) {
                        disabledModules.add(moduleTitle);
                    }
                }
            }
        }

        if (disabledModules.size === Object.keys(arrayOfRoleListData[0]).length - 1) {
            throw new Error(`All specified modules are disabled for the provider (${providerCode}): ${[...disabledModules].join(', ')}`);
        }

        return disabledModules;
    }

    async checkModuleWiseRole(arrayOfRoleListData, providerCode) {
        const disabledModules = await this.checkIfModuleEnabled(arrayOfRoleListData, providerCode);

        for (const roleData of arrayOfRoleListData) {
            for (const moduleTitle in roleData) {
                if (moduleTitle !== 'testCaseNumber') {
                    if (disabledModules.has(moduleTitle)) {
                        console.warn(`Skipping "${moduleTitle}" as it's not enabled for the provider "${providerCode}".`);
                        continue;
                    }

                    const moduleRole = roleData[moduleTitle];
                    const moduleRoles = typeof moduleRole === 'string'
                        ? moduleRole.split(',').map(s => s.trim())
                        : [];

                    const sectionRoot = this.page.locator(`.ui-panel:has(.ui-panel-title:text-is("${moduleTitle}"))`);

                    for (const role of moduleRoles) {
                        if (CommonUtils.isAffirmative(role)) {
                            const allCheckboxes = sectionRoot.locator('input[type="checkbox"]');
                            const count = await allCheckboxes.count();

                            for (let j = 0; j < count; j++) {
                                const checkbox = allCheckboxes.nth(j);
                                await checkbox.check();
                            }
                            break;

                        } else if (role && !CommonUtils.isNegative(role)) {
                            const label = sectionRoot.getByText(role, { exact: true });

                            if (!await this.utils.isElementAvailable(label)) {
                                console.warn(`Role "${role}" not found under module "${moduleTitle}" for provider "${providerCode}".`);
                                continue;
                            }

                            const forId = await label.first().getAttribute('for');
                            const checkbox = sectionRoot.locator(`[id="${forId}"]`);

                            await checkbox.check();
                        }
                    }
                }
            }
        }
    }

    async getExistingProfileCount() {
        await this.page.locator('#agencyWideRolesSection_content').waitFor({ state: 'visible', timeout: 7000 });

        const panels = this.page.locator('#profilesSection_content > div.ui-panel');
        const panelCount = await panels.count();
        let validCount = 0;

        for (let i = 0; i < panelCount; i++) {
            const hasNoRecords = await panels.nth(i).locator('tbody.ui-datatable-data tr.ui-datatable-empty-message').count();
            if (hasNoRecords === 0) {
                validCount++;
            }
        }

        return validCount;
    }

    async extractExistingProfileDetails() {
        const panels = this.page.locator('#profilesSection_content > div.ui-panel');
        const panelCount = await panels.count();
        const allAddCaseloadLinks = this.page.getByRole('link', { name: 'Add Caseload' });
        const allAddCaseloadCount = await allAddCaseloadLinks.count();
        const profileDetails = [];

        for (let i = 0; i < panelCount; i++) {
            const panel = panels.nth(i);
            const rawProfileName = await panel.locator('a.ui-commandlink.ui-widget').first().textContent();
            const profileName = rawProfileName?.split(':')[0].trim().toLowerCase() ?? '';
            const profileType = rawProfileName?.split(':')[1].trim().toLowerCase() ?? '';
            const superRoleContainer = await panel.locator('a:text("Super Role :")').locator('..');
            const fullText = await superRoleContainer.textContent();
            const superRoleName = fullText?.split(':')[1]?.trim() ?? '';
            const caseloadRows = await panel.locator('tbody.ui-datatable-data tr').all();
            const caseloadName = [];

            for (const row of caseloadRows) {
                const cell = row.locator('td').first();
                const value = (await cell.textContent())?.trim();
                if (value) {
                    caseloadName.push(value);
                }
            }

            const addCaseloadLink = panel.getByRole('link', { name: 'Add Caseload' });
            let addCaseloadLinkIndexNo = null;

            if (await addCaseloadLink.count() > 0) {
                const linkHandle = await addCaseloadLink.first();
                const linkId = await linkHandle.getAttribute('id');

                for (let j = 0; j < allAddCaseloadCount; j++) {
                    const candidateId = await allAddCaseloadLinks.nth(j).getAttribute('id');

                    if (candidateId === linkId) {
                        addCaseloadLinkIndexNo = j;
                        break;
                    }
                }
            }

            profileDetails.push({
                profileName,
                profileType,
                superRoleName,
                caseloadName,
                addCaseloadLinkIndexNo,
            });
        }

        return profileDetails;
    }

    async getAddCaseloadLinkIndex(profileName) {
        await this.page.locator('#agencyWideRolesSection_content').waitFor({ state: 'visible', timeout: 7000 });
        await this.listPage.waitForAriaFalse();

        const profileDetails = await this.extractExistingProfileDetails();
        const matchedIndex = profileDetails.findIndex(p => p.profileName === profileName.toLowerCase());
        let matchedProfile = null;
        let addCaseloadLinkIndex = null;

        if (matchedIndex !== -1) {
            matchedProfile = profileDetails[matchedIndex];
            addCaseloadLinkIndex = matchedProfile.addCaseloadLinkIndexNo;
        }

        return { profileDetails, matchedIndex, matchedProfile, addCaseloadLinkIndex };
    }

    async addProfileSuperRoleCaseload(profileName, profileType, superRoleName, caseloadName, providerCode, providerType) {
        const count = await this.getExistingProfileCount();

        if (count === 0) {
            let tableRowNo = 0;

            await this.updateProfileName(profileName, profileType, providerType);
            await this.addSuperRole(superRoleName, tableRowNo);
            await this.addCaseload(profileType, caseloadName, tableRowNo, providerCode);

        } else {
            const initialProfileInfo = await this.getAddCaseloadLinkIndex(profileName);
            let matchedIndex = initialProfileInfo.matchedIndex;
            let matchedProfile = initialProfileInfo.matchedProfile;

            if (matchedIndex === -1) {
                if (!(await this.utils.isElementAvailable(this.lnkAddProfile))) {
                    throw new Error(`Cannot add more profile for this User.`);
                }

                console.log(`No duplicate Profile Name, "${profileName}", found. Creating new.`);
                await this.addProfileName(profileName, profileType, providerType);

                const updatedProfileInfo = await this.getAddCaseloadLinkIndex(profileName);
                matchedIndex = updatedProfileInfo.matchedIndex;
                const addCaseloadLinkIndex = updatedProfileInfo.addCaseloadLinkIndex;

                await this.addSuperRole(superRoleName, matchedIndex);
                await this.addCaseload(profileType, caseloadName, addCaseloadLinkIndex, providerCode);

            } else {
                const formattedExpectedCaseloadArray = Array.isArray(caseloadName)
                    ? caseloadName.map(name => this.#getFormattedCaseload(name, providerCode))
                    : caseloadName
                        ? [this.#getFormattedCaseload(caseloadName, providerCode)]
                        : [];

                const superRoleMatch = matchedProfile.superRoleName.trim() === superRoleName.trim();
                const caseloadMatch = formattedExpectedCaseloadArray.every(expected =>
                    matchedProfile.caseloadName.includes(expected)
                );

                /*if (superRoleMatch && caseloadMatch) {
                    throw new Error(`Profile "${profileName}" already exists with given superRoleName & caseloadName.`);
                }*/

                if (!superRoleMatch) {
                    await this.addSuperRole(superRoleName, matchedIndex);
                }

                if (!caseloadMatch) {
                    const caseloadListCount = await this.page.locator(`[id*=":${matchedIndex}:profileCaseloadList_data"] tr`).count();

                    for (let index = 0; index < caseloadListCount; index++) {
                        await this.page.locator(`[id*=":${matchedIndex}:profileCaseloadList_data"] tr td a`).nth(1).click();
                    }

                    const refreshedProfileInfo = await this.getAddCaseloadLinkIndex(profileName);
                    matchedIndex = refreshedProfileInfo.matchedIndex;
                    const addCaseloadLinkIndex = refreshedProfileInfo.addCaseloadLinkIndex;

                    await this.addCaseload(profileType, caseloadName, addCaseloadLinkIndex, providerCode);
                }
            }
        }
    }

    async addUserPrivilege(userPrivilegeData, arrayOfRoleListData, providerCode) {
        const { profileName, profileType, providerType, superRoleName, caseloadName, checkAllAgencyWideRole } = userPrivilegeData;
        let typeofProfile = CommonUtils.formatLabel(profileType);

        await this.addProfileSuperRoleCaseload(profileName, typeofProfile, superRoleName, caseloadName, providerCode, providerType);

        if (CommonUtils.isAffirmative(checkAllAgencyWideRole)) {
            await this.checkAllVisibleRole();

        } else {
            await this.checkModuleWiseRole(arrayOfRoleListData, providerCode);
        }
        await this.commonButtons.clickButton('Save');
    }

    async clickUserLoginName(userLoginName){
        await this.page.locator(`td[role="gridcell"] a:text-is("${userLoginName}")`).click();
    }

}