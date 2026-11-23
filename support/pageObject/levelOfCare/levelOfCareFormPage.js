/**
 * @author Emran Hosssain Rabbi
 * @since 10/08/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';
import { writeExcelCell } from '../../commonUtility/write-xlsx';
import { DonePage } from '../../commonPages/donePage.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';


export class LevelOfCareFormPage {

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
        this.txtSearchInput = page.locator("#locTemplates_wrapper input[type='search']");
        this.lnkNavbarScrollingDropdown = page.locator("[id='navbarScrollingDropdown']");
        this.lnkCaseManagerProfile = page.locator("[aria-label='Switch to Case Maanger Profile']");
        // --- Text Inputs ---
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

        this.iframeLookup = page.frameLocator("[frameborder='0']");
        this.rdoSelectDocument = this.iframeLookup.locator("input[name='select-radio']");

        this.levelOfCareColumns = [
            'Intellectual Disability',
            'Related Disability',
            'Impaired judgment/limited capabilities',
            'Behavior problems',
            'Abusiveness',
            'Assaultiveness',
            'Drug effects / medical monitorship',
            'Acquisition of behaviors necessary to function with as much self determination and independence as possible',
            'Prevention or deceleration of regression or loss of current optimal functional status',
            'Person Meets Level of Care'
        ];

        this.ddlLevelOfCareType = page.locator('#levelOfCare\\.type');
        this.ddlReason = page.locator('#levelOfCare\\.waiver');
        this.ddlAssignedApproverBtn = page.locator('#levelOfCare_assignedApprover_bs_btn');
        this.txtAssignedApproverSearch = page.locator('.dropdown-menu.open .bs-searchbox input');
        this.ddlAssignedApproverOptions = page.locator('.dropdown-menu.open ul.inner li a span.text');
    }

    async selectIndvAndLocTemplate(testcase) {
        await this.listPage.selectFilteredFirstItem(testcase.osId);
        await this.page.waitForLoadState('load');

        if (CommonUtils.isAffirmative(testcase['Enable Level Of Care Multiple Template'])) {
            await this.txtSearchInput.fill(testcase.templateFormId);
            const lnkAdd = this.page
                .locator('#locTemplates tbody tr', { hasText: testcase.templateFormId })
                .getByRole('link', { name: 'Add', exact: true });
            await lnkAdd.click();
        }
    }

    async fillUpLevelOfCareForm(testcase) {
        await this.fillAllLevelOfCareRadioFields(testcase);
        await this.ddlLevelOfCareType.selectOption(testcase['Type']);
        await this.ddlReason.selectOption(testcase['Reason for LOC']);

        // The section count is fixed at three.
        for (const sectionNumber of [1, 2, 3]) {
            await this.attachDocument(sectionNumber, testcase);
        }
    }

    async attachDocument(sectionNumber, testcase) {
        const section = this.page.locator(`#section${sectionNumber}`);
        await this.commonButtons.clickButton('Attach Other File', section);
        await section.locator(this.lnkAddFile).last().click();
        const txtSelectFile = this.page.locator('.modal:visible').getByText('Browse', { exact: true });
        const txtFileDescription = this.page.getByRole('dialog').getByRole('textbox', { name: 'Description' });

        await this.attachmentUtils.attachFile(testcase, txtSelectFile);
        if (testcase.fileDescription) {
            await txtFileDescription.fill(testcase.fileDescription);
        }

        await this.commonButtons.clickButton('Upload');
        await this.page.locator('i.fa.fa-circle-o-notch.fa-spin').waitFor({ state: 'hidden', timeout: 6 * 60 * 1000 }); //Uploading large 10MB files can take around 6 minutes depending on network conditions.
        await this.commonButtons.clickButton('Attach Other File', section);
        await section.locator(this.lnkAddFile).last().click();
        await this.commonButtons.clickButton('Individual Document Lookup');
        await this.commonButtons.clickButton('Search', this.iframeLookup);

        if (await this.rdoSelectDocument.first().isVisible()) {
            await this.rdoSelectDocument.first().click();
            await this.commonButtons.clickButton('Add', this.iframeLookup);
        } else {
            await this.page.locator("[class='close remote-modal-close']").click();
        }
    }

    async pendingApprovalProcessFromOsProvider(formId) {
        await this.txtFormId.fill(formId);
        await this.commonButtons.clickButton('Search');
        await this.page.getByText(formId).click();
        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.txtReturnReason.fill('Test Return');
        await this.commonButtons.clickButton('Return');
        await this.donePage.verifyPartialDoneMessage('has been Returned');
        await this.commonButtons.clickButton('Back to Form');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned');

        await this.commonButtons.clickButton('Submit');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully submitted');
        await this.commonButtons.clickButton('Back to Form');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.commonButtons.clickButton('Approve');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully approved');
        await this.commonButtons.clickButton('Back to Form');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Approved');
    }

    async selectAssignedApproverIfVisible(providerName) {
        if (!providerName) return;

        if (await this.ddlAssignedApproverBtn.isVisible()) {
            await this.ddlAssignedApproverBtn.click();
            await this.txtAssignedApproverSearch.fill(providerName);
            await this.ddlAssignedApproverOptions.filter({ hasText: providerName }).click();
        }
    }

    async completeLevelOfCareWorkflow(testcase, questionnairePage, questionnaireData, isOsProvider = false) {
        await this.fillUpLevelOfCareForm(testcase);
        await this.commonButtons.clickButton('Save');
        await this.donePage.verifyPartialDoneMessage('has been successfully saved');
        await this.selectAssignedApproverIfVisible(testcase['Assigned Approver Name']);
        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Draft');

        await this.writeLocFormIdValuesToLocFormSheet(testcase.rowIndex, 'levelOfCareData');

        await this.commonButtons.clickButton('Open');
        await questionnairePage.processAllQuestions(questionnaireData);
        await this.commonButtons.clickButton('Update');
        await this.donePage.verifyPartialDoneMessage('has been successfully updated');
        await this.commonButtons.clickButton('Back to Form');

        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Draft');

        await this.commonButtons.clickButton('Submit');
        await this.commonButtons.clickButton('Yes');

        await this.donePage.verifyPartialDoneMessage('has been successfully submitted');
        await this.commonButtons.clickButton('Back to Form');

        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        if (isOsProvider) {
            await this.approveLevelOfCareFormDirectly();
        }
    }

    async approveLevelOfCareFormDirectly() {
        await this.txtReturnReason.fill('Test Return');
        await this.commonButtons.clickButton('Return');
        await this.donePage.verifyPartialDoneMessage('has been Returned');
        await this.commonButtons.clickButton('Back to Form');
        let status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Returned');

        await this.commonButtons.clickButton('Submit');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully submitted');
        await this.commonButtons.clickButton('Back to Form');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Pending Approval');

        await this.commonButtons.clickButton('Approve');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully approved');
        await this.commonButtons.clickButton('Back to Form');
        status = await this.commonUtils.fetchFormStatus();
        expect(status).toEqual('Approved');
    }

    async processLevelOfCareApproval(locFormId, isOsProvider = false) {
        if (!isOsProvider) {
            await this.pendingApprovalProcessFromOsProvider(locFormId);
        }
    }

    async writeLocFormIdValuesToLocFormSheet(rowIndex, sheetName) {
        const formId = await this.donePage.fetchFormIdFromDoneMessage();
        const filePath = 'resources/levelOfCare/levelOfCare.xlsx';
        writeExcelCell({ filePath, sheetName, row: rowIndex, col: 'locFormId', value: formId });
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
        }

        if (validationMsg && validationMsg.trim() !== '') {
            await expect(this.alrtDanger).toBeVisible();
            await expect(this.alrtDanger).toContainText(validationMsg.trim());
        }
    }

    /**
    * Select Yes/No radio button based on Excel data.
    *
    * @param {Object} data - Excel row data
    * @param {string} element - Excel column name / UI label
    */
    async selectYesNoByElement(data, element) {
        const value = String(data[element] ?? '').trim().toLowerCase();

        if (!value) {
            return;
        }

        const label = this.page
            .locator('label.control-label')
            .filter({ hasText: element })
            .first();

        await expect(label).toBeVisible();

        const fieldName = await label.getAttribute('for');

        if (!fieldName) {
            throw new Error(
                `Field not found for column: '${element}'`
            );
        }

        const radioValue = {
            yes: 'true',
            no: 'false'
        }[value];

        if (!radioValue) {
            throw new Error(
                `Invalid value '${data[element]}' for '${element}'. Expected Yes or No.`
            );
        }

        // Select the corresponding radio button
        const radio = this.page.locator(
            `input[name='${fieldName}'][type='radio'][value='${radioValue}']`
        );

        await expect(radio).toBeVisible();
        await radio.check();
    }

    /**
     * Fill all Level of Care Yes/No fields from Excel.
     *
     * @param {Object} data - Excel row data
     */
    async fillAllLevelOfCareRadioFields(data) {
        for (const column of this.levelOfCareColumns) {
            await this.selectYesNoByElement(data, column);
        }
    }
}