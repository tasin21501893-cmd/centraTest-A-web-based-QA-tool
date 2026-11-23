/**
 * @author Emran Hosssain Rabbi
 * @since 10/08/2026
 */

import path from 'path';
import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';
import { writeExcelCell } from '../../commonUtility/write-xlsx.js';
import { DonePage } from '../../commonPages/donePage.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { resourcePaths } from '../../../support/constants/resourcePaths.js';

export class EligibilityPage {

    /**
         * @param {import('@playwright/test').Page} page
         */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.donePage = new DonePage(page);
        this.listPage = new ListPage(page);
        this.txtFormId = page.locator('#formId');
        this.lnkAddFile = page.getByRole('link', { name: 'Add File', exact: true });
        this.txtSearchInput = page.locator("#elgTemplates_wrapper input[type='search']");
        this.dtpEligibilityRequestDate = page.locator('#eligibility\\.requestDate');
        this.ddlEligibilityRequestedCategory = page.locator('#eligibility\\.requestedCategory');
        this.ddlEligibilityCategory = page.locator('#eligibility\\.category');
        this.dtpEffectiveDateFrom = page.locator('#eligibility\\.effectiveFrom');
        this.dtpEffectiveDateTo = page.locator('#eligibility\\.effectiveTo');
        this.ddlEligibilityOutcome = page.locator('#eligibility\\.outcome');
        this.ddlDenialReason = page.locator('#eligibility\\.denialReason');
        this.ddlEligibilityReferredBy = page.locator('#eligibility\\.eligibilityReferredBy');
        this.ddlProcessingStatus = page.locator('#eligibility\\.processingStatus');
        this.txtCommentField = page.locator('#elgComment\\.comments');
        this.txtJustification = page.locator('#eligibility\\.justification');
        this.txtReturnReason = page.getByRole('textbox', { name: 'Return Reason' });
        this.alrtDanger = page.locator('.alert.alert-danger');
        this.ddlMappedProvider = page.locator('#eligibility\\.mappedProvider');
        this.iframeLookup = page.frameLocator("[frameborder='0']");
        this.rdoSelectDocument = this.iframeLookup.locator("input[name='select-radio']");
        this.txtReceivedDateFrom = this.iframeLookup.locator("input[type='text'][name='receivedDateFrom']");
    }

    async selectIndvAndEligibilityTemplate(testcase) {
        await this.listPage.selectFilteredFirstItem(testcase.osId);
        await this.page.waitForLoadState('load');

        if (CommonUtils.isAffirmative(testcase['Enable Eligibility Multiple Template'])) {
            await this.txtSearchInput.fill(testcase.templateFormId);
            const lnkAdd = this.page
                .locator('#elgTemplates tbody tr', { hasText: testcase.templateFormId })
                .getByRole('link', { name: 'Add', exact: true });
            await lnkAdd.click();
        }
    }

    async selectMappedProvider(providerCode) {
        const option = this.ddlMappedProvider.locator('option').filter({
            hasText: providerCode
        });

        const value = await option.getAttribute('value');

        if (!value) {
            throw new Error(`Provider with code '${providerCode}' was not found.`);
        }

        await this.ddlMappedProvider.selectOption(value);
    }

    async fillUpEligibilityForm(testcase) {
        await this.dtpEligibilityRequestDate.fill(testcase['Eligibility Request Date']);
        await this.ddlEligibilityRequestedCategory.selectOption(testcase['Requested Eligibility Category']);
        await this.ddlEligibilityCategory.selectOption(testcase['Eligibility Category']);
        await this.dtpEffectiveDateFrom.fill(testcase['Effective Date From']);
        await this.dtpEffectiveDateTo.fill(testcase['Effective Date To']);
        await this.ddlEligibilityOutcome.selectOption(testcase['Outcome']);
        await this.ddlDenialReason.selectOption(testcase['Eligibility Denial Reason']);
        await this.ddlEligibilityReferredBy.selectOption(testcase['Eligibility Referred By']);
        await this.ddlProcessingStatus.selectOption(testcase['Processing Status']);
        await this.txtJustification.fill(testcase['Justification']);
        await this.commonButtons.clickButton('Attach Other File');
        await this.lnkAddFile.last().click();
        await this.attachmentUtils.uploadFile(testcase);
        await this.commonButtons.clickButton('Attach Other File');
        await this.lnkAddFile.last().click();
        await this.commonButtons.clickButton('Individual Document Lookup');
        await this.txtReceivedDateFrom.clear();
        await this.commonButtons.clickButton('Search', this.iframeLookup);
        await this.rdoSelectDocument.first().click();
        await this.commonButtons.clickButton('Add', this.iframeLookup);

        if (testcase['Linked Provider']?.trim()) {
            await this.selectMappedProvider(testcase['Linked Provider']);
        }
    }

    /**
         * Executes a workflow step: clicks action button, verifies completion message, 
         * and navigates back to the form state.
         * @param {string} action - The button label to click (e.g., 'Submit for review', 'Approve').
         */
    async takeAction(action) {
        await this.commonButtons.clickButton(action);

        const actionMessages = {
            'Submit for review': 'has been successfully submitted',
            'Submit for approval': 'has been Successfully Reviewed',
            'Approve': 'has been successfully approved',
            'Return to reviewer': 'has been Returned to Reviewer',
            'Return': 'has been Returned',
            'Send to Provider': 'Successfully sent to provider',
            'Save': 'has been successfully saved',
            'Update': 'has been successfully updated'
        };

        if (actionMessages[action]) {
            if (action === 'Approve') {
                await this.commonButtons.clickButton('Yes');
            }
            await this.donePage.verifyPartialDoneMessage(actionMessages[action]);
        }

        await this.commonButtons.clickButton('Back to Form');
    }

    async approveFormWithoutLinkedProvider() {
        await this.txtReturnReason.fill('Test Return');
        await this.takeAction('Return to reviewer');
        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned to Reviewer');

        await this.takeAction('Submit for approval');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.takeAction('Approve');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Approved');
    }

    async submitProviderResponseFromChildProvider(testcase, formId) {
        await this.txtFormId.fill(formId);
        await this.commonButtons.clickButton('Search');
        await this.page.getByText(formId).click();

        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Provider Response');

        await this.commonButtons.clickButton('Add Comments');
        await this.txtCommentField.fill(testcase['Eligibility Comments']);
        await this.commonButtons.clickButton('Save');

        await this.takeAction('Submit for review');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Review');
    }

    async pendingApprovalProcessFromOsProviderIfLinkedProviderIsNotMapped(formId) {
        await this.txtFormId.fill(formId);
        await this.commonButtons.clickButton('Search');
        await this.page.getByText(formId).click();

        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.txtReturnReason.fill('Test Return');
        await this.takeAction('Return to reviewer');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned to Reviewer');

        await this.takeAction('Return');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned');

        await this.takeAction('Submit for review');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Review');

        await this.takeAction('Submit for approval');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.takeAction('Approve');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Approved');
    }

    async approvePendingReviewFormFromOsProvider(formId) {
        await this.txtFormId.fill(formId);
        await this.commonButtons.clickButton('Search');
        await this.page.getByText(formId).click();

        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Review');

        await this.takeAction('Submit for approval');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.txtReturnReason.fill('Test Return');
        await this.takeAction('Return to reviewer');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned to Reviewer');

        await this.takeAction('Submit for approval');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.takeAction('Approve');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Approved');
    }

    async writeEligibilityFormIdValuesToEligibilityFormSheet(rowIndex, sheetName) {
        const formId = await this.donePage.fetchFormIdFromDoneMessage();
        const filePath = resourcePaths.ELIGIBILITY;
        writeExcelCell({ filePath, sheetName, row: rowIndex, col: 'elgFormId', value: formId });
    }

    async checkUncheck10MbFlag(providerCode, expectedStatus) {
        await this.listPage.selectFilteredFirstItem(providerCode);
        await this.page.waitForLoadState('networkidle');
        const chkAllow10MBSingleFile = this.page.locator('#preference\\.allow10MBSingleFile');

        if (expectedStatus.toLowerCase() === 'enable') {
            await chkAllow10MBSingleFile.check();
        } else {
            await chkAllow10MBSingleFile.uncheck();
        }
    }

    async uploadAndCheckValidation(fileNamesInput, validationMsg) {
        if (!fileNamesInput) return;

        const filePaths = typeof fileNamesInput === 'string'
            ? fileNamesInput.split(',').map(file => file.trim()).filter(Boolean)
            : Array.isArray(fileNamesInput) ? fileNamesInput : [];

        for (const filePath of filePaths) {
            await this.commonButtons.clickButton('Attach Other File');

            const lnkAddFileElem = this.lnkAddFile.last();
            await lnkAddFileElem.waitFor({ state: 'visible' });
            await lnkAddFileElem.click();

            const btnBrowse = this.page.getByText('Browse').last();
            await btnBrowse.waitFor({ state: 'visible' });

            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                btnBrowse.click()
            ]);

            await fileChooser.setFiles(path.join('resources', 'attachment', filePath));
            await this.commonButtons.clickButton('Upload');
            await this.commonUtils.waitForSpinnerHidden()
        }

        if (validationMsg && validationMsg.trim() !== '') {
            await expect(this.alrtDanger).toBeVisible();
            await expect(this.alrtDanger).toContainText(validationMsg.trim());
        }
    }

    async completeEligibilityWorkflow(testcase, questionnairePage, questionnairedata, isOsProvider = false) {
        await this.fillUpEligibilityForm(testcase);
        await this.commonButtons.clickButton('Save');
        await this.donePage.verifyPartialDoneMessage('has been successfully saved');

        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Draft');

        await this.writeEligibilityFormIdValuesToEligibilityFormSheet(testcase.rowIndex, 'eligibilityData');
        await this.commonButtons.clickButton('Open');
        await questionnairePage.processAllQuestions(questionnairedata);
        await this.commonButtons.clickButton('Update');
        await this.donePage.verifyPartialDoneMessage('has been successfully updated');
        await this.commonButtons.clickButton('Back to Form');

        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Draft');

        if (testcase['Linked Provider'].trim() !== '') {
            await this.takeAction('Send to Provider');
            status = await this.commonUtils.fetchFormStatus();
            expect(status).toEqual('Pending Provider Response');
        } else {
            await this.takeAction('Submit for review');
            status = await this.commonUtils.fetchFormStatus();
            expect(status).toEqual('Pending Review');

            await this.takeAction('Submit for approval');
            status = await this.commonUtils.fetchFormStatus();
            expect(status).toEqual('Pending Approval');

            if (isOsProvider) {
                await this.approveFormWithoutLinkedProvider();
            }
        }
    }

    async processEligibilityApproval(testcase, formId, isOsProvider = false) {
        if (testcase['Linked Provider'].trim() !== '') {
            await this.approvePendingReviewFormFromOsProvider(formId);
        }

        else if (!isOsProvider) {
            await this.pendingApprovalProcessFromOsProviderIfLinkedProviderIsNotMapped(formId);
        }
    }
}