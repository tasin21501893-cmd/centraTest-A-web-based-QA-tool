/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { tmsUtils } from './utility/tmsUtils.js';
import { tmsLabels } from './utility/tmsLabels.js';
import { DonePage } from '../../commonPages/donePage.js';
import { tmsConfig } from './utility/tmsConfig.js';

export class NewSessionPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.donePage = new DonePage(page);
        this.#initLocators(page);
    }

    async fillSessionDetails(data) {
        await this.sessionContainers.first().waitFor({ state: 'visible', timeout: 15000 });
        const sessionCount = await this.sessionContainers.count();

        for (let i = 0; i < Math.min(sessionCount, tmsConfig.MAX_NO_OF_SESSIONS); i++) {
            const session = this.sessions[i];

            if (data.sessionDate) {
                await session.dtpSessionDate.fill(data.sessionDate);
            }

            if (data.sessionLenHour) {
                await session.txtSessionLenHour.fill(data.sessionLenHour);
            }

            if (data.sessionLenMin) {
                await session.txtSessionLenMin.fill(data.sessionLenMin);
            }

            if (data.noOfsessionTrainees) {
                await session.txtNoOfTrainees.fill(data.noOfsessionTrainees);
            }

            if (data.sessionComments) {
                await session.txtComments.fill(data.sessionComments);
            }

            if (data.sessionLocation) {
                await session.txtLocation.fill(data.sessionLocation);
            }

            if (data.otherInstructors != null && String(data.otherInstructors).trim()) {
                await session.txtOtherInstructors.fill(String(data.otherInstructors));
            }

            if (data.fileAttachment) {
                const container = this.page.locator(`#trSessionNotes-${i}`);
                await tmsUtils.attachMaximumFiles(this.page, this.attachmentUtils, data, container);
            }
        }
    }

    async clickSave() {
        await this.commonButtons.clickButton(tmsLabels.SAVE);
    }

    async verifySuccessMessage() {
        await this.donePage.verifyPartialDoneMessage(tmsLabels.SAVED_SUCCESSFULLY);
    }

    #initLocators(page) {
        this.sessionContainers = page.locator('div[id^="session"]');
        this.sessions = [];

        for (let i = 0; i < tmsConfig.MAX_NO_OF_SESSIONS; i++) {
            this.sessions.push({
                dtpSessionDate: page.locator(`[id="trainingSessions[${i}].sessionDate"]`),
                txtSessionLenHour: page.locator(`[id="trainingSessions[${i}].sessionLenHour"]`),
                txtSessionLenMin: page.locator(`[id="trainingSessions[${i}].sessionLenMin"]`),
                txtNoOfTrainees: page.locator(`[id="trainingSessions[${i}].sessionSize"]`),
                txtComments: page.locator(`[id="trainingSessions[${i}].comments"]`),
                txtLocation: page.locator(`[id="trainingSessions[${i}].location"]`),
                txtOtherInstructors: page.locator(`[id="trainingSessions[${i}].otherInstructors"]`)
            });
        }
    }
}
