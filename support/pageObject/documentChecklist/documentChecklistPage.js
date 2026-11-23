/**
 * @author Tarikul Islam
 * @since 18/04/25
*/

import { DonePage } from '../../commonPages/donePage';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class DocumentChecklistPage {

    constructor(page) {
        this.page = page;
        this.txtTitle = this.page.locator("[name='title']");
        this.txtProvider = this.page.locator('#providerSearch');
        this.firstLookupWrapper = this.page.locator('.ui-helper-hidden-accessible');
        this.firstLookupResult = this.page.locator('.ui-menu-item > .ui-menu-item-wrapper').first();
        this.ddlDocumentType = this.page.locator("[name='documentType']");
        this.ddlModuleName = this.page.locator("[name='module']");
        this.txtFieldLabel = this.page.locator("[name='fieldLabel']");

        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
    }

    async createDocumentChecklist(data) {
        await this.txtTitle.fill(data.title);
        // Waits for the element to be attached to the DOM
        await this.firstLookupWrapper.waitFor({ state: 'attached' }).catch(() => {
            console.log(`Timed out waiting for Locator to become selectable`);
        });
        await this.txtProvider.fill(data.provider);
        await this.txtProvider.press('ArrowDown');
        await this.firstLookupResult.click();
        await this.ddlDocumentType.selectOption(data.documentType);
        await this.ddlModuleName.selectOption(data.moduleName);
        await this.commonButtons.clickButton('Save');
        await this.donePage.verifyPartialDoneMessage(data.expectedMsg);

        if (!data.fieldLabels) return;

        const fieldLabelList = data.fieldLabels
            .split(',')
            .map(fieldLabel => fieldLabel.trim())
            .filter(fieldLabel => fieldLabel);

        for (const fieldLabel of fieldLabelList) {
            await this.commonButtons.clickButton('Add');
            await this.txtFieldLabel.fill(fieldLabel);
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage(data.expectedMsg);
        }
    }
}