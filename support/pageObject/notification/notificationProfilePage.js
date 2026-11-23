/**
 * @author Akash Ahmed
 * @since 02/10/2026
 */

/**
    Using the same page for Default Notificaiton, Configure Notification and Apply Notification page.
 */

import { expect } from '@playwright/test';

import { ListPage } from '../../commonPages/listPage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class NotificationProfilePage {

    constructor(page) {
        this.page = page;
        this.donePage = new DonePage(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);

        this.ddlModuleName = page.locator('#module-selection');
        this.sectionNotificationEvents = page.locator('section.panel.panel-info:has(.panel-title:has-text("Notification Events"))');
        this.sectionSelectMedia = page.locator('section.panel.panel-info:has(.panel-title:has-text("Select Media"))');
        this.alertErrorNotificationProfile = page.locator('div.alert.alert-danger');
        this.alrtSuccessMsg = page.locator('div.alert.alert-success');

        // Switch to iframe inside modal
        this.notificationFrame = page.frameLocator('#notif-profile-edit iframe');

        // Elements INSIDE iframe
        this.txtName = this.notificationFrame.locator('[name="name"]');
        this.txtDescription = this.notificationFrame.locator('[name="description"]');
        this.btnUpdate = this.notificationFrame.locator('input[type="button"][value="Update"]');
        this.errNameRequired = this.notificationFrame.locator('input#name + .help-block');
        this.descriptionRequired = this.notificationFrame.locator('textarea#description + .help-block');
        this.chkEnableNotification = page.locator('[name="notifEnabled"]');

    }

    async selectNotificationEvents(notificationEvents) {

        // Parse Excel values using common utility
        const selectedEvents = (await this.commonUtils.parseCommaSeparatedList(notificationEvents)).map(v => v.toLowerCase());
        const foundEvents = [];

        // Go through each notification event row
        const rows = await this.sectionNotificationEvents.locator('.panel-body > .row').all();

        for (const row of rows) {

            const eventLabel = row.locator('label.control-label');
            const eventName = (await eventLabel.textContent()).trim().toLowerCase();
            const yesRadio = row.locator('input[type="radio"][value="true"]');
            const noRadio = row.locator('input[type="radio"][value="false"]');
            const valueToSelect = selectedEvents.includes(eventName) ? 'yes' : 'no';

            // ADDED: track if this UI event matches an Excel-provided event
            if (selectedEvents.includes(eventName) && !foundEvents.includes(eventName)) {
                foundEvents.push(eventName);
            }

            await this.commonUtils.selectRadioOption(valueToSelect, yesRadio, noRadio);
        }

        // ADDED: throw error if any Excel event was not found in UI
        const missingEvents = selectedEvents.filter(e => !foundEvents.includes(e));
        if (missingEvents.length > 0) {
            throw new Error(`Notification events from Excel not found in UI: ${missingEvents.join(', ')}`);
        }
    }

    async selectMedia(data) {

        const mediaMap = [
            { col: 'selectMediaEmail', legend: 'Email' },
            { col: 'selectMediaPhoneText', legend: 'Phone/Text Message' },
            { col: 'selectMediaSComm', legend: 'Secure Communications' }
        ];

        for (const { col, legend } of mediaMap) {

            let cellValue = data[col];
            if (!cellValue || !cellValue.trim()) continue;

            const fieldset = this.sectionSelectMedia.locator(`fieldset:has(legend:has-text("${legend}"))`);
            const hasColon = cellValue.includes(':');

            // SINGLE YES / NO MODE
            if (!hasColon) {

                const choice = cellValue.trim().toLowerCase();
                if (!['yes', 'no'].includes(choice)) continue;

                await this.commonUtils.checkRadioByLabel(fieldset, choice);

                continue;
            }

            // MULTI LABEL:VALUE MODE
            const pairs = await this.commonUtils.parseCommaSeparatedList(cellValue);

            for (const pair of pairs) {

                if (!pair.includes(':')) continue;

                let [labelText, valueText] = pair.split(':');

                labelText = labelText.trim();
                valueText = valueText.trim().toLowerCase();

                if (!labelText || !valueText) continue;

                const row = fieldset.locator(`.row:has-text("${labelText}")`);

                if (await row.count() === 0) continue;

                await this.commonUtils.checkRadioByLabel(row, valueText);
            }
        }
    }

    async notificationProfileSetup(data) {
        // Module change triggers page reload → MUST wait
        await this.ddlModuleName.selectOption({ label: data.moduleName });
        await this.sectionNotificationEvents.waitFor({ state: 'visible' });

        await this.selectNotificationEvents(data.notificationEvents);
        await this.selectMedia(data);
        await this.commonButtons.clickButton('Save');
    }

    async verifyAlertMessage(expectedMessage) {
        await expect(this.alertErrorNotificationProfile).toContainText(expectedMessage);
    }

    async createDefaultNotification(data) {
        let Name = '';

        // Generate name if character count provided
        if (data.nameNumberOfCharacters && data.nameNumberOfCharacters > 0) {
            Name = await this.commonUtils.generateString(data.nameNumberOfCharacters);

            // Regenerate if duplicate
            while (await this.listPage.isItemExistInColumnByName(Name, "Name")) {
                Name = await this.commonUtils.generateString(data.nameNumberOfCharacters);
            }
        }
        // Use provided name directly if available
        else if (data.nameInCharacters) {
            Name = data.nameInCharacters;
        }

        await this.commonButtons.clickButton("Create New");
        await this.txtName.waitFor({ state: 'visible' });

        if (Name) {
            await this.txtName.fill(Name);
        }

        if (data.descriptionNumberOfCharacters && data.descriptionNumberOfCharacters > 0) {
            await this.txtDescription.fill(await this.commonUtils.generateString(data.descriptionNumberOfCharacters));
        }

        await this.commonButtons.clickButton('Save', this.notificationFrame);
    }

    async setupNotificationProfile(data, expectedMessage) {
        await this.commonUtils.navigateToDashboardLink('Settings', 'Notification Profile', 'Configure');
        await this.notificationProfileSetup(data);

        await this.donePage.verifyPartialDoneMessage(expectedMessage);
    }

    async checkEnableNotificationsOption() {
        const isChecked = await this.chkEnableNotification.isChecked();

        if (!isChecked) {
            await this.chkEnableNotification.click();
            await this.commonButtons.clickButton('Update');
        }
    }
}