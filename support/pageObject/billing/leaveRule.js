/**
 * @author Sheikh Faiyaz Mahamud
 * @since 21/05/25
*/

export class LeaveRule {

    constructor(page) {
        this.page = page;
        this.txtRuleName = page.locator(`[name='ruleName']`);
        this.txtMaxMonthlyLeaveDays = page.locator(`[name='maxMonthlyLeaveDays']`);
        this.txtMaxYearlyLeaveDays = page.locator(`[name='maxYearlyLeaveDays']`);
        this.txtMaxConsecutiveLeaveDays = page.locator(`[name='maxConsecutiveLeaveDays']`);

        this.rdoCalendarYear = page.locator('#yearType1');
        this.rdoFiscalYear = page.locator('#yearType2');

        this.rdoRateSourceMap = {
            'Service Rate': page.locator('#rateSource1'),
            'Unit Rate History': page.locator('#rateSource2'),
            'Define Rate Below': page.locator('#rateSource3'),
            'Percentage of Service Rate': page.locator('#rateSource4'),
            'Define Rate In Service': page.locator('#rateSource5'),
        };

        this.rdoBillingDataGroupingTypeMap = {
            'Per Day': page.locator('#billDataGrouping1'),
            'Group Per Continuous Option': page.locator('#billDataGrouping2'),
            'Group Per Option': page.locator('#billDataGrouping3'),
            'Group Per Revenue Code': page.locator('#billDataGrouping4'),
            'Group Per Continuous Revenue Code': page.locator('#billDataGrouping5'),
        };

        this.txtNonCoveredDaysPolicyMap = {
            'No Billing Data': page.locator('#nonCoveredDayPolicy1'),
            'Billing Data with non-billable units': page.locator('#nonCoveredDayPolicy2'),
            'Billing Data with non-billable units and Revenue Code': page.locator('#nonCoveredDayPolicy3'),
            'Billing Data with billable units and Revenue Code': page.locator('#nonCoveredDayPolicy4'),
        };
    }

    async selectYear(year) {
        if (year.trim().toLowerCase() === 'calendar year') {
            await this.rdoCalendarYear.click();
        } else {
            await this.rdoFiscalYear.click();
        }
    }

    async checkRateSource(rateSource) {
        const sourceOption = this.rdoRateSourceMap[rateSource];
        if (sourceOption)
            await sourceOption.check();
    }

    async checkBillingDataGroupingType(option) {
        const locator = this.rdoBillingDataGroupingTypeMap[option];
        if (locator)
            await locator.check();
    }

    async checkNonCoveredDayPolicy(option) {
        const locator = this.txtNonCoveredDaysPolicyMap[option];
        if (locator)
            await locator.check();
    }

    async fillUpLeaveRuleForm(ruleName, data) {
        await this.txtRuleName.fill(ruleName);
        await this.txtMaxMonthlyLeaveDays.fill(data.maxMonthlyLeaveDays);
        await this.selectYear(data.yearType);
        await this.checkRateSource(data.rateSource);
        await this.checkBillingDataGroupingType(data.billingDataGroupingType);
        await this.checkNonCoveredDayPolicy(data.billingForNonCoveredDays);
    }

    async updateLeaveRuleForm(data) {
        await this.txtMaxMonthlyLeaveDays.fill(data.updatedMaxMonthlyLeaveDays);
    }
}