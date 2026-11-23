/**
 * @author Tawratur Rashid
 * @since 02/18/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../commonPages/donePage.js';
import { IdfPage } from './idfPage.js';

export class AdvanceDirectivePage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachment = new AttachmentUtils(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.idfPage = new IdfPage(page);

        this.txtComments = page.locator('[name="comment"]');
    }

    getRadioButton(index, value) {
        return this.page.locator(`[name="advanceDirectiveList[${index}].completed"][value="${value}"]`);
    }

    getDateField(index) {
        return this.page.locator(`[name="advanceDirectiveList[${index}].completedDate"]`);
    }

    async navigateToAdvanceDirectives(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Advance Directives cannot be saved or updated for Deleted individuals');
        }
        await this.donePage.clickLinkByText('Advance Directives');
        await this.commonButtons.clickButton('Edit');
    }

    async fillDirectiveSection(index, completionStatus, date, fileName, description, isDocumentLookup) {
        if (CommonUtils.isAffirmative(completionStatus)) {
            await this.getRadioButton(index, 'true').click();

            if (date) {
                await this.getDateField(index).fill(date);
            }

            if (fileName) {
                const sectionLocator = this.page.locator(`[id="advanceDirectiveList[${index}].attachment"]`);
                const removeLink = sectionLocator.getByRole('link', { name: 'Remove', exact: true });

                if (await removeLink.isVisible()) {
                    await removeLink.click();
                    await this.commonButtons.clickButton('Yes');
                }

                await this.page.evaluate(() => {
                    document.querySelectorAll('div[role="dialog"]').forEach(dialog => {
                        const style = window.getComputedStyle(dialog);
                        if (style.display === 'none' || style.visibility === 'hidden') {
                            dialog.remove();
                        }
                    });
                });

                await this.attachment.addAttachment({
                    fileName: fileName,
                    fileDescription: description,
                    isDocumentLookup: isDocumentLookup
                });
            }
        } else {
            await this.getRadioButton(index, 'false').click();
        }
    }

    async advanceDirectiveFormFillUp(data) {
        const directiveMap = [
            { field: 'advanceDirective', index: 0 },
            { field: 'dnrOrder', index: 1 },
            { field: 'powerOfAttorney', index: 2 },
            { field: 'livingWill', index: 3 },
            { field: 'preferredIntervention', index: 4 }
        ];

        for (const directive of directiveMap) {
            const fieldName = directive.field;
            const index = directive.index;

            if (data[fieldName]) {
                await this.fillDirectiveSection(
                    index,
                    data[fieldName],
                    data[`${fieldName}Date`],              
                    data[`${fieldName}FileName`],
                    data[`${fieldName}Description`],
                    data[`${fieldName}IsDocLookup`]
                );
            }
        }

        if (data.comments) {
            await this.txtComments.fill(data.comments);
        }

        if (await this.commonButtons.isButtonPresent('Save')) {
            await this.commonButtons.clickButton('Save');
        } else {
            await this.commonButtons.clickButton('Update');
        }
    }
}