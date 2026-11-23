/**
 * @author Timon Protik Mondal
 * @since 27/07/2025
 */

import { expect } from '@playwright/test';
import { ListPage } from '../../commonPages/listPage';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { CommonUtils } from '../../../support/commonUtility/commonUtils.js';
import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';

export class QuickReferralPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);

        this.selectFilter = page.locator('#dt-search-0');
        this.clientStatus = page.locator('[name="clientStatus"]');
        this.dtpAdmissionDate = page.locator('[name="admissionDate"]');
        this.alreadyLinkedItemIndicator = page.locator('#dataList > tbody > tr > td:nth-child(1)');

        this.errMsgAdmissionDate = page.locator('#admissionDate\\.errors');
        this.errMsgClientStatus = page.locator('#clientStatus\\.errors');
        this.errorMsgProvider = page.locator('#referralCommand > div > div > ul > li');
    };

    async quickReferIndividual(data) {
        const referrableProviderList = data.referToLinkProviderCode
            .split(",")
            .map(provider => provider.trim())
            .filter(provider => provider);

        for (const provider of referrableProviderList) {
            await this.listPage.selectFilteredFirstItemUponAvailability(provider);
            await this.page.waitForLoadState('domcontentloaded');
            const indicatorText = await this.alreadyLinkedItemIndicator.textContent();
            const isAlreadyLinked = indicatorText?.toLowerCase().includes("linked");

            if (isAlreadyLinked) {
                console.log(`Individual with Oversight ID ${data.oversightId} is already linked to "${provider}".`);
            }
        }

        await this.clientStatus.selectOption({ label: data.referredIndividualStatus });
        await this.dtpAdmissionDate.fill(data.admissionDate);
    };

    async processQuickReferralSubmission(data) {
        await this.commonUtils.navigateToDashboardLink("Intake", "Multi-Provider Individual", "Quick Referral");
        await this.page.getByRole('cell', { name: data.oversightId, exact: true }).click();
        await this.quickReferIndividual(data);
        await this.commonButtons.clickButton('Send');
    };

    async deselectFilteredItemFromList(providerCode) {
        await this.listPage.selectFilteredFirstItemUponAvailability(providerCode);
    };

    async validateSuccessfulQuickReferralMsg(expectedMsg) {
        await expect(this.donePage.verifyDoneMessage).toHaveText(`${expectedMsg}`);
    };

    async validateAdmissionDateErrorMsg(expectedMsg) {
        await expect(this.errMsgAdmissionDate).toHaveText(`${expectedMsg}`);
    };

    async validateReferredIndividualStatusErrorMsg(expectedMsg) {
        await expect(this.errMsgClientStatus).toHaveText(`${expectedMsg}`);
    };

    async validateNoProviderSelectionErrorMsg(expectedMsg) {
        await expect(this.errorMsgProvider).toHaveText(`${expectedMsg}`);
    };
}