/**
* @author Rownak Jahan Nowrin
* @since 10/24/2024
*/
import { expect } from '@playwright/test';

exports.NdSisWorksheet = class NdSisWorksheet {
    /**
    * @param {import('@playwright/test').Page} page -The Playwright Page Object  
    */

    constructor(page) {
        this.page = page;
        this.atcIndividual = page.locator("input#clientLookup");
        this.txtSisTrackingNum = page.locator("input[name='sisTrackingNum']");
        this.txtSisId = page.locator("input[name='sisId']");
        this.txtSisAssessmentFormId = page.locator('input[name="formId"]');
        this.dtpCreatedFromDate = page.locator("input[name='createdFrom']");
        this.dtpCreatedToDate = page.locator("input[name ='createdTo']");
        this.dtpEffectiveDate = page.locator("input[name='effectiveDate']");
        this.dtpExpirationDate = page.locator("input[name='expirationDate']");
    }

    async searchAndFilter(data) {
        if (data.individualName) {
            await this.atcIndividual.fill(data.individualName)
            await this.page.waitForSelector("div[class='ui-menu-item-wrapper']")
            const options = await this.page.$$("div[class='ui-menu-item-wrapper']")

            for (let option of options) {
                const val = await option.textContent()

                if (val.includes(data.individualName)) {
                    await option.click()
                    break;
                }
            }
        }

        await this.txtSisTrackingNum.fill(data.sisTrackingNum)
        await this.txtSisId.fill(data.sisId)
        await this.txtSisAssessmentFormId.fill(data.sisAssessmentFormId)
        await this.dtpCreatedFromDate.fill(data.createDateFrom)
        await this.dtpCreatedToDate.fill(data.createDateTo)
    }

    async formFillUp(effectiveDate, expirationDate) {
        await this.dtpEffectiveDate.fill(effectiveDate)
        await this.dtpExpirationDate.fill(expirationDate)
    }

    async isValidationMessagePresent(page, validationMessage) {
        await expect(page.locator(`text=${validationMessage}`)).toBeVisible();
    }
}
