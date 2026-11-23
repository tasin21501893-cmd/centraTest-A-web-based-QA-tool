/**
 * @author Muhammad Muntasir Mamoor
 * @author Ziaur Rahman
 * @since 24/07/25
 */

import { expect } from '@playwright/test';

import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { readExcelDataWithSheetName, filterObjects } from '../../commonUtility/read-xlsx.js';

import { getIdfReadOnlyMap } from '../../helper/idf/idfFieldMap.js';

export class IdfPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.donePage = new DonePage(page);

        //Idf Core Data
        this.dtpPhoto1Date = page.locator("[name='client.clientDetail.photoDate1']");
        this.ddlTitle = page.locator("[id='client.titlePickerBtn']");
        this.ddlGender = page.locator("[id='client.genderPickerBtn']");
        this.ddlPronoun = page.locator("[id='client.preferredPronounPickerBtn']");
        this.ddlPreferredGender = page.locator("[id='client.preferredGenderPickerBtn']");
        this.txtFirstName = page.locator("[name='client.firstName']");
        this.txtLastName = page.locator("[name='client.lastName']");
        this.txtMiddleName = page.locator("[name='client.middleName']");
        this.txtSuffix = page.locator("[name='client.suffix']");
        this.txtBirthDate = page.locator("[name='client.birthDate']");
        this.txtGoesBy = page.locator("[name='client.goesBy']");
        this.txtSsn = page.locator("[name='client.ssn']");
        this.txtMedicaidNumber = page.locator("[name='client.medicaidNumber']");
        this.txtEmail = page.locator("[name='client.clientDetail.email']");
        this.txtPhoneNo = page.locator("[name='client.clientDetail.phoneNo']");
        this.ddlRace = page.locator("[id='client.clientDetail.racesPickerBtn']");
        this.ddlEthnicity = page.locator("[id='client.clientDetail.ethnicityPickerBtn']");
        this.ddlTribe = page.locator("[id='client.clientDetail.tribePickerBtn']");
        this.ddlClassMembership = page.locator("[id='client.clientDetail.classMembershipPickerBtn']");
        this.txtOversightId = page.locator("[name='oversightAssignedId']");

        //Idf Address Information
        this.ddlResidentialAddressProgram = page.locator("[id='residentialAddressProgramPickerBtn']");
        this.txtResAddressAttention = page.locator("[name='client.clientDetail.raAttention']");
        this.btnResAddressLocationButton = page.locator('#client\\.clientDetail\\.raLocationButton');
        this.txtResAddressPrimaryPhone = page.locator("[name='client.clientDetail.residencePhone']");
        this.txtResAddressSecondaryPhone = page.locator("[name='client.clientDetail.raSecondaryPhone']");
        this.txtResAddressAdditionalPhone = page.locator("[name='client.clientDetail.raAdditionalPhone']");
        this.ddlResidentialCountyState = page.locator("[id='client.clientDetail.residentialCountyStatePickerBtn']");
        this.ddlResidentialCounty = page.locator("[id='client.clientDetail.residentialCountyPickerBtn']");
        this.ddlServiceCountyState = page.locator("[id='client.clientDetail.serviceCountyStatePickerBtn']");
        this.ddlServiceCounty = page.locator("[id='client.clientDetail.serviceCountyPickerBtn']");
        this.chkCopyFromResidentialAddress = page.locator("#copyFromResidentialAddress");
        this.txtMailingAddressAttention = page.locator("[name='client.clientDetail.mailingAttention']");
        this.txtMailingAddressPrimaryPhone = page.locator("[name='client.clientDetail.mailingPrimaryPhone']");
        this.txtMailingAddressSecondaryPhone = page.locator("[name='client.clientDetail.mailingSecondaryPhone']");
        this.txtMailingAddressAdditionalPhone = page.locator("[name='client.clientDetail.mailingAdditionalPhone']");

        this.pnlIdfMatched = page.locator('.panel-warning');
        this.dtpAdmissionDate = page.locator('#client\\.clientAdmissionDate');

        //For IDF Search
        this.txtSrchSsn = page.locator("[name='ssn']");
        this.txtSrchMedicaidNumber = page.locator("[name='medicaidNumber']");
        this.txtSrchMedicareNumber = page.locator("[name='medicareNumber']");
        this.txtSrchFormId = page.locator("[name='formId']");
        this.dtpSrchBirthDateFrom = page.locator("[name='birthDateFrom']");
        this.dtpSrchBirthDateTo = page.locator("[name='birthDateTo']");
        this.dtpSrchAdmissionDateFrom = page.locator("[name='admissionDateFrom']");
        this.dtpSrchAdmissionDateTo = page.locator("[name='admissionDateTo']");
        this.ddlSrchStatus = page.locator("[name='status']");
        this.ddlSrchIdType = page.locator("[name='idType']");
        this.txtSrchIdNumber = page.locator("[name='idNumber']");
        this.ddlSrchCaseStatus = page.locator("[name='caseStatus']");
        this.txtSrchOversightId = page.locator("[name='oversightId']");

        //For Individual Search from Individual Lookup Search
        this.btnsearchIndivLookup = page.locator("#clientLookupAdvanceSearch");

        this.lookupIframe = page.locator('[frameborder="0"]').contentFrame();
        this.lookupIframeTblDataList = this.lookupIframe.locator('#dataList:visible');
        this.lookupRecordLength = this.lookupIframe.locator('[id="dt-length-0"]');
        this.lookupIframeRows = this.lookupIframe.locator('#dataList tbody tr');

        this.registrationFrame = page.frameLocator('iframe[src*="/ma/common/clientSelection"]');
        this.txtRegFirstName = this.registrationFrame.locator("[name='firstName']");
        this.txtRegLastName = this.registrationFrame.locator("[name='lastName']");
        this.txtRegBirthDate = this.registrationFrame.locator("[name='birthDate']");
        this.btnRegSearch = this.registrationFrame.locator("[name='_action_search']");

        this.tblDataList = page.locator('#dataList:visible');
        this.tblDataListRows = page.locator('#dataList tbody tr');
        this.tblDataTablesEmpty = page.locator('.dataTables_empty');
    }

    async navigateToIdf(isOversight) {
        if (CommonUtils.isAffirmative(isOversight)) {
            await this.commonUtils.navigateToDashboardLink("Intake", "Individual Intake", "New");
        } else {
            await this.commonUtils.navigateToDashboardLink("Admin", "Individual Intake", "New");
        }
    }

    async navigateToIdfSearch(isOversight) {
        if (CommonUtils.isAffirmative(isOversight)) {
            await this.commonUtils.navigateToDashboardLink("Intake", "Individual Demographics", "Search");
        } else {
            await this.commonUtils.navigateToDashboardLink("Admin", "Individual Demographics", "Search");
        }
    }

    async navigateToIdfList(isOversight) {
        if (CommonUtils.isAffirmative(isOversight)) {
            await this.commonUtils.navigateToDashboardLink("Intake", "Individual Demographics", "List");
        } else {
            await this.commonUtils.navigateToDashboardLink("Admin", "Individual Demographics", "List");
        }
    }

    async addImage(data) {
        const attachmentData = readExcelDataWithSheetName('resources/individual/idf.xlsx', 'addImage');
        const imageData = filterObjects(attachmentData, [{ "formIndex": data.index }]);
        await this.attachmentUtils.addImage(imageData[0]);

        await this.dtpPhoto1Date.fill(data.photo1Date);
    }

    async IdfCoreDataFillUp(data) {
        if (data.gender) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlGender, data.gender);
        }
        if (data.title) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlTitle, data.title);
        }

        if (await this.commonUtils.isElementAvailable(this.ddlPronoun)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlPronoun, data.pronoun);
        }

        if (await this.commonUtils.isElementAvailable(this.ddlPreferredGender)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlPreferredGender, data.preferredGender);
        }

        await this.txtFirstName.fill(data.firstName);
        await this.txtLastName.fill(data.lastName);
        await this.txtMiddleName.fill(data.middleName);
        await this.txtSuffix.fill(data.suffix);
        await this.txtBirthDate.fill(data.birthDate);
        await this.txtGoesBy.fill(data.goesBy);
        await this.txtSsn.fill(data.ssn);
        await this.txtMedicaidNumber.fill(data.medicaidNumber);
        await this.txtEmail.fill(data.email);
        await this.txtPhoneNo.fill(data.phoneNo);

        if (data.races) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlRace, data.races);
        }
        if (data.ethnicity) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlEthnicity, data.ethnicity);
        }
        if (data.tribe) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlTribe, data.tribe);
        }

        if (data.classMembership) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlClassMembership, data.classMembership);
        }

        if (CommonUtils.isAffirmative(data.isOversight)) {
            await this.txtOversightId.fill(data.oversightId);
        }
    }

    async residentialAddressInfo(data) {
        await this.txtResAddressAttention.fill(data.resAddressAttention);
        await this.commonUtils.fillUpAddressAndLocationWithLocator('client.clientDetail.residentialAddress', this.btnResAddressLocationButton, data, true);
        await this.txtResAddressPrimaryPhone.fill(data.resAddressPrimaryPhone);
        await this.txtResAddressSecondaryPhone.fill(data.resAddressSecondaryPhone);
        await this.txtResAddressAdditionalPhone.fill(data.resAddressAdditionalPhone);
        if (data.residentialCountyState) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlResidentialCountyState, data.residentialCountyState);
        }
        if (data.serviceCountyState) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlServiceCountyState, data.serviceCountyState);
        }

        if (data.residentialCountyState) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlResidentialCounty, data.residentialCounty);
        }

        if (data.serviceCountyState) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlServiceCounty, data.serviceCounty);
        }
    }

    async mailingAddressInfo(data) {
        if (CommonUtils.isAffirmative(data.copyFromResidentialAddress)) {
            await this.chkCopyFromResidentialAddress.check();
        } else {
            await this.txtMailingAddressAttention.fill(data.mailingAddressAttention);
            await this.commonUtils.fillUpAddressWithLocator('client.clientDetail.mailingAddress', data, true);
            await this.txtMailingAddressPrimaryPhone.fill(data.mailingAddressPrimaryPhone);
            await this.txtMailingAddressSecondaryPhone.fill(data.mailingAddressSecondaryPhone);
            await this.txtMailingAddressAdditionalPhone.fill(data.mailingAddressAdditionalPhone);
        }
    }

    async idfFormFillUp(data) {
        const photoData = {
            hasPhoto: data.hasPhoto,
            index: data.testCaseNumber,
            photo1Date: data.photo1Date
        }

        const residentialAddressData = {
            street1: data.resAddressStreet1,
            street2: data.resAddressStreet2,
            city: data.resAddressCity,
            zip: data.resAddressZip,
            state: data.resAddressState,
            country: data.resAddressCountry,
            location: data.location,
            useAddressAndLocation: data.useAddressAndLocation,
            resAddressAttention: data.resAddressAttention,
            resAddressPrimaryPhone: data.resAddressPrimaryPhone,
            resAddressSecondaryPhone: data.resAddressSecondaryPhone,
            resAddressAdditionalPhone: data.resAddressAdditionalPhone,
            residentialCountyState: data.residentialCountyState,
            residentialCounty: data.residentialCounty,
            serviceCountyState: data.serviceCountyState,
            serviceCounty: data.serviceCounty
        }

        const mailingAddressData = {
            mailingAddressAttention: data.mailingAddressAttention,
            street1: data.mailingAddressStreet1,
            street2: data.mailingAddressStreet2,
            city: data.mailingAddressCity,
            zip: data.mailingAddressZip,
            state: data.mailingAddressState,
            country: data.mailingAddressCountry,
            mailingAddressPrimaryPhone: data.mailingAddressPrimaryPhone,
            mailingAddressSecondaryPhone: data.mailingAddressSecondaryPhone,
            mailingAddressAdditionalPhone: data.mailingAddressAdditionalPhone
        }

        await this.IdfCoreDataFillUp(data);

        if (CommonUtils.isAffirmative(data.hasPhoto)) {
            await this.addImage(photoData);
        }

        await this.residentialAddressInfo(residentialAddressData);
        await this.mailingAddressInfo(mailingAddressData);
    }

    async createNewIdfAndAdmit(data) {
        const dataForIsIdfExist = {
            firstName: data.firstName,
            lastName: data.lastName,
            isOversight: data.isOversight,
            birthDate: data.birthDate,
            ssn: data.ssn,
            medicaidNumber: data.medicaidNumber,
            oversightId: data.oversightId
        };

        await this.isIdfExist(dataForIsIdfExist);
        await this.navigateToIdf(data.isOversight);
        await this.idfFormFillUp(data);
        await this.commonButtons.clickButton('Save');

        if (await this.commonUtils.isElementAvailable(this.pnlIdfMatched)) {
            await this.commonButtons.clickButton('Save');
            await this.commonButtons.clickButton('Yes');
        }

        if (data.admissionDate) {
            await this.donePage.clickLinkByText('Form');
            await this.admitIndividual(data.admissionDate);
        }
    }

    async searchIdfFromIndividualLookUp(data) {
        await this.navigateToIdfSearch(data.isOversight);

        await this.btnsearchIndivLookup.click();

        await this.txtRegFirstName.fill(data.firstName);
        await this.txtRegLastName.fill(data.lastName);
        await this.txtRegBirthDate.fill(data.birthDate);
        await this.btnRegSearch.click();
    }

    async searchWithSpecificField(elementLocator, isOversight, data) {
        await this.navigateToIdfSearch(isOversight);
        await elementLocator.fill(data);
        await this.commonButtons.clickButton('Search');
    }

    async isIdfExist(data) {

        if (!(data.medicaidNumber) && !(data.ssn)) {
            await this.searchIdfFromIndividualLookUp(data);
            await this.lookupRecordLength.waitFor({ state: 'visible' });

            if (await this.commonUtils.isElementAvailable(this.lookupIframeTblDataList)) {
                const matchedRow = this.lookupIframeRows
                    .filter({ has: this.lookupIframe.locator(`td:nth-child(2):text-is("${data.firstName}")`) })
                    .filter({ has: this.lookupIframe.locator(`td:nth-child(4):text-is("${data.lastName}")`) });

                const count = await matchedRow.count();

                if (count > 0) {
                    throw new Error(`Individual: "${data.lastName}, ${data.firstName}" already exists.`);
                }
            }
        }

        if (data.medicaidNumber) {
            await this.searchWithSpecificField(this.txtSrchMedicaidNumber, data.isOversight, data.medicaidNumber);

            if (await this.commonUtils.isElementAvailable(this.tblDataList)) {
                throw new Error(`Individual with Medicaid Number : "${data.medicaidNumber}" already Exists`);
            }
        }

        if (data.ssn) {
            await this.searchWithSpecificField(this.txtSrchSsn, data.isOversight, data.ssn);

            if (await this.commonUtils.isElementAvailable(this.tblDataList)) {
                throw new Error(`Individual with Social Security Number : "${data.ssn}" already Exists`);
            }
        }

        if (CommonUtils.isAffirmative(data.isOversight)) {
            await this.searchWithSpecificField(this.txtSrchSsn, data.isOversight, data.oversightId);

            if (await this.commonUtils.isElementAvailable(this.tblDataList)) {
                throw new Error(`Individual with Oversight ID : "${data.oversightId}" already Exists`);
            }
        }
    }

    /**
     * Searches for an individual from Individual Demographic List and opens Individual Demographic Form.
     * If IDF Form ID is provided, searches using Form ID.
     * Otherwise, filters using First Name, Last Name, Medicaid Number, SSN, and Birth Date.
     */
    async filterIdfByFormIdOrDemographics(data) {
        await this.navigateToIdfList(data.isOversight);

        if (data.idfFormId) {
            await this.listPage.selectFilteredFirstItemUponAvailability(data.idfFormId);
        } else {
            const expectedName = `${data.lastName}, ${data.firstName}`;

            // Filter by Last, First Name to shrink the table size for performance
            await this.listPage.fillFilterField(expectedName);

            if (await this.commonUtils.isElementAvailable(this.tblDataTablesEmpty)) {
                throw new Error(`Individual: "${expectedName}" does not Exist.`);
            }

            // Dynamically maps column indexes
            const individualColumnIndex = await this.listPage.getColumnIndexByName('Individual');
            const medicaidColumnIndex = await this.listPage.getColumnIndexByName('Medicaid Number');
            const ssnColumnIndex = await this.listPage.getColumnIndexByName('Social Security Number');
            const birthDateColumnIndex = await this.listPage.getColumnIndexByName('Birth Date');

            const rowLocator = this.tblDataListRows
                .filter({ has: this.page.locator(`td:nth-child(${individualColumnIndex}):text-is("${expectedName}")`) })
                .filter({ has: this.page.locator(`td:nth-child(${medicaidColumnIndex}):text-is("${data.medicaidNumber}")`) })
                .filter({ has: this.page.locator(`td:nth-child(${ssnColumnIndex}):text-is("${data.ssn}")`) })
                .filter({ has: this.page.locator(`td:nth-child(${birthDateColumnIndex}):text-is("${data.birthDate}")`) });

            if (await rowLocator.count() > 0) {
                await rowLocator.first().click();
            } else {
                throw new Error(`Respective data does not match with any individual.`);
            }
        }
    }

    async createIndividualWithRequiredFields(firstName, lastName, oversightId = null) {
        await this.txtFirstName.fill(firstName);
        await this.txtLastName.fill(lastName);

        if (oversightId && await this.commonUtils.isElementAvailable(this.txtOversightId)) {
            await this.txtOversightId.fill(oversightId);
        }
    }

    async admitIndividual(admissionDate) {
        await this.commonButtons.clickButton('Admit');
        await this.dtpAdmissionDate.fill(admissionDate);
        await this.commonButtons.clickButton('Done');
    }

    async verifyAllFieldsInReadOnlyMode(testcase) {
        const fieldMap = getIdfReadOnlyMap();
        const readOnlyData = await this.getReadOnlyFormData();

        for (const field of fieldMap) {
            let expected;

            if (field.type !== 'address') {
                expected = testcase[field.key];

                if (!expected) continue;
            }

            switch (field.type) {
                case 'text': {
                    const actual = readOnlyData[field.readOnlyFieldId] || '';

                    console.log(
                        `[VERIFY] ${field.key} | Expected: "${expected}" | Actual: "${actual}"`
                    );
                    expect(actual, `"${field.key}": expected "${expected}", got "${actual}"`).toBe(expected);
                    break;
                }

                case 'multiselect-div': {
                    const locator = this.page.locator(
                        `#${field.readOnlyFieldId.replace(/\./g, '\\.')}`
                    );

                    await this.verifyMultiselectDiv(locator, expected);
                    break;
                }

                case 'address': {
                    const expectedAddress = this.buildExpectedAddress(
                        testcase,
                        field.prefix
                    );

                    const actual = await this.getAddressFromSection(
                        field.section
                    );

                    console.log(
                        `[VERIFY] ${field.section} | Expected: "${expectedAddress}" | Actual: "${actual}"`
                    );

                    expect(actual).toBe(expectedAddress);

                    break;
                }
            }
        }
    }

    /** 
     * Extracts all read-only label and value pairs from the page in a single browser evaluation. 
     * @returns {Promise<Object<string, string>>} 
     */ 
    async getReadOnlyFormData() { 
        await this.page.waitForLoadState('domcontentloaded'); 
 
        const fieldMap = getIdfReadOnlyMap(); 
 
        const extractedData = await this.page.evaluate((fields) => { 
            const result = {}; 
 
            fields.forEach(field => { 
                if (field.readOnlyFieldId) { 
                    let val = ''; 
                    const lbl = document.querySelector(`label[for="${field.readOnlyFieldId}"]`); 
                    if (lbl) { 
                        const parentDiv = lbl.closest('div'); 
                        const valDiv = parentDiv ? parentDiv.nextElementSibling : null; 
                        if (valDiv) { 
                            val = valDiv.innerText.trim().replace(/\n/g, ', '); 
                        } 
                    } 
 
                    if (!val) { 
                        // Fallback: check direct element by id (e.g. multiselect containers) 
                        const el = document.getElementById(field.readOnlyFieldId); 
                        if (el) { 
                            val = el.innerText ? el.innerText.trim().replace(/\n/g, ', ') : (el.value || ''); 
                        } 
                    } 
 
                    result[field.readOnlyFieldId] = val; 
                    result[field.key] = val; 
                    if (lbl) { 
                        const labelText = lbl.innerText.trim().replace(/:\s*$/, ''); 
                        if (labelText) result[labelText] = val; 
                    } 
                } 
            }); 
 
            return result; 
        }, fieldMap); 
 
        return extractedData;
    }


    async verifyMultiselectDiv(containerLocator, expectedRawValue) {
        const expectedValues = expectedRawValue
            .split('|')
            .map(v => v.trim().toLowerCase())
            .filter(Boolean);

        const actualValues = await containerLocator
            .locator('> div')
            .allInnerTexts();

        const normalizedActualValues = actualValues
            .map(v => v.trim().toLowerCase())
            .filter(Boolean);

        console.log(
            `Expected values: ${expectedValues.join(', ')}`
        );

        console.log(
            `Actual values: ${normalizedActualValues.join(', ')}`
        );

        expect(
            normalizedActualValues.sort(),
            `Expected: [${expectedValues.join(', ')}], Actual: [${normalizedActualValues.join(', ')}]`
        ).toEqual(expectedValues.sort());
    }

    buildExpectedAddress(data, prefix) {

        const parts = [
            data[`${prefix}Street1`],
            data[`${prefix}Street2`],
            data[`${prefix}City`]
        ].filter(Boolean);

        const stateZip = [
            data[`${prefix}State`],
            data[`${prefix}Zip`]
        ].filter(Boolean).join(' ');

        if (stateZip) {
            parts.push(stateZip);
        }

        if (data[`${prefix}Country`]) {
            parts.push(data[`${prefix}Country`]);
        }

        return parts.join(', ');
    }

    async getAddressFromSection(sectionTitle) {
        const section = this.page.locator('fieldset', {
            has: this.page.locator('.sub-section-title', { hasText: sectionTitle })
        });

        const addressValue = section
            .locator('.row', { has: this.page.locator('label', { hasText: 'Address' }) })
            .locator('.label-value');

        return (await addressValue.innerText()).trim();
    }
}
