/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { tmsLabels } from './utility/tmsLabels.js';
import { tmsUtils } from './utility/tmsUtils.js';

export class TrainingSessionPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.#initLocators(page);
    }

    async fillSessionForm(data) {
        if (data.class) {
            await this.listPage.fillFilterField(data.class);
            const targetRow = this.page.locator('table > tbody > tr').filter({ hasText: data.class }).first();
            await targetRow.click();
        }

        if (data.sessionTypeInitial) {
            await this.commonUtils.selectRadioOption(data.sessionTypeInitial, this.rdoSessionTypeInitial, this.rdoSessionTypeRecertification);
        }
        if (data.sessionTypeRecert) {
            await this.commonUtils.selectRadioOption(data.sessionTypeRecert, this.rdoSessionTypeRecertification, this.rdoSessionTypeInitial);
        }

        if (data.noOfSession) {
            await this.txtSessionCount.fill(data.noOfSession);
        }

        if (data.noOfSession && parseInt(data.noOfSession, 10) > 1 && data.linkedSessions) {
            await this.commonUtils.selectRadioOption(data.linkedSessions, this.rdoSessionsAreLinkedYes, this.rdoSessionsAreLinkedNo);
        }

        if (data.noOfTrainees) {
            await this.txtTraineePerSession.fill(data.noOfTrainees);
        }

        if (data.commonComments) {
            await this.txtCommonComments.fill(data.commonComments);
        }

        if (data.commonLocation) {
            await this.txtCommonLocation.fill(data.commonLocation);
        }
    }

    async clickContinue() {
        await this.commonButtons.clickButton(tmsLabels.CONTINUE);
    }

    async clickSave() {
        await this.commonButtons.clickButton(tmsLabels.SAVE);
    }

    async selectFirstInstructor() {
        await this.btnAddInstructor.click();
        await this.addInstructorModal.waitFor({ state: 'visible' });
        const frame = await this.page.locator('#add-instructor-modal iframe').contentFrame();
        const ddlInstructor = frame.locator('button#login_bs_btn');
        const ddlInstructorList = frame.locator('.dropdown-menu.open:visible');
        await tmsUtils.selectFirstInstructor(ddlInstructor, ddlInstructorList);
        await this.clickSave();
    }

    async selectInstructorByName(data) {
        await this.btnAddInstructor.click();
        await this.addInstructorModal.waitFor({ state: 'visible' });
        const frame = await this.page.locator('#add-instructor-modal iframe').contentFrame();
        const frameUtils = new CommonUtils(frame);
        await frameUtils.selectBootstrapCustomDropdown(frame.locator('button#login_bs_btn'), data.instructor);
        await this.clickSave();
    }

    #initLocators(page) {
        this.btnAddInstructor = page.locator('a[id="add-instructor"]');
        this.addInstructorModal = page.locator('#add-instructor-modal');
        this.rdoSessionTypeInitial = page.locator('input[id="sessionType1"]');
        this.rdoSessionTypeRecertification = page.locator('input[id="sessionType2"]');
        this.txtSessionCount = page.locator('input[id="sessionCount"]');
        this.rdoSessionsAreLinkedYes = page.locator('input[id="sessionsAreLinked1"]');
        this.rdoSessionsAreLinkedNo = page.locator('input[id="sessionsAreLinked2"]');
        this.txtTraineePerSession = page.locator('input[id="commonSessionSize"]');
        this.txtCommonComments = page.locator('textarea[id="commonComments"]');
        this.txtCommonLocation = page.locator('input[id="commonLocation"]');
    }
}
