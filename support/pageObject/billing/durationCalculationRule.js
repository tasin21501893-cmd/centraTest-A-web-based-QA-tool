/**
 * @author Sheikh Faiyaz Mahamud
 * @since 29/05/2025
 */

export class DurationCalculationRule {

    constructor(page) {
        this.page = page;
        this.txtRuleName = page.locator(`[name='ruleName']`);
        this.rdoCheckInOutOptionsMap = {
            'Total Duration': page.locator('#durationCalculationOption1'),
            'Not more than Scheduled Duration': page.locator('#durationCalculationOption2'),
            'Duration within Scheduled Time': page.locator('#durationCalculationOption3')
        };
        this.chkEnableSupportingDocValidation = page.locator(`[name='supportingDocValidationEnabled']`);
        this.rdoOvernightBillingOptionsMap = {
            'Use Check-In Date as Service Date': page.locator('#overnightBillingOption1'),
            'Use Check-Out Date as Service Date': page.locator('#overnightBillingOption2'),
            'Split Check-In and Check-Out at Midnight': page.locator('#overnightBillingOption3')
        };
    }

    async checkCheckInOutOptions(option) {
        const calculationOption = this.rdoCheckInOutOptionsMap[option];
        if (calculationOption)
            await calculationOption.check();
    }

    async checkSupportingDocValidation(data) {
        if (data.trim().toLowerCase() === 'yes') {
            if (!await this.chkEnableSupportingDocValidation.isChecked()) {
                await this.chkEnableSupportingDocValidation.check();
            }
        }
    }

    async checkOvernightBillingOptions(option) {
        const billingOptions = this.rdoOvernightBillingOptionsMap[option];
        if (billingOptions)
            await billingOptions.check();
    }

    async fillUpDurationCalculationRuleForm(ruleName, data) {
        await this.txtRuleName.fill(ruleName);
        await this.checkCheckInOutOptions(data.checkInOutOptions);
        await this.checkSupportingDocValidation(data.enableSupportingDocValidation);
        await this.checkOvernightBillingOptions(data.OvernightBillingOptions);
    }

    async updateDurationCalculationRuleForm(data) {
        await this.checkCheckInOutOptions(data.updatedCheckInOutOptions);
    }
}
