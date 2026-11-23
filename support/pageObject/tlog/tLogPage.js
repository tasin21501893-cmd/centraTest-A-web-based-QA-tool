/**
 * @author Akash Ahmed
 * @since 17/08/25
 */

import { expect } from '@playwright/test'

import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';

import { NotificationProfilePage } from '../../pageObject/notification/notificationProfilePage.js';

export class TLogPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.attachment = new AttachmentUtils(page);

        this.txtSummary = page.locator('[name = "summary"]');
        this.txtDescription = page.locator('#description');
        this.dtpTimeIn = page.locator('[name = "timeIn"]');
        this.dtpTimeOut = page.locator('[name = "timeOut"]');
        this.atcReporter = page.locator('#reportedByLookup');
        this.dtpReportedOn = page.locator('[name = "reportDate"]');
        this.atcFirstReporter = page.locator('.ui-menu-item-wrapper').first();
        this.btnDelete = page.locator('[name = "_action_delete"]');
        this.modalDescriptionPanel = page.locator('div.modal-body.panel-body');
        this.txtStatusPrimary = page.locator('span.status.text-primary');
        this.txtStatusDanger = page.locator('span.status.text-danger');
        this.txtDeleteComments = page.locator('[name = "deleteComments"]');
        this.txtFormId = page.locator('[name = "formId"]');
        this.ddlNotifLevel = page.locator('[name="notifLevel"]');
        this.txtHeaderLocator = page.locator('.page-header #title');
        this.dtpCreatedFrom = page.locator('[name="createdFrom"]');
        this.dtpCreatedTo = page.locator('[name="createdTo"]');

        this.errMsgExtraCharacters = page.locator('.text-counter-wrapper.error .text-danger');
        this.errMsgTimeOut = page.locator('#timeOut\\.errors');
        this.errMsgReportDate = page.locator('#reportDate\\.errors');
        this.errMsgPhotoUpload = page.locator('#imageId-image-upload .has-error .help-block');
        this.errMsgFileUpload = page.locator('.global-error-div .alert.alert-danger');
        this.errMsgDeleteComment = page.locator('#deleteComments\\.errors');
        this.errMsgCharacterCount = page.locator('.text-counter-wrapper .text-danger');
        this.errTLogCmd = page.locator('#tlogCmd\\.errors');
        this.errMsgWarning = page.locator('#tlogCmd > div.alert.alert-warning');
    }

    async isProgramAndIndividualExist(data) {

        if ((await this.txtHeaderLocator.textContent())?.trim() === 'Select Program For T-Log') {
            await this.listPage.selectProgramFromProgramList(data.programName, data.siteName);
        }

        if (CommonUtils.isAffirmative(data.TLogWithoutIDF)) {
            const linkToCreateTLogWithoutIDF = this.page.getByRole('link', { name: 'Create T-Log without an Individual' });

            if (await this.commonUtils.isElementAvailable(linkToCreateTLogWithoutIDF)) {
                await linkToCreateTLogWithoutIDF.click();
                return;
            }

            throw new Error("'Create T-Log without an Individual' Not Exists.");
        }

        await this.listPage.selectIndividualFromIndividualList(data);
    }

    async fillUpTLogForm(data) {

        if (data.types) {
            const typeArray = data.types.split(',').map(type => type.trim());
            for (const typeValue of typeArray) {
                const formattedType = typeValue.charAt(0).toUpperCase() + typeValue.slice(1).toLowerCase();
                await this.commonUtils.selectCheckboxUsingFieldName(this.page, formattedType);
            }
        }

        // By default Low is seleted, if empty data is provided, Low will remain selected
        if (data.notificationLevel) {
            await this.ddlNotifLevel.selectOption(data.notificationLevel);
        }

        await this.txtSummary.fill(data.summary);
        if (data.descriptionNumberOfCharacters) {
			await this.txtDescription.fill(await this.commonUtils.generateString(data.descriptionNumberOfCharacters));
		}

        // To check if the TimeIn and TimeOut field is disabled from Provider Configuration
        if (await this.commonUtils.isElementAvailable(this.dtpTimeIn)) {
            await this.dtpTimeIn.fill(data.timeIn);
            await this.dtpTimeOut.fill(data.timeOut);
        }

        // Max field validation: reporter + reportedOn
        if (data.reporter) {
            await this.atcReporter.fill(data.reporter);

            try {
                await expect(this.atcFirstReporter).toBeVisible();
                await this.atcFirstReporter.click();
            } catch (error) {
                throw new Error(`Reporter "${data.reporter}" does not exist or no suggestion appeared.`);
            }

            await this.dtpReportedOn.fill(data.reportedOn);

            if (data.fileName) {
                await this.attachment.addAttachment({ fileName: data.fileName, isDocumentLookup: data.isDocumentLookup });
            }

            if (data.imageName) {
                await this.attachment.addImage({ fileName: data.imageName });
            }

        }
    }

    async navigateAndFillTLog(data) {
        await this.commonUtils.navigateToDashboardLink("Individual", "T-Log", "New");
        await this.isProgramAndIndividualExist(data);
        await this.fillUpTLogForm(data);
    }

    // Navigate, check time fields, fill T-Log, and submit
    async navigateAndFillTLogIfTimeAvailableAndSubmit(data) {
        await this.commonUtils.navigateToDashboardLink("Individual", "T-Log", "New");
        await this.isProgramAndIndividualExist(data);

        if (await this.commonUtils.isElementAvailable(this.dtpTimeIn)) {
            await this.fillUpTLogForm(data);
            await this.commonButtons.clickButton('Submit');
            return;
        }

        throw new Error("Time In and Time Out fields are disabled from Provider Preference.");
    }

    async navigateFillupSubmit(data) {
        await this.navigateAndFillTLog(data);
        await this.commonButtons.clickButton('Submit');
    }

    // Navigate to T-Log Search Page and Search for a T-Log form and Click on the first result
    async searchAndOpenTLog(data) {
        await this.commonUtils.navigateToDashboardLink("Individual", "T-Log", "Search");
        await this.txtFormId.fill(data.formId);
        await this.dtpCreatedFrom.fill(data.dtpCreatedFrom);
        await this.dtpCreatedTo.fill(data.dtpCreatedTo);
        await this.commonButtons.clickButton('Search');
        await this.listPage.clickFirstListItem();
    }

    async setupProfileAndSubmitTLog(testcase, notificationProfilePage, tLogPage, donePage) {
        await notificationProfilePage.setupNotificationProfile(testcase, testcase.expectedNotifSuccessMsg);

        await tLogPage.navigateFillupSubmit(testcase);

        if (!testcase.descriptionNumberOfCharacters?.trim()) {
            await this.commonButtons.clickButton('Yes');
        }

        await donePage.verifyPartialDoneMessage(testcase.expectedSubmitMsg);

        const formID = await donePage.fetchFormIdFromDoneMessage();

        await donePage.clickLinkByText('Form');

        return formID;
    }
}