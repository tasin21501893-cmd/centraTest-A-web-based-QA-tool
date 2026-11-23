/**
 * @author Timon Protik Mondal
 * @since 17/04/2025
 */

import { expect } from '@playwright/test';

export class RevenueCodePage {
    
    constructor(page) {
        this.page = page;
        this.txtCode = page.locator('[name="code"]');
        this.txtDescription = page.locator('[name="description"]');
        this.txtOccurrenceSpanCode = page.locator('[name="occurrenceSpanCode"]');
        this.codeErrorMsg = page.locator('#code\\.errors');
        this.descriptionErrorMsg = page.locator('#description\\.errors');
        this.occurrenceSpanCodeErrorMsg = page.locator('#occurrenceSpanCode\\.errors');
        this.selectRevenueCode = page.locator('#revenueCodeList tbody tr td a').first();
    };

    async revenueCodeFillUp(data) {
        await this.txtCode.fill(data.code);
        await this.txtDescription.fill(data.description);

        if(await this.isOccurrenceSpanCodeAvailable()){
            await this.txtOccurrenceSpanCode.fill(data.occurrenceSpanCode);
        }
    };

    async isOccurrenceSpanCodeAvailable(){
        await this.page.waitForLoadState('domcontentloaded');
        
        if (await this.txtOccurrenceSpanCode.isVisible()) {
            return true;
        }
    };

    async clickRevenueCode(data) {
        await this.selectRevenueCode.click();
    };

    async validateCodeErrorMsg(expectedMsg) {
        await expect(this.codeErrorMsg).toHaveText(`${expectedMsg}`);
    };

    async validateDescriptionErrorMsg(expectedMsg) {
        await expect(this.descriptionErrorMsg).toHaveText(`${expectedMsg}`);
    };

    async validateOccurrenceSpanCodeErrorMsg(expectedMsg) {
        await expect(this.occurrenceSpanCodeErrorMsg).toHaveText(`${expectedMsg}`);
    };

}