/**
 * @author Rihalatul Jannat
 * @since 02/16/2026
 */

import { expect } from '@playwright/test';
import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { IdfPage } from './idfPage.js';


export class DiagnosisPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.idfPage = new IdfPage(page);

        this.btnCodeTypeDropdown = page.locator('button.selected-code-type');
        this.codeTypeDropdownList = page.locator('ul.dropdown-menu');
        this.txtDiagnosisLookup = page.locator('#diagnosisLookup');
        this.txtDescription = page.locator("[name = 'description']");
        this.dtpDiagnosisDate = page.locator('#diagnosisDate');
        this.txtDiagnosedByLookup = page.locator('#diagnosedByLookup');
        this.spinnerDiagnosedByLoading = page.locator('#diagnosedByLookupLoading');
        this.chkIsPrimary = page.locator('[name="primary"]');
        this.msgPrimaryExists = page.getByText('A Primary Diagnosis already exists for this Individual');
        this.chkResolved = page.locator('[name="resolved"]');
        this.dtpResolutionDate = page.locator('[name="resolveDate"]');
        this.txtResolvedByLookup = page.locator('#resolvedByLookup');
        this.txtDeleteReason = page.locator('[name="deleteComment"]');
        this.btnDeleteSubmit = page.locator('input[name="_action_delete"]');

        this.successAlertMsg = page.locator('div.alert.alert-success');
    }

    async navigateToCreateDiagnosis(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);
        await this.donePage.clickLinkByText('Diagnosis List');
        await this.commonButtons.clickButton('Create New');
    }

    async fillUpDiagnosis(data) {
        if (data.diagnosisCodeType) {
            await this.btnCodeTypeDropdown.click();
            const option = this.codeTypeDropdownList.getByText(data.diagnosisCodeType, { exact: true });
            await option.click();
        }

        if (data.diagnosisCode) {
            await this.txtDiagnosisLookup.fill(data.diagnosisCode.toString());
            const atcFirstItem = this.page.locator('.ui-autocomplete:visible .ui-menu-item').first();
            await expect(atcFirstItem).toBeVisible({ timeout: 5000 });
            await atcFirstItem.click();
        }

        if (data.description) {
            await this.txtDescription.fill(await this.commonUtils.generateString(data.description));
        }
        
        await this.dtpDiagnosisDate.fill(data.diagnosisDate);

        if (data.diagnosedBy) {
            await this.txtDiagnosedByLookup.pressSequentially(data.diagnosedBy, { delay: 100 });
            const firstMenuItem = this.page.locator('.ui-autocomplete:visible .ui-menu-item').first();
            
            try {
                await firstMenuItem.waitFor({ state: 'visible', timeout: 5000 });
                await firstMenuItem.click();
            } catch (error) {
                throw new Error('Diagnosed By: No autocomplete results found for "${data.diagnosedBy}"');
            }
        }
    }

    async fillUpPrimaryDiagnosis(data) {
        if (CommonUtils.isAffirmative(data.isPrimary)) {
            await this.chkIsPrimary.check();
        }
    }

    async fillUpResolvedDiagnosis(data) {
        if (CommonUtils.isAffirmative(data.isResolved)) {
            await this.chkResolved.check();
            await this.dtpResolutionDate.fill(data.resolutionDate);

            if (data.resolvedBy) {
                await this.txtResolvedByLookup.pressSequentially(data.resolvedBy, { delay: 100 });
                const firstMenuItem = this.page.locator('.ui-autocomplete:visible .ui-menu-item').first();
                
                try {
                    await firstMenuItem.waitFor({ state: 'visible', timeout: 5000 });
                    await firstMenuItem.click();
                } catch (error) {
                    throw new Error('Resolved By: No autocomplete results found for "${data.resolvedBy}"');
                }
            }
        }
    }

    async fillUpIndividualDiagnosis(data) {
        await this.fillUpDiagnosis(data);
        await this.fillUpPrimaryDiagnosis(data);

        if (CommonUtils.isNegative(data.isPrimary)) {
            await this.fillUpResolvedDiagnosis(data);
        }
    }
} 