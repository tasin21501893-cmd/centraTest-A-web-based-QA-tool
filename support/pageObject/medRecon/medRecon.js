/**
 * @author M Rashidur Rahman Rafi
 * @since 01/19/2025
 */

const { expect } = require('@playwright/test')
const { CommonButtons } = require("../../commonUtility/commonButtons.js");
const { CommonUtils } = require("../../commonUtility/commonUtils.js");
const { ListPage } = require("../../commonPages/listPage.js");
const medReconModalLocator = "iframe[src^='/ma/medicalInfo/medicationReconciliation']";

exports.MedRecon = class MedRecon {

    constructor(page) {
        this.page = page;

        this.reconTypeField = page.locator('[name="tmpMedReconciliation.reconciliationType"]');
        this.reconciledByLoginField = page.locator('[name="tmpMedReconciliation.reconciledByLogin"]');
        this.reconciledByContactField = page.locator('[name="tmpMedReconciliation.reconciledByContact"]');
        this.reconciliaitonDateField = page.locator('[name="tmpMedReconciliation.reconciliationDate"]');
        this.activeFromField = page.locator('[name="tmpMedReconciliation.activeFrom"]');
        this.activeToField = page.locator('[name="tmpMedReconciliation.activeTo"]');
        this.commentsField = page.locator('[name="tmpMedReconciliation.comments"]');

        this.reconTypeErrorMsg = page.locator('#tmpMedReconciliation\\.reconciliationType\\.errors');
        this.reconciledByContactErrorMsg = page.locator('#tmpMedReconciliation\\.reconciledByContact\\.errors');
        this.reconciliationDateErrorMsg = page.locator('#tmpMedReconciliation\\.reconciliationDate\\.errors');
        this.activeFromErrorMsg = page.locator('#tmpMedReconciliation\\.activeFrom\\.errors');
        this.activeToErrorMsg = page.locator('#tmpMedReconciliation\\.activeTo\\.errors');
        this.commentsErrorMsg = page.locator('#tmpMedReconciliation\\.comments\\.errors');

        this.globalValidation = page.locator('.alert-danger');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
    }

    async addMedRecon(data) {
        await this.listPage.selectFilteredFirstItem(data.individualName);
        await this.commonButtons.clickButton('Add Reconciliation');
        await this._fillMedReconModal(data);
    }

    async validateErrorMsg(errorMsgLocator, expectedMsg) {
        const iframe = this.page.frameLocator(medReconModalLocator);
        await expect(iframe.locator(errorMsgLocator)).toHaveText(`${expectedMsg}`);
    }

    async validateGlobalMsg(expectedMsg) {
        await expect(this.globalValidation).toContainText(`${expectedMsg}`);
    }

    async clickActionButton() {
        const saveButtonVisible = await this.commonButtons.isButtonPresent('Save');

        if (saveButtonVisible === true) {
            await this.commonButtons.clickButton('Save');
        } else {
            await this.commonButtons.clickButton('Update');
        }
    }

    async _fillMedReconModal(data) {
        const iframe = this.page.frameLocator(medReconModalLocator);

        await this._setType(iframe.locator(this.reconTypeField), data.type);
        await this._setReconciledBy(iframe.locator(this.reconciledByLoginField), iframe.locator(this.reconciledByContactField), data.reconciledByLogin, data.reconciledByContact);
        await this._setReconciliationDate(iframe.locator(this.reconciliaitonDateField), data.reconciliationDate);
        await this._setActiveDate(iframe.locator(this.activeFromField), iframe.locator(this.activeToField), data.activeFrom, data.activeTo);
        await this._setComments(iframe.locator(this.commentsField), data.comments, data.commentLength);

        await this.commonButtons.clickButton('Continue', iframe);
    }

    async _setType(reconTypeLocator, reconType) {
        await reconTypeLocator.selectOption(reconType);
    }

    async _setReconciledBy(loginLocator, contactLocator, reconciledByLogin, reconciledByContact) {
        if (reconciledByLogin) {
            await loginLocator.selectOption(reconciledByLogin);
        } else {
            await contactLocator.selectOption(reconciledByContact);
        }
    }

    async _setReconciliationDate(reconDateLocator, reconciledDate) {
        await reconDateLocator.fill(reconciledDate);
    }

    async _setActiveDate(activeFromLocator, activeToLocator, activeFrom, activeTo) {
        await activeFromLocator.fill(activeFrom);
        await activeToLocator.fill(activeTo);
    }

    async _setComments(commentsLocator, comments, length) {
        if (length !== '') {
            comments = await this.commonUtils.generateString(length);
        }

        await commentsLocator.fill(comments);
    }

} 