/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { ListPage } from "../../../commonPages/listPage.js";

export class EmployerPage {

    constructor(page) {
        this.page = page;
        this.ddlCorporateEntity = this.page.locator("[name='corporateEntity']");
        this.txtOrganizationName = this.page.locator("[name='organizationName']");
        this.txtPhone = this.page.locator("[name='phone']");
        this.txtEmailAddress = this.page.locator("[name='emailAddress']");
        this.txtWebAddress = this.page.locator("[name='webAddress']");
        this.txtDeactivationReason = this.page.locator("[id='_action_deactivate-comment']");

        this.errMsgOrganizationName = this.page.locator("[id='organizationName.errors']");
        this.errMsgStreet1 = this.page.locator("[id='address.street1.errors']");
        this.errMsgStreet2 = this.page.locator("[id='address.street2.errors']");
        this.errMsgCity = this.page.locator("[id='address.city.errors']");
        this.errMsgState = this.page.locator("[id='address.state.errors']");
        this.errMsgZip = this.page.locator("[id='address.zip.errors']");
        this.errMsgCountry = this.page.locator("[id='address.country.errors']");
        this.errMsgPhone = this.page.locator("[id='phone.errors']");
        this.errMsgEmailAddress = this.page.locator("[id='emailAddress.errors']");
        this.errMsgWebAddress = this.page.locator("[id='webAddress.errors']");
        this.alert = this.page.locator("[class='alert alert-danger']");
        this.errMsgDeactivationReasonRequired = this.page.locator("[id='_action_deactivate-requiredMsg']");

        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
    }

    async deactivateForm(reasonForDeactivation) {
        await this.commonButtons.clickButton('Deactivate');
        await this.commonButtons.clickButton('Yes');
        reasonForDeactivation && await this.txtDeactivationReason.fill(reasonForDeactivation);
        await this.commonButtons.clickButton('Confirm');
    }

    async fillUpForm(data) {
        await this.page.waitForLoadState('domcontentloaded');
        data.corporateEntity && await this.ddlCorporateEntity.selectOption(data.corporateEntity);
        data.organizationName && await this.txtOrganizationName.fill(data.organizationName);
        
        if(data.address){
            let address = data.address.split(',').map(value=> value.trim())
            await this.commonUtils.fillUpAddress(...address);
        }
        
        data.phone && await this.txtPhone.fill(data.phone);
        data.emailAddress && await this.txtEmailAddress.fill(data.emailAddress);
        data.webAddress && await this.txtWebAddress.fill(data.webAddress);
    }
}