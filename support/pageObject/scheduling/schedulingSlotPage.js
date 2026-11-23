/**
 * @author Muhammad Muntasir Mamoor
 * @author Tawratur Rashid
 * @since 28/06/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { SearchPage } from '../../../support/commonPages/SearchPage.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';

import urlData from '../../../resources/commonResources/urlData.json';

export class SchedulingSlotPage {
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.searchPage = new SearchPage(page);
        this.attachment = new AttachmentUtils(page);

        this.tblHeaderOversightId = page.locator('th:has-text("Oversight ID")');
        this.dtpStartDate = page.locator('[name="startDate"]');
        this.dtpEndDate = page.locator('[name="endDate"]');
        this.btnProgram = page.locator('button[data-id="program"]');
        this.btnService1 = page.locator('button[data-id="service1"]');
        this.btnService2 = page.locator('button[data-id="service2"]');
        this.btnStaffDdl = page.locator('button[data-id="slotStaffs"]');
        this.txtSearchField = page.locator('.bs-searchbox input:visible');
        this.ddlFirstDropdownOption = page.locator('ul.inner li.active:visible');
        this.lnkAddService2 = page.locator('.addService2');
        this.txtService1Duration = page.locator('[name="durationForService1"]');
        this.rdoBillableYes = page.locator('#billable1');
        this.rdoBillableNo = page.locator('#billable2');
        this.btnStartAddress = page.locator('button[data-id="address1Picker"]');

        this.btnStartAddressLocation = page.locator('.unselected-location, .selected-location').first();
        this.btnEndAddress = page.locator('button[data-id="address2Picker"]');
        this.btnEndAddressLocation = page.locator('.unselected-location, .selected-location').last();

        this.txtNote = page.locator('[name="note"]');

        this.txtIvrPhone = page.locator('#ivrPhone');
        this.btnIvrPhoneDdl = page.locator('.input-group:has(#ivrPhone) .dropdown-toggle[role="button"]');
        this.ddlIvrOptions = page.locator('.input-group:has(#ivrPhone) .dropdown-menu li a');

        this.lnkManualEdit = page.locator('.slotStaffAction');
        this.dtpCheckInTime = page.locator('[name="checkInTime"]');
        this.ddlCheckInLocationType = page.locator('[name="checkInLocationType"]');
        this.ddlFvvCheckInLocation = page.locator('button[data-id="checkInFvvDevice.locationName"]');
        this.txtCheckInOtp = page.locator('[name="checkInOtp"]');
        this.btnCheckInAddressPicker = page.locator('button[data-id="checkInAddressPicker"]');

        this.dtpCheckOutTime = page.locator('[name="checkOutTime"]');
        this.ddlCheckOutLocationType = page.locator('[name="checkOutLocationType"]');
        this.ddlFvvCheckOutLocation = page.locator('button[data-id="checkOutFvvDevice.locationName"]');
        this.txtCheckOutOtp = page.locator('[name="checkOutOtp"]');
        this.btnCheckOutAddressPicker = page.locator('button[data-id="checkOutAddressPicker"]');
        this.rdoResidingCaregiverYes = page.locator('#residingCaregiver-value-true');
        this.rdoResidingCaregiverNo = page.locator('#residingCaregiver-value-false');
        this.secondaryStaffYes = page.locator('#secondaryStaff-label secondaryStaff-value-true')
        this.secondaryStaffNo = page.locator('#secondaryStaff-label secondaryStaff-value-false')
        this.txtTravelDistance = page.locator('[name="staffTravelDistance"]');
        this.exceptionCode = page.locator('[name="reasonCode"]:visible');
        this.txtDescription = page.locator('[name="reasonDescription"]:visible');
        this.verifiedBy = page.locator('button[data-id="verifiedBy"]');
        this.btnUpdate = page.getByRole('button', { name: 'Update' });
        this.btnPromptYes = page.locator('.btn-prompt-yes');
        this.tblHeader = page.locator('#clientList tbody tr');
        this.deleteComment = page.locator('#deleteComment');
        this.attachmentSection = page.locator('#attachment');
        this.statusElement = page.locator('#form-status-text');
    }

    async navigateAndSelectIndividual(data) {
        await this.page.waitForLoadState("domcontentloaded");
        await this.commonUtils.navigateToDashboardLink('Staff', 'Schedule', 'New Slot');

        await this.listPage.selectIndividualFromIndividualList(data);
    }

    async navigateAndSearchSlot(data) {
        await this.commonUtils.navigateToDashboardLink('Staff', 'Schedule', 'Search');
        await this.searchPage.searchForm({ formId: data.slotFormId });
        await this.listPage.selectFilteredFirstItemUponAvailability(data.slotFormId);
    }

    async selectReasonCode(selectLocator, visibleText) {
        await selectLocator.waitFor({ state: 'visible' });
        await selectLocator.selectOption({ label: visibleText });
    }

    getEditButtonByStaffName(name) {
        return this.page.locator(`a.slotStaffAction[data-staffname*="${name}"]`);
    }

    async fillIvrPhone(phoneData) {
        if (!phoneData) return;

        await this.btnIvrPhoneDdl.click();
        const targetedOption = this.ddlIvrOptions.getByText(phoneData.trim(), { exact: true });

        if (await targetedOption.count() > 0 && await targetedOption.first().isVisible()) {
            await targetedOption.first().click();
        } else {
            await this.page.keyboard.press('Escape');
            await this.txtIvrPhone.fill(phoneData);
        }
    }

    async handleAttachments(data) {
        if (!data.fileName) return;

        const removeLink = this.attachmentSection.getByRole('link', { name: 'Remove', exact: true });

        if (await removeLink.isVisible()) {
            await removeLink.click();
            await this.commonButtons.clickButton('Yes');
        }

        await this.attachment.addAttachment({
            fileName: data.fileName,
            fileDescription: data.fileDescription,
            isDocumentLookup: data.isDocumentLookup
        });
    }

    async manualCheckInOut(data) {
        if (!data.staffs) return;

        const checkInAddress = {
            street1: data.checkInAddressStreet1,
            street2: data.checkInAddressStreet2,
            city: data.checkInAddressCity,
            zip: data.checkInAddressZip,
            state: data.checkInAddressState,
            country: data.checkInAddressCountry
        };

        const checkOutAddress = {
            street1: data.checkOutAddressStreet1,
            street2: data.checkOutAddressStreet2,
            city: data.checkOutAddressCity,
            zip: data.checkOutAddressZip,
            state: data.checkOutAddressState,
            country: data.checkOutAddressCountry
        };

        const splitedStaff = data.staffs.split('|');

        for (const staff of splitedStaff) {
            const staffName = staff.trim();
            const editBtn = this.getEditButtonByStaffName(staffName);

            const isCheckInIncomplete = !data.fvvCheckInLocation || !data.fvvCheckInCode;
            const isCheckOutIncomplete = !data.fvvCheckOutLocation || !data.fvvCheckOutCode;

            await editBtn.click();

            if (data.fvvCheckInLocation && data.fvvCheckInCode) {
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlFvvCheckInLocation, data.fvvCheckInLocation);
                await this.txtCheckInOtp.fill(data.fvvCheckInCode);
            } else {
                await this.dtpCheckInTime.fill(data.checkInTime);

                if (data.checkInAddressFromAllowedAddress) {
                    await this.commonUtils.selectBootstrapCustomDropdown(this.btnCheckInAddressPicker, data.checkInAddressFromAllowedAddress);
                } else if (checkInAddress && checkInAddress.country) {
                    await this.commonUtils.fillUpAddressWithLocator('checkInAddress', checkInAddress);
                }
            }

            if (await this.commonUtils.isElementAvailable(this.ddlCheckInLocationType)) {
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlCheckInLocationType, data.checkInLocationType);
            }

            if (data.fvvCheckOutLocation && data.fvvCheckOutCode) {
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlFvvCheckOutLocation, data.fvvCheckOutLocation);
                await this.txtCheckOutOtp.fill(data.fvvCheckOutCode);
            } else {
                await this.dtpCheckOutTime.fill(data.checkOutTime);

                if (data.checkOutAddressFromAllowedAddress) {
                    await this.commonUtils.selectBootstrapCustomDropdown(this.btnCheckOutAddressPicker, data.checkOutAddressFromAllowedAddress);
                } else if (checkOutAddress && checkOutAddress.country) {
                    await this.commonUtils.fillUpAddressWithLocator('checkOutAddress', checkOutAddress);
                }
            }

            if (await this.commonUtils.isElementAvailable(this.ddlCheckOutLocationType)) {
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlCheckOutLocationType, data.checkOutLocationType);
            }

            if (await this.commonUtils.isElementAvailable(this.rdoResidingCaregiverYes)) {
                await this.commonUtils.selectRadioOption(data.residingCaregiver, this.rdoResidingCaregiverYes, this.rdoResidingCaregiverNo);
            }
            if (await this.commonUtils.isElementAvailable(this.secondaryStaffYes)) {
                await this.commonUtils.selectRadioOption(data.secondaryStaff, this.secondaryStaffYes, this.secondaryStaffNo);
            }

            if (await this.commonUtils.isElementAvailable(this.txtTravelDistance)) {
                await this.txtTravelDistance.fill(data.travelDistance);
            }

            if (await this.commonUtils.isElementAvailable(this.verifiedBy)) {
                await this.commonUtils.selectBootstrapCustomDropdown(this.verifiedBy, data.verifiedBy);
            }

            if (isCheckInIncomplete || isCheckOutIncomplete) {
                if (await this.commonUtils.isElementAvailable(this.exceptionCode)) {
                    await this.selectReasonCode(this.exceptionCode, data.exceptionCode);
                    await this.page.keyboard.press('Escape');
                    await this.txtDescription.fill(data.exceptionDescription);
                }
            }

            await this.commonButtons.clickButton('Update');

            try {
                await this.btnPromptYes.waitFor({ state: 'visible', timeout: 3000 });
                if (await this.btnPromptYes.isVisible()) {
                    await this.commonButtons.clickButton('Yes');
                }
            } catch (e) {
                console.info('Attestation prompt did not appear within 3 seconds; proceeding with execution workflow.');
            }
        }
    }

    async _fillFormFields(data) {
        const startAddressData = {
            street1: data.startAddrStreet1,
            street2: data.startAddrStreet2,
            city: data.startAddrCity,
            zip: data.startAddrZip,
            state: data.startAddrState,
            country: data.startAddrCountry,
            location: data.startAddrLocation,
            useAddressAndLocation: data.startAddrUseAddressAndLocation
        };

        const endAddressData = {
            street1: data.endAddrStreet1,
            street2: data.endAddrStreet2,
            city: data.endAddrCity,
            zip: data.endAddrZip,
            state: data.endAddrState,
            country: data.endAddrCountry,
            location: data.endAddrLocation,
            useAddressAndLocation: data.endAddrUseAddressAndLocation
        };

        await this.dtpStartDate.fill(data.startDate);
        await this.dtpEndDate.fill(data.endDate);

        if (data.program) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnProgram, data.program);
        }

        if (data.service1) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnService1, data.service1);
        }

        if (data.service2) {

            if (!await this.commonUtils.isElementAvailable(this.lnkAddService2)) {
                throw new Error('Multi Service is not enabled for the provider.');
            }

            await this.lnkAddService2.click();
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnService2, data.service2);
            await this.txtService1Duration.fill(data.service1Duration);
        }

        if (data.staffs) {
            const splitedStaff = data.staffs.split('|');

            await this.btnStaffDdl.click();

            for (const staff of splitedStaff) {
                const name = staff.trim();

                await this.txtSearchField.fill(name);

                const option = this.page.locator('ul.inner li', {
                    has: this.page.locator('a', { hasText: name })
                }).first();

                const isSelected = await option.evaluate(el =>
                    el.classList.contains('selected')
                );

                if (!isSelected) {
                    await option.locator('a').first().click();
                }
            }
            await this.page.keyboard.press('Escape');
        }

        if (data.billable?.toLowerCase() === 'no') {
            await this.commonUtils.selectRadioOption(data.billable, this.rdoBillableYes, this.rdoBillableNo);
        }

        if (data.startAddrFromIndividualAddress) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnStartAddress, data.startAddrFromIndividualAddress);
        } else if (startAddressData && startAddressData.country) {
            await this.commonUtils.fillUpAddressAndLocationWithLocator('address1', this.btnStartAddressLocation, startAddressData);
        }

        if (data.endAddrFromIndividualAddress) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnEndAddress, data.endAddrFromIndividualAddress);
        } else if (endAddressData && endAddressData.country) {
            await this.commonUtils.fillUpAddressAndLocationWithLocator('address2', this.btnEndAddressLocation, endAddressData);
        }

        if (data.ivrPhone) {
            await this.fillIvrPhone(data.ivrPhone);
        }

        if (data.txtNote) {
            await this.txtNote.fill(data.note);
        }

        await this.handleAttachments(data);
    }

    async updateSchedulingEvvForm(data) {
        await this._fillFormFields(data);
    }

    async fillUpSchedulingEvvForm(data) {
        
        const action = data.action.toLowerCase();

        if (action === 'save') {
            await this.navigateAndSelectIndividual(data);
            await this._fillFormFields(data);
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage(data.expectedMsg);

        } else if (action === 'approve') {
            await this.navigateAndSelectIndividual(data);
            await this._fillFormFields(data);
            await this.commonButtons.clickButton('Approve');
            await this.donePage.clickLinkByText('Form');
            await this.manualCheckInOut(data);
            await this.donePage.doneMessageText.waitFor({ state: 'visible' });
            await this.donePage.verifyPartialDoneMessage(data.secondaryExpectedMsg);

        } else if (action === 'update') {
            await this.navigateAndSearchSlot(data);

            const updateButton = this.page.locator('input[name="_action_slot_edit"]');

            await updateButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => null);

            if (await updateButton.isVisible()) {
                await updateButton.click();
                await this.page.waitForLoadState("domcontentloaded");
                await this.updateSchedulingEvvForm(data);
                if (await this.commonUtils.isElementAvailable(this.exceptionCode)) {
                    await this.selectReasonCode(this.exceptionCode, data.exceptionCode);
                    await this.page.keyboard.press('Escape');
                    await this.txtDescription.fill(data.exceptionDescription);
                    await this.page.waitForLoadState('networkidle');
                }

                await this.commonButtons.clickButton('Save');

                try {
                    const visibleYesButton = this.page.locator('.modal-dialog .btn-prompt-yes').locator('visible=true');

                    await visibleYesButton.waitFor({ state: 'visible', timeout: 4000 });
                    await visibleYesButton.click({ force: true });

                } catch (e) {
                    console.info('Attestation prompt did not appear or handle within timeout; proceeding.', e.message);
                }
            } else {
                await this.commonButtons.clickButton('Save');
            }

            await this.donePage.doneMessageText.waitFor({ state: 'visible' });
            await this.donePage.verifyPartialDoneMessage(data.expectedMsg);

        } else if (action === 'delete') {
            await this.navigateAndSearchSlot(data);

            const currentStatus = (await this.statusElement.textContent({ timeout: 3000 }).catch(() => '')).trim();

            if (currentStatus === 'Deleted') {
                console.warn('Slot is already in Deleted status');
            } else {
                const approveButton = this.page.getByRole('button', { name: 'Approve', exact: true });
                const isDraft = await approveButton.isVisible({ timeout: 2000 }).catch(() => false);
                await this.commonButtons.clickButton('Delete');

                if (!isDraft) {
                    await this.page.waitForLoadState("domcontentloaded");
                    await this.deleteComment.fill(data.deleteComment);

                    if (await this.commonUtils.isElementAvailable(this.exceptionCode)) {
                        await this.selectReasonCode(this.exceptionCode, data.exceptionCode);
                        await this.page.keyboard.press('Escape');
                        await this.txtDescription.fill(data.exceptionDescription);
                        await this.page.waitForLoadState('networkidle');
                    }

                    await this.commonButtons.clickButton('Delete');
                }

                try {
                    await this.btnPromptYes.waitFor({ state: 'visible', timeout: 3000 });
                    if (await this.btnPromptYes.isVisible()) {
                        await this.commonButtons.clickButton('Yes');
                    }
                } catch (e) {
                    console.info('Attestation prompt did not appear within 3 seconds; proceeding with execution workflow.');
                }
            }

            await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
            await this.donePage.verifyPartialDoneMessage(data.secondaryExpectedMsg);
        }
    }
}