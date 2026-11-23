/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';

export class ContactPersonPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.txtFirstName = this.page.locator("[name='firstName']");
        this.txtLastName = this.page.locator("[name='lastName']");
        this.txtTitle = this.page.locator("[name='title']");
        this.txtMobilePhone = this.page.locator("[name='phoneMobile']");
        this.txtOfficePhone = this.page.locator("[name='phoneOffice']");
        this.txtOfficePhoneExtension = this.page.locator("[name='phoneExtension']");
        this.txtEmailAddress = this.page.locator("[name='emailAddress']");
        this.txtComments = this.page.locator("[name='comments']");

        this.errMsgFirstName = this.page.locator("[id='firstName.errors']");
        this.errMsgLastName = this.page.locator("[id='lastName.errors']");
        this.errMsgTitle = this.page.locator("[id='title.errors']");
        this.errMsgStreet1 = this.page.locator("[id='address.street1.errors']");
        this.errMsgStreet2 = this.page.locator("[id='address.street2.errors']");
        this.errMsgCity = this.page.locator("[id='address.city.errors']");
        this.errMsgState = this.page.locator("[id='address.state.errors']");
        this.errMsgZip = this.page.locator("[id='address.zip.errors']");
        this.errMsgCountry = this.page.locator("[id='address.country.errors']");
        this.errMsgMobilePhone = this.page.locator("[id='phoneMobile.errors']");
        this.errMsgOfficePhone = this.page.locator("[id='phoneOffice.errors']");
        this.errMsgOfficePhoneExtension = this.page.locator("[id='phoneExtension.errors']");
        this.errMsgEmailAddress = this.page.locator("[id='emailAddress.errors']");
        this.errMsgComments = this.page.locator("[id='comments.errors']");
        this.alert = this.page.locator("[class='alert alert-danger']");
    }

    async fillUpForm(data) {
        await this.page.waitForLoadState('domcontentloaded');
        data.firstName && await this.txtFirstName.fill(data.firstName);
        data.lastName && await this.txtLastName.fill(data.lastName);
        data.title && await this.txtTitle.fill(data.title);

        if(data.address){
            let address = data.address.split(',').map(value=> value.trim())
            await this.commonUtils.fillUpAddress(...address);
        }
        
        data.mobilePhone && await this.txtMobilePhone.fill(data.mobilePhone);
        data.officePhone && await this.txtOfficePhone.fill(data.officePhone);
        data.officePhoneExtension && await this.txtOfficePhoneExtension.fill(data.officePhoneExtension);
        data.emailAddress && await this.txtEmailAddress.fill(data.emailAddress);
        data.comments && await this.txtComments.fill(data.comments);
    }
}