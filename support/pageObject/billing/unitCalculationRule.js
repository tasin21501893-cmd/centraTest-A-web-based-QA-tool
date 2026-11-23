/**
 * @author Sheikh Faiyaz Mahamud
 * @since 01/06/25
*/

export class UnitCalculationRule {

    constructor(page) {
        this.page = page;
        this.txtRuleName = page.locator(`[name='ruleName']`);

        this.rdoBundleRulesMap = {
            'Bundle for each day': page.locator('#bundlePreference1'),
            'Bundle for date range': page.locator('#bundlePreference2'),
        };

        this.rdoCalculationOfUnitsMap = {
            'Use duration from time In/Out': page.locator('#calculationUnitSrc1'),
            'Use the specified unit': page.locator('#calculationUnitSrc2'),
            'Use number of days': page.locator('#calculationUnitSrc3'),
            'Use number of sessions': page.locator('#calculationUnitSrc4'),
            'Use direct billing units': page.locator('#calculationUnitSrc5')
        };

        this.rdoApplyRoundingAlgorithmMap = {
            'For the duration of each Data': page.locator('#roundingPreference1'),
            'For the total duration of all Data': page.locator('#roundingPreference2'),
            'For the total duration of all Data per Day': page.locator('#roundingPreference3')
        };

        this.txtSpecifiedUnit = page.locator('#specifiedUnits');
    }

    async checkBundleRules(rule) {
        const bundleRules = this.rdoBundleRulesMap[rule];
        if (bundleRules)
            await bundleRules.check();
    }

    async checkCalculationOfUnits(unit) {
        const calculationOfUnits = this.rdoCalculationOfUnitsMap[unit];
        if (calculationOfUnits)
            await calculationOfUnits.check();
    }

    async checkApplyRoundingAlgorithm(algo) {
        const applyRoundingAlgorithm = this.rdoApplyRoundingAlgorithmMap[algo];
        if (applyRoundingAlgorithm)
            await applyRoundingAlgorithm.check();
    }

    async fillUpUnitCalculationRuleForm(data) {
        await this.txtRuleName.fill(data.ruleName);
        await this.checkBundleRules(data.bundleRules);
        await this.checkCalculationOfUnits(data.calculationOfUnits);

        if (data.calculationOfUnits.trim().toLowerCase() === 'use duration from time in/out') {
            if (!data.applyRoundingAlgorithm) {
                throw new Error('Missing rounding option in excel file');
            }
            await this.checkApplyRoundingAlgorithm(data.applyRoundingAlgorithm);
        }

        if (data.calculationOfUnits.trim().toLowerCase() === 'use the specified unit') {
            if (!data.specifiedUnit) {
                throw new Error('Missing Specified Unit value in excel file');
            }
            await this.txtSpecifiedUnit.fill(data.specifiedUnit);
        }
    }

    async updateUnitCalculationRuleForm(data) {
        await this.checkBundleRules(data.updatedBundleRules);
    }
}