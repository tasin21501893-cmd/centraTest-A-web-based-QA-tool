/**
 * @author Sheikh Faiyaz Mahamud
 * @since 07/04/2025
 */

export class AttendanceType {

    constructor(page) {
        this.page = page;
        this.txtAttendanceTypeName = page.locator('#typeName');
        this.rdoYes = page.locator('#calBillableUnitFromTimeInOut1');
        this.rdoNo = page.locator('#calBillableUnitFromTimeInOut2');
        this.rdoEntireDay = page.locator('#mergeTimeSlots1');
        this.rdoEachSession = page.locator('#mergeTimeSlots2');

        this.chkUseBundleRules = page.locator(`[name='hasBundleRule']`);
        this.chkUseIspDataAsSupportingDoc = page.locator(`[name='hasIspDataSupportingDoc']`);

        this.rdoContinuousBundling = page.locator('#bundleType1');
        this.rdoDailyBundling = page.locator('#bundleType2');

        this.rdoToAttendanceRecord = page.locator('#ispDataSupportingDocLinkingCriteria1');
        this.rdoToAttendanceTimeEntry = page.locator('#ispDataSupportingDocLinkingCriteria2');

        this.rdoSameProgramOnly = page.locator('#ispDataSupportingDocType1');
        this.rdoAnyProgram = page.locator('#ispDataSupportingDocType2');
        this.rdoSupportingDocument = page.locator('#ispDataSupportingDocType3');
        this.chkIspDataCriteria = page.locator(`[name='ispDataCriteria']`);

        this.txtMinimum = (index) => page.locator(`input[name="bundleRuleList[${index}].minValue"]`);
        this.txtMaximum = (index) => page.locator(`input[name="bundleRuleList[${index}].maxValue"]`);
        this.txtBillableUnits = (index) => page.locator(`input[name="bundleRuleList[${index}].billableUnit"]`);
        this.txtBundleCode = (index) => page.locator(`input[name="bundleRuleList[${index}].bundleCode"]`);

        this.txtOptionName = (index) => page.locator(`input[name="optionList[${index}].optionName"]`);
        this.txtOptionCode = (index) => page.locator(`input[name="optionList[${index}].shortCode"]`);
        this.txtIspDataCount = (index) => page.locator(`input[name="optionList[${index}].ispDataCount"]`);
        this.txtBillingUnits = (index) => page.locator(`input[name="optionList[${index}].correspondingBillingUnit"]`);
        this.chkBillable = (index) => page.locator(`input[name="optionList[${index}].billable"]`);
    }

    async checkUseTimeInOut(time) {
        const timeVal = time.trim().toLowerCase();
        if (timeVal === 'yes') {
            await this.rdoYes.click();
        } else if (timeVal === 'no') {
            await this.rdoNo.click();
        }
    }

    async checkDuration(duration) {
        const durationVal = duration.trim().toLowerCase();
        if (durationVal === 'for the entire day') {
            await this.rdoEntireDay.click();
        } else {
            await this.rdoEachSession.click();
        }
    }

    async checkBundleRuleOption(bundle) {
        const bundleVal = bundle.trim().toLowerCase();
        if (bundleVal === 'continuous bundling') {
            await this.rdoContinuousBundling.click();
        } else if (bundleVal === 'daily bundling') {
            await this.rdoDailyBundling.click();
        }
    }

    async checkUseIspDataAsSupportingDoc(doc) {
        const docVal = doc.trim().toLowerCase();
        if (docVal === 'yes') {
            await this.chkUseIspDataAsSupportingDoc.click();
        }
    }

    async checkLinkIspData(data) {
        const dataVal = data.trim().toLowerCase();
        if (dataVal === 'To Attendance Record') {
            await this.rdoToAttendanceRecord.click();
        }
        else
            await this.rdoToAttendanceTimeEntry.click();
    }

    async checkIspProgramSelectionCriteria(data) {
        const dataVal = data.trim().toLowerCase();
        if (dataVal === 'Supporting Document') {
            await this.rdoSupportingDocument.click();
        }
        else if (dataVal === 'Any Program') {
            await this.rdoAnyProgram.click();
        }
        else
            await this.rdoSameProgramOnly.click();
    }

    async checkIspDataCriteria(data) {
        const dataVal = data.trim().toLowerCase();
        if (dataVal === 'yes') {
            await this.chkIspDataCriteria.click();
        }
    }

    async fillUpAttendanceTypeForm(data, attendanceTypeName) {

        if (attendanceTypeName === undefined) {
            attendanceTypeName = data.attendanceTypeName;
        }

        const timeInOutVal = data.timeInOut.trim().toLowerCase();
        const useBundleRules = data.useBundleRules.trim().toLowerCase();

        await this.txtAttendanceTypeName.fill(attendanceTypeName);

        if (timeInOutVal === 'yes') {
            await this.rdoYes.click();
            await this.checkDuration(data.useDuration);
        }

        if (useBundleRules === 'yes') {
            await this.chkUseBundleRules.click();
            await this.page.waitForTimeout(400);
            await this.checkBundleRuleOption(data.bundleRulesType);
        }

        if (data.useIspDataAsSupportingDoc.trim().toLowerCase() === 'yes') {
            await this.checkLinkIspData(data.linkIspData);
            await this.checkIspProgramSelectionCriteria(data.ispProgramSelectionCriteria);
            await this.checkIspDataCriteria(data.ispDataCriteria);
        }
    }

    async updateAttendanceTypeForm(data1, data2) {
        await this.updateBundleRule(data1);
        await this.updateOptions(data2);
    }

    async fillUpBundleRule(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtMinimum(i).fill(data[i].minimum);
            await this.txtMaximum(i).fill(data[i].maximum);
            await this.txtBillableUnits(i).fill(data[i].billableUnits);
            await this.txtBundleCode(i).fill(data[i].bundleCode);
        }
    }

    async updateBundleRule(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtMinimum(i).fill(data[i].updatedMinimum);
            await this.txtMaximum(i).fill(data[i].updatedMaximum);
            await this.txtBillableUnits(i).fill(data[i].updatedBillableUnits);
            await this.txtBundleCode(i).fill(data[i].updatedBundleCode);
        }
    }

    async fillUpOptions(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtOptionName(i).fill(data[i].optionName);
            await this.txtOptionCode(i).fill(data[i].optionCode);

            if (data[i].ispDataCount) {
                await this.txtIspDataCount(i).fill(data[i].ispDataCount);
            }

            if (data[i].billingUnits) {
                await this.txtBillingUnits(i).fill(data[i].billingUnits);
            }

            if (data[i].billable && data[i].billable.toString().trim().toLowerCase() === 'no') {
                await this.chkBillable(i).click();
            }
        }
    }

    async updateOptions(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtOptionName(i).fill(data[i].updatedOptionName);
            await this.txtOptionCode(i).fill(data[i].updatedOptionCode);
        }
    }

    // This method is specifically for creating attendance for Daily IRA which cannot use bundle rule
    async fillUpAttendanceTypeForDailyIRA(data) {
        await this.txtAttendanceTypeName.fill(data.attendanceType);
        await this.checkUseTimeInOut(data.timeInOut);
    }

    async fillOptionsForDailyIra(data) {
        for (let i = 0; i < data.length; i++) {
            await this.txtOptionName(i).fill(data[i].optionName);
            await this.txtOptionCode(i).fill(data[i].optionCode);
            await this.txtBillingUnits(i).fill(data[i].billingUnits);
        }
    }
}