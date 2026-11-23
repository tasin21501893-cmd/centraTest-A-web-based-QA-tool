/**
 * @author Mohaimen Abid Mahadi
 * @since 18/09/25
 */

import { CommonButtons } from "../../commonUtility/commonButtons.js";

export class TimeTrackingTemplatePage {

    constructor(page) {
        this.page = page;
        this.txtTemplateName = this.page.locator("[name='typeName']");
        this.dtpStartTime = this.page.locator("[name='startTime']");
        this.dtpEndTime = this.page.locator("[name='endTime']");
        this.ddlInterval = this.page.locator("[name='intervalPeriod']");
        this.txtNote = this.page.locator("[name='note']");

        this.errMsgTemplateName = this.page.locator("[id='typeName.errors']");
        this.errMsgStartTime = this.page.locator("[id='startTime.errors']");
        this.errMsgEndTime = this.page.locator("[id='endTime.errors']");
        this.errMsgInterval = this.page.locator("[id='intervalPeriod.errors']");
        this.errMsgOptionsName = this.page.locator("[id='timeTrackingOptions[0].name.errors']");
        this.errMsgOptionsColor = this.page.locator("[id='timeTrackingOptions[0].colorCode.errors']");
        this.errMsgNote = this.page.locator("[id='note.errors']");

        this.commonButtons = new CommonButtons(page);
    }

    async fillUpForm(data) {
        await this.txtTemplateName.fill(data.templateName);
        await this.dtpStartTime.fill(data.startTime);
        await this.dtpEndTime.fill(data.endTime);
        await this.ddlInterval.selectOption(data.interval);
        
        const optionNames = (data.optionNames).split(',').map(value=> value.trim());
        const optionColors = (data.optionColors).split(',').map(value=> value.trim());
        
        for (let optionIndex = 0; optionIndex < optionNames.length; optionIndex++){
            if (optionIndex > 1) {
                await this.commonButtons.clickButton('Add More');
            }

            await this.page.locator('[id="timeTrackingOptions['+ optionIndex +'].name"]').fill(optionNames[optionIndex]);
            await this.page.locator('[data-id="timeTrackingOptions['+ optionIndex +'].colorCode"]').click();
            await this.page.getByRole('option', { name: optionColors[optionIndex], exact: true }).click();
        }

        await this.txtNote.fill(data.note);
        await this.commonButtons.clickButton('Save');
    }
}