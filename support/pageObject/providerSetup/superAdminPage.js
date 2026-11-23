/**
 * @author Maksuda Islam (Lima)
 * @author Tarikul Islam
 * @author Emran Hossain Rabbi
 * @since 01/09/2024
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class SuperAdminPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);

        this.btnCreateNewSuperAdmin = page.getByText('Create New Super Admin');

        this.txtFirstNameField = page.locator('[name="firstName"]');
        this.txtLastNameField = page.locator('[name="lastName"]');
        this.txtUserInitialsInputField = page.locator('[name="userInitial"]');
        this.userInitialsSearchIcon = page.locator('#user-initial-search');

        this.searchTableFrame = page.frameLocator("iframe[frameborder='0']");
        this.userInitialSearchLinks = this.searchTableFrame.locator('a.user-initial');

        this.txtLoginNameField = page.locator('[name="loginName"]');
        this.txtPasswordField = page.locator('[name="password1"]');
        this.txtConfirmPasswordField = page.locator('[name="password2"]');
        this.chkForce2FA = page.locator('[name="forceOTP"]');
        this.rdoIgnorePwdPolicyYes = page.locator('#disablePasswordCheck1');
        this.rdoIgnorePwdPolicyNo = page.locator('#disablePasswordCheck2');

        this.chkSuperAdmin = page.locator('[name="createSuperAdmin"]');
        this.rdoStatusActive = page.locator('#status1');
        this.rdoStatusPending = page.locator('#status2');

        this.titlePickerBtn = page.locator('#userTitlePickerBtn');
        this.titleOptions = page.locator('th-select-picker#userTitlePicker [role="option"] .form-check-label');
        this.titleOption = (title) => page.locator('th-select-picker#userTitlePicker [role="option"]', { hasText: title, });
        this.titleAddIcon = page.locator('#new-title-add');
        this.txtEmployeeIDField = page.locator('[name="employeeId"]');
        this.txtHireDateInputField = page.locator('[name="hireDate"]');

        this.titleModalFrame = page.frameLocator('#new-title-modal iframe');
        this.txtTitleModalTitle = this.titleModalFrame.locator('#title');
        this.txtTitleModalDescription = this.titleModalFrame.locator('#description');
        this.btnSubmitTitle = this.titleModalFrame.locator('input[type="submit"]');

        this.closeButtons = this.page.locator('[aria-label="Close"]');
        this.btnSave = page.locator('input[name="save"]');
        this.successAlertValidationMsg = page.locator('div.alert.alert-success.text-center');
    }

    async goToCreateNewSuperAdminPage() {
        await this.btnCreateNewSuperAdmin.click();
    }

    async clickProvider(providerCode) {
        await this.page.getByRole('cell', { name: providerCode, exact: true }).click();
    }

    async selectUserInitialFromSearchTable() {
        await this.userInitialsSearchIcon.click();
        const firstInitial = this.userInitialSearchLinks.first();
        await this.page.waitForLoadState('networkidle');
        await firstInitial.click();
        await this.commonUtils.waitForChangeInDOM('#userInitial', { timeout: 1500 });
        this.userInitial = await this.txtUserInitialsInputField.inputValue();
        if ((await this.userInitial.trim()) === '') {
            const closeButtons = this.page.locator('[aria-label="Close"]');
            await closeButtons.click();
            await this.page.waitForLoadState('networkidle');
            await this.selectUserInitialFromSearchTable();
        }
    }

    async checkStatusRadioButton(status) {
        if (status === "Active") {
            await this.rdoStatusActive.check();
        } else if (status === "Pending") {
            await this.rdoStatusPending.check();
        }
    }

    async fillupTitleFrame(title, description) {
        await this.titleAddIcon.click();
        await this.txtTitleModalTitle.fill(title);
        await this.txtTitleModalDescription.fill(description);
        await this.btnSubmitTitle.click();
        await this.page.waitForLoadState('networkidle')
        const closeButtons = this.page.locator('[aria-label="Close"]');

        const count = await closeButtons.count();

        for (let i = 0; i < count; i++) {
            await closeButtons.nth(i).click();
        }

        await expect(this.page.locator('.modal-header')).toBeHidden();
        await this.commonUtils.waitForChangeInDOM('#userTitlePicker', { timeout: 1500 });
        const titleText = await this.page.locator('#userTitlePickerBtn .button-title').innerText();

        if ((await titleText.trim()) === '- Please Select -') {
            await this.page.waitForLoadState('networkidle');
            await this.fillupTitleFrame(title, description);
        }
    }

    async userInformation(firstName, lastName) {
        await this.txtFirstNameField.fill(firstName);
        await this.txtLastNameField.fill(lastName);
        await this.selectUserInitialFromSearchTable();
    }

    async authConfig(loginName, password, confirmPassword, uncheckForce2FA) {
        const force2FACount = await this.commonUtils.isElementAvailable(this.chkForce2FA);

        await this.txtLoginNameField.fill(loginName);
        await this.txtPasswordField.fill(password);
        await this.txtConfirmPasswordField.fill(confirmPassword);

        if (force2FACount > 0) {
            if (await this.chkForce2FA.isChecked() && ['y', 'yes'].includes(uncheckForce2FA.toLowerCase())) {
                await this.chkForce2FA.uncheck();
            }
        } else {
            console.log("2FA is not configured for the Provider");
        }
    }

    async accountSettings(status, uncheckSuperAdmin) {
        if (await this.chkSuperAdmin.isChecked() && ['y', 'yes'].includes(uncheckSuperAdmin.toLowerCase())) {
            await this.chkSuperAdmin.uncheck();
        }
        await this.checkStatusRadioButton(status);
    }

    async createNewTitle(title, description) {
        await this.fillupTitleFrame(title, description);
    }

    async setTitle(title, description) {
        const rawOptions = await this.titleOptions.allTextContents();
        const titleDropdownOptions = rawOptions.map(text => text.trim());

        if (titleDropdownOptions.includes(title)) {
            await this.titlePickerBtn.click();
            await this.titleOption(title).click();
        } else {
            await this.createNewTitle(title, description);
        }
    }


    async EmployerInformation(title, description, employeeID, hireDate) {
        await this.setTitle(title, description);
        await this.txtEmployeeIDField.fill(employeeID);
        await this.txtHireDateInputField.fill(hireDate);
    }

    async IgnorePasswordPolicy(id) {
        if (id === "Yes") {
            await this.rdoIgnorePwdPolicyYes.check();
        } else if (id === "No") {
            await this.rdoIgnorePwdPolicyNo.check();
        }
    }

    async createSuperAdminFormFillup(data) {
        await this.userInformation(data.firstName, data.lastName);
        await this.authConfig(data.loginName, data.password, data.confirmPassword, data.uncheckForce2FA);
        await this.accountSettings(data.status, data.uncheckSuperAdmin);
        await this.EmployerInformation(data.title, data.description, data.employeeID, data.hireDate);
    }

    async saveSuperAdmin() {
        await this.btnSave.click();
    }
}