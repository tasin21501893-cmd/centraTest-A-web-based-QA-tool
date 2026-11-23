/**
 * @author Shaikh Nahian
 * @since 04/06/2026
 */
import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class RequestForm {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);

        // Page Header 
        this.lnkTherapAdminTab = page.getByRole('link', { name: 'Therap Admin tab with 6 sections' });
        this.lnkNewRequest = page.getByRole('link', { name: 'New for File Transfer Request' });
        this.lblRequestFormHeader = page.locator('section.page-header h1.title');

        // File Transfer Interface (bootstrap-select with live search)
        this.ddlFileTransferInterface = page.locator(
            'button[data-id="fileTransferRequest.fileTransferInterface"]'
        );

        // Source File Type 
        this.ddlSourceFileType = page.locator('#fileTransferRequest\\.sourceFileType');

        // Transfer Type 
        this.ddlTransferType = page.locator('#fileTransferRequest\\.transferType');

        // Source Config (bootstrap-select with live search)
        this.ddlSourceConfig = page.locator(
            'button[data-id="fileTransferRequest.sourceFtConfig"]'
        );

        // Source Directory (text input with "/" prefix added)
        this.txtSourceDirectory = page.locator('#srcRelativePath');

        // Source File Pattern 
        this.txtSourceFilePattern = page.locator('#fileTransferRequest\\.sourceFilePattern');

        // Source File (file type section — enter filename + Add button)
        this.txtSourceFile = page.locator('#fileInputItem');
        this.btnSourceFileAdd = page.locator('#fileAddButton');
        this.lblSelectedFileItems = page.locator('#selectedFileItems');

        // Storage Tracking ID
        this.txtStorageTrackingId = page.locator('#fileTransferRequest\\.storageTrackingId');
        this.btnTrackingIdSearch = page.locator('#trackingIdSearch');

        // DB Storage file list (multiselect)
        this.lstSelectedFtsFileItems = page.locator('li[id^="selectedFtsFileIdList-multi-select-box"] span.text');

        // Destination Section 

        // Destination Config (bootstrap-select with live search)
        this.ddlDestinationConfig = page.locator(
            'button[data-id="fileTransferRequest.destinationFtConfig"]'
        );

        // Destination Directory (text input with "/" prefix added)
        this.txtDestinationDirectory = page.locator('#destinationRelativePath');

        // Status (bootstrap-select with live search)
        this.ddlStatus = page.locator(
            'button[data-id="fileTransferRequest.status"]'
        );

        // Backup Policy 
        this.ddlBackupPolicy = page.locator('#fileTransferRequest\\.backupPolicy');

        // Source Remove Policy 
        this.ddlRemovePolicy = page.locator('#fileTransferRequest\\.removePolicy');

        // Max Try Count 
        this.txtMaxTryCount = page.locator('#fileTransferRequest\\.maxTryCount');

        // External Identifier 
        this.txtExternalIdentifier = page.locator('#fileTransferRequest\\.externalIdentifier');

        // Action Buttons 
        this.btnCancel = page.getByRole('button', { name: 'Cancel' });
        this.btnBack = page.getByRole('button', { name: 'Back' });
        this.btnSave = page.getByRole('button', { name: 'Save' });
        this.lnkBackToForm = page.getByRole('link', { name: 'Form' });
        this.lblTrackingId = page.locator('.form-group.label-value').filter({ has: page.locator('xpath=preceding-sibling::div//label[contains(text(),"Tracking ID")]') }).first();
    }

    // Dynamic Locators

    /**
     * Returns a dropdown option locator scoped to a specific dropdown container.
     * Prevents ambiguity when multiple bootstrap-select dropdowns are open.
     * @param {import('@playwright/test').Locator} dropdownBtn - The toggle button locator
     * @param {string} optionText - Visible text of the option to select
     */
    getDropdownOption(dropdownBtn, optionText) {
        return dropdownBtn
            .locator('xpath=ancestor::div[contains(@class,"bootstrap-select")]')
            .locator('ul.dropdown-menu.inner li a span.text', { hasText: optionText });
    }

    // Interaction 

    /**
     * Selects an option from a bootstrap-select dropdown (with live search).
     * Scoped to the specific dropdown to avoid cross-dropdown ambiguity.
     * @param {import('@playwright/test').Locator} dropdownBtn - The toggle button locator
     * @param {string} optionText - Visible text of the option to select
     */
    async selectBootstrapDropdownOption(dropdownBtn, optionText) {
        // Step 1: Click the toggle button to open the dropdown
        await dropdownBtn.click();

        // Step 2: Scope the search box to this dropdown's container
        const searchInput = dropdownBtn
            .locator('xpath=ancestor::div[contains(@class,"bootstrap-select")]')
            .locator('.bs-searchbox input[type="search"]');

        // Step 3: Type to filter options
        await searchInput.fill(optionText);

        // Step 4: Click the matching option scoped to this dropdown
        await this.getDropdownOption(dropdownBtn, optionText).click();
    }

    /**
     * Selects an option from a plain HTML <select> element.
     * @param {import('@playwright/test').Locator} selectLocator - The <select> locator
     * @param {string} optionText - Visible text of the option to select
     */
    async selectPlainDropdownOption(selectLocator, optionText) {
        await selectLocator.selectOption({ label: optionText });
    }

    /**
     * Adds a source file by typing the filename and clicking the Add button.
     * @param {string} fileName - The filename to add
     */
    async addSourceFile(fileName) {
        await this.txtSourceFile.fill(fileName);
        await this.btnSourceFileAdd.click();
    }

    // Wrappers 

    async openRequestCreateForm() {
        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'File Transfer Request', 'New');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyRequestFormOpened() {
        const header = (await this.lblRequestFormHeader.textContent()).trim();
        if (header == "File Transfer Request") return true;
        return false;
    }

    async selectFileTransferInterface(optionText) {
        await this.selectBootstrapDropdownOption(this.ddlFileTransferInterface, optionText);
    }

    async selectSourceFileType(optionText) {
        await this.selectPlainDropdownOption(this.ddlSourceFileType, optionText);
    }

    async selectTransferType(optionText) {
        await this.selectPlainDropdownOption(this.ddlTransferType, optionText);
    }

    async selectSourceConfig(optionText) {
        await this.selectBootstrapDropdownOption(this.ddlSourceConfig, optionText);
    }

    async enterStorageTrackingIdAndSearch(id) {
        await this.txtStorageTrackingId.fill(id);
        await this.btnTrackingIdSearch.click();
        await this.btnTrackingIdSearch.click();
        await this.lstSelectedFtsFileItems.first().waitFor({ state: 'visible' });
        await this.page.waitForLoadState('networkidle');
    }

    async selectDestinationConfig(optionText) {
        await this.selectBootstrapDropdownOption(this.ddlDestinationConfig, optionText);
    }

    async enterSourceDirectory(path) {
        await this.txtSourceDirectory.fill(path);
    }

    async enterDestinationDirectory(path) {
        await this.txtDestinationDirectory.fill(path);
    }

    async enterSourceFilePattern(pattern) {
        await this.txtSourceFilePattern.fill(pattern);
    }

    async selectStatus(optionText) {
        await this.selectBootstrapDropdownOption(this.ddlStatus, optionText);
    }

    async selectBackupPolicy(optionText) {
        await this.selectPlainDropdownOption(this.ddlBackupPolicy, optionText);
    }

    async selectRemovePolicy(optionText) {
        await this.selectPlainDropdownOption(this.ddlRemovePolicy, optionText);
    }

    async enterMaxTryCount(maxCount) {
        await this.txtMaxTryCount.fill(maxCount);
    }

    async enterExternalIdentifier(extId) {
        await this.txtExternalIdentifier.fill(extId);
    }

    async collectSourceFileNamesForDBStorage() {
        const items = this.lstSelectedFtsFileItems;
        const count = await items.count();
        const names = [];
        for (let i = 0; i < count; i++) {
            let text = (await items.nth(i).textContent()).trim();
            // Strip trailing size info, e.g. " (249 Bytes)", " (11.63 KB)", " (20.00 MB)"
            text = text.replace(/\s*\(\d[\d.,]*\s*(?:Bytes?|KB|MB|GB|TB)\)\s*$/i, '');
            if (text) names.push(text);
        }
        return names.join(', ');
    }

    async fillRequestForm(data) {
        await this.selectFileTransferInterface(data.fileTransferInterface);
        await this.selectSourceFileType(data.sourceFileType);
        if (data.sourceFileType === 'DB Storage') {
            await this.enterStorageTrackingIdAndSearch(data.storageTrackingId);
        } else {
            await this.selectSourceConfig(data.sourceConfig);
            await this.enterSourceDirectory(data.sourceDirectory);
            await this.selectTransferType(data.transferType);
            if (data.sourceFileType === 'Directory') {
                await this.enterSourceFilePattern(data.sourceFilePattern);
            } else {
                for (const fileName of data.sourceFilename.split(',').map(f => f.trim())) {
                    await this.addSourceFile(fileName);
                }
            }
            await this.selectStatus(data.status);
            await this.selectBackupPolicy(data.backupPolicy);
            await this.selectRemovePolicy(data.sourceRemovePolicy);
        }
        await this.selectDestinationConfig(data.destinationConfig);
        await this.enterDestinationDirectory(data.destinationDirectory);
        await this.enterMaxTryCount(data.maxTryCount);
        if (data.externalIdentifier) await this.enterExternalIdentifier(data.externalIdentifier);
    }

    async verifyRequestSuccess() {
        try {
            await this.donePage.verifyPartialDoneMessage('Successfully Saved');
            return true;
        } catch (err) {
            return false;
        }
    }

    async goBackToForm() {
        await this.lnkBackToForm.click();
    }

    async collectTrackingID() {
        return await this.lblTrackingId.textContent();
    }
}