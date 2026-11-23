/**
* @author Sayed Ahmed Tasin
* @since 03/04/2026
*/

import { ListPage } from '../../../commonPages/listPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../../commonUtility/buttonLabels.js';

export class AppointmentsForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.ddlResultType = page.locator('[name="appointmentResultTypeStr"]');
        this.ddlProgram = page.locator('[name="tmpProgramId"]');
        this.ddlAppointmentStatus = page.locator('[name="appointmentStatus"]');
        this.ddlLocationType = page.locator('[name="locationType"]');
        this.ddlAppointmentReason = page.locator('[name="appointmentReason"]');
        this.txtResultDescription = page.locator('[name="appointmentResultDescriptionStr"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.txtBeginTime = page.locator('[name="beginTime"]');
        this.txtEndTime = page.locator('[name="endTime"]');
        this.txtAppointmentWithOther = page.locator('[name="appointmentWith"]');
        this.txtLocationTypeOther = page.locator('[name="locationTypeOther"]');
        this.txtPhone = page.locator('[name="telNo"]');
        this.txtPhoneExtension = page.locator('[name="telNoExt"]');
        this.txtDriver = page.locator('[name="driver"]');
        this.txtPickUpAt = page.locator('[name="pickupAt"]');
        this.txtDepartTime = page.locator('[name="departTime"]');
        this.txtDescription = page.locator('[name="appointmentReasonOther"]');
        this.txtConfidentialNote = page.locator('[name="confidentialNote"]');
        this.txtComments = page.locator('[name="comments"]');
        this.txtSpecialty = page.locator('[name="specialty"]');
        this.txtStreet1 = page.locator('[name="address.street1"]');
        this.txtStreet2 = page.locator('[name="address.street2"]');
        this.txtCity = page.locator('[name="address.city"]');
        this.txtZip = page.locator('[name="address.zip"]');
        this.errMsgProgram = page.locator('[id="tmpProgramId.errors"]');
        this.errMsgReportedBy = page.locator('[id="reporter.errors"]');
        this.errMsgReportedByOther = page.locator('[id="reporterNameOther.errors"]');
        this.errMsgAppointmentWith = page.locator('[id="appointmentWith.errors"]');
        this.errMsgEventDate = page.locator('[id="eventDate.errors"]');
        this.errMsgBeginTime = page.locator('[id="beginTime.errors"]');
        this.errMsgEndTime = page.locator('[id="endTime.errors"]');
        this.errMsgTxtDescription = page.locator('[id="appointmentReasonOther.errors"]');
        this.errMsgConfidentialNote = page.locator('[id="confidentialNote.errors"]');
        this.errMsgComments = page.locator('[id="comments.errors"]');
        this.errMsgConsultant = page.locator('[id="physicianName.errors"]');
        this.errMsgSpecialty = page.locator('[id="specialty.errors"]');
        this.errMsgLocationTypeOther = page.locator('[id="locationTypeOther.errors"]');
        this.errMsgPhone = page.locator('[id="telNo.errors"]');
        this.errMsgExtension = page.locator('[id="telNoExt.errors"]');
        this.errMsgDepartTime = page.locator('[id="departTime.errors"]');
        this.errMsgCountry = page.locator('[id="address.country.errors"]');
        this.errMsgZip = page.locator('[id="address.zip.errors"]');
        this.errMsgState = page.locator('[id="address.state.errors"]');
        this.errMsgCity = page.locator('[id="address.city.errors"]');
        this.errMsgStreet1 = page.locator('[id="address.street1.errors"]');
        this.errMsgStreet2 = page.locator('[id="address.street2.errors"]');
        this.errMsgPhysicianName = page.locator('[id="physicianName.errors"]');
        this.errMsgDriver = page.locator('[id="driver.errors"]');
        this.errMsgPickUpAt = page.locator('[id="pickupAt.errors"]');
        this.errMsgResultType = page.locator('[id="resultTypeError"]');
        this.errMsgResultDescription = page.locator('div.text-danger:has-text("extra characters have been entered")');
        this.errMsgDeleteRequired = page.locator('[id="deleteRequiredMessage"]');
        this.btnConsultantSearch = page.locator('button[onclick*="physician-lookup-modal"]');
        this.btnHospitalSearch = page.locator('button[onclick*="hospital-lookup-modal"]');
        this.modalFrame = page.frameLocator('iframe[src*="selectionList"]');
        this.modalFilter = this.modalFrame.getByPlaceholder('Filter');
        this.modalRows = this.modalFrame.locator('#dataList tbody tr');
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
    }

    async hospitalConsultantModalHandler(buttonLocator, searchText) {
        await buttonLocator.click();
        await this.modalFilter.fill(searchText);
        await this.modalRows.first().click();
    }

    async addResultModalHandler(individual, resultDescription) {
        await this.listPage.selectFilteredFirstItem(individual);
        await this.commonButtons.clickButton(ButtonLabels.ADD_RESULT);
        await this.txtResultDescription.fill(resultDescription);
        await this.commonButtons.clickButton(ButtonLabels.ADD);
    }

    async increaseMaxLengthIfNeeded(locator, value, limit, newLimit) {
        if (value && value.length > limit) {
            await locator.evaluate((el, max) => el.setAttribute('maxlength', max), newLimit);
        }
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.program && await this.ddlProgram.selectOption(formObject.program);
        formObject.reportedBy && await this.ddlReportedBy.selectOption(formObject.reportedBy);
        formObject.reportedByOther.length > 64 && await this.increaseMaxLengthIfNeeded(this.txtReportedByOther, formObject.reportedByOther, 64, 100);
        formObject.reportedByOther && await this.txtReportedByOther.fill(formObject.reportedByOther);
        formObject.eventDate && await this.dtpEventDate.fill(formObject.eventDate);
        formObject.notificationLevel && await this.ddlNotificationLevel.selectOption(formObject.notificationLevel);
        formObject.appointmentStatus && await this.ddlAppointmentStatus.selectOption(formObject.appointmentStatus);
        formObject.endTime && await this.txtEndTime.fill(formObject.endTime);
        formObject.beginTime && await this.txtBeginTime.fill(formObject.beginTime);
        formObject.physicianName && await this.hospitalConsultantModalHandler(this.btnConsultantSearch, formObject.physicianName);
        formObject.hospital && await this.hospitalConsultantModalHandler(this.btnHospitalSearch, formObject.hospital);
        formObject.appointmentWithOther.length > 64 && await this.increaseMaxLengthIfNeeded(this.txtAppointmentWithOther, formObject.appointmentWithOther, 64, 100);
        formObject.appointmentWithOther && await this.txtAppointmentWithOther.fill(formObject.appointmentWithOther);
        formObject.specialty && await this.txtSpecialty.fill(formObject.specialty);
        formObject.locationType && await this.ddlLocationType.selectOption(formObject.locationType);
        formObject.locationTypeOther && await this.txtLocationTypeOther.fill(formObject.locationTypeOther);
        formObject.street1.length > 128 && await this.increaseMaxLengthIfNeeded(this.txtStreet1, formObject.street1, 128, 150);
        formObject.street2.length > 128 && await this.increaseMaxLengthIfNeeded(this.txtStreet2, formObject.street2, 128, 150);
        formObject.city.length > 32 && await this.increaseMaxLengthIfNeeded(this.txtCity, formObject.city, 32, 50);
        formObject.zip.length > 10 && await this.increaseMaxLengthIfNeeded(this.txtZip, formObject.zip, 10, 20);

        await this.commonUtils.fillUpAddress(
            formObject.street1,
            formObject.street2,
            formObject.city,
            formObject.zip,
            formObject.state,
            formObject.country);

        formObject.phone.length > 15 && await this.increaseMaxLengthIfNeeded(this.txtPhone, formObject.phone, 15, 20);
        formObject.phone && await this.txtPhone.fill(formObject.phone);
        formObject.phoneExtension.length > 12 && await this.increaseMaxLengthIfNeeded(this.txtPhoneExtension, formObject.phoneExtension, 12, 20);
        formObject.phoneExtension && await this.txtPhoneExtension.fill(formObject.phoneExtension);
        formObject.driver.length > 127 && await this.increaseMaxLengthIfNeeded(this.txtDriver, formObject.driver, 127, 150);
        formObject.driver && await this.txtDriver.fill(formObject.driver);
        formObject.pickUpAt.length > 127 && await this.increaseMaxLengthIfNeeded(this.txtPickUpAt, formObject.pickUpAt, 127, 150);
        formObject.pickUpAt && await this.txtPickUpAt.fill(formObject.pickUpAt);
        formObject.departTime && await this.txtDepartTime.fill(formObject.departTime);
        formObject.appointmentReason && await this.ddlAppointmentReason.selectOption(formObject.appointmentReason);
        formObject.description && await this.txtDescription.fill(formObject.description);
        formObject.confidentialNote && await this.txtConfidentialNote.fill(formObject.confidentialNote);
        formObject.comments && await this.txtComments.fill(formObject.comments);

        if (formObject.resultType && formObject.resultDescription) {
            await this.commonButtons.clickButton(ButtonLabels.ADD_RESULT);
            formObject.resultType && await this.ddlResultType.selectOption(formObject.resultType);
            formObject.resultDescription && await this.txtResultDescription.fill(formObject.resultDescription);
            await this.commonButtons.clickButton(ButtonLabels.ADD);
        }
    }
}
