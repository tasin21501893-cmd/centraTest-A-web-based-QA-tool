/**
 * @author Sayed Ahmed Tasin
 * @since 18/05/2026
 */

import { ListPage } from '../../../commonPages/listPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';

const DEFAULT_SELECT_OPTION = '- Please Select -';

export class HealthProfileForm {
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.ddlHeightFeet = page.locator('[id="heightFeetPickerBtn"]');
        this.ddlHeightInch = page.locator('[id="heightInchPickerBtn"]');
        this.txtWeightRangeFrom = page.locator('[name="weightFrom"]');
        this.txtWeightRangeTo = page.locator('[name="weightTo"]');
        this.txtTemperatureFrom = page.locator('[name="temperatureFrom"]');
        this.txtTemperatureTo = page.locator('[name="temperatureTo"]');
        this.txtPulseFrom = page.locator('[name="pulseFrom"]');
        this.txtPulseTo = page.locator('[name="pulseTo"]');
        this.txtOxygenSaturationFrom = page.locator('[name="oxygenSaturationFrom"]');
        this.txtOxygenSaturationTo = page.locator('[name="oxygenSaturationTo"]');
        this.txtRespirationFrom = page.locator('[name="respirationFrom"]');
        this.txtRespirationTo = page.locator('[name="respirationTo"]');
        this.txtBloodPressureSystolicFrom = page.locator('[name="bpSystolicFrom"]');
        this.txtBloodPressureSystolicTo = page.locator('[name="bpSystolicTo"]');
        this.txtBloodPressureDiastolicFrom = page.locator('[name="bpDiastolicFrom"]');
        this.txtBloodPressureDiastolicTo = page.locator('[name="bpDiastolicTo"]');
        this.errMsgHeightFeet = page.locator('[id="heightFeet.errors"]');
        this.errMsgHeightInch = page.locator('[id="heightInch.errors"]');
        this.errMsgWeightRangeFrom = page.locator('[id="weightFrom.errors"]');
        this.errMsgWeightRangeTo = page.locator('[id="weightTo.errors"]');
        this.errMsgTemperatureFrom = page.locator('[id="temperatureFrom.errors"]');
        this.errMsgTemperatureTo = page.locator('[id="temperatureTo.errors"]');
        this.errMsgPulseFrom = page.locator('[id="pulseFrom.errors"]');
        this.errMsgPulseTo = page.locator('[id="pulseTo.errors"]');
        this.errMsgOxygenSaturationFrom = page.locator('[id="oxygenSaturationFrom.errors"]');
        this.errMsgOxygenSaturationTo = page.locator('[id="oxygenSaturationTo.errors"]');
        this.errMsgRespirationFrom = page.locator('[id="respirationFrom.errors"]');
        this.errMsgRespirationTo = page.locator('[id="respirationTo.errors"]');
        this.errMsgBloodPressureSystolicFrom = page.locator('[id="bpSystolicFrom.errors"]');
        this.errMsgBloodPressureSystolicTo = page.locator('[id="bpSystolicTo.errors"]');
        this.errMsgBloodPressureDiastolicFrom = page.locator('[id="bpDiastolicFrom.errors"]');
        this.errMsgBloodPressureDiastolicTo = page.locator('[id="bpDiastolicTo.errors"]');
        this.lnkHealthProfile = page.locator('a.link', { hasText: 'Health Profile' });
    }

    async clearForm() {
        const fieldsToClear = [
            this.txtWeightRangeFrom, this.txtWeightRangeTo,
            this.txtTemperatureFrom, this.txtTemperatureTo,
            this.txtPulseFrom, this.txtPulseTo,
            this.txtOxygenSaturationFrom, this.txtOxygenSaturationTo,
            this.txtRespirationFrom, this.txtRespirationTo,
            this.txtBloodPressureSystolicFrom, this.txtBloodPressureSystolicTo,
            this.txtBloodPressureDiastolicFrom, this.txtBloodPressureDiastolicTo
        ];

        for (const field of fieldsToClear) {
            await field.clear();
        }

        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlHeightFeet, DEFAULT_SELECT_OPTION);
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlHeightInch, DEFAULT_SELECT_OPTION);
    }

    async fillWithMaxLengthCheck(locator, value) {
        if (value === undefined || value === null || value === '') return;
        value = value.toString();

        const maxLengthAttr = await locator.getAttribute('maxlength');
        if (maxLengthAttr) {
            const maxLength = parseInt(maxLengthAttr, 10);
            if (value.length > maxLength) {
                await locator.evaluate(el => el.removeAttribute('maxlength'));
            }
        }
        await locator.fill(value);
    }

    async fillupForm(formObject) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlHeightFeet, formObject.heightFeet);
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlHeightInch, formObject.heightInch);
        formObject.weightFrom && await this.txtWeightRangeFrom.fill(formObject.weightFrom);
        formObject.weightTo && await this.txtWeightRangeTo.fill(formObject.weightTo);
        formObject.temperatureFrom && await this.txtTemperatureFrom.fill(formObject.temperatureFrom);
        formObject.temperatureTo && await this.txtTemperatureTo.fill(formObject.temperatureTo);
        formObject.pulseFrom && await this.txtPulseFrom.fill(formObject.pulseFrom);

        if (formObject.pulseTo) {
            await this.fillWithMaxLengthCheck(this.txtPulseTo, formObject.pulseTo);
        }

        formObject.oxygenSaturationFrom && await this.txtOxygenSaturationFrom.fill(formObject.oxygenSaturationFrom);

        if (formObject.oxygenSaturationTo) {
            await this.fillWithMaxLengthCheck(this.txtOxygenSaturationTo, formObject.oxygenSaturationTo);
        }

        formObject.respirationFrom && await this.txtRespirationFrom.fill(formObject.respirationFrom);

        if (formObject.respirationTo) {
            await this.fillWithMaxLengthCheck(this.txtRespirationTo, formObject.respirationTo);
        }

        formObject.bpSystolicFrom && await this.txtBloodPressureSystolicFrom.fill(formObject.bpSystolicFrom);

        if (formObject.bpSystolicTo) {
            await this.fillWithMaxLengthCheck(this.txtBloodPressureSystolicTo, formObject.bpSystolicTo);
        }

        formObject.bpDiastolicFrom && await this.txtBloodPressureDiastolicFrom.fill(formObject.bpDiastolicFrom);

        if (formObject.bpDiastolicTo) {
            await this.fillWithMaxLengthCheck(this.txtBloodPressureDiastolicTo, formObject.bpDiastolicTo);
        }
    }
}
