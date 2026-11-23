/**
 * @author Mohaimen Abid Mahadi
 * @since 18/09/25
 */

import { CommonUtils } from "../../commonUtility/commonUtils.js";
import { CommonButtons } from "../../commonUtility/commonButtons.js";
import { DonePage } from "../../commonPages/donePage.js";

export class DailyDataPage {

    constructor(page) {
        this.page = page;
        this.ddlTemplateName = this.page.locator("[name='template']");
        this.dtpDate = this.page.locator("[name='entryDate']");
        this.optionList = this.page.locator(`div.form-group:has(select[name="timeTrackingCells[0].timeTrackingOption"])`).locator('ul.inner > li');
        this.enabledDropdown = this.page.locator('div.btn-group.bootstrap-select \> button:not(.disabled)');
        this.currentDate = this.page.locator('div.form-group:has-text("Date")').locator('+ div.label-value');
        this.timeSlot = this.page.locator('label.control-label');

        this.errMsgTemplateName = this.page.locator("[id='template.errors']");
        this.errMsgDate = this.page.locator("[id='entryDate.errors']");
        this.alert = this.page.locator("[class='alert alert-danger']");

        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
    }

    async saveOrUpdateDailyData() {
        await this.page.waitForLoadState("domcontentloaded");
        const numberOfDropdowns = await this.enabledDropdown.count();
        const totalOptions = await this.optionList.count();

        for (let currentDropdownIndex = 0; currentDropdownIndex < numberOfDropdowns; currentDropdownIndex++) {
            const dropdownFormGroup = this.page.locator(`div.form-group:has(select[name="timeTrackingCells[${currentDropdownIndex}].timeTrackingOption"])`);
            const dropdownButton = dropdownFormGroup.locator('button.dropdown-toggle');
            const optionToSelect = dropdownFormGroup.locator('ul.inner > li').nth((currentDropdownIndex % (totalOptions - 1)) + 1);

            await dropdownButton.click();
            await optionToSelect.click();
        }

        if (await this.commonButtons.isButtonPresent('Update')) {
            await this.commonButtons.clickButton('Update');

        } else await this.commonButtons.clickButton('Save');
    }

    async getSelectedOptionText(index) {
        const dropdownSelect = this.page.locator(`select[name="timeTrackingCells[${index}].timeTrackingOption"]`);
        const selectedValue = await dropdownSelect.locator('option[selected="selected"]').getAttribute('data-content');
        const match = selectedValue.match(/class='([^']*)'/);
        const optionText = await this.page.locator(`span.${match[1]}`).first().textContent();

        return optionText ? optionText.trim() : null;
    }

    async validateOptionsColor() {
        await this.page.waitForLoadState("domcontentloaded");
        const numberOfDropdowns = await this.enabledDropdown.count();
        const timeSlotTexts = (await this.timeSlot.allTextContents()).map(text => text.trim());
        const currentDate = (await this.currentDate.textContent()).trim();
        const totalOptions = await this.optionList.count();
        const optionTexts = (await this.optionList.allTextContents()).map(text => text.trim());
        let unmatchedItem = 0;

        for (let currentDropdownIndex = 0; currentDropdownIndex < numberOfDropdowns; currentDropdownIndex++) {
            const expectedOption = optionTexts[((currentDropdownIndex % (totalOptions - 1)) + 1)];
            const selectedOption = await this.getSelectedOptionText(currentDropdownIndex);

            if (selectedOption !== expectedOption) {
                unmatchedItem++;
                console.log('Date: '+ currentDate +' Time slot: '+ timeSlotTexts[currentDropdownIndex+1] +" - Selected: '" + selectedOption + "' and expected: '" + expectedOption +"'");
            }
        }

        return unmatchedItem;
    }

    async fillUpForm(data) {
        await this.ddlTemplateName.selectOption(data.templateName);

        if (data.startDate) {
            await this.commonUtils.selectCheckboxUsingFieldName(this.page, 'Specific Date');
            await this.dtpDate.fill(data.startDate);
        }

        await this.commonButtons.clickButton('Next');
        await this.saveOrUpdateDailyData();

        if (data.endDate) {
            let totalDates = await this.commonUtils.calculateDaysBetweenDates(data.startDate, data.endDate);
            while (totalDates--) {
                await this.donePage.clickLinkByText('Form');
                await this.commonButtons.clickButton('Next Day');
                await this.saveOrUpdateDailyData();
            }
        }
    }

    async validateForm(data) {
        await this.ddlTemplateName.selectOption(data.templateName);

        if (data.startDate) {
            await this.commonUtils.selectCheckboxUsingFieldName(this.page, 'Specific Date');
            await this.dtpDate.fill(data.startDate);
        }

        await this.commonButtons.clickButton('Next');
        let unmatchedItem = await this.validateOptionsColor();

        if (data.endDate) {
            let totalDates = await this.commonUtils.calculateDaysBetweenDates(data.startDate, data.endDate);
            while (totalDates--) {
                await this.commonButtons.clickButton("Next Day");
                unmatchedItem += await this.validateOptionsColor();
            }
        } 

        return unmatchedItem;
    }

}