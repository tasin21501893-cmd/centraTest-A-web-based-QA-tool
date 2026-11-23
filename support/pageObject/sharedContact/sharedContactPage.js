/**
 * @author Ziaur Rahman
 * @since 03/08/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { mapPrimaryAddress, mapMailingAddress } from '../../../resources/sharedContact/dataMapper.js';

export class SharedContactPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);

        this.txtTitle = page.locator('[name="title"]');
        this.txtFirstName = page.locator('[name="firstName"]');
        this.txtLastName = page.locator('[name="lastName"]');
        this.txtMiddleName = page.locator('[name="middleName"]');
        this.txtOrganizationName = page.locator('[name="name"]');
        this.txtNpiNumber = page.locator('[name="npiNumber"]');
        this.ddlType = page.locator('[name="type"]');
        this.ddlSpecialty = page.locator('[name="speciality"]');
        this.txtSpecialtyOther = page.locator('[name="specialityOther"]');

        //Shared Contact Address Information
        this.txtPrimaryAddressAttention = page.locator('[name="attention"]');
        this.txtPrimaryAddressPrimaryPhone = page.locator('[name="phone"]');
        this.txtPrimaryAddressPrimaryPhoneExt = page.locator('[name="phoneExt"]');
        this.txtPrimaryAddressSecondaryPhone = page.locator('[name="secondaryPhone"]');
        this.txtPrimaryAddressSecondaryPhoneExt = page.locator('[name="secondaryPhoneExt"]');
        this.txtPrimaryAddressAdditionalPhone = page.locator('[name="additionalPhone"]');
        this.txtPrimaryAddressAdditionalPhoneExt = page.locator('[name="additionalPhoneExt"]');
        this.txtPrimaryAddressFax = page.locator('[name="fax"]');
        this.txtPrimaryAddressEmail = page.locator('[name="email"]');
        this.txtPrimaryAddressWebAddress = page.locator('[name="webAddress"]');
        this.chkCopyFromPrimaryAddress = page.locator('#copyFromAddress');
        this.txtMailingAddressAttention = page.locator('[name="mailingAttention"]');
        this.txtMailingAddressPrimaryPhone = page.locator('[name="mailingPrimaryPhone"]');
        this.txtMailingAddressPrimaryPhoneExt = page.locator('[name="mailingPrimaryPhoneExt"]');
        this.txtMailingAddressSecondaryPhone = page.locator('[name="mailingSecondaryPhone"]');
        this.txtMailingAddressSecondaryPhoneExt = page.locator('[name="mailingSecondaryPhoneExt"]');
        this.txtMailingAddressAdditionalPhone = page.locator('[name="mailingAdditionalPhone"]');
        this.txtMailingAddressAdditionalPhoneExt = page.locator('[name="mailingAdditionalPhoneExt"]');
        this.txtMailingAddressFax = page.locator('[name="mailingFax"]');

        this.errMsgNameStreetPhone = this.page.locator('.alert-danger ul li');
    }

    async fillUpSharedContactForm(data) {
        const primaryAddressData = mapPrimaryAddress(data);
        const mailingAddressData = mapMailingAddress(data);

        await this.fillUpGeneralSection(data);
        await this.fillUpPrimaryAddress(primaryAddressData);

        if (CommonUtils.isNegative(data.copyFromPrimaryAddress)) {
            await this.fillUpMailingAddress(mailingAddressData);
        } else {
            await this.chkCopyFromPrimaryAddress.check();
        }
    }

    async fillUpGeneralSection(data) {
        await this.txtTitle.fill(data.title);
        await this.txtFirstName.fill(data.firstName);
        await this.txtMiddleName.fill(data.middleName);
        await this.txtLastName.fill(data.lastName);
        await this.txtOrganizationName.fill(data.organizationName);
        await this.txtNpiNumber.fill(data.npiNumber);
        await this.ddlType.selectOption(data.type);
        await this.ddlSpecialty.selectOption(data.specialty);

        if (data.specialty === 'Other') {
            await this.txtSpecialtyOther.fill(data.specialtyOther);
        }
    }

    async fillUpPrimaryAddress(data) {
        await this.txtPrimaryAddressAttention.fill(data.primaryAddressAttention);
        await this.commonUtils.fillUpAddressWithLocator('address', data);
        await this.txtPrimaryAddressPrimaryPhone.fill(data.primaryAddressPrimaryPhone);
        await this.txtPrimaryAddressPrimaryPhoneExt.fill(data.primaryAddressPrimaryPhoneExt);
        await this.txtPrimaryAddressSecondaryPhone.fill(data.primaryAddressSecondaryPhone);
        await this.txtPrimaryAddressSecondaryPhoneExt.fill(data.primaryAddressSecondaryPhoneExt);
        await this.txtPrimaryAddressAdditionalPhone.fill(data.primaryAddressAdditionalPhone);
        await this.txtPrimaryAddressAdditionalPhoneExt.fill(data.primaryAddressAdditionalPhoneExt);
        await this.txtPrimaryAddressFax.fill(data.primaryAddressFax);
        await this.txtPrimaryAddressEmail.fill(data.primaryAddressEmail);
        await this.txtPrimaryAddressWebAddress.fill(data.primaryAddressWebAddress);
    }

    async fillUpMailingAddress(data) {
        if (data.country) {
            await this.commonUtils.fillUpAddressWithLocator('mailingAddress', data);
        }

        await this.txtMailingAddressAttention.fill(data.mailingAddressAttention);
        await this.txtMailingAddressPrimaryPhone.fill(data.mailingAddressPrimaryPhone);
        await this.txtMailingAddressPrimaryPhoneExt.fill(data.mailingAddressPrimaryPhoneExt);
        await this.txtMailingAddressSecondaryPhone.fill(data.mailingAddressSecondaryPhone);
        await this.txtMailingAddressSecondaryPhoneExt.fill(data.mailingAddressSecondaryPhoneExt);
        await this.txtMailingAddressAdditionalPhone.fill(data.mailingAddressAdditionalPhone);
        await this.txtMailingAddressAdditionalPhoneExt.fill(data.mailingAddressAdditionalPhoneExt);
        await this.txtMailingAddressFax.fill(data.mailingAddressFax);
    }

    async updatedOrganizationName(data) {
        await this.txtOrganizationName.fill(data);
    }

    async createAndOpenForm(data) {
        await this.fillUpSharedContactForm(data);
        await this.commonButtons.clickButton('Save');
        await this.donePage.clickLinkByText('Form');
    }
}