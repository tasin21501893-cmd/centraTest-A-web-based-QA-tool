/**
 * @author Maksuda Islam (Lima)
 * @author Tarikul Islam
 * @since 01/09/2024
 */

import { assert } from 'assert';
import { expect } from '@playwright/test';

import urlData from '../../resources/commonResources/urlData.json';
import { readExcelDataWithSheetName, findObject } from "../commonUtility/read-xlsx";

import { CommonButtons } from '../commonUtility/commonButtons';

export class LoginPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('head > title');
        this.txtLoginName = page.getByPlaceholder('Login Name');
        this.txtProviderCode = page.getByPlaceholder('Provider Code');
        this.txtPassword = page.getByPlaceholder('Password');
        this.lnkForgotPassword = page.getByRole('link', { name: 'Forgot Password?' });
        this.btnDashboard = page.locator('[name="_action_dashboard"]');
        this.btnPromptYes = page.locator('.btn.btn-primary.btn-sm.btn-prompt-yes');
        this.scrollContainer = page.locator('#details .rich-text-content');

        this.commonButtons = new CommonButtons(page);
    }

    async verifyPageTitle() {
        const pageTitleText = await this.pageTitle.innerText();
        assert(pageTitleText.includes("Therap :: Login"));
    }

    async login(loginName, providerCode, password) {
        await this.txtLoginName.fill(loginName);
        await this.txtProviderCode.fill(providerCode);
        await this.commonButtons.clickButton('Continue');
        await this.txtPassword.fill(password);
        await this.commonButtons.clickButton('Login');
    }

    async loginUsingExcelData(data) {
        await this.txtLoginName.fill(data.loginName);
        await this.txtProviderCode.fill(data.providerCode);
        await this.commonButtons.clickButton('Continue');
        await this.txtPassword.fill(data.password);
        await this.commonButtons.clickButton('Login');
    }

    async doLogin(excelFilePath, sheetName, arrayOfObjectsToFilter) {
        await this.page.goto(urlData.LoginURL, { waitUntil: "domcontentloaded" });
        let loginData = readExcelDataWithSheetName(excelFilePath, sheetName);
        let supportingRow = findObject(loginData, arrayOfObjectsToFilter);
        await this.loginUsingExcelData(supportingRow);
        
        try {
            await this.page.waitForURL(url => !url.href.includes(urlData.LoginURL), { timeout: 15000 });
        } catch (error) {
            expect(this.page.url()).not.toContain(urlData.LoginURL);
        }

        if (this.page.url().includes(urlData.UcLoaderURL)) {
            try {
                await this.page.waitForURL(url => !url.href.includes(urlData.UcLoaderURL));
            } catch (error) {
                throw new Error(`Login failed or loader got stuck on ${urlData.UcLoaderURL}`);
            }
        }
        await this.skipPostLogin();
    }

    async ValidateAlertDangerText(alertMessage) {
        const dangerText = await this.page.$eval('.alert.alert-danger.text-center', element => element.textContent.trim().replace(/\s/g, ''));
        expect(dangerText).toBe(alertMessage.trim().replace(/\s/g, ''));
    }

    async validateExistanceOfForgotPasswordLink() {
        await this.lnkForgotPassword.click();
    }

    async validateExistanceOfTroubleLogging() {
        await this.getTroubleLoggingIn.click();
        const locator = await this.page.frameLocator('#troubleLoggingHelpUrl').getByText('Self Password Reset Enabled?').innerText();
        assert(locator.includes('Self Password Reset Enabled?'));
    }

    async skipPostLogin() {
        if (this.page.url().includes('/sa/view')) {
            await this.scrollContainer.waitFor({ state: 'visible' });
            await this.scrollContainer.focus();
            await this.page.keyboard.press('End');
            await this.commonButtons.clickButton('Agree');
            await this.btnPromptYes.click();
            await this.skipPostLogin();
        }

        if (this.page.url().includes('/common/loginDetail')) {
            await this.commonButtons.clickButton('Cancel');
            await this.skipPostLogin();
        }

        if (this.page.url().includes('/splash/view')) {
            await this.btnDashboard.click();
            await this.skipPostLogin();
        }

        if (this.page.url().includes('/authConfig/selfPasswordReset')) {
            await this.commonButtons.clickButton('Cancel');
            await this.skipPostLogin();
        }

        if (this.page.url().includes('/authConfig/password/change')) {
            await this.commonButtons.clickButton('Cancel');
            await this.skipPostLogin();
        }

        if (this.page.url().includes('/newfpage/admin') || this.page.url().includes('/fpage/unifiedDashboard')) {
            await this.page.goto('/ma/home/switch?newDashboard=true&fpmode=admin');
            await this.skipPostLogin();
        }
    }
}