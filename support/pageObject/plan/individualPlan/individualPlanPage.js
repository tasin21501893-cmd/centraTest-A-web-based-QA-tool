/**
* @author Md. Hasin Ibtida Alam
* @since 09/01/2024
*/

import { filterObjects } from '../../../../support/commonUtility/read-xlsx.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { ListPage } from '../../../commonPages/listPage.js';
import { DonePage } from '../../../commonPages/donePage.js';
import { SearchPage } from '../../../../support/commonPages/searchPage.js';
import { expect } from '@playwright/test';

export class IndividualPlanPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.ipChildModal = this.page.locator('#ip-child-modal');
        this.iframe = this.ipChildModal.frameLocator('iframe[frameborder="0"]');
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.searchPage = new SearchPage(page);

        // Alert
        this.alertText = this.page.locator('.alert-info', { hasText: 'OISP-' });

        //Form Status
        this.formStatus = this.page.locator('#form-status-text');

        // Main Form
        this.dtpMeetingDate = this.page.locator('[name="meetingDate"]');
        this.dtpStartDate = this.page.locator('[name="startDate"]');
        this.dtpEndDate = this.page.locator('[name="endDate"]');

        //About Me
        this.txtAdmireAboutMe = this.page.frameLocator('iframe[id="aboutMe.admireAboutMe_ifr"]').locator('#tinymce');
        this.txtImportantToMe = this.page.frameLocator('iframe[id="aboutMe.importantToMe_ifr"]').locator('#tinymce');
        this.txtSupportMeBest = this.page.frameLocator('iframe[id="aboutMe.bestSupportMe_ifr"]').locator('#tinymce');

        //Risk
        this.ddlRISKRiskType = this.iframe.locator('[name="risk"]');
        this.txtRISKRiskOther = this.iframe.locator('[name="riskOther"]');
        this.txtRISKComments = this.iframe.locator('[name="comments"]');

        //Risk - Support Document
        this.txtRISKSDDescription = this.iframe.locator('#description');
        this.txtRISKSDWhereKeptHome = this.iframe.locator('[name="whereAtHome"]');
        this.dtpRISKSDDateAtHome = this.iframe.locator('[name="entryDateAtHome"]');
        this.txtRISKSDWhereKeptWork = this.iframe.locator('[name="whereAtWork"]');
        this.dtpRISKSDDateAtWork = this.iframe.locator('[name="entryDateAtWork"]');

        //Professional Service
        this.txtPSName = this.iframe.locator('[name="name"]');
        this.txtPSType = this.iframe.locator('[name="contactType"]');
        this.txtPSOrganization = this.iframe.locator('[name="responsibleOrganization"]');
        this.ddlPSSpecialty = this.iframe.locator('[name="speciality"]');
        this.txtPSSpecialtyOther = this.iframe.locator('[name="specialityOther"]');
        this.txtPSContactInformation = this.iframe.locator('[name="contactInformation"]');
        this.txtPSSpecificReasons = this.iframe.locator('[name="reason"]');
        this.txtPSHowOften = this.iframe.locator('[name="howOften"]');
        this.txtPSWhereToRecord = this.iframe.locator('[name="whereRecord"]');
        this.txtPSNotes = this.iframe.frameLocator('#zzzNotes_ifr').locator('[data-id="zzzNotes"]');

        //Nursing
        this.rdoHasCarePlanAtHomeYes = this.page.locator('[id="nursing.hasCarePlanAtHome1"]');
        this.rdoHasCarePlanAtHomeNo = this.page.locator('[id="nursing.hasCarePlanAtHome2"]');
        this.txtWhereCarePlanAtHome = this.page.locator('[id="nursing.whereCarePlanAtHome"]');
        this.rdoHasCarePlanAtWorkYes = this.page.locator('[id="nursing.hasCarePlanAtWork1"]');
        this.rdoHasCarePlanAtWorkNo = this.page.locator('[id="nursing.hasCarePlanAtWork2"]');
        this.txtWhereCarePlanAtWork = this.page.locator('[id="nursing.whereCarePlanAtWork"]');
        this.rdoHasHealthProblemListYes = this.page.locator('[id="nursing.hasHlthProblemList1"]');
        this.rdoHasHealthProblemListNo = this.page.locator('[id="nursing.hasHlthProblemList2"]');
        this.txtWhereMedicalProblemListAtHome = this.page.locator('[id="nursing.whereListAtHome"]');
        this.txtWhereMedicalProblemListAtWork = this.page.locator('[id="nursing.whereListAtWork"]');
        this.rdoHasHealthCareRepresentativeYes = this.page.locator('[id="nursing.hasHlthRepresentative1"]');
        this.rdoHasHealthCareRepresentativeNo = this.page.locator('[id="nursing.hasHlthRepresentative2"]');
        this.rdoAppointedBySelf = this.page.locator('[id="nursing.representativeAppointedBy1"]');
        this.rdoAppointedByIndividualPlanTeam = this.page.locator('[id="nursing.representativeAppointedBy2"]');
        this.dtpAppointmentDate = this.page.locator('[id="nursing.appointmentDate"]');
        this.txtWhereDocumentLocated = this.page.locator('[id="nursing.representativeLocation"]');

        //Service Support Section
        this.ddlSSTypeOfRequest = this.iframe.locator('[name="typeOfRequest"]');
        this.ddlSSRegion = this.iframe.locator('[name="region"]');
        this.ddlSSFundingSource = this.iframe.locator('[name="fundingSource"]');
        this.ddlSSService = this.iframe.locator('[name="services"]');
        this.ddlSSServiceProvider = this.iframe.locator('[name="serviceProvider"]');
        this.txtSSName = this.iframe.locator('[name="name"]');
        this.txtSSBusinessName = this.iframe.locator('[name="businessName"]');
        this.txtSSOtherServiceProvider = this.iframe.locator('[name="otherServiceProvider"]');
        this.ddlSSReferringProvider = this.iframe.locator('[name="referringProvider"]');
        this.ddlSSAttendingProvider = this.iframe.locator('[name="attendingProvider"]');
        this.txtSSPhysicalAddress = this.iframe.locator('[name="physicalAddress"]');
        this.txtSSMailingAddress = this.iframe.locator('[name="mailingAddress"]');
        this.txtSSPhones = this.iframe.locator('[name="phoneNumbers"]');
        this.dtpSSServiceDateFrom = this.iframe.locator('[name="fromDate"]');
        this.dtpSSServiceDateTo = this.iframe.locator('[name="toDate"]');
        this.txtSSServiceAmount = this.iframe.locator('[name="serviceAmount"]');
        this.ddlSSUnitOfMeasure = this.iframe.locator('[name="unitOfMeasure"]');
        this.ddlSSFrequency = this.iframe.locator('[name="unitFrequency"]');
        this.txtSSTotalUnits = this.iframe.locator('[name="totalUnit"]');
        this.txtSSRate = this.iframe.locator('[name="rate"]');
        this.txtSSCost = this.iframe.locator('[name="cost"]');
        this.btnSSCalculateCost = this.iframe.locator('#calculateCost');
        this.btnSSCalculateTotalUnits = this.iframe.locator('#calculateTotalUnits');
        this.ddlSSAdjudicationReason = this.iframe.locator('[name="adjudicationReason"]');
        this.txtSSNotes = this.iframe.frameLocator('#zzzNotes_ifr').locator('[data-id="zzzNotes"]');

        //Service Requested and Not Available
        this.ddlSRService = this.iframe.locator('[name="service"]');
        this.dtpSRDateRequested = this.iframe.locator('[name="requestDate"]');
        this.ddlSRReasonNotAvailable = this.iframe.locator('[name="reason"]');
        this.txtSRPotentialAlternateSupports = this.iframe.locator('[name="alternateSupports"]');
        this.txtSRComments = this.iframe.locator('[name="comments"]');

        //Service Offered and Declined
        this.ddlSDService = this.iframe.locator('[name="service"]');
        this.dtpSDDateOffered = this.iframe.locator('[name="offerDate"]');
        this.dtpSDDateDeclined = this.iframe.locator('[name="declineDate"]');
        this.ddlSDReasonDeclined = this.iframe.locator('[name="reason"]');
        this.txtSDPotentialAlternateSupports = this.iframe.locator('[name="alternateSupports"]');
        this.txtSDComments = this.iframe.locator('[name="comments"]');

        //Natural Informal Supports
        this.ddlNISSupport = this.iframe.locator('[name="support"]');
        this.ddlNISSupportType = this.iframe.locator('[name="supportType"]');
        this.txtNISSupportRole = this.iframe.locator('[name="supportRole"]');
        this.txtNISProvidedBy = this.iframe.locator('[name="providedBy"]');
        this.ddlNISProviderType = this.iframe.locator('[name="providerType"]');
        this.ddlNISProviderRelationship = this.iframe.locator('[name="providerRelationship"]');
        this.dtpNISSupportStartDate = this.iframe.locator('[name="supportStartDate"]');
        this.txtNISFrequency = this.iframe.locator('[name="frequency"]');
        this.txtNISAmount = this.iframe.locator('[name="amount"]');
        this.txtNISSupportGoals = this.iframe.locator('[name="supportGoals"]');
        this.ddlNISSatisfactionWithSupport = this.iframe.locator('[name="supportSatisfaction"]');
        this.txtNISComments = this.iframe.locator('[name="comments"]');

        //Restriction
        this.ddlHaveAnyRestrictions = this.page.locator('[name="hasRestrictions"]');
        this.ddlRESRestrictionType = this.iframe.locator('[name="restrictionType"]');
        this.dtpRESDateImplemented = this.iframe.locator('[name="restrictionDate"]');
        this.txtRESReason = this.iframe.locator('[name="restrictionReason"]');
        this.txtRESEnvironmentalRiskSupport = this.iframe.locator('[name="environmentalRiskSupport"]');
        this.txtRESCurrentRestrictivePlan = this.iframe.locator('[name="currentRestrictivePlan"]');
        this.txtRESPlansTriedInThePast = this.iframe.locator('[name="pastTriedPlans"]');

        //Action Plan
        this.chkAPActionPlanForEmploymentServices = this.iframe.locator('[name="hasEmploymentService"]');
        this.rdoAPReasonForPlanning1 = this.iframe.locator('#reasonForPlanning1');
        this.rdoAPReasonForPlanning2 = this.iframe.locator('#reasonForPlanning2');
        this.rdoAPReasonForPlanning3 = this.iframe.locator('#reasonForPlanning3');
        this.rdoAPReasonForPlanning4 = this.iframe.locator('#reasonForPlanning4');
        this.rdoAPReasonForPlanning5 = this.iframe.locator('#reasonForPlanning5');
        this.txtAPDesiredOutcome = this.iframe.locator('[name="desiredOutcome"]');
        this.txtAPIssue = this.iframe.frameLocator('#zzzIssue_ifr').locator('[data-id="zzzIssue"]');

        //Action Plan - Action Step
        this.txtAPASDescription = this.iframe.locator('[name="description"]');
        this.chkAPASIsAtHome = this.iframe.locator('[name="hasWhereAtHome"]');
        this.txtAPASHomeResponsiblePerson = this.iframe.locator('[name="responsibleForHome"]');
        this.chkAPASIsAtWork = this.iframe.locator('[name="hasWhereAtWork"]');
        this.txtAPASWorkResponsiblePerson = this.iframe.locator('[name="responsibleForWork"]');
        this.chkAPASIsAtOtherPlace = this.iframe.locator('[name="hasWhereAtOther"]');
        this.txtAPASOtherResponsiblePerson = this.iframe.locator('[name="responsibleForOther"]');
        this.txtAPASHowOften = this.iframe.locator('[name="howOften"]');
        this.txtAPASWhereToRecord = this.iframe.locator('[name="whereToRecord"]');
        this.txtAPASNotes = this.iframe.locator('[name="notes"]');

        //Discussion Record
        this.txtDRNeedIssue = this.iframe.locator('[name="issue"]');
        this.txtDRDiscussion = this.iframe.frameLocator('#zzzDiscussion_ifr').locator('[data-id="zzzDiscussion"]');
        this.txtDRDecision = this.iframe.locator('[name="decision"]');

        //Change Approval Process
        this.txtCAPExceptions = this.page.locator('[name="changeApprovalProcess"]');

        //Participants
        this.ddlPARTeamMember = this.iframe.locator('[name="teamMemberId"]');
        this.txtPAROtherParticipant = this.iframe.locator('[name="tempOtherParticipant"]');
        this.txtPARRelationship = this.iframe.locator('[name="otherRelationship"]');
        this.rdoPARReceiveCopyOfPlanYes = this.iframe.locator('#receivePlanCopy1');
        this.rdoPARReceiveCopyOfPlanNo = this.iframe.locator('#receivePlanCopy2');

        // Reason for Discontinuation
        this.discontinueModal = this.page.locator("#discontinueModal");
        this.txtReasonForDiscontinuation = this.page.locator('[name="reasonForDiscontinue"]');

        // Acknowledge
        this.acknowledgeModal = this.page.locator("#ackModal");
        this.txtAcknowledgeComments = this.page.locator('[name="acknowledgeComments"]');

        // First Change Form Row from Change Form List
        this.rdoFirstActiveChangeForm = this.page.locator('#activeChangeForms tr input[type="radio"]').first();
    }

    // Private helper to fill a field only if visible
    async #fillIfVisible(locator, value) {
        if (value !== undefined && value !== null && await locator.isVisible()) {
            await locator.fill(value);
        }
    }

    // Private helper to select an option only if visible
    async #selectIfVisible(locator, value) {
        if (value !== undefined && value !== null && await locator.isVisible()) {
            await locator.selectOption(value);
        }
    }

    async fillUpForm(data, individualPlanExcelObject) {
        await this.dtpMeetingDate.fill(data.meetingDate);
        await this.dtpStartDate.fill(data.startDate);
        await this.dtpEndDate.fill(data.endDate);

        if (await this.page.locator('#aboutMe').isVisible()) {
            await this.fillUpSectionAboutMe(data);
        }

        if (await this.page.locator('#legalDecisionMaker').isVisible()) {
            await this.fillUpSectionLegalDecisionMaker(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#risk').isVisible()) {
            await this.fillUpSectionRisk(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#profService').isVisible()) {
            await this.fillUpSectionProfessionalService(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#nursing').isVisible()) {
            await this.fillUpSectionNursing(data);
        }

        if (await this.page.locator('#serviceSupport').isVisible()) {
            await this.fillUpSectionServiceSupport(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#serviceRequested').isVisible()) {
            await this.fillUpSectionServiceRequested(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#serviceDeclined').isVisible()) {
            await this.fillUpSectionServiceDeclined(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#informalSupport').isVisible()) {
            await this.fillUpSectionNaturalInformalSupport(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#restriction').isVisible()) {
            await this.ddlHaveAnyRestrictions.selectOption(data.haveAnyRestrictions);
            await this.fillUpSectionRestriction(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#actionPlan').isVisible()) {
            await this.fillUpSectionActionPlan(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#discussionRecord').isVisible()) {
            await this.fillUpSectionDiscussionRecord(data.index, individualPlanExcelObject);
        }

        if (await this.page.locator('#changeApproval').isVisible()) {
            await this.fillUpSectionChangeApprovalProcess(data);
        }

        if (await this.page.locator('#participant').isVisible()) {
            await this.fillUpSectionParticipant(data.index, individualPlanExcelObject);
        }
    }

    async fillUpSectionAboutMe(data) {
        await this.txtAdmireAboutMe.fill(data.admireAboutMe);
        await this.txtImportantToMe.fill(data.importantToMe);
        await this.txtSupportMeBest.fill(data.supportMeBest);
    }

    async fillUpSectionLegalDecisionMaker(ipIndex, individualPlanExcelObject) {
        const legalDecisionMakerData = filterObjects(individualPlanExcelObject.legalDecisionMakerData, [{ "ipIndex": ipIndex }]);

        if (legalDecisionMakerData.length > 0) {
            await this.commonButtons.clickButton('Add/Remove Legal Decision Maker');
            await this.ipChildModal.waitFor({ state: 'visible' });

            for (let i = 0; i < legalDecisionMakerData.length; i++) {
                await this.iframe.locator('tr', { hasText: legalDecisionMakerData[i].name }).locator('input[type="checkbox"]').click();
            }

            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpSectionRisk(ipIndex, individualPlanExcelObject) {
        const riskData = filterObjects(individualPlanExcelObject.riskData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < riskData.length; i++) {
            await this.commonButtons.clickButton('Add Risk');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpRiskData(riskData[i], individualPlanExcelObject.supportDocumentData);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpRiskData(riskData, supportDocumentSheetData = []) {
        const supportDocumentData = filterObjects(supportDocumentSheetData, [{ "riskIndex": riskData.index }]);

        await this.ddlRISKRiskType.selectOption(riskData.riskType || "");
        await this.txtRISKRiskOther.fill(riskData.riskOther ?? "");
        await this.txtRISKComments.fill(riskData.comments ?? "");

        for (let j = 0; j < supportDocumentData.length; j++) {
            await this.commonButtons.clickButton('Add New Support Document', this.iframe);
            await this.fillUpSupportDocumentData(supportDocumentData[j]);
            await this.commonButtons.clickButton('Continue', this.iframe);
        }

        await this.page.waitForLoadState('networkidle');
    }

    async fillUpSupportDocumentData(supportDocument) {
        await this.txtRISKSDDescription.fill(supportDocument.description);
        await this.txtRISKSDWhereKeptHome.fill(supportDocument.whereKeptHome);
        await this.dtpRISKSDDateAtHome.fill(supportDocument.dateAtHome);
        await this.txtRISKSDWhereKeptWork.fill(supportDocument.whereKeptWork);
        await this.dtpRISKSDDateAtWork.fill(supportDocument.dateAtWork);
    }

    async fillUpSectionProfessionalService(ipIndex, individualPlanExcelObject) {
        const professionalServiceData = filterObjects(individualPlanExcelObject.professionalServiceData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < professionalServiceData.length; i++) {
            await this.commonButtons.clickButton('Add Professional Service');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpProfessionalServiceData(professionalServiceData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpProfessionalServiceData(professionalServiceData) {
        await this.txtPSName.fill(professionalServiceData.name);
        await this.txtPSType.fill(professionalServiceData.type);
        await this.txtPSOrganization.fill(professionalServiceData.organization);
        await this.ddlPSSpecialty.selectOption(professionalServiceData.specialty);
        await this.txtPSSpecialtyOther.fill(professionalServiceData.specialtyOther);
        await this.txtPSContactInformation.fill(professionalServiceData.contactInformation);
        await this.txtPSSpecificReasons.fill(professionalServiceData.specificReasons);
        await this.txtPSHowOften.fill(professionalServiceData.howOften);
        await this.txtPSWhereToRecord.fill(professionalServiceData.whereToRecord);
        await this.txtPSNotes.fill(professionalServiceData.notes);
    }

    async fillUpSectionNursing(data) {
        await this.commonUtils.selectRadioOption(data.hasCarePlanAtHome, this.rdoHasCarePlanAtHomeYes, this.rdoHasCarePlanAtHomeNo);
        await this.txtWhereCarePlanAtHome.fill(data.whereCarePlanAtHome);
        await this.commonUtils.selectRadioOption(data.hasCarePlanAtWork, this.rdoHasCarePlanAtWorkYes, this.rdoHasCarePlanAtWorkNo);
        await this.txtWhereCarePlanAtWork.fill(data.whereCarePlanAtWork);
        await this.commonUtils.selectRadioOption(data.hasHealthProblemList, this.rdoHasHealthProblemListYes, this.rdoHasHealthProblemListNo);
        await this.txtWhereMedicalProblemListAtHome.fill(data.whereMedicalProblemListAtHome);
        await this.txtWhereMedicalProblemListAtWork.fill(data.whereMedicalProblemListAtWork);
        await this.commonUtils.selectRadioOption(data.hasHealthCareRepresentative, this.rdoHasHealthCareRepresentativeYes, this.rdoHasHealthCareRepresentativeNo);

        if (["self appointed"].includes(data.appointedBy?.trim().toLowerCase())) {
            await this.rdoAppointedBySelf.check();

        } else if (["individual plan team appointed"].includes(data.appointedBy?.trim().toLowerCase())) {
            await this.rdoAppointedByIndividualPlanTeam.check()
        }

        await this.dtpAppointmentDate.fill(data.appointmentDate);
        await this.txtWhereDocumentLocated.fill(data.whereDocumentLocated);
    }

    async fillUpSectionServiceSupport(ipIndex, individualPlanExcelObject) {
        const serviceSupportData = filterObjects(individualPlanExcelObject.serviceSupportData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < serviceSupportData.length; i++) {
            await this.commonButtons.clickButton('Add Service Support');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpServiceSupportData(serviceSupportData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpServiceSupportData(serviceSupportData) {
        // Wait specifically for the iframe's DOM to attach and render key fields (critical for Firefox)
        await this.ddlSSTypeOfRequest.waitFor({ state: 'visible', timeout: 30000 });

        await this.#selectIfVisible(this.ddlSSTypeOfRequest, serviceSupportData.typeOfRequest);
        await this.#selectIfVisible(this.ddlSSRegion, serviceSupportData.region);
        await this.#selectIfVisible(this.ddlSSService, serviceSupportData.service);
        await this.#selectIfVisible(this.ddlSSFundingSource, serviceSupportData.fundingSource);
        await this.#selectIfVisible(this.ddlSSServiceProvider, serviceSupportData.serviceProvider);

        await this.#fillIfVisible(this.txtSSName, serviceSupportData.name);
        await this.#fillIfVisible(this.txtSSBusinessName, serviceSupportData.businessName);
        await this.#fillIfVisible(this.txtSSOtherServiceProvider, serviceSupportData.otherServiceProvider);

        await this.#selectIfVisible(this.ddlSSReferringProvider, serviceSupportData.referringProvider);
        await this.#selectIfVisible(this.ddlSSAttendingProvider, serviceSupportData.attendingProvider);

        await this.#fillIfVisible(this.txtSSPhysicalAddress, serviceSupportData.physicalAddress);
        await this.#fillIfVisible(this.txtSSMailingAddress, serviceSupportData.mailingAddress);
        await this.#fillIfVisible(this.txtSSPhones, serviceSupportData.phones);
        await this.#fillIfVisible(this.dtpSSServiceDateFrom, serviceSupportData.serviceDateFrom);
        await this.#fillIfVisible(this.dtpSSServiceDateTo, serviceSupportData.serviceDateTo);
        await this.#fillIfVisible(this.txtSSServiceAmount, serviceSupportData.serviceAmount);

        await this.#selectIfVisible(this.ddlSSUnitOfMeasure, serviceSupportData.unitOfMeasure);
        await this.#selectIfVisible(this.ddlSSFrequency, serviceSupportData.frequency);

        await this.#fillIfVisible(this.txtSSTotalUnits, serviceSupportData.totalUnits);
        await this.#fillIfVisible(this.txtSSRate, serviceSupportData.rate);
        await this.#fillIfVisible(this.txtSSCost, serviceSupportData.cost);

        await this.#selectIfVisible(this.ddlSSAdjudicationReason, serviceSupportData.adjudicationReason);

        await this.#fillIfVisible(this.txtSSNotes, serviceSupportData.notes);
    }

    async fillUpSectionServiceRequested(ipIndex, individualPlanExcelObject) {
        const serviceRequestedData = filterObjects(individualPlanExcelObject.serviceRequestedData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < serviceRequestedData.length; i++) {
            await this.commonButtons.clickButton('Add Requested Service');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpServiceRequestedData(serviceRequestedData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpServiceRequestedData(serviceRequestedData) {
        await this.ddlSRService.selectOption(serviceRequestedData.service);
        await this.dtpSRDateRequested.fill(serviceRequestedData.dateRequested);
        await this.ddlSRReasonNotAvailable.selectOption(serviceRequestedData.reasonNotAvailable);
        await this.txtSRPotentialAlternateSupports.fill(serviceRequestedData.potentialAlternateSupports);
        await this.txtSRComments.fill(serviceRequestedData.comments);
    }

    async fillUpSectionServiceDeclined(ipIndex, individualPlanExcelObject) {
        const serviceDeclinedData = filterObjects(individualPlanExcelObject.serviceDeclinedData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < serviceDeclinedData.length; i++) {
            await this.commonButtons.clickButton('Add Declined Service');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpServiceDeclinedData(serviceDeclinedData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpServiceDeclinedData(serviceDeclinedData) {
        await this.ddlSDService.selectOption(serviceDeclinedData.service);
        await this.dtpSDDateOffered.fill(serviceDeclinedData.dateOffered);
        await this.dtpSDDateDeclined.fill(serviceDeclinedData.dateDeclined);
        await this.ddlSDReasonDeclined.selectOption(serviceDeclinedData.reasonDeclined);
        await this.txtSDPotentialAlternateSupports.fill(serviceDeclinedData.potentialAlternateSupports);
        await this.txtSDComments.fill(serviceDeclinedData.comments);
    }

    async fillUpSectionNaturalInformalSupport(ipIndex, individualPlanExcelObject) {
        const naturalInformalSupportData = filterObjects(individualPlanExcelObject.naturalInformalSupportData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < naturalInformalSupportData.length; i++) {
            await this.commonButtons.clickButton('Add Natural/Informal Support');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpNaturalInformalSupportData(naturalInformalSupportData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpNaturalInformalSupportData(naturalInformalSupportData) {
        await this.ddlNISSupport.selectOption(naturalInformalSupportData.support);
        await this.ddlNISSupportType.selectOption(naturalInformalSupportData.supportType);
        await this.txtNISSupportRole.fill(naturalInformalSupportData.supportRole);
        await this.txtNISProvidedBy.fill(naturalInformalSupportData.providedBy);
        await this.ddlNISProviderType.selectOption(naturalInformalSupportData.providerType);
        await this.ddlNISProviderRelationship.selectOption(naturalInformalSupportData.providerRelationship);
        await this.dtpNISSupportStartDate.fill(naturalInformalSupportData.supportStartDate);
        await this.txtNISFrequency.fill(naturalInformalSupportData.frequency);
        await this.txtNISAmount.fill(naturalInformalSupportData.amount);
        await this.txtNISSupportGoals.fill(naturalInformalSupportData.supportGoals);
        await this.ddlNISSatisfactionWithSupport.selectOption(naturalInformalSupportData.satisfactionWithSupport);
        await this.txtNISComments.fill(naturalInformalSupportData.comments);
    }

    async fillUpSectionRestriction(ipIndex, individualPlanExcelObject) {
        const restrictionData = filterObjects(individualPlanExcelObject.restrictionData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < restrictionData.length; i++) {
            await this.commonButtons.clickButton('Add Restriction');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpRestrictionData(restrictionData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpRestrictionData(restrictionData) {
        await this.ddlRESRestrictionType.selectOption(restrictionData.restrictionType);
        await this.dtpRESDateImplemented.fill(restrictionData.dateImplemented);
        await this.txtRESReason.fill(restrictionData.reason);
        await this.txtRESEnvironmentalRiskSupport.fill(restrictionData.environmentalRiskSupport);
        await this.txtRESCurrentRestrictivePlan.fill(restrictionData.currentRestrictivePlan);
        await this.txtRESPlansTriedInThePast.fill(restrictionData.plansTriedInThePast);
    }

    async fillUpSectionActionPlan(ipIndex, individualPlanExcelObject) {
        const actionPlanData = filterObjects(individualPlanExcelObject.actionPlanData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < actionPlanData.length; i++) {
            await this.commonButtons.clickButton('Add Action Plan');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpActionPlanData(actionPlanData[i], individualPlanExcelObject.actionStepData, individualPlanExcelObject.actionPlanIspProgramData);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpActionPlanData(actionPlanData, actionStepSheetData, ispProgramSheetData) {
        const actionStepData = filterObjects(actionStepSheetData, [{ "actionPlanIndex": actionPlanData.index }]);
        const ispProgramData = filterObjects(ispProgramSheetData, [{ "actionPlanIndex": actionPlanData.index }]);
        const reasonForPlanning = actionPlanData.reasonForPlanning?.trim().toLowerCase();

        await this.txtAPDesiredOutcome.waitFor({ state: 'visible' });

        if (["yes", "y"].includes(actionPlanData.actionPlanForEmploymentServices?.trim().toLowerCase())) {
            await this.chkAPActionPlanForEmploymentServices.check();
        }

        if (reasonForPlanning != null) {
            if (reasonForPlanning == "i am making a plan to maintain or improve my current job.") {
                await this.rdoAPReasonForPlanning1.check();

            } else if (reasonForPlanning == "i want to get a job in the next year.") {
                await this.rdoAPReasonForPlanning2.check();

            } else if (reasonForPlanning == "i want to discover more about work and my skills and get a job in the next two years.") {
                await this.rdoAPReasonForPlanning3.check();

            } else if (reasonForPlanning == "i don't want to work right now.") {
                await this.rdoAPReasonForPlanning4.check();

            } else if (reasonForPlanning == "i am in school and planning for work after graduation.") {
                await this.rdoAPReasonForPlanning5.check();
            }
        }

        await this.txtAPDesiredOutcome.fill(actionPlanData.desiredOutcome);
        await this.txtAPIssue.fill(actionPlanData.issue);

        for (let j = 0; j < actionStepData.length; j++) {
            const btnAddActionStep = this.commonButtons.getButtonLocator('Add New Action Step', this.iframe);
            await btnAddActionStep.waitFor({ state: 'visible' });
            await btnAddActionStep.click();

            await this.fillUpActionStepData(actionStepData[j]);
            await this.commonButtons.clickButton('Continue', this.iframe);

            await this.txtAPASDescription.waitFor({ state: 'hidden' });
            await this.txtAPDesiredOutcome.waitFor({ state: 'visible' });
        }

        for (let j = 0; j < ispProgramData.length; j++) {
            const btnLinkIsp = this.commonButtons.getButtonLocator('Link ISP Program', this.iframe);
            await btnLinkIsp.waitFor({ state: 'visible' });
            await btnLinkIsp.click();

            const btnSearch = this.commonButtons.getButtonLocator('Search', this.iframe);
            await btnSearch.waitFor({ state: 'visible' });
            await btnSearch.click();

            await this.iframe.locator('table.dataTable, table > tbody > tr').first().waitFor({ state: 'visible' });

            await this.listPage.selectFilteredFirstItem(ispProgramData[j].ispProgramName, this.iframe);
            await this.commonButtons.clickButton('Add', this.iframe);

            await this.txtAPDesiredOutcome.waitFor({ state: 'visible' });
        }

        await this.page.waitForLoadState('networkidle');
    }

    async fillUpActionStepData(actionStep) {
        await this.chkAPASIsAtHome.waitFor({ state: 'visible', timeout: 30000 });

        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkAPASIsAtHome, actionStep.isAtHome);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkAPASIsAtWork, actionStep.isAtWork);
        await this.commonUtils.toggleCheckboxUsingLocator(this.page, this.chkAPASIsAtOtherPlace, actionStep.isAtOtherPlace);

        await this.txtAPASDescription.fill(actionStep.description);
        await this.txtAPASHomeResponsiblePerson.fill(actionStep.homeResponsiblePerson);
        await this.txtAPASWorkResponsiblePerson.fill(actionStep.workResponsiblePerson);
        await this.txtAPASOtherResponsiblePerson.fill(actionStep.otherResponsiblePerson);
        await this.txtAPASHowOften.fill(actionStep.howOften);
        await this.txtAPASWhereToRecord.fill(actionStep.whereToRecord);
        await this.txtAPASNotes.fill(actionStep.notes);
    }

    async fillUpSectionDiscussionRecord(ipIndex, individualPlanExcelObject) {
        const discussionRecordData = filterObjects(individualPlanExcelObject.discussionRecordData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < discussionRecordData.length; i++) {
            await this.commonButtons.clickButton('Add Discussion Record');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillUpDiscussionRecordData(discussionRecordData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillUpDiscussionRecordData(discussionRecordData) {
        await this.txtDRNeedIssue.fill(discussionRecordData.needIssue);
        await this.txtDRDiscussion.fill(discussionRecordData.discussion);
        await this.txtDRDecision.fill(discussionRecordData.decision);
    }

    async fillUpSectionChangeApprovalProcess(data) {
        await this.txtCAPExceptions.fill(data.exceptions);
    }

    async fillUpSectionParticipant(ipIndex, individualPlanExcelObject) {
        const participantData = filterObjects(individualPlanExcelObject.participantData, [{ "ipIndex": ipIndex }]);

        for (let i = 0; i < participantData.length; i++) {
            await this.commonButtons.clickButton('Add Participant');
            await this.ipChildModal.waitFor({ state: 'visible' });
            await this.fillParticipantData(participantData[i]);
            await this.commonButtons.clickButton('Continue', this.iframe);
            await this.ipChildModal.waitFor({ state: 'hidden' });
        }
    }

    async fillParticipantData(participantData) {
        await this.ddlPARTeamMember.selectOption(participantData.teamMember);
        await this.txtPAROtherParticipant.fill(participantData.otherParticipant);
        await this.txtPARRelationship.fill(participantData.relationship);
        await this.commonUtils.selectRadioOption(participantData.receiveCopyOfPlan, this.rdoPARReceiveCopyOfPlanYes, this.rdoPARReceiveCopyOfPlanNo);
    }

    async fetchAlertMessage() {
        const message = await this.alertText.innerText();
        return message ? message.trim() : null;
    }

    async verifyPartialAlertMessage(expectedMessage) {
        const actualMessage = await this.fetchAlertMessage();
        expect(actualMessage.toLowerCase()).toContain(expectedMessage.trim().toLowerCase());
    }

    async navigateToNewForm(planTemplateName, individualName, forced = true) {
        await this.commonUtils.navigateToDashboardLink('Individual', planTemplateName, 'New');
        await this.listPage.selectFilteredFirstItem(individualName);

        if (this.page.url().includes('Lister')) {
            const blockingStatuses = ['Draft', 'Pending Approval'];

            for (const status of blockingStatuses) {
                if (await this.listPage.isItemExist(status)) {
                    if (forced) {
                        await this.listPage.selectFilteredFirstItem(status);
                        await this.commonButtons.clickButton('Delete');
                        await this.commonButtons.clickButton('Yes');
                        await this.donePage.clickLinkByText('List');
                        break;
                    } else {
                        throw new Error(`A '${status}' ${planTemplateName} already exists for this ${individualName}.`);
                    }
                }
            }

            await this.commonButtons.clickButton('Create New');
        }
    }

    async executeDiscontinueAction(reasonForDiscontinuation) {
        await this.commonButtons.clickButton('Discontinue');
        await this.txtReasonForDiscontinuation.fill(reasonForDiscontinuation);
        await this.commonButtons.clickButton('Discontinue', this.discontinueModal);
        await this.commonButtons.clickButton('Yes');
    }

    async executeAcknowledgeAction(comments) {
        await this.commonButtons.clickButton('Acknowledge');
        await this.txtAcknowledgeComments.fill(comments);
        await this.commonButtons.clickButton('Acknowledge', this.acknowledgeModal);
    }

    async searchAndOpenFormUsingFormId(formId) {
        await this.commonUtils.navigateToDashboardLink('Individual', 'Individual Plan', 'Search');
        await this.searchPage.searchForm({ formId: formId });
        await this.listPage.clickFirstListItem();
    }

    //Select First Change Form from Change Form List Page while Updating Individual Plan
    async selectFirstChangeForm() {
        await this.rdoFirstActiveChangeForm.check();
        await this.commonButtons.clickButton('Select');
    }

    /**
     * Navigates to a new form for a given plan template and individual.
     * By default, forcibly deletes existing blocking items ('Draft', 'Pending Approval').
     *
     * @param {string} planTemplateName - The name/type of the plan template.
     * @param {string} individualName - The name or identifier of the target individual.
     * @param {boolean} [forced=true] - Optional. Defaults to true to delete blocking items. If false, throws an error when a blocking item exists.
     * @throws {Error} Throws an error if a blocking item exists and `forced` is explicitly set to false.
     * @returns {Promise<void>} Resolves when navigation to the form is complete.
     */
    async createFormByStatus(data, individualPlanExcelObject) {
        await this.navigateToNewForm(data.planTemplateName, data.individualName);
        await this.fillUpForm(data, individualPlanExcelObject);

        switch (data.formStatus.toLowerCase()) {

            case 'draft':
                await this.commonButtons.clickButton('Save');
                await this.donePage.verifyPartialDoneMessage('successfully saved');
                break;

            case 'pending approval':
                await this.commonButtons.clickButton('Submit');
                await this.donePage.verifyPartialDoneMessage('successfully submitted');
                break;

            case 'approved':
                await this.commonButtons.clickButton('Approve');
                await this.donePage.verifyPartialDoneMessage('successfully approved');
                break;

            case 'deleted':
                await this.commonButtons.clickButton('Save');
                await this.donePage.clickLinkByText('Form');
                await this.commonButtons.clickButton('Delete');
                await this.commonButtons.clickButton('Yes');
                await this.donePage.verifyPartialDoneMessage('successfully deleted');
                break;

            case 'discontinued':
                await this.commonButtons.clickButton('Approve');
                await this.donePage.clickLinkByText('Form');
                await this.executeDiscontinueAction(data.reasonForDiscontinuation);
                await this.donePage.verifyPartialDoneMessage('successfully discontinued');
                break;
        }
        await this.donePage.clickLinkByText("Form");
    }

    async deleteOrDiscontinueForm(reasonForDiscontinuation) {
        reasonForDiscontinuation = reasonForDiscontinuation?.trim() || 'Demo Reason';

        if (await this.commonButtons.isButtonPresent('Delete')) {
            await this.commonButtons.clickButton('Delete');
            await this.commonButtons.clickButton('Yes');
            await this.donePage.verifyPartialDoneMessage('successfully deleted');

        } else if (await this.commonButtons.isButtonPresent('Discontinue')) {
            await this.executeDiscontinueAction(reasonForDiscontinuation);
            await this.donePage.verifyPartialDoneMessage('successfully discontinued');

        } else {
            throw new Error('No delete or discontinue button found');
        }
        await this.donePage.clickLinkByText("Form");
    }
}