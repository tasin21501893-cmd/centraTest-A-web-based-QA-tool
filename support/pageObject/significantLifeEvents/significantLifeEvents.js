/**
 * @author Nadia Motalib Laboni
 * @since 01/11/2024
 */

const { expect } = require('@playwright/test');
const { CommonButtons } = require("../../commonUtility/commonButtons.js");
const { CommonUtils } = require("../../commonUtility/commonUtils.js");


exports.significantLifeEvents = class significantLifeEvents {

    constructor(page) {
        this.page = page;
        this.txtEvent = page.locator('[name="tmpItem.event"]');
        this.ddlCategory = page.locator('[name="tmpItem.category"]');
        this.txtCategoryOther = page.locator('[name="tmpItem.categoryOther"]');
        this.dtpEventDate = page.locator('[name="tmpItem.eventDate"]');
        this.txtDescription = page.locator('[name="tmpItem.description"]');


        this.eventErrorMsg = page.locator('#tmpItem\\.event\\.errors');
        this.categoryErrorMsg = page.locator('#tmpItem\\.category\\.errors');
        this.categoryOtherErrorMsg = page.locator('#tmpItem\\.categoryOther\\.errors');
        this.eventDateErrorMsg = page.locator('#tmpItem\\.eventDate\\.errors');
        this.descriptionErrorMsg = page.locator('#tmpItem\\.description\\.errors');
        this.globalErrorMsg = page.locator('.alert-danger');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    async addSignificantLifeEvent(data) {
        await this._setEvent(data.event);
        await this._setCategory(data.category, data.categoryOther);
        await this._setEventDate(data.eventDate);
        await this._setDescription(data.descriptionLength, data.description);

        await this.commonButtons.clickButton('Add');
    }

    async validateGlobalErrorMsg(errorMsgLocator, expectedErrorMsg) {
        await expect(errorMsgLocator).toContainText(`${expectedErrorMsg}`);
    }

    async validateErrorMsg(errorMsgLocator, expectedErrorMsg) {
        await expect(errorMsgLocator).toHaveText(`${expectedErrorMsg}`);
    }

    async clickActionButton() {
        const isSaveButtonVisible = await this.commonButtons.isButtonPresent('Save');

        await this.commonButtons.clickButton(isSaveButtonVisible ? 'Save' : 'Update');
    }

    async _setEvent(event) {
        await this.txtEvent.fill(event);
    }

    async _setCategory(category, categoryOther) {
        await this.ddlCategory.selectOption(category);

        if (category === 'Other') {
            await this.txtCategoryOther.fill(categoryOther);
        }
    }

    async _setEventDate(eventDate) {
        await this.dtpEventDate.fill(eventDate);
    }

    async _setDescription(descriptionLength, description) {
        if (descriptionLength) {
            description = await this.commonUtils.generateString(descriptionLength);
        }

        await this.txtDescription.fill(description);
    }
}