/**
* @author Emran Hossain Rabbi
* @since 08 / 02 / 2026
*/

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { MedHistoryCommonUtils } from "../medHistory/medHistoryCommonUtils.js";

/**
 * Page object for Pharmacy Message related actions
 */
export class PharmacyMessagePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.medHistoryCommonUtils = new MedHistoryCommonUtils(page);

        // Locators
        this.txtMessageId = page.locator('#messageId');
        this.btnProcessedOrderSection = page.locator('#processedOrderSection-collapse-btn');
        this.btnPrescriptionSection = page.locator('#prescriptionSection-collapse-btn');
        this.tblTimingQuantityRows = page.locator('table:has(th:text("Give Amount / Quantity")) tbody tr');
        this.ddlMedicationType = page.locator('[data-id="mh.medicationType"]');
        this.tblTqTableHeaders = page.locator('#tqTable thead th');
        this.tblTqTableRows = page.locator('#tqTable tbody tr');

        // Status locators
        this.txtStatusSuccess = page.locator('[class="status text-success"]');
        this.txtStatusPrimary = page.locator('[class="status text-primary"]');
        this.txtStatusDanger = page.locator('[class="status text-danger"]');

        // Table lists
        this.tblDataList = '#dataList';
        this.txtPrescriptionNumber = page.locator('[id="prescriptionNumber"]');

    }

    /**
     * Gets the success status text
     * @returns {Promise<string>} The status text
     */
    async getStatusTextSuccess() {
        return (await this.txtStatusSuccess.textContent()).trim();
    }

    /**
     * Gets the primary status text
     * @returns {Promise<string>} The status text
     */
    async getStatusTextPrimary() {
        return (await this.txtStatusPrimary.textContent()).trim();
    }

    /**
     * Gets the danger status text
     * @returns {Promise<string>} The status text
     */
    async getStatusTextDanger() {
        return (await this.txtStatusDanger.textContent()).trim();
    }

    /**
     * Clicks the "New Search" link
     */
    async clickNewSearch() {
        await this.page.locator('a:has-text("New Search")').click();
    }

    /**
     * Searches for a message and checks its status
     * @param {string} messageId The message ID to search for
     * @param {string} expectedStatus The expected status
     */
    async searchMessageAndCheckStatus(messageId, expectedStatus) {
        await this.txtMessageId.fill(messageId);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('load');
        const statusValue = (await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Status')).trim();
        expect(statusValue).toEqual(expectedStatus);

        await this.clickDynamicMessageLink(messageId);

        const statusText = await this.getStatusTextPrimary();
        expect(statusText).toEqual(expectedStatus);
    }

    /**
     * Gets a dynamic message link based on message ID
     * @param {string} messageId 
     * @returns {import('@playwright/test').Locator}
     */
    getLnkDynamicMessage(messageId) {
        return this.page.getByText(messageId);
    }

    /**
     * Gets a dynamic option from the medication type dropdown
     * @param {string} optionName 
     * @returns {import('@playwright/test').Locator}
     */
    getDdlDynamicMedicationTypeOption(optionName) {
        return this.page.getByRole('listbox').getByRole('option', { name: optionName });
    }

    /**
     * Enters the message ID
     * @param {string} messageId 
     */
    async enterMessageId(messageId) {
        await this.txtMessageId.fill(messageId);
    }

    /**
     * Clicks the dynamic message link
     * @param {string} messageId 
     */
    async clickDynamicMessageLink(messageId) {
        await this.getLnkDynamicMessage(messageId).click();
    }

    /**
     * Clicks the processed order section
     */
    async clickProcessedOrderSection() {
        await this.btnProcessedOrderSection.click();
    }

    /**
     * Clicks the prescription section
     */
    async clickPrescriptionSection() {
        await this.btnPrescriptionSection.click();
    }

    /**
     * Clicks the medication type dropdown
     */
    async clickMedicationTypeDropdown() {
        await this.ddlMedicationType.click();
    }

    /**
     * Selects an option from the medication type dropdown
     * @param {string} optionName 
     */
    async selectMedicationTypeOption(optionName) {
        await this.getDdlDynamicMedicationTypeOption(optionName).click();
    }

    /**
     * Acknowledges a pharmacy group message and verifies Medication History data creation
     * @param {Object} data The test data object
     */
    async pharmacyGroupMessageAcknowledgeAndCreateMedicationHistoryData(data) {
        // =========================================================
        // PART 1: Extract Data from Pharmacy Message Group
        // =========================================================

        await this.enterMessageId(data['Message ID']);
        await this.commonButtons.clickButton('Search');
        await this.clickDynamicMessageLink(data['Message ID']);

        await this.clickProcessedOrderSection();
        await this.clickPrescriptionSection();
        await this.page.waitForLoadState('load');
        // Extract message group details concurrently
        const [
            msgMedicationName,
            msgDrugCode,
            msgCodingSystem,
            msgMedicationStrength,
            msgStrengthUnit,
            msgDoseForm,
            msgMedicationRoute,
            msgProviderName,
            msgProviderIdentifier,
            msgPrescriptionNumber
        ] = await Promise.all([
            this.medHistoryCommonUtils.getValueByLabel('Medication Name'),
            this.medHistoryCommonUtils.getValueByLabel('Drug Code'),
            this.medHistoryCommonUtils.getValueByLabel('Coding System'),
            this.medHistoryCommonUtils.getValueByLabel('Medication Strength'),
            this.medHistoryCommonUtils.getValueByLabel('Strength Unit'),
            this.medHistoryCommonUtils.getValueByLabel('Dose Form'),
            this.medHistoryCommonUtils.getValueByLabel('Medication Route'),
            this.medHistoryCommonUtils.getValueByLabel('Ordering Provider Name'),
            this.medHistoryCommonUtils.getValueByLabel('Ordering Provider Identifier'),
            this.medHistoryCommonUtils.getValueByLabel('Prescription Number')
        ]);

        const medHistoryValuePharmacyMessageGroup = {
            'Medication Name': msgMedicationName,
            'Drug Code': msgDrugCode,
            'Coding System': msgCodingSystem,
            'Medication Strength': msgMedicationStrength,
            'Strength Unit': msgStrengthUnit,
            'Dose Form': msgDoseForm,
            'Medication Route': msgMedicationRoute,
            'Doctor Name': `${msgProviderName}, NPI-${msgProviderIdentifier}`,
            'Prescription Number': msgPrescriptionNumber,
            'Timing Quantity List': []
        };

        const msgRowCount = await this.tblTimingQuantityRows.count();
        for (let i = 0; i < msgRowCount; i++) {
            const values = await this.tblTimingQuantityRows.nth(i).locator('td').allTextContents();
            const trimmedValues = values.map(text => text.trim());

            medHistoryValuePharmacyMessageGroup['Timing Quantity List'].push({
                'Give Amount / Quantity': trimmedValues[0].split(/\s+/)[0],
                'Frequency': trimmedValues[1],
                'Begin Date & Time': trimmedValues[2].toLowerCase(),
                'End Date & Time': trimmedValues[3].toLowerCase(),
                'Instruction': trimmedValues[4],
                'Schedule Time(s)': trimmedValues[5],
            });
        }

        // =========================================================
        // PART 2: Acknowledge and Create Medication History
        // =========================================================

        await this.commonButtons.clickButton('Acknowledge and Create');
        await this.clickMedicationTypeDropdown();
        await this.selectMedicationTypeOption(data.medicationType);
        await this.commonButtons.clickButton('Approve');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Form');

        // =========================================================
        // PART 3: Extract Data from New Medication History Form
        // =========================================================

        // Extract form details concurrently
        const [
            formMedicationName,
            formDrugCode,
            formCodingSystem,
            formStrength,
            formStrengthUnit,
            formDoseForm,
            formMedicationRoute,
            formDoctorName,
            formPrescriptionNumber
        ] = await Promise.all([
            this.medHistoryCommonUtils.getValueByLabel('Medication Name'),
            this.medHistoryCommonUtils.getValueByLabel('Drug Code'),
            this.medHistoryCommonUtils.getValueByLabel('Drug Coding System'),
            this.medHistoryCommonUtils.getValueByLabel('Strength'),
            this.medHistoryCommonUtils.getValueByLabel('Strength Unit'),
            this.medHistoryCommonUtils.getValueByLabel('Dose Form'),
            this.medHistoryCommonUtils.getValueByLabel('Route'),
            this.medHistoryCommonUtils.getValueByLabel('Doctor (Pharmacy Message)'),
            this.medHistoryCommonUtils.getValueByLabel('Prescription Number')
        ]);

        const medHistoryFromData = {
            'Medication Name': formMedicationName,
            'Drug Code': formDrugCode,
            'Coding System': formCodingSystem,
            'Medication Strength': `${formStrength} ${formStrengthUnit}`,
            'Strength Unit': formStrengthUnit,
            'Dose Form': formDoseForm,
            'Medication Route': formMedicationRoute,
            'Doctor Name': formDoctorName,
            'Prescription Number': formPrescriptionNumber,
            'Timing Quantity List': []
        };

        // Extract form table details mapping by dynamic headers
        const headers = (await this.tblTqTableHeaders.allTextContents()).map(header => header.trim());
        const formTableRowsCount = await this.tblTqTableRows.count();

        for (let i = 0; i < formTableRowsCount; i++) {
            const values = (await this.tblTqTableRows.nth(i).locator('td').allTextContents()).map(text => text.trim());
            const tqData = {};

            headers.forEach((header, index) => {
                tqData[header] = values[index];
            });

            medHistoryFromData['Timing Quantity List'].push({
                'Give Amount / Quantity': tqData['Give Amount / Quantity'],
                'Frequency': tqData['Frequency'],
                'Begin Date & Time': tqData['Begin Date & Time'],
                'End Date & Time': tqData['End Date & Time'],
                'Instruction': tqData['Instruction'],
                'Schedule Time(s)': tqData['Schedule Time(s)']
            });
        }

        // =========================================================
        // PART 4: Assertion
        // =========================================================

        expect(medHistoryValuePharmacyMessageGroup).toEqual(medHistoryFromData);
    }

    /**
     * Checks an order from ToDo list based on priority and prescription name
     * @param {Object} testcase Testcase data containing priority
     * @param {string} prescriptionName Expected prescription name
     */
    async checkOrderFromToDo(testcase) {
        await this.page.locator(`a[href*="listType=LT_PHARMACY_MSG_ACKNOWLEDGE_${testcase.priority}"]`).click();
        await this.page.getByRole('textbox', { name: 'Filter' }).fill(testcase['Prescription Name']);
        const prescriptionNumber = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Prescription Number');
        expect(prescriptionNumber).toEqual(testcase['Prescription Name']);
    }

    async verifyPharmacyMessageGroupFromUi(prescriptionNumber, messageId) {
        await this.commonUtils.navigateToDashboardLink('Health', 'Pharmacy Message Group', 'Search');
        await this.txtPrescriptionNumber.fill(prescriptionNumber);
        await this.txtMessageId.fill(messageId);
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('load');
        const actualPrescriptionNumber = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Prescription Number');
        const actualMessageId = await this.commonUtils.getTableDataValueByColumnName(this.tblDataList, 'Message ID');

        expect(actualPrescriptionNumber).toEqual(prescriptionNumber);
        expect(actualMessageId).toEqual(messageId);
    }
}
