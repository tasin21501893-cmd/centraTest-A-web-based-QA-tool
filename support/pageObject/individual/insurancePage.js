/**
 * @author Sunjare Zulfiker
 * @since 02/10/26
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { IdfPage } from './idfPage.js';
import { readExcelDataWithSheetName, filterObjects } from '../../commonUtility/read-xlsx.js';

export class InsurancePage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.idfPage = new IdfPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);

        this.ddlMedicareSection = page.locator('[name="medicareSection"]');
        this.txtMedicareNumber = page.locator('[name="medicareNumber"]');
        this.dtpMedicareEffectiveDate = page.locator('[name="medicareEffectiveDate"]');
        this.txtMedPlanDID = page.locator('[name="medPlanId"]');
        this.txtMedPlanDPlanName = page.locator('[name="medPlanName"]');
        this.txtMedPlanDIssuer = page.locator('[name="medPlanIssuer"]');
        this.txtMedPlanDRxBIN = page.locator('[name="medPlanRxbin"]');
        this.txtMedPlanDRxPCN = page.locator('[name="medPlanRxpcn"]');
        this.txtMedPlanDRxGRP = page.locator('[name="medPlanRxgrp"]');
        this.txtOtherBenefits = page.locator('[name="otherBenefits"]');
        this.txtInsuranceCompany = page.locator('[name="insuranceCompany"]');
        this.txtInsuranceGroup = page.locator('[name="insuranceGroup"]');
        this.txtInsurancePolicyNumber = page.locator('[name="insurancePolicyNumber"]');
        this.txtInsurancePolicyHolder = page.locator('[name="insurancePolicyHolder"]');
    }

    async navigateToIndividualInsurance(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);

        if (await this.commonUtils.fetchFormStatus() == 'Deleted') {
            throw new Error('Insurance cannot be saved or updated for Deleted individuals');
        }

        await this.donePage.clickLinkByText('Insurance');
    }

    async medicareFillUp(data) {
        await this.ddlMedicareSection.selectOption(data.medicareSection);
        await this.txtMedicareNumber.fill(data.medicareNumber);
        await this.dtpMedicareEffectiveDate.fill(data.medicareEffectiveDate);
        await this.txtMedPlanDID.fill(data.medPlanDID);
        await this.txtMedPlanDPlanName.fill(data.medPlanDPlanName);
        await this.txtMedPlanDIssuer.fill(data.medPlanDIssuer);
        await this.txtMedPlanDRxBIN.fill(data.medPlanDRxBIN);
        await this.txtMedPlanDRxPCN.fill(data.medPlanDRxPCN);
        await this.txtMedPlanDRxGRP.fill(data.medPlanDRxGRP);
        await this.txtOtherBenefits.fill(await this.commonUtils.generateString(data.otherBenefits));
    }

    async otherInsuranceFillUp(data) {
        await this.txtInsuranceCompany.fill(data.insuranceCompany);
        await this.txtInsuranceGroup.fill(data.insuranceGroup);
        await this.txtInsurancePolicyNumber.fill(data.insurancePolicyNumber);
        await this.txtInsurancePolicyHolder.fill(data.insurancePolicyHolder);
    }

    async attachmentFillUp(data) {
        let attachmentData = readExcelDataWithSheetName('resources/individual/insurance.xlsx', 'addAttachment');
        await this.attachmentUtils.addFile(data.testCaseNumber, attachmentData);
    }

    async insuranceFormFillUp(data) {
        await this.medicareFillUp(data);
        await this.otherInsuranceFillUp(data);
        await this.attachmentFillUp(data);
    }

    async saveOrUpdateInsurance(data) {
        await this.navigateToIndividualInsurance(data);

        if (await this.commonButtons.isButtonPresent('Edit')) {
            await this.commonButtons.clickButton('Edit');
        }

        await this.insuranceFormFillUp(data);

        if (await this.commonButtons.isButtonPresent('Save')) {
            await this.commonButtons.clickButton('Save');
        } else {
            await this.commonButtons.clickButton('Update');
        }
    }
}