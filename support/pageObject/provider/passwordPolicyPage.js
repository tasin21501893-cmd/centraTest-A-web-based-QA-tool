/**
 * @author Md. Shajjad Howlader
 * @since 07/11/25
 */

import { CommonUtils } from '../../commonUtility/commonUtils';

export class PasswordPolicyPage {

    constructor(page) {
        this.page = page;
        this.utils = new CommonUtils(page);
        this.txtMinLenPwd = page.locator('[name="minLength"]');
        this.txtMinNumUpperCase = page.locator('[name="minUppers"]');
        this.txtMinNumDigits = page.locator('[name="minDigits"]');
        this.txtMinNumOtherChars = page.locator('[name="minSymbols"]');
        this.txtMaxNumIncorrectPwds = page.locator('[name="maxWrongs"]');
        this.txtNumDaysPwdExpireRegular = page.locator('[name="expiryAge"]');
        this.txtWarnStartDayNormal = page.locator('[name="expiryWarningsBefore"]');
        this.txtNumDaysPwdExpireSuperAdmin = page.locator('[name="expiryAgeForPa"]');
        this.txtWarnStartDaySuperAdmin = page.locator('[name="expiryWarningsBeforeForPa"]');
        this.txtNumRecentPwdsNoReuse = page.locator('[name="passwordReuseLimit"]');
    }

    async fillUpForm(data) {
        await this.txtMinLenPwd.fill(data.minimumLengthPassword);
        await this.txtMinNumUpperCase.fill(data.minimumNumberUpperCaseLetters);
        await this.txtMinNumDigits.fill(data.minimumNumberDigits);
        await this.txtMinNumOtherChars.fill(data.minimumNumberCharacters);
        await this.txtMaxNumIncorrectPwds.fill(data.maximumNumberIncorrectPasswords);
        await this.txtNumDaysPwdExpireRegular.fill(data.passwordExpiresForRegularUsers);
        await this.txtWarnStartDayNormal.fill(data.warningForNormalUser);
        await this.txtNumDaysPwdExpireSuperAdmin.fill(data.passwordExpiresForSuperAdmin);
        await this.txtWarnStartDaySuperAdmin.fill(data.warningForSuperAdmin);
        await this.txtNumRecentPwdsNoReuse.fill(data.recentlyUsedPasswordsCanNotReused);
        await this.utils.toggleCheckboxUsingValue(this.page, 'Force all users to change password', data.forceChangePassword);
        
    }
};