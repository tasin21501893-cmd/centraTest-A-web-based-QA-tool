/**
 * @author Akash Ahmed
 * @since 03/13/2026
 */

import { expect } from '@playwright/test';

export class SCommNotificationPage {

    constructor(page) {
        this.page = page;
        this.txtNotificationContent = page.locator('div.rich-text-content');
        this.tblFormIdCell = page.locator('#form-attachments tbody tr td:nth-child(2)');
        this.txtNotificationTitle = page.locator('h4 > p.wrap');
    }

    extractField(content, fieldName) {
        const match = new RegExp(`${fieldName}:\\s*([^\\n]+)`).exec(content);
        return match?.[1]?.trim() ?? null;
    }

    normalizeType(value) {
        return value?.toString().toLowerCase().replace(/-/g, '').trim();
    }

    getNotificationFields(content) {
        const fields = {
            moduleName: this.extractField(content, 'Module name'),
            actionName: this.extractField(content, 'Action name'),
            type: this.extractField(content, 'Type'),
            notificationLevel: this.extractField(content, 'Notification Level')
        };
        return fields;
    }

    verifyModule(actualModuleName, expectedModuleName) {
        expect(actualModuleName).toBe(expectedModuleName);
    }

    verifyAction(actualActionName, expectedActionName) {
        expect(actualActionName?.toLowerCase()).toBe(expectedActionName.toLowerCase());
    }

    verifyType(actualType, expectedType) {
        expect(this.normalizeType(actualType)).toContain(this.normalizeType(expectedType));
    }

    verifyNotificationLevel(actualNotificationLevel, expectedNotificationLevel) {
        expect(actualNotificationLevel).toBe(expectedNotificationLevel);
    }

    async getNotificationText() {
        return this.txtNotificationContent.innerText();
    }

    async verifyNotificationTitle(testcase) {
        const expectedTitle = `${testcase.moduleName} - ${testcase.notificationEvents} - ${testcase.notificationLevel}`;
        const actualTitle = (await this.txtNotificationTitle.innerText()).trim();

        expect(actualTitle.toLowerCase()).toBe(expectedTitle.toLowerCase());
    }

    async verifyFormId(expectedFormId) {
        const actualFormId = (await this.tblFormIdCell.innerText()).trim();

        expect(actualFormId).toBe(expectedFormId);
    }

    async verifyNotification(testcase, expectedFormId, sCommPage) {
        let finalFormId;

        await expect(async () => {
            await sCommPage.navigateAndOpenFirstMessage();
            await this.page.waitForLoadState('domcontentloaded')
            const isFormIdVisible = await this.tblFormIdCell.isVisible();

            if (!isFormIdVisible) {
                throw new Error('Message not found or Form ID not visible.');
            }

            finalFormId = (await this.tblFormIdCell.innerText()).trim();

            expect(finalFormId).toBe(expectedFormId);

        }).toPass({
            intervals: [2_000],
            timeout: 60_000,
            message: 'Message not found within 60 seconds.'
        });

        const notificationFields = this.getNotificationFields(await this.getNotificationText());

        if (notificationFields.moduleName) {
            this.verifyModule(notificationFields.moduleName, testcase.moduleName);
        }

        if (notificationFields.actionName) {
            this.verifyAction(notificationFields.actionName, testcase.notificationEvents);
        }

        if (notificationFields.type) {
            this.verifyType(notificationFields.type, testcase.types);
        }

        if (notificationFields.notificationLevel) {
            this.verifyNotificationLevel(notificationFields.notificationLevel, testcase.notificationLevel);
        }
    }
}