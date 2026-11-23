/**
 * @author Muhammad Muntasir Mamoor
 * @since 11/02/26
 */

import { ListPage } from '../../commonPages/listPage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { readExcelDataWithSheetName, filterObjects } from '../../commonUtility/read-xlsx.js';
import { DonePage } from '../../commonPages/donePage.js';
import { IdfPage } from './idfPage.js';
import { IBubbleUtils } from '../../commonUtility/iBubbleUtils.js';

export class IndividualDetailsPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.donePage = new DonePage(page);
        this.idfPage = new IdfPage(page);
        this.iBubble = new IBubbleUtils(page);

        // general Section
        this.btnImageUpload = page.locator('.add-image-button:visible');
        this.imageDiv = page.locator('.image-upload-wrap-div');
        this.btnImageRemove = page.locator('.image-upload-delete');
        this.dtpPhoto2Date = page.locator("[name='client.clientDetail.photoDate2']");
        this.ddlHairColor = page.locator("[name='client.clientDetail.hairColor']");
        this.txtHairColorOther = page.locator("[name='client.clientDetail.hairColorOther']");
        this.ddlEyeColor = page.locator("[name='client.clientDetail.eyeColor']");
        this.txtEyeColorOther = page.locator("[name='client.clientDetail.eyeColorOther']");
        this.ddlInterpreterNeeded = page.locator("[name='client.clientDetail.interpreter']");
        this.ddlPrimaryOralLanguage = page.locator("[name='client.clientDetail.language']");
        this.txtPrimaryOralLanguageOther = page.locator("[name='client.clientDetail.languageOther']");
        this.ddlPrimaryWrittenLanguage = page.locator("[name='client.clientDetail.writtenLanguage']");
        this.txtPrimaryWrittenLanguageOther = page.locator("[name='client.clientDetail.writtenLanguageOther']");
        this.ddlSecondaryOralLanguage = page.locator("[name='client.clientDetail.secondaryOralLanguage']");
        this.txtSecondaryOralLanguageOther = page.locator("[name='client.clientDetail.secondaryOralLanguageOther']");
        this.ddlSecondaryWrittenLanguage = page.locator("[name='client.clientDetail.secondaryWrittenLanguage']");
        this.txtSecondaryWrittenLanguageOther = page.locator("[name='client.clientDetail.secondaryWrittenLanguageOther']");
        this.ddlReligion = page.locator("[name='client.clientDetail.religion']");
        this.txtReligionOther = page.locator("[name='client.clientDetail.religionOther']");
        this.ddlCitizenship = page.locator("[name='client.clientDetail.citizenship']");
        this.txtCitizenshipOther = page.locator("[name='client.clientDetail.citizenshipOther']");
        this.ddlCitizenshipStatus = page.locator("[name='client.clientDetail.citizenshipStatus']");
        this.ddlMaritalStatus = page.locator("[name='client.clientDetail.maritalStatus']");
        this.dtpMaritalStatusDate = page.locator("[name='client.clientDetail.maritalStatusDate']");
        this.ddlIndividualTimeZone = page.locator("[name='client.tz']");
        this.ddlLivingArrangment = page.locator("[name='client.clientDetail.livingArrangement']");
        this.txtCharacteristics = page.locator("[name='client.clientDetail.characteristics']");
        this.ddlGuardianOfSelf = page.locator("[name='client.clientDetail.selfContact']");
        //ID numbers Section
        this.ddlIdType = page.locator("[name='client.idType']");
        this.txtIdNumber = page.locator("[name='client.idNumber']");
        this.ddlAdditionalIdType = page.locator("[name='client.clientDetail.additionalIdType']");
        this.txtAdditionalIdNumber = page.locator("[name='client.clientDetail.additionalIdNumber']");
        this.divOtherIdNumber = page.locator('.client-id-number-row');
        // Medical Information Section
        this.ddlDevelopmentalDisabilities = page.locator("[name='client.clientDetail.developmentalDisabilities']");
        this.ddlIntellectualDisabilities = page.locator("[name='client.clientDetail.mentalRetardation']");
        this.ddlHearingStatus = page.locator("[name='client.clientDetail.hearingStatus']");
        this.ddlVisionStatus = page.locator("[name='client.clientDetail.visionStatus']");
        this.ddlBloodType = page.locator("[name='client.clientDetail.bloodType']");
        this.txtPrimaryPhysicianCare = page.locator("[id='client.clientDetail.primaryPhysicianLookup']");
        this.firstLookupResult = page.locator('.ui-menu-item > .ui-menu-item-wrapper:visible');
        this.txtOtherMedicalInformation = page.locator("[name='client.clientDetail.diagnosisOther']");
        this.txtEmergencyOrders = page.locator("[name='client.clientDetail.emergencyOrders']");
        this.txtAdaptiveEquipment = page.locator("[name='client.clientDetail.adaptiveEquipment']");
        //Behavior and Guideline Section
        this.txtBehaviorManagement = page.locator("[name='client.clientDetail.behavior']");
        this.txtDietaryGuidelines = page.locator("[name='client.clientDetail.dietaryGuidelines']");
        this.txtEatingGuidelines = page.locator("[name='client.clientDetail.feedingGuidelines']");
        this.ddlCommunicationModality = page.locator("[name='client.clientDetail.commModality']");
        this.txtCommunicationModalityOther = page.locator("[name='client.clientDetail.commModalityOther']");
        this.txtCommunicationComments = page.locator("[name='client.clientDetail.commComments']");
        this.ddlMobility = page.locator("[name='client.clientDetail.mobility']");
        this.txtMobilityOther = page.locator("[name='client.clientDetail.mobilityOther']");
        this.txtMobilityComments = page.locator("[name='client.clientDetail.mobilityComments']");
        this.ddlSupervision = page.locator("[name='client.clientDetail.supervision']");
        this.txtSupervisionOther = page.locator("[name='client.clientDetail.supervisionOther']");
        this.txtSupervisionComments = page.locator("[name='client.clientDetail.supervisionComments']");
        this.ddlFoodTexture = page.locator("[name='client.clientDetail.foodTexture']");
        this.ddlLiquidConsistency = page.locator("[name='client.clientDetail.liquidConsistency']");
        this.ddlToiletingStatus = page.locator("[name='client.clientDetail.toileting']");
        this.ddlBathingStatus = page.locator("[name='client.clientDetail.bathingStatus']");
        this.ddlMealtimeStatus = page.locator("[name='client.clientDetail.mealtimeStatus']");
        this.txtReferralSource = page.locator("[name='client.clientDetail.referralSource']");
        this.chkWrittenAdvice = page.locator("[name='client.clientDetail.writtenAdviceFromFamily']");
        this.errPhysicianSearch = page.locator('.ui-autocomplete-lookup-error');
        //Idf Search
        this.ddlIdfSearchIdType = page.locator("[name='idType']");
        this.txtIdfSearchIdNumber = page.locator("[name='idNumber']");
        this.tblDataList = page.locator('#dataList:visible');
        this.tblEmptyDataTable = page.locator('.dataTables_empty');
    }

    async isIdNumberExist(isOversight, idType, idNumber, formId) {
        await this.idfPage.navigateToIdfSearch(isOversight);
        await this.ddlIdfSearchIdType.selectOption(idType);
        await this.txtIdfSearchIdNumber.fill(idNumber);
        await this.commonButtons.clickButton('Search');

        if (await this.commonUtils.isElementAvailable(this.tblDataList)) {
            await this.listPage.fillFilterField(formId);

            if ((await this.commonUtils.isElementAvailable(this.tblEmptyDataTable))) {
                throw new Error(`Another Individual with Id Type : "${idType}" and Id Number : "${idNumber}" already Exists`);
            }
        }
    }

    async navigateToIndividualDetailsForm(formId) {
        await this.listPage.selectFilteredFirstItemUponAvailability(formId);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Individual Details form can not be updated for Deleted Individual');
        }

        await this.donePage.clickLinkByText('Individual Details');
        await this.commonButtons.clickButton('Edit');
    }

    async addImage(data) {
        const attachmentData = readExcelDataWithSheetName('resources/individual/individualDetails.xlsx', 'addImage');
        const imageData = filterObjects(attachmentData, [{ "formIndex": data.index }]);
        await this.attachmentUtils.addImage(imageData[0]);

        await this.dtpPhoto2Date.fill(data.photo1Date);
    }

    async individualDetailsGeneralInformationFillUp(data) {
        const birthPlace = {
            street1: data.birthPlaceStreet1,
            street2: data.birthPlaceStreet2,
            city: data.birthPlaceCity,
            zip: data.birthPlaceZip,
            state: data.birthPlaceState,
            country: data.birthPlaceCountry
        }

        const photoData = {
            hasPhoto: data.hasPhoto,
            index: data.testCaseNumber,
            photo1Date: data.photo2Date
        }

        if (CommonUtils.isAffirmative(data.hasPhoto)) {
            if (await this.commonUtils.isElementAvailable(this.btnImageUpload)) {
                await this.addImage(photoData);
            } else {
                await this.imageDiv.hover();
                await this.btnImageRemove.click();
                await this.commonButtons.clickButton('Yes');
                await this.addImage(photoData);
            }
        }

        await this.ddlHairColor.selectOption(data.hairColor);

        if (data.hairColor == 'Other') {
            await this.txtHairColorOther.fill(data.hairColorOther);
        }

        await this.ddlEyeColor.selectOption(data.eyeColor);

        if (data.eyeColor == 'Other') {
            await this.txtEyeColorOther.fill(data.eyeColorOther);
        }

        await this.ddlInterpreterNeeded.selectOption(data.interpreterNeeded);
        await this.ddlPrimaryOralLanguage.selectOption(data.primaryOralLanguage);

        if (data.primaryOralLanguage == 'Other') {
            await this.txtPrimaryOralLanguageOther.fill(data.primaryOralLanguageOther);
        }

        await this.ddlPrimaryWrittenLanguage.selectOption(data.primaryWrittenLanguage);

        if (data.primaryWrittenLanguage == 'Other') {
            await this.txtPrimaryWrittenLanguageOther.fill(data.primaryWrittenLanguageOther);
        }

        await this.ddlSecondaryOralLanguage.selectOption(data.secondaryOralLanguage);

        if (data.secondaryOralLanguage == 'Other') {
            await this.txtSecondaryOralLanguageOther.fill(data.secondaryOralLanguageOther);
        }

        await this.ddlSecondaryWrittenLanguage.selectOption(data.secondaryWrittenLanguage);

        if (data.secondaryWrittenLanguage == 'Other') {
            await this.txtSecondaryWrittenLanguageOther.fill(data.secondaryWrittenLanguageOther);
        }

        await this.ddlReligion.selectOption(data.religion);

        if (data.religion == 'Other') {
            await this.txtReligionOther.fill(data.religionOther);
        }

        await this.ddlCitizenship.selectOption(data.citizenship);

        if (data.citizenship == 'Other') {
            await this.txtCitizenshipOther.fill(data.citizenshipOther);
        }

        await this.ddlCitizenshipStatus.selectOption(data.citizenshipStatus);
        await this.ddlMaritalStatus.selectOption(data.maritalStatus);

        if (data.maritalStatus) {
            await this.dtpMaritalStatusDate.fill(data.maritalStatusDate);
        }

        await this.ddlIndividualTimeZone.selectOption(data.tz);
        await this.ddlLivingArrangment.selectOption(data.livingArrangement);
        await this.commonUtils.fillUpAddressWithLocator('client.clientDetail.birthPlace', birthPlace);
        await this.txtCharacteristics.fill(await this.commonUtils.generateString(data.characterstics));
        await this.ddlGuardianOfSelf.selectOption(data.guardianOfSelf);
    }

    async individualIDNumberFillUp(data) {
        const participantSheetData = readExcelDataWithSheetName('resources/individual/individualDetails.xlsx', 'otherIds');
        const OtherIds = filterObjects(participantSheetData, [{ "formIndex": data.testCaseNumber }]);
        let countOfOtherIds = await this.divOtherIdNumber.count();

        if (data.idType) {
            await this.ddlIdType.selectOption(data.idType);
            await this.txtIdNumber.fill(data.idNumber);
        }

        if (data.additionalIdType) {
            await this.ddlAdditionalIdType.selectOption(data.additionalIdType);
            await this.txtAdditionalIdNumber.fill(data.additionalIdNumber);
        }

        if (OtherIds.length + countOfOtherIds > 5) {
            throw new Error(`You can add upto 5 Other IDs`);
        }

        if (OtherIds.length > 0) {
            for (let otherId = 0; otherId < OtherIds.length; otherId++) {
                await this.commonButtons.clickButton("Add");
                await this.page.locator(`[name='client.clientDetail.clientIdNumbers[${countOfOtherIds + 1}].idType']`).selectOption(OtherIds[otherId].otherIdType);
                await this.page.locator(`[name='client.clientDetail.clientIdNumbers[${countOfOtherIds + 1}].idNumber']`).fill(OtherIds[otherId].otherIdNumber);
                countOfOtherIds++;
            }
        }
    }

    async individualDetailsMedicalInformationFillUp(data) {
        if (data.developmentDisabilities) {
            const splitedDevelopmentDisabilities = (data.developmentDisabilities).split(',');
            await this.ddlDevelopmentalDisabilities.selectOption(splitedDevelopmentDisabilities);
        }

        await this.ddlIntellectualDisabilities.selectOption(data.intellectualDisabilities);
        await this.ddlHearingStatus.selectOption(data.hearingStatus);
        await this.ddlVisionStatus.selectOption(data.visionStatus);
        await this.ddlBloodType.selectOption(data.bloodType);

        if (data.primaryPhysicianCare) {
            await this.txtPrimaryPhysicianCare.fill(data.primaryPhysicianCare);
            await this.page.waitForTimeout(1000);
            if (await this.commonUtils.isElementAvailable(this.errPhysicianSearch)) {
                console.log(`No Primary Physician Care found with '${data.primaryPhysicianCare}'`);
                return;
            } else {
                await this.firstLookupResult.click();
            }
        }

        await this.txtOtherMedicalInformation.fill(await this.commonUtils.generateString(data.otherMedicalInformation));
        await this.txtEmergencyOrders.fill(await this.commonUtils.generateString(data.emergencyOrders));
        await this.txtAdaptiveEquipment.fill(await this.commonUtils.generateString(data.adaptiveEquipment));
    }

    async individualDetailsBehaviorAndGuidlineFillUp(data) {
        await this.txtBehaviorManagement.fill(await this.commonUtils.generateString(data.behaviorManagement));
        await this.txtDietaryGuidelines.fill(await this.commonUtils.generateString(data.dietaryGuidelines));
        await this.txtEatingGuidelines.fill(await this.commonUtils.generateString(data.eatingGuidelines));
        await this.ddlCommunicationModality.selectOption(data.communicationModality);

        if (data.communicationModality == 'Other') {
            await this.txtCommunicationModalityOther.fill(await this.commonUtils.generateString(data.communicationModalityOther));
        }

        await this.txtCommunicationComments.fill(await this.commonUtils.generateString(data.communicationComments));
        await this.ddlMobility.selectOption(data.mobility);

        if (data.mobility == 'Other') {
            await this.txtMobilityOther.fill(data.mobilityOther);
        }

        await this.txtMobilityComments.fill(await this.commonUtils.generateString(data.mobilityComments));
        await this.ddlSupervision.selectOption(data.supervision);

        if (data.supervision == 'Other') {
            await this.txtSupervisionOther.fill(data.supervisionOther);
        }

        await this.txtSupervisionComments.fill(await this.commonUtils.generateString(data.supervisionComments));
        await this.ddlFoodTexture.selectOption(data.foodTexture);
        await this.ddlLiquidConsistency.selectOption(data.liquidConsistency);
        await this.ddlToiletingStatus.selectOption(data.toiletingStatus);
        await this.ddlBathingStatus.selectOption(data.bathingStatus);
        await this.ddlMealtimeStatus.selectOption(data.mealtimeStatus);
        await this.txtReferralSource.fill(await this.commonUtils.generateString(data.referralSource));

        if (CommonUtils.isAffirmative(data.writtenAdvice)) {
            await this.chkWrittenAdvice.check();
        }
    }

    async IndividualDetailsFormFillUp(data) {
        await this.individualDetailsGeneralInformationFillUp(data);
        await this.individualIDNumberFillUp(data);
        await this.individualDetailsMedicalInformationFillUp(data);
        await this.individualDetailsBehaviorAndGuidlineFillUp(data);
    }

    async IndividualDetailsFormUpdate(data) {
        await this.IndividualDetailsFormFillUp(data);
        await this.commonButtons.clickButton('Update');
    }
}