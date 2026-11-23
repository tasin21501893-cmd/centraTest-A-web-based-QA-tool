/**
 * @author Maksuda Islam (Lima)
 * @author Abdullah Umar Nasib
 * @since 01/09/2024
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { SuperAdminPage } from '../../pageObject/providerSetup/superAdminPage';

export class UserPage {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.superAdminPage = new SuperAdminPage(page);
        this.txtFirstNameField = page.locator('[name="firstName"]');
        this.txtFirstNameErrorMsg = page.locator('#firstName\\.errors');
        this.txtLastNameField = page.locator('[name="lastName"]');
        this.txtLastNameErrorMsg = page.locator('#lastName\\.errors');
        this.ddlUserType = page.locator('#typePickerBtn');
        this.txtTypeOption = (type) => page.locator('[role="option"]', { hasText: type });
        this.txtUserInitialsInputField = page.locator('[name="userInitial"]');
        this.userInitialsSearchIcon = page.locator('#user-initial-search');
        this.txtLoginNameField = page.locator('[name="loginName"]');
        this.loginNameErrorMsg = page.locator('#loginName\\.errors');
        this.txtPasswordField = page.locator('[name="password1"]');
        this.txtPasswordErrorMsg = page.locator('#password1\\.errors');
        this.txtConfirmPasswordField = page.locator('[name="password2"]');
        this.txtConfirmPasswordErrorMsg = page.locator('#password2\\.errors');
        this.titleAddIcon = page.locator('#new-title-add');
        this.userInitialErrorMsg = page.locator('#userInitial\\.errors');

        this.commonUtils = new CommonUtils(page);
    }

    async goToCreateNewSuperAdminPage() {
        await this.page.locator('#pageContent > section:nth-child(4) > div > a').click();
    }

    async checkStatusRadioButton(status) {
        if (status == 'Active') {
            this.page.locator('#status1');
        }
        else if (status == 'Pending') {
            this.page.locator('#status2');
        }
    }

    async userInformation(firstName, lastName, userType) {
        const countOfUserType = await this.commonUtils.isElementAvailable(this.ddlUserType);

        await this.txtFirstNameField.fill(firstName);
        await this.txtLastNameField.fill(lastName);

        if (countOfUserType > 0) {
            await this.ddlUserType.click();
            await this.txtTypeOption(userType).click();
        }
        await this.superAdminPage.selectUserInitialFromSearchTable();
    }

    async authConfig(loginName, password, confirmPassword, ignorePasswordPolicy) {
        await this.txtLoginNameField.fill(loginName);
        await this.txtPasswordField.fill(password);
        await this.txtConfirmPasswordField.fill(confirmPassword);

        await this.superAdminPage.IgnorePasswordPolicy(ignorePasswordPolicy);
    }

    async accountSettings(status) {
        await this.checkStatusRadioButton(status);
    }

    async userFormFillup(data) {
        await this.userInformation(data.firstName, data.lastName, data.userType);
        await this.authConfig(data.loginName, data.password, data.confirmPassword, data.ignorePasswordPolicy);
        await this.accountSettings(data.status);
        await this.superAdminPage.EmployerInformation(data.title, data.description, data.employeeID, data.hireDate);
    }

    async checkIfUserAlreadyExists() {
        await this.page.waitForLoadState('networkidle');
        const isLoginNameErrorVisible = await this.loginNameErrorMsg.isVisible();
        const isUserInitialErrorVisible = await this.userInitialErrorMsg.isVisible();

        return isLoginNameErrorVisible || isUserInitialErrorVisible;
    }
}