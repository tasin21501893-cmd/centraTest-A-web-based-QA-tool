/**
 * @author Nadia Motalib Laboni
 * @since 07/20/2025
 */

const { CommonButtons } = require("../../commonUtility/commonButtons.js");
const { CommonUtils } = require("../../commonUtility/commonUtils.js");
const { DateTimeUtils } = require("../../commonUtility/dateTimeUtils.js");

exports.GerResolutionPage = class GerResolutionPage {

    constructor(page) {
        this.page = page;
        this.dtpDateOpened = page.locator('input[name="dateOpened"]');
        this.dtpDateClosed = page.locator('input[name="dateClosed"]');
        this.rdoCriticalEventYes = page.locator('input[name="criticalEvent"][value="true"]');
        this.rdoCriticalEventNo = page.locator('input[name="criticalEvent"][value="false"]');
        this.rdoInvestigationNeededYes = page.locator('input[name="investigationNeeded"][value="true"]');
        this.rdoInvestigationNeededNo = page.locator('input[name="investigationNeeded"][value="false"]');
        this.ddlAneTypes = page.locator('select[name="aneTypes"]');
        this.ddlFindings = page.locator('select[name="findings"]');

        this.ddlInvestigatorName = page.locator('select[name="tmpInvestigator.person"]');
        this.txtInvestigatorOther = page.locator('input[name="tmpInvestigator.personOther"]');
        this.ddlInvestigatorAssignedBy = page.locator('select[name="tmpInvestigator.assignedBy"]');
        this.txtInvestigatorAssignedByOther = page.locator('input[name="tmpInvestigator.assignedByOther"]');
        this.dtpInvestigatorAssignedDate = page.locator('input[name="tmpInvestigator.assignedDate"]');
        this.txtInvestigatorComment = page.locator('textarea[name="tmpInvestigator.comments"]');
        this.btnAddInvestigator = page.locator('input[name="addInvestigator"]');

        this.ddlInvestigatorNarrativeActionType = page.locator('select[name="tmpInvestigatorComment.actionType"]');
        this.txtInvestigatorNarrativeActionTypeOther = page.locator('input[name="tmpInvestigatorComment.actionTypeOther"]');
        this.ifrInvestigatorNarrativeFrameLocator = page.frameLocator('iframe[id^="tmpInvestigatorComment.comments"]').locator('#tinymce');
        this.btnAddInvestigatorNarrative = page.locator('input[name="addInvestigatorComment"]');

        this.ddlInvolvedPersonName = page.locator('select[name="tmpInvolvedPerson.person"]');
        this.txtInvolvedPersonNameOther = page.locator('input[name="tmpInvolvedPerson.personOther"]');
        this.ddlInvolvementType = page.locator('select[name="tmpInvolvedPerson.involvementType"]');
        this.txtInvolvedPersonComment = page.locator('textarea[name="tmpInvolvedPerson.comments"]');
        this.btnAddInvolvedPerson = page.locator('input[name="addInvolvedPerson"]');

        this.ifrResolutionSummaryNarrativeFrameLocator = page.frameLocator('iframe[id^="investigationNarrative"]').locator('#tinymce');
        this.ifrResolutionNoteFrameLocator = page.frameLocator('iframe[id^="notes"]').locator('#tinymce');
        this.ifrResolutionStaffActionFrameLocator = page.frameLocator('iframe[id^="staffActions"]').locator('#tinymce');

        this.ddlRecommendBy = page.locator('select[name="tmpRecommendation.recommendedBy"]');
        this.txtRecommendByOther = page.locator('input[name="tmpRecommendation.recommendedByOther"]');
        this.dtpRecommendDate = page.locator('input[name="tmpRecommendation.recommendationDate"]');
        this.ddlPersonResponsible = page.locator('select[name="tmpRecommendation.personResponsible"]');
        this.txtPersonResponsibleOther = page.locator('input[name="tmpRecommendation.personResponsibleOther"]');
        this.dtpCompleteDate = page.locator('input[name="tmpRecommendation.completionDate"]');
        this.txtRecommendation = page.locator('textarea[name="tmpRecommendation.recommendations"]');
        this.btnAddRecommendation = page.locator('input[name="addRecommendation"]');

        this.txtComment = page.locator('textarea[name="tmpComment.comments"]');
        this.btnAddComment = page.locator('input[name="addComment"]');

        this.ifrRootCauseFrameLocator = page.frameLocator('iframe[id^="rootCause"]').locator('#tinymce');

        this.errMsgDateOpened = page.locator('#dateOpened\\.errors');
        this.errMsgDateClosed = page.locator('#dateClosed\\.errors');
        this.errMsgCriticalEvent = page.locator('#criticalEvent\\.errors');
        this.errMsgInvestigationNeeded = page.locator('#investigationNeeded\\.errors');

        this.errMsgInvestigatorName = page.locator('#tmpInvestigator-personError');
        this.errMsgInvestigatorNameOther = page.locator('#tmpInvestigator-personOtherError');
        this.errMsgInvestigatorAssignByOther = page.locator('#tmpInvestigator-assignedByOtherError');
        this.errMsgInvestigatorAssignDate = page.locator('#tmpInvestigator-assignedDateError');
        this.errMsgInvestigatorComment = page.locator('#tmpInvestigator-commentsError');

        this.errMsgActionType = page.locator('#tmpInvestigatorComment-actionTypeError');
        this.errMsgActionTypeOther = page.locator('#tmpInvestigatorComment-actionTypeOtherError');
        this.errMsgInvestigatorNarrativeComment = page.locator('#tmpInvestigatorComment-commentsError');

        this.errMsgInvolvedPersonName = page.locator('#tmpInvolvedPerson-personError');
        this.errMsgInvolvedPersonNameOther = page.locator('#tmpInvolvedPerson-personOtherError');
        this.errMsgInvolvementType = page.locator('#tmpInvolvedPerson-involvementTypeError');
        this.errMsgInvolvedPersonComment = page.locator('#tmpInvolvedPerson-commentsError');

        this.errMsgNarrative = page.locator('#investigationNarrative\\.errors');
        this.errMsgNote = page.locator('#notes\\.errors');
        this.errMsgStaffAction = page.locator('#staffActions\\.errors');

        this.errMsgRecommendBy = page.locator('#tmpRecommendation-recommendedByError');
        this.errMsgRecommendByOther = page.locator('#tmpRecommendation-recommendedByOtherError');
        this.errMsgRecommendDate = page.locator('#tmpRecommendation-recommendationDateError');
        this.errMsgPersonResponsibleOther = page.locator('#tmpRecommendation-personResponsibleOtherError');
        this.errMsgCompleteDate = page.locator('#tmpRecommendation-completionDateError');
        this.errMsgRecommendation = page.locator('#tmpRecommendation-recommendationsError');

        this.errMsgComment = page.locator('#tmpComment-commentsError');
        this.errMsgRootCause = page.locator('#rootCause\\.errors');

        this.globErrMsg = page.locator('.alert-danger');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.dateTimeUtils = new DateTimeUtils(page);
    }

    async createNewGerr(data) {
        await this._fillGeneralInformationSection(data);
        await this._fillInvestigatorsSection(data);
        await this._fillInvestigatorNarrativeSection(data);
        await this._fillInvolvedPersonSection(data);
        await this._fillResolutionSummarySection(data);
        await this._fillRecommendationSection(data);
        await this._fillCommentSection(data);
        await this._fillRootCauseSection(data);
        await this._performAction(data);
    }

    async _fillGeneralInformationSection(data) {
        await this._enterOpenDate(data.openDate);
        await this._enterCloseDate(data.closeDate);
        await this._checkWasCriticalEvent(data.criticalEvent);
        await this._checkInvestigationNeeded(data.investigationNeeded);

        if (data.aneTypes) {
            await this._selectANETypes(data.aneTypes);
        }

        if (data.findingTypes) {
            await this._selectFindings(data.findingTypes);
        }
    }

    async _fillInvestigatorsSection(data) {
        await this._selectInvestigatorName(data.investigatorName, data.investigatorNameOther);
        await this._selectInvestigatorAssignedBy(data.investigatorAssignedBy, data.investigatorAssignedByOther);
        await this._enterInvestigatorAssignDate(data.investigatorAssignedDate);
        await this._enterInvestigatorComment(data.investigatorCommentLength, data.investigatorComment);
        await this.btnAddInvestigator.click();
    }

    async _fillInvestigatorNarrativeSection(data) {
        await this._selectInvestigatorNarrativeActionType(data.investigatorActionType, data.investigatorActionTypeOther);
        await this._enterInvestigatorNarrativeComment(data.investigatorNarrativeCommentLength, data.investigatorNarrativeComment);
        await this.btnAddInvestigatorNarrative.click();
    }

    async _fillInvolvedPersonSection(data) {
        await this._selectInvolvedPersonName(data.involvedPersonName, data.involvedPersonNameOther);
        await this._selectInvolvementType(data.involvementType);
        await this._enterInvolvedPersonComment(data.involvedPersonCommentLength, data.involvedPersonComment);
        await this.btnAddInvolvedPerson.click();
    }

    async _fillResolutionSummarySection(data) {
        await this._enterResolutionSummaryNarrative(data.resolutionSummaryNarrativeLength, data.resolutionSummaryNarrative);
        await this._enterResolutionNote(data.resolutionNoteLength, data.resolutionNote);
        await this._enterResolutionStaffAction(data.resolutionStaffActionLength, data.resolutionStaffAction);
    }

    async _fillRecommendationSection(data) {
        await this._selectRecommendBy(data.recommendBy, data.recommendByOther);
        await this._enterRecommendDate(data.recommendDate);
        await this._selectPersonResponsible(data.personResponsible, data.personResponsibleOther);
        await this._enterDateComplete(data.dateComplete);
        await this._enterRecommendation(data.recommendationLength, data.recommendation);
        await this.btnAddRecommendation.click();
    }

    async _fillCommentSection(data) {
        await this._enterComment(data.commentLength, data.comment);
        await this.btnAddComment.click();
    }

    async _fillTextArea(textLength, text, textAreaLocator) {
        if (textLength > 0) {
            text = await this.commonUtils.generateString(textLength);
        }
        await textAreaLocator.fill(text);
    }

    async _selectMultipleOption(options, dropdownLocator) {
        const optionValues = await this.commonUtils.parseCommaSeparatedList(options);
        await dropdownLocator.selectOption(optionValues);
    }

    async _selectSingleSelectOption(option, dropdownLocator, optionOther = null, dropdownLocatorOther = null) {
        if (!option || option.toString().trim() === "") {
            return;
        }

        await dropdownLocator.selectOption(option);

        if (option.toLowerCase() === 'other') {
            await dropdownLocatorOther.fill(optionOther);
        }
    }

    async _fillRootCauseSection(data) {
        await this._fillTextArea(data.rootCauseLength, data.rootCause, this.ifrRootCauseFrameLocator);
    }

    async _enterOpenDate(openDate) {
        openDate = await this.dateTimeUtils.getDate(openDate);
        await this.dtpDateOpened.fill(openDate);
    }

    async _enterCloseDate(closeDate) {
        closeDate = await this.dateTimeUtils.getDate(closeDate);
        await this.dtpDateClosed.fill(closeDate);
    }

    async _checkWasCriticalEvent(criticalEventVal) {
        await this.commonUtils.selectRadioOption(criticalEventVal, this.rdoCriticalEventYes, this.rdoCriticalEventNo);
    }

    async _checkInvestigationNeeded(investigationNeededVal) {
        await this.commonUtils.selectRadioOption(investigationNeededVal, this.rdoInvestigationNeededYes, this.rdoInvestigationNeededNo);
    }

    async _selectANETypes(aneTypes) {
        await this._selectMultipleOption(aneTypes, this.ddlAneTypes);
    }

    async _selectFindings(findingTypes) {
        await this._selectMultipleOption(findingTypes, this.ddlFindings);
    }

    async _selectInvestigatorName(investigatorName, investigatorNameOther) {
        await this._selectSingleSelectOption(investigatorName, this.ddlInvestigatorName, investigatorNameOther, this.txtInvestigatorOther);
    }

    async _selectInvestigatorAssignedBy(investigatorAssignedBy, investigatorAssignedByOther) {
        await this._selectSingleSelectOption(investigatorAssignedBy, this.ddlInvestigatorAssignedBy, investigatorAssignedByOther, this.txtInvestigatorAssignedByOther);
    }

    async _enterInvestigatorAssignDate(investigatorAssignedDate) {
        investigatorAssignedDate = await this.dateTimeUtils.getDate(investigatorAssignedDate);
        await this.dtpInvestigatorAssignedDate.fill(investigatorAssignedDate);
    }

    async _enterInvestigatorComment(investigatorCommentLength, investigatorComment) {
        await this._fillTextArea(investigatorCommentLength, investigatorComment, this.txtInvestigatorComment);
    }

    async _selectInvestigatorNarrativeActionType(investigatorActionType, investigatorActionTypeOther) {
        await this._selectSingleSelectOption(investigatorActionType, this.ddlInvestigatorNarrativeActionType, investigatorActionTypeOther, this.txtInvestigatorNarrativeActionTypeOther);
    }

    async _enterInvestigatorNarrativeComment(investigatorNarrativeCommentLength, investigatorNarrativeComment) {
        await this._fillTextArea(investigatorNarrativeCommentLength, investigatorNarrativeComment, this.ifrInvestigatorNarrativeFrameLocator);
    }

    async _selectInvolvedPersonName(involvedPersonName, involvedPersonNameOther) {
        await this._selectSingleSelectOption(involvedPersonName, this.ddlInvolvedPersonName, involvedPersonNameOther, this.txtInvolvedPersonNameOther);
    }

    async _selectInvolvementType(involvementType) {
        await this._selectSingleSelectOption(involvementType, this.ddlInvolvementType);
    }

    async _enterInvolvedPersonComment(involvedPersonCommentLength, involvedPersonComment) {
        await this._fillTextArea(involvedPersonCommentLength, involvedPersonComment, this.txtInvolvedPersonComment);
    }

    async _enterResolutionSummaryNarrative(resolutionSummaryNarrativeLength, resolutionSummaryNarrative) {
        await this._fillTextArea(resolutionSummaryNarrativeLength, resolutionSummaryNarrative, this.ifrResolutionSummaryNarrativeFrameLocator);
    }

    async _enterResolutionNote(resolutionNoteLength, resolutionNote) {
        await this._fillTextArea(resolutionNoteLength, resolutionNote, this.ifrResolutionNoteFrameLocator);
    }

    async _enterResolutionStaffAction(resolutionStaffActionLength, resolutionStaffAction) {
        await this._fillTextArea(resolutionStaffActionLength, resolutionStaffAction, this.ifrResolutionStaffActionFrameLocator);
    }

    async _selectRecommendBy(recommendBy, recommendByOther) {
        await this._selectSingleSelectOption(recommendBy, this.ddlRecommendBy, recommendByOther, this.txtRecommendByOther);
    }

    async _enterRecommendDate(recommendDate) {
        recommendDate = await this.dateTimeUtils.getDate(recommendDate);
        await this.dtpRecommendDate.fill(recommendDate);
    }

    async _selectPersonResponsible(personResponsible, personResponsibleOther) {
        await this._selectSingleSelectOption(personResponsible, this.ddlPersonResponsible, personResponsibleOther, this.txtPersonResponsibleOther);
    }

    async _enterDateComplete(dateComplete) {
        dateComplete = await this.dateTimeUtils.getDate(dateComplete);
        await this.dtpCompleteDate.fill(dateComplete);
    }

    async _enterRecommendation(recommendationLength, recommendation) {
        await this._fillTextArea(recommendationLength, recommendation, this.txtRecommendation);
    }

    async _enterComment(commentLength, comment) {
        await this._fillTextArea(commentLength, comment, this.txtComment);
    }

    async _performAction(data) {
        switch ((data.actionValue).toLowerCase()) {
            case 'save':
                await this.commonButtons.clickButton('Save');
                break;

            case 'delete':
                await this.commonButtons.clickButton('Delete');
                await this.commonButtons.clickButton('Yes');
                break;

            case 'close':
                await this.commonButtons.clickButton('Close');
                await this.commonButtons.clickButton('Yes');
                break;

            default:
                break;
        }
    }
}