/**
 * @author Sheikh Faiyaz Mahamud
 * @since 05/02/2025
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class DescriptionCode {

  constructor(page) {
    this.page = page;
    this.txtServiceDescription = page.locator(`[name='desc']`);
    this.txtServiceCode = page.locator(`[name='code']`);
    this.txtAccountNumber = page.locator(`[name='accountNumber']`);
    this.txtUnitOfMeasure = page.locator(`[name='unitMeasure']`);
    this.txtUnitRate = page.locator(`[name='unitCost']`);

    this.rdoProfessionalClaim = page.locator('#claimType1');
    this.rdoInstitutionalClaim = page.locator('#claimType2');

    this.txtProcedureModifier1 = page.locator('#procedureModifier1');
    this.txtProcedureModifier2 = page.locator('#procedureModifier2');
    this.txtProcedureModifier3 = page.locator('#procedureModifier3');
    this.txtProcedureModifier4 = page.locator('#procedureModifier4');

    this.txtPrimaryDiagnosisCode = page.locator('#primaryDiagnosisCodeLookup');

    this.txtDiagnosisCodePointer1 = page.locator('#diagnosisCodePtr1');
    this.txtDiagnosisCodePointer2 = page.locator('#diagnosisCodePtr2');
    this.txtDiagnosisCodePointer3 = page.locator('#diagnosisCodePtr3');
    this.txtDiagnosisCodePointer4 = page.locator('#diagnosisCodePtr4');

    this.chkUseProcedureModifiersIn837 = page.locator(`[name='useProcedureModifiersIn837']`);

    this.btnHabilitationServicesType = page.locator(`#habPlanTypeIdPickerBtn`);

    this.btnRevenueCode = page.locator(`#revenueCodeIdPickerBtn`);
    this.txtRateCode = page.locator(`[name='rateCode']`);
    this.txtRateValue = page.locator(`[name='rateValue']`);
    this.txtLocatorCode = page.locator(`[name='locatorCode']`);
    this.chkUseLocatorCodeFromServiceForm = page.locator(`[name='useLocatorCodeFromService']`);

    this.btnUnitForElectronicSubmission = page.locator('#unitForElectronicSubmissionPickerBtn');
    this.btnProcedureQualifier = page.locator('#procedureQualifierPickerBtn');
    this.chkAddServiceDescriptionIn837 = page.locator(`[name='useDescIn837']`);

    this.chkEnableRateHistory = page.locator(`[name='enableRateHistory']`);
    this.dtpRateHistoryDateFrom = page.locator(`[name='periodFrom']`);
    this.dtpRateHistoryDateTo = page.locator(`[name='periodTo']`);
    this.txtRateHistoryUnitRate = page.locator(`[name='unitCost']`);

    this.rdoRestrict = page.locator('#totalUnitValidationLevel1');
    this.rdoRestrictNContinue = page.locator('#totalUnitValidationLevel2');
    this.rdoBlock = page.locator('#totalUnitValidationLevel3');

    this.iconBillableUnitCalculator = page.locator('title="Billable Unit Calculator"');
    this.btnUnitofMeasureCalculation = page.locator(`#unitMeasureForCalculationPickerBtn`);

    this.rdoRoundingAlgorithmMap = {
      'Half Up': page.locator('#roundingAlgorithmType1'),
      'Half Down': page.locator('#roundingAlgorithmType2'),
      'Up': page.locator('#roundingAlgorithmType3'),
      'Down': page.locator('#roundingAlgorithmType4'),
      'Quarter Up': page.locator('#roundingAlgorithmType5'),
      'Quarter Down': page.locator('#roundingAlgorithmType6'),
      'Two Third Up': page.locator('#roundingAlgorithmType7'),
      'Two Third Down': page.locator('#roundingAlgorithmType8'),
      'Three Quarter Up': page.locator('#roundingAlgorithmType9'),
      'Three Quarter Down': page.locator('#roundingAlgorithmType10'),
      'Thirteen By Fifteen Up': page.locator('#roundingAlgorithmType11'),
      'None': page.locator('#roundingAlgorithmType12')
    };

    this.rdoSmallestAllowedIncrementMap = {
      '5 Min': page.locator('#smallestAllowedIncrementInMins1'),
      '6 Min': page.locator('#smallestAllowedIncrementInMins2'),
      '7.5 Min': page.locator('#smallestAllowedIncrementInMins3'),
      '10 Min': page.locator('#smallestAllowedIncrementInMins4'),
      '15 Min': page.locator('#smallestAllowedIncrementInMins5'),
      '20 Min': page.locator('#smallestAllowedIncrementInMins6'),
      '30 Min': page.locator('#smallestAllowedIncrementInMins7'),
      '45 Min': page.locator('#smallestAllowedIncrementInMins8'),
      '60 Min': page.locator('#smallestAllowedIncrementInMins9'),
      '120 Min': page.locator('#smallestAllowedIncrementInMins10'),
    };

    this.commonUtils = new CommonUtils(page);
  }

  async checkClaimType(claimType) {
    const claimTypeLower = claimType.trim().toLowerCase();
    if (claimTypeLower === 'professional claim' || claimTypeLower === 'p' || claimTypeLower === 'professional') {
      await this.rdoProfessionalClaim.click();
    }
    else if (claimTypeLower === 'institutional claim' || claimTypeLower === 'i' || claimTypeLower === 'institutional') {
      await this.rdoInstitutionalClaim.click();
    }
  }

  async checkValidationForTotalBillableUnits(bUnits) {
    if (bUnits.trim().toLowerCase() === 'restrict') {
      await this.rdoRestrict.click();
    }
    else if (bUnits.trim().toLowerCase() === 'restrict & continue') {
      await this.rdoRestrictNContinue.click();
    }
    else if (bUnits.trim().toLowerCase() === 'block') {
      await this.rdoBlock.click();
    }
  }

  async fillUpAddRateHIstoryInfo(dateFrom, dateTo, unitRateRH) {
    const iframe = this.page.frameLocator("iframe[frameborder='0']");
    await iframe.locator('#periodFrom').fill(dateFrom);
    await iframe.locator('#periodTo').fill(dateTo);
    await iframe.locator('#unitCost').fill(unitRateRH);
    await iframe.getByText('Save').click();
  }

  async checkRoundingAlgorithm(algo) {
    const roundingAlgorithm = this.rdoRoundingAlgorithmMap[algo];
    if (roundingAlgorithm)
      await roundingAlgorithm.check();
  }

  async checkSmallestAllowedIncrement(inc) {
    const smallestAllowedIncrement = this.rdoSmallestAllowedIncrementMap[inc];
    if (smallestAllowedIncrement)
      await smallestAllowedIncrement.check();
  }

  async fillUpPrimaryDiagnosisCode(dcode) {
    await this.txtPrimaryDiagnosisCode.click();
    await this.txtPrimaryDiagnosisCode.fill(dcode);
    await this.page.waitForTimeout(3000); // Added a wait to allow options to load, based on the input.  
    await this.txtPrimaryDiagnosisCode.press('ArrowDown');
    await this.txtPrimaryDiagnosisCode.press('Enter');
  }

  async fillUpDescriptionCodeForm(data, serviceDescriptionCode) {
    if (serviceDescriptionCode === undefined) {
      serviceDescriptionCode = data.serviceDescriptionCode;
    }
    await this.txtServiceDescription.fill(serviceDescriptionCode);
    await this.txtServiceCode.fill(data.serviceCode);
    await this.txtUnitOfMeasure.fill(data.unitMeasure);
    if (data.unitRate) { await this.txtUnitRate.fill(data.unitRate); }
    await this.checkClaimType(data.claimType);

    const claimTypeLower = data.claimType.trim().toLowerCase();
    const isProfessional = claimTypeLower === 'professional claim' || claimTypeLower === 'p' || claimTypeLower === 'professional';

    if (isProfessional) {
      await this.fillUpPrimaryDiagnosisCode(data.primaryDiagnosisCode);
    }
    else {
      if (data.btnHabilitationServicesType && data.habilitationServiceType) { await this.commonUtils.selectBootstrapCustomDropdown(this.btnHabilitationServicesType, data.habilitationServiceType); }
      await this.commonUtils.selectBootstrapCustomDropdown(this.btnRevenueCode, data.revenueCode);
      if (data.rateCode) { await this.txtRateCode.fill(data.rateCode); }
      if (data.rateValue) { await this.txtRateValue.fill(data.rateValue); }
      if (data.locatorCode) { await this.txtLocatorCode.fill(data.locatorCode); }
    }

    if (data.enableRateHistory.trim().toLowerCase() === 'yes') {
      await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Enable Rate History', data.enableRateHistory);
      await this.page.getByText('Add Rate History Information').click();
      await this.page.waitForLoadState();
      await this.fillUpAddRateHIstoryInfo(data.dateFrom, data.dateTo, data.unitRateRH);
    }

    await this.checkValidationForTotalBillableUnits(data.validationForTotalBillableUnits);

    if (data.unitOfMeasure) {
      const unitOfMeasureMap = {
        '5': '5 Minutes',
        '6': '6 Minutes',
        '15': '15 Minutes',
        '20': '20 Minutes',
        '30': '30 Minutes',
        '60': '1 Hour',
        '120': '2 Hours'
      };
      const optionText = unitOfMeasureMap[data.unitOfMeasure.toString().trim()] || data.unitOfMeasure;
      await this.commonUtils.selectBootstrapCustomDropdown(this.btnUnitofMeasureCalculation, optionText);
    }
    if (data.roundingAlgorithm) { await this.checkRoundingAlgorithm(data.roundingAlgorithm); }
    if (data.smallestAllowedIncrement) { await this.checkSmallestAllowedIncrement(data.smallestAllowedIncrement); }
  }

  async updateDescriptionCodeForm(data) {
    await this.txtAccountNumber.fill(data.updatedAccountNumber);
  }
}
