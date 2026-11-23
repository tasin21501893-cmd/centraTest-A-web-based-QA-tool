/**
 * @author M M Kabid Hasan
 * @since 08/13/2026
 */

import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';
import { DonePage } from '../../commonPages/donePage.js';
import { MsnSearchPage } from './msnSearchPage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class MsnForm {
    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.msnSearchPage = new MsnSearchPage(page);
        this.commonUtils = new CommonUtils(page);
        this.ddlMonth = page.locator('#monthPickerBtn');
        this.ddlYear = page.locator('#yearPickerBtn');
        this.noteFrame = page.frameLocator('#note_ifr');
        this.txtNote = this.noteFrame.locator('body#tinymce[contenteditable="true"].mce-content-body');
        this.btnOpenQnr = page.locator('#openBtn');
        this.lstQuestions = page.locator('ol[class="qn-list"]');
        this.question = this.lstQuestions.locator('li');
        this.txtAnswer = page.locator('.qnrInput');
        this.btnAnswerSave = page.locator('#actionSaveButton');
        this.btnClosePopup = page.getByText('Close Popup');
        this.btnLinkSap = page.locator('input[name="hpLinkButton"]');
        this.sapFrame = page.locator('#hp-search-modal').frameLocator('iframe[src*="/ma/msn/sapSearch"]');
        this.txtSapFilter = this.sapFrame.locator('#dt-search-0');
        this.btnSapSearch = this.sapFrame.locator('input[name="_action_search"]');
        this.btnSapAdd = this.sapFrame.locator('input[name="_action_next"]');
        this.txtIspComments = page.locator('textarea[id^="msnLinkedSaps["][id$="].comment"]');
        this.btnLinkIspReport = page.locator('input[name="ispReportLinkButton"]');
        this.ispFrame = page.locator('#isp-report-search-modal').frameLocator('iframe[src*="/ma/msn/ispReportSearch"]');
        this.txtIspFilter = this.ispFrame.locator('#dt-search-0');
        this.btnIspSearch = this.ispFrame.locator('input[name="_action_search"]');
        this.btnIspAdd = this.ispFrame.locator('input[name="_action_next"]');
        this.txtReasonForReturning = page.locator('#tmpReasonForReturning');
        this.txtReasonForDeletion = page.locator('#tmpReasonForDeletion');
        this.btnReturnConfirm = page.locator('#btn-return-modal-confirm');
        this.msgEmptySearch = page.locator('.empty-table-message');
        this.tblRowMsnSearchList = this.listPage.tblDataTable.locator('tbody tr').filter({ hasNotText: 'Nothing found to display' }).first();

        this.errMsgNote = page.locator('span[id="note.errors"]');
        this.errMsgMonth = page.locator('span[id="month.errors"]');
        this.errMsgGlobal = page.locator('ul.global-errors-list');
        this.errMsgSap = this.sapFrame.locator('[class="cstm-modal-body panel-body"]');
        this.errMsgIspReport = this.ispFrame.locator('[class="cstm-modal-body panel-body"]');
        this.errMsgTooManySapContent = page.locator('span[id="msnLinkedSaps.errors"]');
        this.errMsgTooLongComments = page.locator('.invalid-feedback.d-block').first();
        this.errMsgReasonForDeletion = page.locator('#deleteReasonErrorMessage');
        this.errMsgReasonForReturn = page.locator('#returnReasonErrorMessage');
    }

    async selectMonth(month) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlMonth, [month]);
    }

    async selectYear(year) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlYear, [year]);
    }

    async fillNote(note) {
        await this.txtNote.waitFor({ state: 'visible' });
        await this.txtNote.click();
        await this.txtNote.fill(`${note}`);
    }

    async answerQuestions(answer) {
        await this.btnOpenQnr.click();
        for (let i = 0; i < answer.length; i++) {
            await this.question.nth(i).click();
            await this.txtAnswer.fill(answer[i]);
            await this.btnAnswerSave.click();
        }
        await this.btnClosePopup.click();
    }

    async linkSap(listOfSapFormId) {
        await this.btnLinkSap.click();
        await this.btnSapSearch.waitFor({ state: 'visible' });
        await this.btnSapSearch.click();
        await this.sapFrame.locator('tbody tr').first().waitFor({ state: 'visible' });
        for (let i = 0; i < listOfSapFormId.length; i++) {
            await this.txtSapFilter.fill(listOfSapFormId[i]);
            const checkbox = this.sapFrame
                .locator('tr')
                .filter({ hasText: listOfSapFormId[i] })
                .locator('input[type="checkbox"]');

            await checkbox.waitFor({ state: 'visible' });
            await checkbox.click();
        }
        await this.btnSapAdd.click();
    }

    async linkIspReport(listOfIspReportFormId) {
        await this.btnLinkIspReport.click();
        await this.btnIspSearch.waitFor({ state: 'visible' });
        await this.btnIspSearch.click();
        await this.ispFrame.locator('tbody tr').first().waitFor({ state: 'visible' });
        for (let i = 0; i < listOfIspReportFormId.length; i++) {
            await this.txtIspFilter.fill(listOfIspReportFormId[i]);
            const checkbox = this.ispFrame
                .locator('tr')
                .filter({ hasText: listOfIspReportFormId[i] })
                .locator('input[type="checkbox"]');

            await checkbox.waitFor({ state: 'visible' });
            await checkbox.click();
        }
        await this.btnIspAdd.click();
    }

    async fillAllIspComments(commentText) {
        await this.txtIspComments.first().waitFor({ state: 'visible' });
        const ispComments = await this.txtIspComments.all();
        for (const ispComment of ispComments) {
            await ispComment.fill(commentText);
        }
    }

    async fillupReasonForDelete(reason){
        await this.txtReasonForDeletion.fill(reason);
    }

    async deleteConflictingForms(testcase) {
        await this.commonUtils.navigateToDashboardLink('Individual', 'Monthly Summary Note', 'Search');
        await this.msnSearchPage.fillUpForm(testcase);
        await this.msnSearchPage.setStatusField(['Draft', 'Pending Approval', 'Approved']);
        await this.commonButtons.clickButton(ButtonLabels.SEARCH);

        await this.tblRowMsnSearchList.or(this.msgEmptySearch).waitFor({ state: 'visible' });

        if (await this.tblRowMsnSearchList.isVisible()) {
            await this.listPage.clickFirstListItem();
            await this.page.waitForLoadState();
            await this.takeAction('delete', testcase.reasonForDeletion);
            await this.donePage.verifyPartialDoneMessage(testcase?.expectedMessage?.['delete'] || 'successfully deleted');
        }
    }

    async takeAction(action, reason = '') {
        switch (action) {
            case 'save':
                await this.commonButtons.clickButton(ButtonLabels.SAVE);
                break;

            case 'submit':
                await this.commonButtons.clickButton(ButtonLabels.SUBMIT);
                break;

            case 'return':
                await this.commonButtons.clickButton(ButtonLabels.RETURN_TO_SUBMITTER);
                await this.txtReasonForReturning.fill(reason);
                await this.btnReturnConfirm.click();
                break;

            case 'approve':
                await this.commonButtons.clickButton(ButtonLabels.APPROVE);
                await this.commonButtons.clickButton(ButtonLabels.YES);
                break;

            case 'update':
                await this.commonButtons.clickButton(ButtonLabels.UPDATE);
                await this.commonButtons.clickButton(ButtonLabels.YES);
                break;

            case 'delete':
                await this.commonButtons.clickButton(ButtonLabels.DELETE);
                await this.txtReasonForDeletion.fill(reason);
                await this.commonButtons.clickButton(ButtonLabels.CONFIRM);
                await this.commonButtons.clickButton(ButtonLabels.YES);
                break;

            default:
                throw new Error(`Invalid action provided: "${action}". Valid actions are: 'save', 'submit', 'return', 'approve', 'update', 'delete'`);
        }

        await this.page.waitForLoadState();
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individualName && await this.listPage.selectFilteredFirstItem(formObject.individualName);
        formObject.msnTemplate && await this.listPage.selectFilteredFirstItem(formObject.msnTemplate);
        formObject.month && await this.selectMonth(formObject.month);
        formObject.year && await this.selectYear(formObject.year);
        formObject.note && await this.fillNote(formObject.note);
        formObject.answer && await this.answerQuestions(formObject.answer);
        formObject.sapFormIds && await this.linkSap(formObject.sapFormIds);
        formObject.comment && await this.fillAllIspComments(formObject.comment);
        formObject.ispReportFormIds && await this.linkIspReport(formObject.ispReportFormIds);
    }
}
