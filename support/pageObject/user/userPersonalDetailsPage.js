/**
 * @author Ziaur Rahman
 * @author Abdullah Umar Nasib
 * @since 18/02/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { readExcelDataWithSheetName, filterObjects } from '../../../support/commonUtility/read-xlsx.js';

export class UserPersonalDetailsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);

        // Basic Information
        this.dtpDateOfBirth = page.locator('[name="dateOfBirth"]');
        this.dtpDateOfBirthErrorMsg = page.locator('#dateOfBirth\\.errors');
        this.txtLicenseNumber = page.locator('[name="licenseNumber"]');
        this.txtLicenseNumberErrorMsg = page.locator('#licenseNumber\\.errors');
        this.txtSsn = page.locator('[name="ssn"]');
        this.txtSsnErrorMsg = page.locator('#ssn\\.errors');

        // ID Type and Number
        this.btnAddId = page.locator('button.add-login-id-number');
        this.txtIdNumber = page.locator('[name="loginIdNumbers[0].idNumber"]');
        this.txtIdNumberErrorMsg0 = page.locator('#loginIdNumbers0\\.idNumber\\.errors');
        this.ddlIdTypeErrorMsg0 = page.locator('#loginIdNumbers0\\.code\\.errors');
        this.ddlIdTypeErrorMsg1 = page.locator('#loginIdNumbers1\\.code\\.errors');

        // Contact Information :: Address
        this.txtAddressStreet1 = page.locator('[name="address.street1"]');
        this.txtAddressStreet2 = page.locator('[name="address.street2"]');
        this.txtAddressCity = page.locator('[name="address.city"]');
        this.ddlAddressState = page.locator('[name="address.state"]');
        this.txtAddressZipCode = page.locator('[name="address.zip"]');
        this.ddlAddressCountry = page.locator('[name="address.country"]');

        // Contact Information :: Phone Number
        this.txtPhoneNumberHome = page.locator('[name="homeTelno"]');
        this.txtPhoneNumberMobile = page.locator('[name="mobileTelno"]');
        this.txtPhoneNumberTemporary = page.locator('[name="tempTelno"]');
        this.txtPhoneNumberExtension = page.locator('[name="tempTelnoExt"]');
        this.txtPhoneNumberComments = page.locator('[name="telnoComment"]');
        this.txtEMailAddress = page.locator('[name="email"]');

        // Contact Information :: Error Messages
        this.txtAddressStreet1ErrorMsg = page.locator('#address\\.street1\\.errors');
        this.txtAddressStreet2ErrorMsg = page.locator('#address\\.street2\\.errors');
        this.txtAddressCityErrorMsg = page.locator('#address\\.city\\.errors');
        this.txtAddressZipCodeErrorMsg = page.locator('#address\\.zip\\.errors');
        this.txtHomePhoneErrorMsg = page.locator('#homeTelno\\.errors');
        this.txtMobilePhoneErrorMsg = page.locator('#mobileTelno\\.errors');
        this.txtTemporaryPhoneErrorMsg = page.locator('#tempTelno\\.errors');
        this.txtTemporaryPhoneExtErrorMsg = page.locator('#tempTelnoExt\\.errors');
        this.txtPhoneNumberCommentsErrorMsg = page.locator('#telnoComment\\.errors');
        this.txtEmailErrorMsg = page.locator('#email\\.errors');

        // Preferences
        this.ddlTimeZone = page.locator('[name="login.preferredTz"]');
        this.ddlTimeZoneErrorMsg = page.locator('#login\\.preferredTz\\.errors');
        this.chkEnableNotification = page.locator('[name="notifEnabled"]');

        // Additional Contact Information :: Employer/Work Information
        this.txtWorkInfoWorkPhoneNumber = page.locator('[name="workTelno"]');
        this.txtWorkInfoWorkPhoneNumberExtension = page.locator('[name="workTelnoExt"]');
        this.txtWorkInfoWorkFaxNumber = page.locator('[name="faxTelno"]');

        // Additional Contact Information :: Emergency Contact 1
        this.txtEmergencyContact1Name = page.locator('[name="emergName1"]');
        this.txtEmergencyContact1PhoneNumber = page.locator('[name="emergTelno1"]');
        this.txtEmergencyContact1PhoneNumberExtension = page.locator('[name="emergTelno1Ext"]');

        // Additional Contact Information :: Emergency Contact 2
        this.txtEmergencyContact2Name = page.locator('[name="emergName2"]');
        this.txtEmergencyContact2PhoneNumber = page.locator('[name="emergTelno2"]');
        this.txtEmergencyContact2PhoneNumberExtension = page.locator('[name="emergTelno2Ext"]');

        // Additional Contact Information :: Error Messages
        this.txtWorkPhoneErrorMsg = page.locator('#workTelno\\.errors');
        this.txtWorkPhoneExtErrorMsg = page.locator('#workTelnoExt\\.errors');
        this.txtWorkFaxErrorMsg = page.locator('#faxTelno\\.errors');

        this.txtEmergName1ErrorMsg = page.locator('#emergName1\\.errors');
        this.txtEmergPhone1ErrorMsg = page.locator('#emergTelno1\\.errors');
        this.txtEmergPhoneExt1ErrorMsg = page.locator('#emergTelno1Ext\\.errors');

        this.txtEmergName2ErrorMsg = page.locator('#emergName2\\.errors');
        this.txtEmergPhone2ErrorMsg = page.locator('#emergTelno2\\.errors');
        this.txtEmergPhoneExt2ErrorMsg = page.locator('#emergTelno2Ext\\.errors');

        // EVV
        this.txtEvvId = page.locator('[name="evvId"]');
        this.ddlEvvCaregiverType = page.locator('[name="evvCaregiverType"]');

        // EVV :: Error Messages
        this.txtEvvIdErrorMsg = page.locator('#evvId\\.errors');
        this.ddlEvvCaregiverTypeErrorMsg = page.locator('#evvCaregiverType\\.errors');

        this.btnSignAddEdit = page.locator("#show-sign-modal");
        this.btnCancel = page.locator('[name="_action_cancel"]');
        this.btnBack = page.locator('[name="_action_back"]');
        this.btnUpdate = page.locator('[name="_action_save_or_update"]');

        this.successAlertMsg = page.locator('div.alert.alert-success.text-center');
    }

    async navigateToPersonalDetailsPage(data) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'User', 'List');

        await this.listPage.fillFilterFieldForPrimeFaceListPage('null', data.loginName);
        await this.page.waitForLoadState('domcontentloaded');

        try {
            await this.commonUtils.waitForChangeInDOM('#userDataTable');
        } catch (error) {
            console.log(`[Note] DOM mutation observer timed out. Proceeding using native Playwright waits.`);
        }

        const userLink = this.page.locator(`td[role="gridcell"] a:text-is("${data.loginName}")`);
        await userLink.waitFor({ state: 'visible' });
        await userLink.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.donePage.clickLinkByText('Go to Personal Details');
    }

    async uploadUserPhoto(data) {
        if (CommonUtils.isAffirmative(data.hasPhoto)) {
            const attachmentData = readExcelDataWithSheetName('resources/user/user.xlsx', 'addImage');
            const imageData = filterObjects(attachmentData, [{ 'formIndex': data.testCaseNumber }]);

            if (imageData.length > 0) {
                const btnAddImage = this.page.locator('.add-image-button');

                if (!(await btnAddImage.isVisible())) {
                    await this.page.locator('.image-upload-wrap-div').hover();
                    await this.page.locator('.image-upload-delete').click();
                    await this.commonButtons.clickButton('Yes');
                    await btnAddImage.waitFor({ state: 'visible' });
                }

                await this.attachmentUtils.addImage(imageData[0]);
            } else {
                throw new Error(`Test Case "${data.testCaseNumber}" requires a photo, but no matching row was found in the 'addImage' sheet.`);
            }
        }
    }

    async checkGender(gender) {
        if (!gender || gender.trim() === '') return;

        const genderMap = {
            'Male': '#gender1',
            'Female': '#gender2',
            'Other': '#gender3'
        };

        const selector = genderMap[gender];

        if (!selector) {
            throw new Error(`Invalid gender provided: "${gender}". Expected "Male", "Female", or "Other".`);
        }

        await this.page.locator(selector).check();
    }

    async fillupUserIdTypesAndNumbers(idsString) {
        if (!idsString || idsString.trim() === '') return;

        const idsToEnter = idsString.split('|').map(item => {
            const parts = item.split(',');
            return {
                type: parts[0] ? parts[0].trim() : '',
                number: parts[1] ? parts[1].trim() : ''
            };
        });

        for (let i = 0; i < idsToEnter.length; i++) {
            const idData = idsToEnter[i];

            if (i > 0) {
                await this.btnAddId.click();
            }

            const ddlIdType = this.page.locator(`select[name="loginIdNumbers[${i}].code"]`);
            const txtIdNumber = this.page.locator(`[name="loginIdNumbers[${i}].idNumber"]`);

            if (idData.type !== '') {
                await ddlIdType.selectOption({ label: idData.type });
            }

            if (idData.number !== '') {
                await txtIdNumber.fill(idData.number);
            }
        }
    }

    async fillupBasicInformation(data) {
        await this.checkGender(data.gender);

        await this.dtpDateOfBirth.clear();
        await this.dtpDateOfBirth.fill(data.dateOfBirth);

        await this.txtLicenseNumber.fill(data.licenseNumber);

        await this.txtSsn.fill(data.ssn);
    }

    async fillupContactInformation(data) {
        await this.txtAddressStreet1.fill(data.street1);
        await this.txtAddressStreet2.fill(data.street2);
        await this.txtAddressCity.fill(data.city);
        await this.ddlAddressState.selectOption(data.state);
        await this.txtAddressZipCode.fill(data.zipCode);
        await this.ddlAddressCountry.selectOption(data.country);

        await this.txtPhoneNumberHome.fill(data.homePhone);
        await this.txtPhoneNumberMobile.fill(data.mobilePhone);
        await this.txtPhoneNumberTemporary.fill(data.temporaryPhone);
        await this.txtPhoneNumberExtension.fill(data.temporaryPhoneExt);
        await this.txtPhoneNumberComments.fill(data.phoneComment);

        await this.txtEMailAddress.fill(data.email);
    }

    async fillupPreferences(data) {
        await this.ddlTimeZone.selectOption(data.timeZone);

        await this.commonUtils.toggleCheckboxUsingValueById(this.page, this.chkEnableNotification, data.enableNotification);
    }

    async fillupWorkInformation(data) {
        await this.txtWorkInfoWorkPhoneNumber.fill(data.workPhoneNo);
        await this.txtWorkInfoWorkPhoneNumberExtension.fill(data.workPhoneNoExt);
        await this.txtWorkInfoWorkFaxNumber.fill(data.workFaxNumber);
    }

    async fillupEmergencyContact1(data) {
        await this.txtEmergencyContact1Name.fill(data.emgContact1Name);
        await this.txtEmergencyContact1PhoneNumber.fill(data.emgContact1Phone);
        await this.txtEmergencyContact1PhoneNumberExtension.fill(data.emgContact1PhoneExt);
    }

    async fillupEmergencyContact2(data) {
        await this.txtEmergencyContact2Name.fill(data.emgContact2Name);
        await this.txtEmergencyContact2PhoneNumber.fill(data.emgContact2Phone);
        await this.txtEmergencyContact2PhoneNumberExtension.fill(data.emgContact2PhoneExt);
    }

    async fillupAdditionalContactInformation(data) {
        await this.fillupWorkInformation(data);
        await this.fillupEmergencyContact1(data);
        await this.fillupEmergencyContact2(data);
    }

    async fillupEvv(data) {
        if (data.evvId && data.evvId.trim() !== '') {
            await this.txtEvvId.fill(data.evvId);
        }

        if (data.evvCaregiverType && data.evvCaregiverType.trim() !== '') {
            await this.ddlEvvCaregiverType.selectOption(data.evvCaregiverType.trim());
        }
    }

    async fillupPersonalDetails(data) {
        await this.navigateToPersonalDetailsPage(data);
        await this.uploadUserPhoto(data);
        await this.fillupBasicInformation(data);
        await this.fillupUserIdTypesAndNumbers(data.idTypeAndNumber);
        await this.fillupContactInformation(data);
        await this.fillupPreferences(data);
        await this.fillupAdditionalContactInformation(data);
        await this.fillupEvv(data);
    }

    async updateOrSaveDetails() {
        if (await this.commonButtons.isButtonPresent('Save')) {
            await this.commonButtons.clickButton('Save');
        } else {
            await this.commonButtons.clickButton('Update');
        }
    }

    async fillAndSavePersonalDetails(data) {
        await this.fillupPersonalDetails(data);
        await this.updateOrSaveDetails();
    }

    async fillAndSaveBasicInformation(data) {
        await this.fillupBasicInformation(data);
        await this.updateOrSaveDetails();
    }

    async fillAndSaveContactInformation(data) {
        await this.fillupContactInformation(data);
        await this.updateOrSaveDetails();
    }

    async fillAndSavePreferences(data) {
        await this.fillupPreferences(data);
        await this.updateOrSaveDetails();
    }

    async fillAndSaveAdditionalContactInformation(data) {
        await this.fillupAdditionalContactInformation(data);
        await this.updateOrSaveDetails();
    }

    async fillAndSaveEvv(data) {
        await this.fillupEvv(data);
        await this.updateOrSaveDetails();
    }
}