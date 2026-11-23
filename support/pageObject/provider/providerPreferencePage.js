/**
 * @author Md. Shajjad Howlader
 * @since 4/20/25
 */

import { CommonUtils } from '../../commonUtility/commonUtils';

export class ProviderPreferencePage {

    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.ddlSessionTimeoutMinutes = page.locator('[name="providerPreference\\.sessionInactiveInterval"]');
        this.ddlStartingDayOfWeek = page.locator('[name="providerPreference\\.startingDayOfWeek"]');
        this.rdoAllowCreatingTlogWithoutIndivYes = page.locator('#providerPreference\\.allowProgramOnlyTlog1');
        this.rdoAllowCreatingTlogWithoutIndivNo = page.locator('#providerPreference\\.allowProgramOnlyTlog2');
        this.rdoEnableTimeInAndTimeOutYes = page.locator('#providerPreference\\.enableTlogTimeInTimeOut1');
        this.rdoEnableTimeInAndTimeOutNo = page.locator('#providerPreference\\.enableTlogTimeInTimeOut2');
        this.rdoHideWitnessSectionYes = page.locator('#providerPreference\\.hideWitnessSection1');
        this.rdoHideWitnessSectionNo = page.locator('#providerPreference\\.hideWitnessSection2');
        this.ddlForHighNotifLevelGER = page.locator('[name="highNotificationList"]');
        this.ddlForMediumNotifLevelGER = page.locator('[name="mediumNotificationList"]');
        this.ddlForAbuseNeglectExploitationGER = page.locator('[name="abuseNotificationList"]');
        this.txtStateProviderId = page.locator('[name="providerPreference\\.stateProviderId"]');
        this.rdoAllowUserOwnSignupYes = page.locator('#providerPreference\\.canUserSelfSignup1');
        this.rdoAllowUserOwnSignupNo = page.locator('#providerPreference\\.canUserSelfSignup2');
        this.rdoAllowUserCancelSignupYes = page.locator('#providerPreference\\.canUserCancelSignup1');
        this.rdoAllowUserCancelSignupNo = page.locator('#providerPreference\\.canUserCancelSignup2');
        this.ddlNotifyBeforeExpServiceAuthDays = page.locator('[name="providerPreference\\.billSAExpirationrPreference"]');
        this.ddlNotifyWhenTotalBillableUnitsLeft = page.locator('[name="providerPreference\\.billingSALowUnitPreference"]');
        this.ddlIbServiceAuthExpNotifDays = page.locator('[name="providerPreference\\.ibAuthExpiryNotifDays"]');
        this.txtMaxNumDaysForAddUpdateTxn = page.locator('[name="providerPreference\\.pfTransactionLockRange"]');
        this.txtMaxLimitForAccountActivationDate = page.locator('[name="providerPreference\\.pfAccountActivationRange"]');
        this.ddlIspData = page.locator('[name="providerPreference\\.ispDataBillingRestriction"]');
        this.ddlCaseNote = page.locator('[name="providerPreference\\.caseNoteBillingRestrictionLimit"]');
        this.ddlClinicalNote = page.locator('[name="providerPreference\\.clinicalNoteBillingRestrictionLimit"]'); 
        this.ddlBarcodeQRCodeType = page.locator('[name="providerPreference\\.barcodeType"]');       
    }

    async fillUpSessionTimeoutMinutes(data) {
        if (data.sessionTimeoutMinutes) {
            await this.ddlSessionTimeoutMinutes.selectOption({ label: data.sessionTimeoutMinutes });
        }
    }

    async fillUpCalendarPreference(data) {
        if (data.startingDayOfWeek){
            await this.ddlStartingDayOfWeek.selectOption({ label: data.startingDayOfWeek });
        }
    }

    async fillUpTlog(data) {
        if (data.allowCreatingTlogWithoutIndiv) {
            await this.utils.selectRadioOption(
                data.allowCreatingTlogWithoutIndiv,
                this.rdoAllowCreatingTlogWithoutIndivYes,
                this.rdoAllowCreatingTlogWithoutIndivNo
            );
        }
    
        if (data.enableTimeInAndTimeOut) {
            await this.utils.selectRadioOption(
                data.enableTimeInAndTimeOut,
                this.rdoEnableTimeInAndTimeOutYes,
                this.rdoEnableTimeInAndTimeOutNo
            );
        }
    }

    async fillUpGERPreference(data) {
        if (data.hideWitnessSection) {
            await this.utils.selectRadioOption(
                data.hideWitnessSection,
                this.rdoHideWitnessSectionYes,
                this.rdoHideWitnessSectionNo
            );
        }

        const labelsForHighNotificationLevelGER = data.forHighNotificationLevelGER
            .split(',')
            .map(label => label.trim())
            .filter(label => label.length > 0);

        if (labelsForHighNotificationLevelGER.length > 0) {
            // Select the specified labels
            await this.ddlForHighNotifLevelGER.selectOption(
                labelsForHighNotificationLevelGER.map(label => ({ label }))
            );
        } 

        const labelsForMediumNotificationLevelGER = data.forMediumNotificationLevelGER
            .split(',')
            .map(label => label.trim())
            .filter(label => label.length > 0);

        if (labelsForMediumNotificationLevelGER.length > 0) {
            // Select the specified labels
            await this.ddlForMediumNotifLevelGER.selectOption(
                labelsForMediumNotificationLevelGER.map(label => ({ label }))
            );
        } 

        const labelsForAbuseNeglectExploitationGER = data.forAbuseNeglectExploitationGER
            .split(',')
            .map(label => label.trim())
            .filter(label => label.length > 0);

        if (labelsForAbuseNeglectExploitationGER.length > 0) {
            // Select the specified labels
            await this.ddlForAbuseNeglectExploitationGER.selectOption(
                labelsForAbuseNeglectExploitationGER.map(label => ({ label }))
            );
        } 
    }

    async fillUpGERStateInterfacingPreference(data) {
        await this.txtStateProviderId.fill(data.stateProviderId);
    }

    async fillUpTMSPreference(data) {
        if (data.allowUserOwnSignup) {
            await this.utils.selectRadioOption(
                data.allowUserOwnSignup,
                this.rdoAllowUserOwnSignupYes,
                this.rdoAllowUserOwnSignupNo
            );
        }

        if (data.allowUserCancelSignup) {
            await this.utils.selectRadioOption(
                data.allowUserCancelSignup,
                this.rdoAllowUserCancelSignupYes,
                this.rdoAllowUserCancelSignupNo
            );
        }
    }

    async fillUpBillingPreference(data) {
        if (data.notifyBeforeExpiryOfServiceAuthorizationDays) {
            await this.ddlNotifyBeforeExpServiceAuthDays.selectOption({ label: data.notifyBeforeExpiryOfServiceAuthorizationDays });
        } 

        if (data.notifyWhenTotalBillableUnitsLeft) {
            await this.ddlNotifyWhenTotalBillableUnitsLeft.selectOption({ label: data.notifyWhenTotalBillableUnitsLeft });
        } 
    }
   
    async fillUpIBServiceAuthorizationPreference(data) {
        if (data.ibServiceAuthorizationExpiryNotificationDays) {
            await this.ddlIbServiceAuthExpNotifDays.selectOption({ label: data.ibServiceAuthorizationExpiryNotificationDays });
        } 
    }

    async fillUpPDFPreference(data) {
        await this.utils.toggleCheckboxUsingValue(this.page, 'Individual Name', data.individualName);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Medicaid Number', data.medicaidNumber);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Date of Birth', data.dateOfBirth);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Individual ID Number', data.individualIDNumber);
    }

    async fillUpPersonalFinancePreference(data) {
        if (data.maximumNumberOfDaysForAddingUpdatingATransaction){
            await this.txtMaxNumDaysForAddUpdateTxn.fill(data.maximumNumberOfDaysForAddingUpdatingATransaction);
        }

        if (data.maximumlimitForAccountActivationDate){
            await this.txtMaxLimitForAccountActivationDate.fill(data.maximumlimitForAccountActivationDate);
        }
    }

    async fillUpBillingRestrictionDays(data) {
        if (data.ispData) {
            await this.ddlIspData.selectOption({ label: data.ispData });
        } 

        if (data.caseNote) {
            await this.ddlCaseNote.selectOption({ label: data.caseNote });
        } 

        if (data.clinicalNote) {
            await this.ddlClinicalNote.selectOption({ label: data.clinicalNote });
        } 
    }

    async fillUpTwoFactorAuthentication(data) {
        await this.utils.toggleCheckboxUsingValue(this.page, 'Email Based OTP', data.emailBasedOTP);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Disable Two Factor Trust Device', data.disableTwoFactorTrustDevice);
    }

    async fillUpUserProfileSettings(data) {
        await this.utils.toggleCheckboxUsingValue(this.page, 'Prompt for Contact Information on Login', data.enableMobileBiometricLogin);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Mobile Biometric Login', data.enableMobileBiometricLogin);
    }

    async fillUpBarcodeQRCodePreference(data) {
        await this.utils.toggleCheckboxUsingValue(this.page, 'Enable Barcode/QR Code', data.enableBarcodeQRCode);

        if ( ['yes', 'y', 'check'].includes(data.enableBarcodeQRCode.toLowerCase()) && data.barcodeQRCodeType !== undefined) {
            await this.ddlBarcodeQRCodeType.selectOption({ label: data.barcodeQRCodeType });
        }
    }

    async fillUpForm(data) {
        await this.fillUpSessionTimeoutMinutes(data);
        await this.fillUpCalendarPreference(data);
        await this.fillUpTlog(data);
        await this.fillUpGERPreference(data);
        await this.fillUpGERStateInterfacingPreference(data);
        await this.fillUpTMSPreference(data);
        await this.fillUpBillingPreference(data);
        await this.fillUpIBServiceAuthorizationPreference(data);
        await this.fillUpPDFPreference(data);
        await this.fillUpPersonalFinancePreference(data);
        await this.fillUpBillingRestrictionDays(data);
        await this.fillUpTwoFactorAuthentication(data);
        await this.fillUpUserProfileSettings(data);
        await this.fillUpBarcodeQRCodePreference(data);
    }
};