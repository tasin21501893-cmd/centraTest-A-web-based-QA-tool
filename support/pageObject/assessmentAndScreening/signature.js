/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { generateInteger } from '../../helper/acfCore/formFillUpDataProcessor';
import { CommonButtons } from '../../commonUtility/commonButtons';

export class Signature {
    /** 
     * @param {import('playwright').Page} page 
     */

    constructor(page) {
        this.page = page;

        this.commonButtons = new CommonButtons(page);
    }

    async drawSignature() {
        const canvas = this.page.locator('#signature-pad');
        await canvas.waitFor({ state: 'visible' });
        const box = await canvas.boundingBox();
        if (!box) throw new Error('Canvas not found');

        const startX = box.x + 50;
        const startY = box.y + 20;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX, startY + 100);
        await this.page.mouse.move(startX + 50, startY + 100);
        await this.page.mouse.up();

        await this.commonButtons.clickButton('Save');
    }

    async checkSignatureByIndividual() {
        await this.page.locator('[aria-label="isClientSignature"]').check();
    }

    async chooseSignatory() {
        const dropdownSelector = '#spDropDown';
        await this.page.waitForSelector(dropdownSelector);

        const options = await this.page.$$(`${dropdownSelector} option`);
        const availableOptions = options.filter(option => option.textContent !== '- Please Select -' && option.textContent !== 'Other');
        const randomIndex = generateInteger(availableOptions.length - 1);
        const randomOption = availableOptions[randomIndex];
        const valueToSelect = await randomOption.getAttribute('value');

        await this.page.selectOption(dropdownSelector, valueToSelect);
    }
}