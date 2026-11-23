/**
 * @author Mohammad Abdur Rafi Farhab
 * @since 02/25/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class CustomFieldPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);

        this.txtCustomFieldName = page.locator('[name="fieldName"]');
        this.ddlDataType = page.locator('[name="dataType"]');
        this.txtFieldLength = page.locator('[name="fieldLength"]');
        this.rdoRequiredYes = page.getByLabel('Yes');
        this.btnAddOption = page.locator('button.add-option-item');
        this.txtOptions = page.locator('[name="options"]');
        this.alertDanger = page.locator('div.alert.alert-danger');
    }

    async checkRequiredRadioButton(required) {
        if (CommonUtils.isAffirmative(required)) {
            await this.commonUtils.selectRadioButton(this.rdoRequiredYes);
        }
    }

    async customFieldFormFillUp(data) {
        await this.txtCustomFieldName.fill(data.customFieldName);
        await this.ddlDataType.selectOption(data.dataType);
        await this.checkRequiredRadioButton(data.required);
        await this.fieldLengthFill(data.fieldLength);
        await this.dataTypeDropdownOptionsSelect(data.dataType, data.numberOfDropdownOptions, data.optionsSeparatedByComma);
    }

    async fieldLengthFill(fieldLength) {
        if (await this.txtFieldLength.isVisible()) {
            await this.txtFieldLength.fill(fieldLength);
        }
    }

    async dataTypeDropdownOptionsSelect(dataType, numberOfDropdownOptions, optionsSeparatedByComma) {
        if (dataType.toLowerCase() == 'dropdown') {

            const optionsArray = await this.commonUtils.parseCommaSeparatedList(optionsSeparatedByComma);

            for (let i = 0; i < numberOfDropdownOptions; i++) {
                const currentInput = await this.txtOptions.nth(i);

                if (!(await currentInput.isVisible())) {
                    await this.btnAddOption.click();
                    await currentInput.waitFor({ state: 'visible' });
                }

                await currentInput.fill(optionsArray[i]);
            }
        }
    }

    async verifyWarningMsg(expectedMsg) {
        await expect(this.alertDanger).toHaveText(`${expectedMsg}`);
    }
}