/**
 * @author Aysha Akter Chamak
 * @since 08/10/2026
 */
import { expect } from '@playwright/test';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';

export class SapFormPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.dtpStartDate = page.locator('[id="habPlan.habPlanDate"]');
        this.ddlHabService = page.locator('select[id="habPlan.serviceType"]');
        this.dtpMeetingDate = page.locator('[id="habPlan.servicePlanMeetingDate"]');
        this.txtComments = page.locator('[id="habPlan.zzzComments"]');
        this.lnkCreateHabService = page.getByRole('link', { name: 'Create New Type of Habilitation Service' });
        this.txtServiceType = page.locator('#serviceTitle');
        this.lnkAcknowledge = page.locator('a[href*="sapAcknowledgeList"]', { hasText: 'Acknowledge' });

    }

    async approveForm() {
        await this.commonButtons.clickButton(ButtonLabels.APPROVE);
        await this.commonButtons.clickButton(ButtonLabels.YES);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Fills out the SAP form fields using data-driven parameters and a dynamic Hab Service.
     * @param {Object} formObject Key-value pairs containing form input values.
     * @param {string} dynamicHabService The dynamically created Habilitation Service Type.
     */
    async fillUpForm(formObject, dynamicHabService) {
        if (formObject.program) {
            await this.listPage.selectFilteredFirstItem(formObject.program);
            await this.page.waitForLoadState('domcontentloaded');
        }

        if (formObject.individual) {
            await this.listPage.selectFilteredFirstItem(formObject.individual);
            await this.page.waitForLoadState('domcontentloaded');
        }

        if (formObject.startDate) {
            await this.dtpStartDate.fill(formObject.startDate);
        }

        if (dynamicHabService) {
            await this.ddlHabService.selectOption({ label: dynamicHabService });
        }

        if (formObject.servicePlanMeetingDate) {
            await this.dtpMeetingDate.fill(formObject.servicePlanMeetingDate);
        }

        if (formObject.comments) {
            await this.txtComments.fill(formObject.comments);
        }
    }

    /**
     * Creates a new Type of Habilitation Service with the specified name.
     * If options.createUnique is true, it appends a unique timestamp suffix to serviceType.
     * @param {string} serviceType The name or prefix of the habilitation service type to create
     * @param {Object} [options={}] Optional configuration object
     * @returns {Promise<string>} The exact name of the created service Type
     */
    async createDynamicHabService(serviceType, options = {}) {
        const uniqueServiceType = options.createUnique ? `${serviceType}_${Date.now()}` : serviceType;
        await this.commonUtils.navigateToDashboardLink('Admin', 'Type of Habilitation Service', 'List');
        await this.lnkCreateHabService.click();
        await this.txtServiceType.fill(uniqueServiceType);
        await this.commonButtons.clickButton(ButtonLabels.SAVE);
        return uniqueServiceType;
    }

    /**
     * Navigates to the list and deletes the dynamically created service
     * @param {string} serviceType The exact name of the service to delete
     */
    async deleteDynamicHabService(serviceType) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'Type of Habilitation Service', 'List');
        await this.listPage.selectFilteredFirstItemUponAvailability(serviceType);
        await this.page.waitForLoadState('domcontentloaded');
        let actionTaken = '';

        if (await this.commonButtons.isButtonPresent(ButtonLabels.DELETE)) {
            await this.commonButtons.clickButton(ButtonLabels.DELETE);
            actionTaken = 'delete';
        } else if (await this.commonButtons.isButtonPresent(ButtonLabels.DISCONTINUE)) {
            await this.commonButtons.clickButton(ButtonLabels.DISCONTINUE);
            actionTaken = 'discontinue';
        } else {
            throw new Error(`Neither 'Delete' nor 'Discontinue' button is found for service type: ${serviceType}`);
        }

        await this.commonButtons.clickButton(ButtonLabels.YES);
        await this.page.waitForLoadState('domcontentloaded');
        return actionTaken;
    }
    async navigateToAcknowledgeList() {
        await this.lnkAcknowledge.click();
    }

    /**
     * @param {string} formId The unique identifier of the form to acknowledge.
     */
    async acknowledgeForm(formId) {
        let firstTry = true;
        const targetRow = this.page.locator('tbody tr').filter({ hasText: formId });

        await expect(async () => {
            if (!firstTry) {
                await this.page.reload();
                await this.page.waitForLoadState('domcontentloaded');
            }
            firstTry = false;

            await this.listPage.fillFilterField(formId);
            await expect(targetRow).toBeVisible({ timeout: 2000 });
        }).toPass({
            intervals: [3000],
            timeout: 60000
        });

        await this.listPage.selectFilteredFirstItem(formId);
        await this.page.waitForLoadState('domcontentloaded');
        await this.commonButtons.clickButton(ButtonLabels.ACKNOWLEDGE);
        await this.commonButtons.clickButton(ButtonLabels.YES);
        await this.page.waitForLoadState('domcontentloaded');
    }
}
