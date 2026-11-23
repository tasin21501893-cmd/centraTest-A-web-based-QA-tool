/**
 * @author Md. Hasin Ibtida Alam
 * @author Sadeen Mahbub Mobin
 * @since 1/15/25
 */

import { expect } from "@playwright/test";
import { readExcelDataWithSheetName, filterObjects } from "../../../../support/commonUtility/read-xlsx.js";
import { CommonButtons } from "../../../../support/commonUtility/commonButtons.js";
import { CommonUtils } from "../../../../support/commonUtility/commonUtils.js";
import { ListPage } from "../../../../support/commonPages/listPage.js";
import { DonePage } from "../../../../support/commonPages/donePage.js";

export class PfwPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.iframe = this.page.locator("#pfw-child-modal").frameLocator("iframe[frameborder='0']");

        this.dtpStartDate = this.page.locator("[name='startDate']");
        this.dtpEndDate = this.page.locator("[name='endDate']");
        this.txtAnswer = this.iframe.locator("[name='answer']");
        this.txtAgendaAnswer = this.iframe.locator("[name='agendaAnswer']");
        this.questionSections = Array.from({ length: 22 }, (_, questionNumber) =>
            this.page.locator(`[data-question-id='${questionNumber + 1}']`).locator('..')
        );

        this.discontinueModal = this.page.locator("#discontinueModal");
        this.txtReasonForDiscontinuation = this.page.locator("[name='discontinueReason']");
        this.txtReasonForDiscontinuationErrorMsg = this.page.locator(".help-block");
        this.btnClosePopup = this.page.locator(".close > span");

        this.ddlParticipantTeamMember = this.iframe.locator("[name='teamMemberId']");
        this.txtOtherParticipant = this.iframe.locator("[name='otherParticipant']");
        this.txtRelationship = this.iframe.locator("[name='otherRelationship']");

        this.dtpStartDateErrorMsg = page.locator('span#startDate\\.errors');
        this.dtpEndDateErrorMsg = page.locator('span#endDate\\.errors');
        this.txtAnswerErrorMsg = this.iframe.locator('span#answer\\.errors');
        this.txtAgendaAnswerErrorMsg = this.iframe.locator('span#agendaAnswer\\.errors');
        this.ddlParticipantErrorMsg = this.iframe.locator('.alert-danger > ul > li');
        this.txtOtherParticipantErrorMsg = this.iframe.locator('span#otherParticipant\\.errors');
        this.txtOtherRelationshipErrorMsg = this.iframe.locator('span#otherRelationship\\.errors');
    }

    async fillUpForm(data) {
        data.startDate && (await this.dtpStartDate.fill(data.startDate));
        data.endDate && (await this.dtpEndDate.fill(data.endDate));

        for (let questionNumber = 0; questionNumber < this.questionSections.length; questionNumber++) {
            const questionKeyA = `question${questionNumber + 1}a`;
            const questionKeyB = `question${questionNumber + 1}b`;

            if (data[questionKeyA] || data[questionKeyB]) {
                await this.fillUpQuestion(questionNumber, data[questionKeyA], data[questionKeyB]);
            }
        }
        await this.addParticipant(data.index);
    }

    async clickAddOrEditButton(sectionLocator) {
        if (await this.commonButtons.isButtonPresent("Add", sectionLocator)) {
            await this.commonButtons.clickButton("Add", sectionLocator);
        } else if (await this.commonButtons.isButtonPresent("Edit", sectionLocator)) {
            await this.commonButtons.clickButton("Edit", sectionLocator);
        }
    }

    async fillUpQuestion(index, answer, agendaAnswer) {
        await this.clickAddOrEditButton(this.questionSections[index]);

        if (answer) {
            await this.txtAnswer.fill(answer);
        }

        if (agendaAnswer) {
            await this.txtAgendaAnswer.fill(agendaAnswer);
        }
        await this.commonButtons.clickButton("Continue", this.iframe);
    }

    async addParticipant(pfwIndex) {
        const participantSheetData = readExcelDataWithSheetName('resources/plan/pfw/pfw.xlsx', 'teamMembers');
        const data = filterObjects(participantSheetData, [{ "pfwIndex": pfwIndex }]);

            for (let participantNumber = 0; participantNumber < data.length; participantNumber++) {
                await this.commonButtons.clickButton("Add Participant");

                await this.ddlParticipantTeamMember.selectOption(data[participantNumber].teamMember);
                await this.txtOtherParticipant.fill(data[participantNumber].other);
                await this.txtRelationship.fill(data[participantNumber].relationship);

                await this.commonButtons.clickButton("Continue", this.iframe);
            }
    }

    async takeDiscontinueAction(reasonForDiscontinuation) {
        await this.commonButtons.clickButton("Discontinue");
        await this.txtReasonForDiscontinuation.fill(reasonForDiscontinuation);
        await this.commonButtons.clickButton("Discontinue", this.discontinueModal);
        await this.commonButtons.clickButton("Yes");
    }

    async validateErrorMsg(locator, expectedMsg) {
        expect(await locator.textContent()).toContain(expectedMsg);
    }

    async isAgendaAnswerPresent() {
        return await this.txtAgendaAnswer.count() > 0;
    }

    async navigateToNewForm(data) {
        await this.commonUtils.navigateToDashboardLink("Individual", "Personal Focus Worksheet", "New");
        await this.listPage.selectFilteredFirstItem(data.individual);
        if (await this.page.url().includes('Lister')) {
            const blockingStatuses = ['Draft', 'Pending Approval'];
            for (const status of blockingStatuses) {
                if(await this.listPage.isItemExist(status)) {
                    await this.listPage.selectFilteredFirstItem(status);
                    await this.commonButtons.clickButton('Delete');
                    await this.commonButtons.clickButton('Yes');
                    await this.donePage.clickLinkByText('List');
                    break;
                }
            }
            await this.commonButtons.clickButton('Create New');
        }
                            
        await this.fillUpForm(data);
    }
    
    async createForm(status, data) {
        // 1. Navigate and Select Individual
        await this.commonUtils.navigateToDashboardLink("Individual", "Personal Focus Worksheet", "New");
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