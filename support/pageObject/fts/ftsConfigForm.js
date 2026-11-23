/**
 * @author Shaikh Nahian
 * @since 04/06/2026
 */
import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class ConfigForm {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);

        // Main elements
        this.lnkTherapAdminTab = page.getByRole('link', { name: 'Therap Admin tab with 6 sections' });
        this.lnkConfigCreateNew = page.getByRole('link', { name: 'New for File Transfer Config' });
        this.btnOk = page.getByRole('button', { name: 'Ok' });
        this.lnkDashboard = page.locator('a[href="/ma/home/t"]').filter({ hasText: 'HomePage' }).first().or(page.locator('a[href="/ma/home/t"]').nth(1));
        this.lblConfigFormHeader = page.getByRole('heading', { name: 'File Transfer Config' });
        this.lblFormStatus = page.locator('section.page-header span.status.text-primary');
        this.lnkConfigSearch = page.getByRole('link', { name: 'Search for File Transfer Config' });
        this.txtConfigSearchFieldName = page.locator('#name');
        this.tblConfigDataTable = page.locator('#dataList');
        this.tblConfigDataTableRow = page.locator('#dataList tbody tr');
        this.btnConfigTestCollapse = page.locator('#fileTransferConfigTest-collapse-btn');
        this.ddlConfigTestType = page.locator('.filter-option-inner-inner', { hasText: '- Please Select -' });
        this.lnkConfigTestConnectivityTestOption = page.locator('.dropdown-menu .text', { hasText: 'Connectivity Test' });
        this.lnkConfigTestDirectoryStatOption = page.locator('.dropdown-menu .text', { hasText: 'Directory Stat (ls)' });
        this.msgAlert = page.locator('#alert-msg');

        // fields grouped by category
        this.basicFields = {
            txtName: page.getByLabel('* Name'),
            chkActive: page.getByLabel('Active'),
            ddlContextType: page.getByLabel('* Context Type'),
            txtRootDirectory: page.getByLabel('* Root Directory')
        };

        this.remoteFields = {
            ddlProtocol: page.getByLabel('* Protocol'),
            ddlAuthType: page.getByLabel('* Client Authentication Type'),
            txtUsername: page.getByLabel('* Username'),
            txtHost: page.getByLabel('* Host'),
            txtPort: page.getByLabel('* Port'),
            txtSessionTimeout: page.getByLabel('* Session Timeout (ms)'),
            txtChannelTimeout: page.getByLabel('* Channel Timeout (ms)'),
            chkSupportsRename: page.getByLabel('Supports Rename')
        };

        this.keyBasedAuthFields = {
            txtPrivateKeyPath: page.getByLabel('Private Key Path'),
            btnChooseFile: page.getByText('Choose File'),
            txtNewPassphrase: page.getByLabel('New Private Key Passphrase'),
            txtConfirmPassphrase: page.getByLabel('Confirm Private Key Passphrase')
        };

        this.passwordAuthFields = {
            txtPassword: page.getByLabel('* Password'),
            txtConfirmPassword: page.getByLabel('* Confirm Password'),
            txtPasswordExpiryDays: page.getByLabel('* Set Current Password Expiry'),
            txtDefaultPasswordExpiry: page.getByLabel('Default Password Expiry in'),
            chkPasswordPrompt: page.getByLabel('Ignore Password Prompt')
        };

        this.proxyFields = {
            chkEnableCustomProxy: page.getByLabel('Enable Custom Proxy'),
            txtProxyHost: page.getByLabel('Proxy Host'),
            txtProxyPort: page.getByLabel('Proxy Port')
        };

        // Error locators
        this.errorLocators = {
            name: page.locator('#fileTransferConfig\\.name\\.errors'),
            contextType: page.locator('#fileTransferConfig\\.contextType\\.errors'),
            rootDirectory: page.locator('#fileTransferConfig\\.rootDirectory\\.errors'),
            protocol: page.locator('#fileTransferConfig\\.protocol\\.errors'),
            username: page.locator('#fileTransferConfig\\.username\\.errors'),
            host: page.locator('#fileTransferConfig\\.host\\.errors'),
            password: page.locator('#newPassword\\.errors'),
            confirmPassword: page.locator('#confirmPassword\\.errors'),
            passwordExpiry: page.locator('#passwordExpiryInDays\\.errors'),
            keyValidation: page.locator("ul[class='list-unstyled'] li"),
            confirmPassphrase: page.locator('#confirmPrivateKeyPassphrase\\.errors'),
            sessionTimeout: page.locator('#fileTransferConfig\\.sessionTimeout\\.errors'),
            channelTimeout: page.locator('#fileTransferConfig\\.channelTimeout\\.errors'),
            proxyHost: page.locator('#fileTransferConfig\\.proxyHost\\.errors'),
            proxyPort: page.locator('#fileTransferConfig\\.proxyPort\\.errors')
        };
    }

    async openNewForm() {
        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'File Transfer Config', 'New');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyConfigFormOpened() {
        const status = (await this.lblFormStatus.textContent()).trim();
        const configFormHeaderVisible = await this.lblConfigFormHeader.isVisible();
        if (configFormHeaderVisible && status == "New") {
            return true;
        }
        return false;
    }

    async getRowByName(configName) {
        return this.tblConfigDataTableRow.filter({ hasText: configName });
    }

    async openConfigFromDataTable(configName) {
        await this.commonUtils.navigateToDashboardLink('Therap Admin', 'File Transfer Config', 'Search');
        await this.page.waitForLoadState('networkidle');
        await this.txtConfigSearchFieldName.fill(configName);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('networkidle');
        await (await this.getRowByName(configName)).click();
        await this.page.waitForLoadState('networkidle');
    }

    async configFormConfigTest(configName) {
        await this.openConfigFromDataTable(configName);
        await this.btnConfigTestCollapse.click();
        await this.ddlConfigTestType.click();
        await this.lnkConfigTestConnectivityTestOption.click();
        await this.lnkConfigTestDirectoryStatOption.click();
        await this.commonButtons.clickButton('Add Config Test');
    }

    async verifyConfigTestAddSuccess() {
        const message = await this.msgAlert.textContent();
        if (message == "Config test(s) successfully added") return true;
        return false;
    }

    async fillBasicInfo(data) {
        const timestamp = Date.now();
        data._savedName = `${data.name}_${timestamp}`;
        await this.basicFields.txtName.fill(data._savedName);

        if (data.active) {
            await this.basicFields.chkActive.check();
        }

        if (data.contextType) {
            await this.basicFields.ddlContextType.selectOption(data.contextType);
        }

        if (data.rootDirectory) {
            await this.basicFields.txtRootDirectory.fill(data.rootDirectory);
        }
    }

    async fillRemoteConfig(data) {
        if (data.protocol) await this.remoteFields.ddlProtocol.selectOption(data.protocol);
        if (data.authType) await this.remoteFields.ddlAuthType.selectOption(data.authType.toString());
        if (data.username) await this.remoteFields.txtUsername.fill(data.username);
        if (data.host) await this.remoteFields.txtHost.fill(data.host);
        if (data.port && data.port != 22) await this.remoteFields.txtPort.fill(data.port.toString());
        if (data.sessionTimeout) await this.remoteFields.txtSessionTimeout.fill(data.sessionTimeout.toString());
        if (data.channelTimeout) await this.remoteFields.txtChannelTimeout.fill(data.channelTimeout.toString());
        if (data.supportsRename) await this.remoteFields.chkSupportsRename.check();
    }

    async handleKeyBasedAuth(data) {
        if (data.privateKeyPath) {
            await this.keyBasedAuthFields.txtPrivateKeyPath.fill(data.privateKeyPath);
        }

        if (data.privatekeyFile) {
            await this.keyBasedAuthFields.btnChooseFile.click();
            await this.page.locator('input[type="file"]').setInputFiles(data.privatekeyFile);
            await this.page.locator("label[class='btn btn-default']").last().waitFor();
            await this.page.locator("label[class='btn btn-default']").last().click();
        }

        if (data.newPassphrase) {
            await this.keyBasedAuthFields.txtNewPassphrase.fill(data.newPassphrase);
            await this.keyBasedAuthFields.txtConfirmPassphrase.fill(data.newPassphrase);
        }
    }

    async handlePasswordAuth(data) {
        if (data.password) {
            await this.passwordAuthFields.txtPassword.fill(data.password);
            await this.passwordAuthFields.txtConfirmPassword.fill(data.password);
        }

        if (data.passwordExpiryDays) {
            await this.passwordAuthFields.txtPasswordExpiryDays.fill(data.passwordExpiryDays.toString());
        }

        if (data.defaultPasswordExpiryDays) {
            await this.passwordAuthFields.txtDefaultPasswordExpiry.fill(data.defaultPasswordExpiryDays.toString());
            if (data.setDefault) await this.commonButtons.clickButton('Set Default');
        }

        if (data.passwordPrompt) {
            await this.passwordAuthFields.chkPasswordPrompt.check();
        }
    }

    async handleProxyConfig(data) {
        if (data.enableCustomProxy == "TRUE") {
            await this.proxyFields.chkEnableCustomProxy.check();
            if (data.proxyHost) await this.proxyFields.txtProxyHost.fill(data.proxyHost.toString());
            if (data.proxyPort) await this.proxyFields.txtProxyPort.fill(data.proxyPort.toString());
        }
    }

    async fillForm(data) {
        await this.fillBasicInfo(data);

        if (data.contextType === 'REMOTE') {
            await this.fillRemoteConfig(data);

            if (data.authType.includes('KEY_BASED')) {
                await this.handleKeyBasedAuth(data);
            }

            if (data.authType.includes('PASSWORD')) {
                await this.handlePasswordAuth(data);
            }

            await this.handleProxyConfig(data);
        }
    }

    async submitForm(contextType) {
        await this.commonButtons.clickButton('Save');
        await this.page.waitForLoadState('networkidle');

        if (contextType === 'REMOTE') {
            await this.commonButtons.clickButton('Ok');
            await this.page.waitForLoadState('networkidle');
        }
    }

    async validateFieldError(field, invalidMessages) {
        if (await this.errorLocators[field].count() > 0) {
            const actualText = await this.errorLocators[field].textContent();
            for (const message of invalidMessages) {
                await expect.soft(actualText).not.toContain(message);
            }
            return 1;
        }
        return 0;
    }

    async validateErrors() {
        let errorCount = 0;

        errorCount += await this.validateFieldError('name', [
            'Required',
            'This configuration name already exists'
        ]);

        errorCount += await this.validateFieldError('contextType', ['']);

        errorCount += await this.validateFieldError('rootDirectory', [
            'Required',
            'Invalid Directory Pattern',
            'Must end with a forward slash (/)'
        ]);

        errorCount += await this.validateFieldError('protocol', ['']);

        errorCount += await this.validateFieldError('username', ['Required']);
        errorCount += await this.validateFieldError('host', ['Required']);
        errorCount += await this.validateFieldError('password', ['Required']);

        errorCount += await this.validateFieldError('confirmPassword', [
            'Password and Confirm Password did not match'
        ]);

        errorCount += await this.validateFieldError('passwordExpiry', [
            'Password Expiry Days must be greater than zero',
            'Invalid!'
        ]);

        if (await this.errorLocators.keyValidation.count() > 0) {
            const actualText = await this.errorLocators.keyValidation.textContent();
            await expect.soft(actualText).not.toContain('Must provide either the private key path or the key file');
            errorCount++;
        }

        errorCount += await this.validateFieldError('confirmPassphrase', [
            'Key Passphrase and Confirm Key Passphrase did not match'
        ]);

        errorCount += await this.validateFieldError('sessionTimeout', ['Required']);
        errorCount += await this.validateFieldError('channelTimeout', ['Required']);
        errorCount += await this.validateFieldError('proxyHost', [
            'Proxy host cannot be null if proxy is enabled'
        ]);

        errorCount += await this.validateFieldError('proxyPort', [
            'Proxy port cannot be null if proxy is enabled'
        ]);

        return errorCount;
    }

    async verifySuccess(data) {
        try {
            await this.donePage.verifyPartialDoneMessage('File Transfer Config Successfully Saved');
            return true;
        } catch (err) {
            return false;
        }
    }

    async backToDashboard() {
        await this.lnkDashboard.click();
    }
}