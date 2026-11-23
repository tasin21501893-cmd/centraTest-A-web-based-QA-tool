/**
 * @author Sadeen Mahbub Mobin
 * @since 07/01/2024
 */

import { readExcelDataWithSheetName, filterObjects } from '../../commonUtility/read-xlsx.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { resourcePaths } from '../../../support/constants/resourcePaths.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { DonePage } from '../../../support/commonPages/donePage.js';


export class IpAgendaPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.iframe = this.page.locator("#agenda-child-modal").frameLocator("iframe");

        this.dtpMeetingDate = this.page.locator("[name='meetingDate']");
        this.ddlMeetingType = this.page.locator("[name='meetingType']");
        this.dtpReviewPeriodStartDate = this.page.locator("[name='startDate']");
        this.dtpReviewPeriodEndDate = this.page.locator("[name='endDate']");

        this.txtDiscussionTopics = this.iframe.locator("[name='title']");

        this.txtDesiredOutcome = this.iframe.locator("[name='title']");
        this.ddlPeriodicProgress = this.iframe.locator("[name='progress']");

        this.discontinueModal = this.page.locator("#discontinueModal");
        this.txtReasonForDiscontinuation = this.page.locator("[name='discontinueReason']");
        this.btnClosePopup = this.page.locator(".close > span");

        this.errMsgMeetingDate = this.page.locator('span#meetingDate\\.errors');
        this.errMsgReviewPeriodStartDate = this.page.locator('span#startDate\\.errors');
        this.errMsgReviewPeriodEndDate = this.page.locator('span#endDate\\.errors');
        this.errMsgDiscussionTopics = this.iframe.locator('span#title\\.errors');
        this.errMsgDesiredOutcome = this.iframe.locator('span#title\\.errors');
        this.errMsgIndividualizedItemComments = this.page.locator('span#individualizedItems0\\.comments\\.errors');
        this.errMsgProgressTowardsOutcomeComments = this.page.locator('span#progressTowardsOutcomes0\\.comments\\.errors');
        this.errMsgRequiredItemsComments = this.page.locator('span#requiredItems0\\.comments\\.errors');
        this.errMsgMainForm = this.page.locator(".alert-danger .list-unstyled > li");
        this.errMsgReasonForDiscontinuation = this.discontinueModal.locator(".help-block");

        this.chkRequiredItemsTitle = function (title = 0) {
            return this.iframe.locator(`.checkbox > label:text("${title}")`);
        };

        this.ddlIndivItemActionTaken = function (index = 0) {
            return this.page.locator(`[name='individualizedItems[${index}]\\.actionTaken']`);
        };

        this.txtIndivItemComments = function (index = 0) {
            return this.page.locator(`[name='individualizedItems[${index}]\\.comments']`);
        };

        this.txtProgressTowardsOutcomeComments = function (index = 0) {
            return this.page.locator(`[name='progressTowardsOutcomes[${index}]\\.comments']`);
        };

        this.ddlRequiredItemsActionTaken = function (index = 0) {
            return this.page.locator(`[name='requiredItems[${index}]\\.actionTaken']`);
        };

        this.txtRequiredItemsComments = function (index = 0) {
            return this.page.locator(`[name='requiredItems[${index}]\\.comments']`);
        };
    }

    async fillUpForm(data) {
        data.meetingDate && await this.dtpMeetingDate.fill(data.meetingDate);
        data.meetingType && await this.ddlMeetingType.selectOption(data.meetingType);
        data.reviewPeriodStartDate && await this.dtpReviewPeriodStartDate.fill(data.reviewPeriodStartDate);
        data.reviewPeriodEndDate && await this.dtpReviewPeriodEndDate.fill(data.reviewPeriodEndDate);

        await this.addIndividualizedItem(data.index);
        await this.addProgressTowardsOutcome(data.index);
        await this.addRequiredItems(data.index);

        if (CommonUtils.isAffirmative(data.hasAttachment)) {
            const attachmentData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'addFile');
            await this.attachmentUtils.addFile(data.index, attachmentData);
        }
    }

    async addIndividualizedItem(ipAgendaIndex) {
        const individualizedItemSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'individualizedItem');
        const individualizedItemData = filterObjects(individualizedItemSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);

        for (let itemNumber = 0; itemNumber < individualizedItemData.length; itemNumber++) {
            await this.commonButtons.clickButton('Add Individualized Item');

            individualizedItemData[itemNumber].discussionTopics && await this.txtDiscussionTopics.fill(individualizedItemData[itemNumber].discussionTopics);
            await this.commonButtons.clickButton('Continue', this.iframe);
        }
    }

    async addProgressTowardsOutcome(ipAgendaIndex) {
        const progressTowardsOutcomeSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'progressTowardsOutcome');
        const progressTowardsOutcomeData = filterObjects(progressTowardsOutcomeSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);

        for (let outcomeNumber = 0; outcomeNumber < progressTowardsOutcomeData.length; outcomeNumber++) {
            await this.commonButtons.clickButton('Add Other Outcome');

            progressTowardsOutcomeData[outcomeNumber].desiredOutcome && await this.txtDesiredOutcome.fill(progressTowardsOutcomeData[outcomeNumber].desiredOutcome);
            progressTowardsOutcomeData[outcomeNumber].periodicProgress && await this.ddlPeriodicProgress.selectOption(progressTowardsOutcomeData[outcomeNumber].periodicProgress);
            await this.commonButtons.clickButton('Continue', this.iframe);
        }
    }

    async addRequiredItems(ipAgendaIndex) {
        const requiredItemsSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'requiredItems');
        const requiredItemsData = filterObjects(requiredItemsSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);

        if (requiredItemsData.length > 0) {
            await this.commonButtons.clickButton('Add/Remove Required Items');

            for (let itemNumber = 0; itemNumber < requiredItemsData.length; itemNumber++) {
                requiredItemsData[itemNumber].title && await this.chkRequiredItemsTitle(requiredItemsData[itemNumber].title).check();
            }

            await this.commonButtons.clickButton('Continue', this.iframe);
        }
    }

    async recordMeetingMinutes(ipAgendaIndex) {
        const individualizedItemSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'individualizedItem');
        const individualizedItemData = filterObjects(individualizedItemSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);
        const progressTowardsOutcomeSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'progressTowardsOutcome');
        const progressTowardsOutcomeData = filterObjects(progressTowardsOutcomeSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);
        const requiredItemsSheetData = readExcelDataWithSheetName(resourcePaths.IP_AGENDA, 'requiredItems');
        const requiredItemsData = filterObjects(requiredItemsSheetData, [{ 'ipAgendaIndex': ipAgendaIndex }]);

        for (let itemNumber = 0; itemNumber < individualizedItemData.length; itemNumber++) {
            individualizedItemData[itemNumber].actionTaken && await this.ddlIndivItemActionTaken(itemNumber).selectOption(individualizedItemData[itemNumber].actionTaken);
            individualizedItemData[itemNumber].comments && await this.txtIndivItemComments(itemNumber).fill(individualizedItemData[itemNumber].comments);
        }

        for (let outcomeNumber = 0; outcomeNumber < progressTowardsOutcomeData.length; outcomeNumber++) {
            progressTowardsOutcomeData[outcomeNumber].comments && await this.txtProgressTowardsOutcomeComments(outcomeNumber).fill(progressTowardsOutcomeData[outcomeNumber].comments);
        }

        for (let itemNumber = 0; itemNumber < requiredItemsData.length; itemNumber++) {
            requiredItemsData[itemNumber].actionTaken && await this.ddlRequiredItemsActionTaken(itemNumber).selectOption(requiredItemsData[itemNumber].actionTaken);
            requiredItemsData[itemNumber].comments && await this.txtRequiredItemsComments(itemNumber).fill(requiredItemsData[itemNumber].comments);
        }

        await this.commonButtons.clickButton('Save Meeting Minutes');
    }

    async takeAction(action, testCase) {
        if (!await this.commonButtons.isButtonPresent(action) && await this.commonButtons.isButtonPresent('Edit')) {
            await this.commonButtons.clickButton('Edit');
        }

        if (await this.commonButtons.isButtonPresent(action)) {

            if (action === 'Discontinue') await this.takeDiscontinueAction(testCase.reasonForDiscontinuation);
            else await this.commonButtons.clickButton(action);

            if (action === 'Delete') {
                await this.commonButtons.clickButton('Yes');
            }

            if (action === 'Record Meeting Minutes') {
                await this.commonButtons.clickButton('Yes');
                await this.recordMeetingMinutes(testCase.index);
            }

            if (action === 'Copy') {
                await this.commonButtons.clickButton('Yes');
                await this.commonButtons.clickButton('Save');
            }

            return true;
        }

        return false;
    }

    async takeDiscontinueAction(reasonForDiscontinuation) {
        await this.commonButtons.clickButton('Discontinue');
        await this.txtReasonForDiscontinuation.fill(reasonForDiscontinuation);
        await this.commonButtons.clickButton('Discontinue', this.discontinueModal);
        await this.commonButtons.clickButton('Yes');
    }

    async getDashboardNavArgs(linkName) {
        const isOversightProvider = (await this.commonUtils.isExpectedHomePage('Oversight HomePage')) > 0;
        return isOversightProvider
            ? ['Assessment and Planning', 'Individual Plan Agenda', linkName]
            : ['Individual', 'Individual Plan Agenda', linkName];
    }

    async navigateToNewForm(data) {
        const dashboardNavArgs = await this.getDashboardNavArgs('New');
        await this.commonUtils.navigateToDashboardLink(...dashboardNavArgs);
        await this.listPage.selectFilteredFirstItem(data.individual);

        if (await this.page.url().includes('Lister')) {
            const blockingStatuses = ['Draft', 'Pending Approval'];

            for (const status of blockingStatuses) {

                if (await this.listPage.isItemExist(status)) {
                    await this.listPage.selectFilteredFirstItem(status);
                    await this.commonButtons.clickButton('Delete');
                    await this.commonButtons.clickButton('Yes');
                    await this.donePage.clickLinkByText('List');
                    break;
                }
            }
            await this.commonButtons.clickButton('Create New');
        }
    }

    async createForm(status, data) {
        const dashboardNavArgs = await this.getDashboardNavArgs('New');
        await this.commonUtils.navigateToDashboardLink(...dashboardNavArgs);
        await this.listPage.selectFilteredFirstItem(data.individual);

        // 2. LIST PAGE LOGIC: Reuse existing forms to reach target faster
        if (await this.page.url().includes('Lister')) {
            
            if (await this.listPage.isItemExist('Draft')) {
                await this.listPage.selectFilteredFirstItem('Draft'); // Open Draft
            }
            else if (await this.listPage.isItemExist('Pending Approval')) {
                await this.listPage.selectFilteredFirstItem('Pending Approval'); // Open Pending
            }
            else {
                await this.commonButtons.clickButton('Create New'); // Create Fresh
            }
        }

        // 3. FORM FILLING: Fill data if allowed 
        if (await this.commonButtons.isButtonPresent('Save')) {
            await this.fillUpForm(data);
        }

        switch (status) {

            case 'Draft':
                // If Pending 'Return' to make it Draft. If New, just Save.
                if (await this.commonButtons.isButtonPresent('Return')) {
                    await this.commonButtons.clickButton('Return');
                    await this.donePage.clickLinkByText('Form');
                }
                await this.commonButtons.clickButton('Save');
                break;

            case 'Pending Approval':
                // If Draft/New, we Submit. If already Pending can Save).
                if (await this.commonButtons.isButtonPresent('Submit')) {
                    await this.commonButtons.clickButton('Submit');
                } else {
                    await this.commonButtons.clickButton('Save');
                }
                break;

            case 'Approved':
                await this.commonButtons.clickButton('Approve');
                break;

            case 'Deleted':

                if (await this.commonButtons.isButtonPresent('Delete')) {
                    await this.commonButtons.clickButton('Delete');
                }
                // If New, no Delete button. Save to make it Draft, then Delete.
                else {
                    await this.commonButtons.clickButton('Save');
                    await this.donePage.clickLinkByText('Form'); // Re-open if Save closes it
                    await this.commonButtons.clickButton('Delete');
                }
                // Confirm deletion
                await this.commonButtons.clickButton('Yes');
                break;

            case 'Discontinued':
                await this.commonButtons.clickButton('Approve');
                await this.donePage.clickLinkByText('Form');
                await this.takeDiscontinueAction(data.reasonForDiscontinuation);
                break;
        }
    }
}