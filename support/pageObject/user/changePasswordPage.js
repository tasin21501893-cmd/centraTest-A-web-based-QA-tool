/**
 * @author Maksuda Islam (Lima)
 * @since 01/09/2024
 */

import { expect } from '@playwright/test';

export class ChangePassword {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.txtUserNameField = page.locator('.label-value')
        this.txtCurrentPasswordField = page.locator('#currentPassword')
        this.txtNewPasswordField = page.locator('#password1')
        this.txtConfirmNewPasswordField = page.locator('#password2')
        this.btnChangePassword = page.locator('input[name="_action_update"]')
    }

    async validateUserName(firstname, lastname) {
        const name = await this.txtUserNameField.textContent();
        expect(name.trim()).toContain(`${firstname} ${lastname}`);
    }

    async changePassword(data) {
        await this.validateUserName(data.firstName, data.lastName);
        await this.txtCurrentPasswordField.fill(data.password);
        await this.txtNewPasswordField.fill(data.changedPasswordAfterFirstLogin);
        await this.txtConfirmNewPasswordField.fill(data.changedPasswordAfterFirstLogin);
    }

    async clickChangePasswordButton() {
        await this.btnChangePassword.click();
    }

    async firstTimeLoginPasswordChange(baseURL, urlData, loginPage, testInfo, testcase, providerCode) {
        if (baseURL && baseURL.length !== 0) {
            await this.page.goto(baseURL + urlData.LoginURL);
        }

        if (!baseURL || baseURL.length === 0) {
            baseURL = testInfo.project.use.baseURL;
            await this.page.goto(baseURL + urlData.LoginURL);
        }

        await loginPage.login(testcase.loginName, providerCode, testcase.password)

        if ((this.page.url()).includes('/password/change')) {
            await this.changePassword(testcase);
            await this.clickChangePasswordButton();

            expect(this.page.url()).not.toContain('/password/change');
        } else {
            throw new Error(`Password already changed OR Super Admin/User (loginName: ${testcase.loginName}) is not created OR Provider (ProviderCode: ${providerCode}) does not exist!`);
        };
    }
}