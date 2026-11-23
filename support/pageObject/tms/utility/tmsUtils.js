/**
 * @author Waliul Hasnat Rahat
 * @since 08/06/2026
 */

import fs from 'fs';
import path from 'path';
import { tmsLabels } from './tmsLabels.js';
import { tmsConfig } from './tmsConfig.js';

export const tmsUtils = {
    attachMaximumFiles: async (page, attachmentUtils, data, parentLocator = null) => {
        if (data.fileAttachment) {
            const fileName = String(data.fileAttachment).trim();
            const filePath = fileName.startsWith('custom/')
                ? path.join('resources', 'attachment', fileName)
                : path.join('resources', 'attachment', 'common', fileName);

            if (!fs.existsSync(filePath)) {
                throw new Error(`Attachment file not found at path: ${filePath}`);
            }

            let remainingSizeMB = tmsConfig.MAX_ATTACHMENT_SIZE_10_MB;
            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);

            const MAX_ITERATIONS = 30;
            let iteration = 0;
            while (fileSizeMB <= remainingSizeMB && iteration++ < MAX_ITERATIONS) {

                if (parentLocator) {
                    await attachmentUtils.commonButtons.clickButton(tmsLabels.ADD_FILE, parentLocator);
                    const uploadModal = page.locator('.attachment-modal.in');
                    await attachmentUtils.uploadFile({ fileName: fileName });
                    await uploadModal.waitFor({ state: 'hidden', timeout: 10000 });

                } else {
                    await attachmentUtils.addAttachment({ fileName: fileName });
                }

                const sizeInfoLocator = parentLocator
                    ? parentLocator.locator('.total-and-remaining-size:not(.hidden)')
                    : page.locator('.total-and-remaining-size:not(.hidden)');

                await sizeInfoLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

                if (await sizeInfoLocator.isVisible()) {
                    const remainingText = await sizeInfoLocator.locator('b').nth(1).innerText();

                    if (remainingText.includes('MB')) {
                        remainingSizeMB = parseFloat(remainingText.replace('MB', '').trim());

                    } else if (remainingText.includes('KB')) {
                        remainingSizeMB = parseFloat(remainingText.replace('KB', '').trim()) / 1024;

                    } else {
                        remainingSizeMB = 0;
                    }

                } else {
                    remainingSizeMB = remainingSizeMB - fileSizeMB;
                }
            }
        }
    },

    selectFirstInstructor: async (ddlInstructorLocator, dropdownMenuLocator) => {
        await ddlInstructorLocator.click();
        await dropdownMenuLocator.waitFor({ state: 'visible' });
        await dropdownMenuLocator.locator('li a').nth(1).click();
    }
};
