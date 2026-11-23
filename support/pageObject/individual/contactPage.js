/**
 * @author Dibya Nath
 * @since 02/11/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { IdfPage } from './idfPage.js';

export class ContactPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.attachment = new AttachmentUtils(page);
        this.idfPage = new IdfPage(page);

        this.txtFirstName = page.locator('[name="firstName"]');
        this.txtLastName = page.locator('[name="lastName"]');
        this.txtMiddleName = page.locator('[name="middleName"]');
        this.txtAgency = page.locator('[name="agency"]');
        this.rdoEmergencyContact1 = page.locator('#emergencyContact1');
        this.rdoEmergencyContact2 = page.locator('#emergencyContact2');
        this.rdoMailingContact1 = page.locator('#mailingContact1');
        this.rdoMailingContact2 = page.locator('#mailingContact2');
        this.ddlRelationship = page.locator('[name="relationship"]');
        this.txtComments = page.locator('[name="comment"]');
        this.chkIsGuardian = page.locator('[name="guardianData"]');
        this.ddlGuardianType = page.locator('[name="guardian.guardianType"]');
        this.ddlGuardianAuthority = page.locator('[name="guardian.authorities"]');
        this.ddlEstablishedCountyState = page.locator('[name="guardian.estdCountyState"]');
        this.ddlEstablishedCounty = page.locator('[name="guardian.estdCounty"]');
        this.dtpEstablishedDate = page.locator('[name="guardian.estdDate"]');
        this.dtpEstablishedEndDate = page.locator('[name="guardian.estdEndDate"]');
        this.txtAddressAttention = page.locator('[name="attention"]');
        this.chkAddressSameAsResidenceAddress = page.locator('#copyFromResidentialAddress');
        this.chkAddressSameAsPrimaryResidencePhone = page.locator('#copyPrimaryFromResidencePhone');
        this.txtAddressPrimaryPhone = page.locator('[name="primaryPhone"]');
        this.txtAddressPrimaryPhoneExtension = page.locator('[name="primaryPhoneExt"]');
        this.chkAddressSecondSameAsPrimaryResidencePhone = page.locator('#copySecondaryFromResidencePhone');
        this.txtAddressSecondaryPhone = page.locator('[name="secondaryPhone"]');
        this.txtAddressSecondaryPhoneExt = page.locator('[name="secondaryPhoneExt"]');
        this.txtAddressAdditionalPhone = page.locator('[name="additionalPhone"]');
        this.txtAddressAdditionalPhoneExt = page.locator('[name="additionalPhoneExt"]');
        this.txtAddressFax = page.locator('[name="fax"]');
        this.txtAddressEmail = page.locator('[name="email"]');
        this.txtAddressWebAddress = page.locator('[name="webAddress"]');
        this.txtMailingAddressAttentionOrInCareOf = page.locator('[name="mailingAttention"]');
        this.chkMailingAddressSameAsResidenceAddress = page.locator('#copyFromAddress');
        this.txtMailingAddressPrimaryPhone = page.locator('[name="mailingPrimaryPhone"]');
        this.txtMailingAddressPrimaryPhoneExtension = page.locator('[name="mailingPrimaryPhoneExt"]');
        this.txtMailingAddressSecondaryPhone = page.locator('[name="mailingSecondaryPhone"]');
        this.txtMailingAddressSecondaryPhoneExtension = page.locator('[name="mailingSecondaryPhoneExt"]');
        this.txtMailingAddressAdditionalPhone = page.locator('[name="mailingAdditionalPhone"]');
        this.txtMailingAddressAdditionalPhoneExt = page.locator('[name="mailingAdditionalPhoneExt"]');
        this.txtMailingAddressFaxNumber = page.locator('[name="mailingFax"]');
    }

    async processIdfContactForm(data, attachmentData, action) {
        await this.navigateToIdfContact(data, attachmentData);
        await this.donePage.clickLinkByText('Add New Contact');
        await this.fillUpGeneralSection(data);
        await this.fillUpGuardian(data, attachmentData);
        await this.fillUpAddress(data);
        await this.fillUpMailingAddress(data);
        await this.commonButtons.clickButton(action);
    }

    async navigateToIdfContact(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Contact cannot be saved or updated for Deleted individuals');
        }

        await this.donePage.clickLinkByText('Contact List');
    }

    async fillUpGeneralSection(data) {
        await this.txtFirstName.fill(data.contactFirstName);
        await this.txtLastName.fill(data.contactLastName);
        await this.txtMiddleName.fill(data.middleName);
        await this.txtAgency.fill(data.agency);
        await this.ddlRelationship.selectOption(data.relationship);

        if (data.emergencyContact) {
            await this.commonUtils.selectRadioOption(data.emergencyContact, this.rdoEmergencyContact1, this.rdoEmergencyContact2);
        }

        if (data.mailingContact) {
            await this.commonUtils.selectRadioOption(data.mailingContact, this.rdoMailingContact1, this.rdoMailingContact2);
        }

        if (data.comments) {
            const CommentText = await this.commonUtils.generateString(data.comments);
            await this.txtComments.fill(CommentText);
        }
    }

    async fillUpGuardian(data, attachmentData) {
        if (CommonUtils.isAffirmative(data.isGuardian)) {
            await this.chkIsGuardian.click();
            await this.ddlGuardianType.selectOption(data.guardianType);

            if (data.guardianAuthority) {
                const authorities = data.guardianAuthority
                    .split(',')
                    .map(option => option.trim());

                await this.ddlGuardianAuthority.selectOption(authorities);
            }

            await this.ddlEstablishedCountyState.selectOption(data.establishedCountyState);
            await this.ddlEstablishedCounty.selectOption(data.establishedCounty);
            await this.dtpEstablishedDate.fill(data.establishedDate);
            await this.dtpEstablishedEndDate.fill(data.establishedEndDate);

            if (CommonUtils.isAffirmative(data.attachment)) {
                await this.fillUpAttachment(data, attachmentData);
            }
        }
    }

    async fillUpAttachment(data, attachmentData) {
        await this.attachment.addFile(data.testCaseNumber, attachmentData);
    }

    async fillUpAddress(data) {
        await this.txtAddressAttention.fill(data.addressAttentionOrInCareOf);

        if (CommonUtils.isAffirmative(data.addressSameAsResidenceAddress)) {
            await this.chkAddressSameAsResidenceAddress.check();
        }
        else if (data.addressCountry) {
            const addressData = {
                street1: data.addressStreet1,
                street2: data.addressStreet2,
                city: data.addressCity,
                zip: data.addressZipCode,
                country: data.addressCountry,
                state: data.addressState
            };

            await this.commonUtils.fillUpAddressWithLocator("address", addressData);

        }

        if (CommonUtils.isAffirmative(data.addessSameAsPrimaryResidencePhone)) {
            await this.chkAddressSameAsPrimaryResidencePhone.check();
        }
        else {
            await this.txtAddressPrimaryPhone.fill(data.addressPrimaryPhone);
            await this.txtAddressPrimaryPhoneExtension.fill(data.addressPrimaryPhoneExtension);
        }

        if (CommonUtils.isAffirmative(data.addressSecondSameAsPrimaryResidencePhone)) {
            await this.chkAddressSecondSameAsPrimaryResidencePhone.check();
        }
        else {
            await this.txtAddressSecondaryPhone.fill(data.addressSecondaryPhone);
            await this.txtAddressSecondaryPhoneExt.fill(data.addressSecondaryPhoneExtension);
        }

        await this.txtAddressAdditionalPhone.fill(data.addressAdditionalPhone);
        await this.txtAddressAdditionalPhoneExt.fill(data.addressAdditionalPhoneExt);
        await this.txtAddressFax.fill(data.addressFaxNumber);
        await this.txtAddressEmail.fill(data.addressEmail);
        await this.txtAddressWebAddress.fill(data.addressWebAddress);
    }

    async fillUpMailingAddress(data) {
        await this.txtMailingAddressAttentionOrInCareOf.fill(data.mailingAddressAttentionOrInCareOf);

        if (CommonUtils.isAffirmative(data.mailingAddressSameAsResidenceAddress)) {
            await this.chkMailingAddressSameAsResidenceAddress.check();
        }
        else {
            if (data.mailingAddressCountry) {
                const addressData = {
                    street1: data.mailingAddressStreet1,
                    street2: data.mailingAddressStreet2,
                    city: data.mailingAddressCity,
                    zip: data.mailingAddressZipCode,
                    country: data.mailingAddressCountry,
                    state: data.mailingAddressState
                };

                await this.commonUtils.fillUpAddressWithLocator("mailingAddress", addressData);
            }

            await this.txtMailingAddressPrimaryPhone.fill(data.mailingAddressPrimaryPhone);
            await this.txtMailingAddressPrimaryPhoneExtension.fill(data.mailingAddressPrimaryPhoneExtension);
            await this.txtMailingAddressSecondaryPhone.fill(data.mailingAddressSecondaryPhone);
            await this.txtMailingAddressSecondaryPhoneExtension.fill(data.mailingAddressSecondaryPhoneExtension);
            await this.txtMailingAddressAdditionalPhone.fill(data.mailingAddressAdditionalPhone);
            await this.txtMailingAddressAdditionalPhoneExt.fill(data.mailingAddressAdditionalPhoneExt);
            await this.txtMailingAddressFaxNumber.fill(data.mailingAddressFaxNumber);
        }
    }
}