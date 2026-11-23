/**
 * @author Timon Protik Mondal
 * @since 03/27/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../../support/commonUtility/attachmentUtils.js';

export class IndividualConsentPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);

        this.txtConsentName = page.locator('[name="consentName"]');
        this.ddlConsentType = page.locator("[name='type']");
        this.ddlConsentStatus = page.locator("[name='consentStatus']");
        this.dtpEffectiveDateFrom = page.locator('[name="effectiveDateFrom"]');
        this.dtpEffectiveDateTo = page.locator('[name="effectiveDateTo"]');
        this.dtpConsentObtainedDate = page.locator('[name="consentGivenDate"]');
        this.dtpConsentObtainedTime = page.locator('[name="consentGivenTime"]');
        this.btnConsentDocument = page.locator('#attachment1 input[type="file"]');
        this.txtComments = page.locator('[name="comments"]');
        this.chkSelfConsent = page.locator('[name="selfConsent"]');
        this.btnConsenter = page.locator('button[data-id="consenter"]');
        this.txtConsenterOther = page.locator('[name="consenterOther"]');
        this.txtRelationshipWithIndividual = page.locator('[name="relationshipWithIndividual"]');
        this.chkVerbalConsent = page.locator('[name="verbalConsent"]');
        this.btnVerbalConsentReceivedBy = page.locator('button[data-id="consentReceivedBy"]');
        this.lnkConsentList = page.getByRole('link', { name: 'Consent List' });
        this.lnkAddNewConsentRecord = page.getByRole('link', { name: 'Add New Consent Record' });
    }

    async processConsentForm(data, action) {
        await this.txtConsentName.fill(data.consentName);
        await this.ddlConsentType.selectOption(data.consentType);
        await this.ddlConsentStatus.selectOption(data.consentStatus);
        await this.dtpEffectiveDateFrom.fill(data.effectiveDateFrom);
        await this.dtpEffectiveDateTo.fill(data.effectiveDateTo);
        await this.dtpConsentObtainedDate.fill(data.consentObtainedDate);
        await this.dtpConsentObtainedTime.fill(data.consentObtainedTime);
        await this.addAttachmentIfPresent(data);
        await this.txtComments.fill(await this.commonUtils.generateString(data.comments));
        await this.fillUpConsenter(data);
        await this.selectVerbalConsenter(data);
        await this.commonButtons.clickButton(action);
    }

    async fillUpConsenter(data) {
        if (data.isSelfConsenter.toLowerCase() == 'false') {
            if (data.consenter) {
                await this.btnConsenter.click();
                const searchConsenter = this.page.getByRole('combobox', { name: 'Search' });
                await searchConsenter.fill(data.consenter).then(() => this.page.locator('[role="option"]', { hasText: data.consenter }).first().click());
            }
            else {
                await this.txtConsenterOther.fill(data.consenterOther);
                await this.txtRelationshipWithIndividual.fill(data.relationshipWithIndividual);
            }
        }
        else {
            await this.chkSelfConsent.click();
        }
    }

    async selectVerbalConsenter(data) {
        if (data.hasVerbalConsent.toLowerCase() == 'true') {
            await this.chkVerbalConsent.click();
            await this.btnVerbalConsentReceivedBy.click();
            const searchVerbalConsenter = this.page.getByRole('combobox', { name: 'Search' });
            await searchVerbalConsenter.fill(data.verbalConsentReceivedBy).then(() => this.page.locator(`role=option >> span:text-is("${data.verbalConsentReceivedBy}")`).click());
        }
    }

    async addAttachmentIfPresent(data) {
        if (data.fileName) {
            await this.attachmentUtils.addAttachment(data);
        }
    }
}