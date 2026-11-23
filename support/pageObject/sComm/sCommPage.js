/**
 * @author Akash Ahmed
 * @since 03/13/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class SCommPage {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);

        this.lnkRefresh = page.locator('a.btn-inbox-refresh');
        this.lnkFirstMessage = page.locator('#mailbox-content-panel .mailbox-item:first-of-type');
        this.txtNoMsgDisplayed = page.locator('#mailbox-content-panel > p > i');
    }

    async clickRefreshAndOpenFirstMessage() {
        await expect(async () => {
            await this.lnkRefresh.click();

            if (await this.txtNoMsgDisplayed.isVisible()) {
                const noMessageDisplay = (await this.txtNoMsgDisplayed.innerText()).trim();
                expect(noMessageDisplay).toContain('No messages found to display');
                throw new Error('No messages found.');
            }

            await this.lnkFirstMessage.waitFor({ state: 'visible' });

        }).toPass({
            intervals: [2_000],
            timeout: 60_000
        });

        await this.lnkFirstMessage.click();
    }

    async navigateAndOpenFirstMessage() {
        await this.commonUtils.navigateToRightPanelLink('SComm', 'Inbox');
        await this.clickRefreshAndOpenFirstMessage();
    }
}