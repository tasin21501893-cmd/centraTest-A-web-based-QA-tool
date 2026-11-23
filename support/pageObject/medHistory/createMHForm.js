/**
 * @author Emran Hossain Rabbi
 * @since 09/17/2025
 */

import { writeExcelCell } from '../../commonUtility/write-xlsx';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { DonePage } from '../../../support/commonPages/donePage';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { AttachmentUtils } from "../../commonUtility/attachmentUtils.js";

import { StatusTraverse } from './statusTraverse.js';
import { MedHistoryCommonUtils } from './medHistoryCommonUtils.js';

let medicationName;

export class CreateMHForm {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.listPage = new ListPage(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.statusTraverse = new StatusTraverse(page);
        this.medHistoryCommonUtils = new MedHistoryCommonUtils(page);

        this.ddlProgram = page.locator('#mh\\.pgmId');
        this.ddlReporter = page.locator('#mh\\.reporter');
        this.ddlNotificationLevel = page.locator('button[data-id="mh\\.notifLevel"]');
        this.iframe = page.frameLocator("iframe[frameborder='0']");

        this.txtMedicationName = page.locator('[id="mh\\.medicationName"]');
        this.txtCode = page.locator('[id="mh\\.code"]');
        this.txtCodingSystem = page.locator('[id="mh\\.codingSystem"]');
        this.txtStrength = page.locator('[id=mh\\.strength]');
        this.txtStrengthUnit = page.locator('[id="mh\\.strengthUnit"]');
        this.txtFormOfDosage = page.locator('[id="mh\\.formOfDosage"]');
        this.ddlMedicationType = page.locator('[data-id="mh.medicationType"]');

        this.txtCompName = page.locator('[id="compName"]');
        this.txtCompCode = page.locator('[id="compCode"]');
        this.txtCompCodeSys = page.locator('[id="compCodeSys"]');
        this.txtCompStrength = page.locator('[id="compStrength"]');
        this.txtCompStrengthUnit = page.locator('[id="compStrengthUnit"]');
        this.txtCompDose = page.locator('[id="compDose"]');
        this.txtCompMeasurementUnit = page.locator('[id="compMeasurementUnit"]');
        this.ddlCompType = page.locator('#compType');

        this.txtTqDose = page.locator('[id="tqDose"]');
        this.txtTqMeasurementUnit = page.locator('[id="tqMeasurementUnit"]');
        this.txtTqCode = page.locator('[id="tqCode"]');
        this.txtTqStartDate = page.locator('[id="tqStartDate"]');
        this.txtTqEndDate = page.locator('[id="tqEndDate"]');
        this.txtTqStartTime = page.locator('[id="tqStartTime"]');
        this.txtTqEndTime = page.locator('[id="tqEndTime"]');
        this.txtTqInstruction = page.locator('[id="tqInstruction"]');
        this.txtTqFrequency = page.locator('#tqFrequency');

        this.txtRoute = page.locator('#mh\\.medicationRoute\\.route');
        this.txtRouteMethod = page.locator('[id="mh\\.medicationRoute\\.routeMethod"]');
        this.txtRouteDevice = page.locator('[id="mh\\.medicationRoute\\.routeDevice"]');
        this.txtRouteInstruction = page.locator('[id="mh\\.medicationRoute\\.routeInstruction"]');
        this.chkControlledSubstance = page.locator('[id="mh\\.controlledSubstance"]');
        this.ddlControlType = page.locator('#mh\\.controlType');

        this.ddlCategory = page.locator('#mh\\.medicationCategory');
        this.ddlSubCategorySelect = page.locator('#mh\\.medicationSubCategory');
        this.txtPurpose = page.locator('[id="mh\\.purpose"]');
        this.txtSideEffects = page.locator('[id="mh\\.sideEffects"]');
        this.txtComments = page.locator('[id="mh\\.comments"]');
        this.chkDrugCountEnabled = page.locator('[id="mh\\.drugCountEnabled"]');
    }

    async selectProgramAndReporter(data) {

        if (data["Program Name"]) {
            await this.ddlProgram.selectOption({ label: data["Program Name"] + ' (' + data.Site + ')' });
        }
        else {
            await this.ddlProgram.selectOption({ label: '- Please Select -' });
        }

        if (data["Reported By"]) {
            await this.ddlReporter.selectOption({ label: data["Reported By"] });
        }
        else {
            await this.ddlReporter.selectOption({ label: '- Please Select -' });
        }
    }

    async selectNotificationLevel(level) {
        if (level) {
            await this.ddlNotificationLevel.click();
            await this.page.click(`li:has-text("${level}")`);
        }
    }

    async selectPrescriber(prescriber) {

        if (prescriber) {
            await this.commonButtons.clickButton('Look Up');
            await this.iframe.locator('#dataList td', { hasText: prescriber }).waitFor({ state: 'visible' });
            await this.iframe.getByText(prescriber).click()
        }
    }

    async fillMedicationDetails(data) {
        if (data["Medication Name"].includes('Medication auto')) {
            medicationName = data["Medication Type"] + " Medication auto " + await this.medHistoryCommonUtils.getCurrentTimestamp();
        } else {
            medicationName = data["Medication Name"];
        }
        await this.txtMedicationName.fill(medicationName);
        await this.txtCode.fill(data.drugCode);
        await this.txtCodingSystem.fill(data.drugCodingSystem);
        await this.txtStrength.fill(data.strength);
        await this.txtStrengthUnit.fill(data.strengthUnit);
        await this.txtFormOfDosage.fill(data.formOfDosage);

        if (data["Medication Type"]) {
            await this.ddlMedicationType.click();
            await this.page.getByRole('listbox').getByRole('option', { name: data["Medication Type"] }).click();
        }
    }

    async addComponents(data) {

        if (data.CompName && data.CompType) {
            await this.commonButtons.clickButton('Add Component')
            await this.txtCompName.fill(data.CompName);
            await this.txtCompCode.fill(data.drugCode);
            await this.txtCompCodeSys.fill(data.drugCodingSystem);
            await this.txtCompStrength.fill(data.strength);
            await this.txtCompStrengthUnit.fill(data.strengthUnit);
            await this.txtCompDose.fill(data.CompAmount);
            await this.txtCompMeasurementUnit.fill(data.MeasurementUnit);
            await this.ddlCompType.selectOption({ label: data.CompType });
            await this.commonButtons.clickButton('Add')
        }
    }

    async addTimingAndSchedule(data, tqData) {
        let processedTqCount = 0;

        for (let tqIndex = 0; tqIndex < tqData.length; tqIndex++) {

            if (data.testCaseNumber === tqData[tqIndex].testCaseNumber) {
                await this.commonButtons.clickButton('Add Timing & Schedule');
                await this.txtTqDose.fill(tqData[tqIndex].giveAmount);
                await this.txtTqMeasurementUnit.fill(tqData[tqIndex].measurementUnit);
                await this.txtTqCode.fill(tqData[tqIndex].frequency);
                await this.txtTqStartDate.fill(tqData[tqIndex].beginDate);
                await this.txtTqEndDate.fill(tqData[tqIndex].endDate);
                await this.txtTqStartTime.fill(tqData[tqIndex].beginTime);
                await this.txtTqEndTime.fill(tqData[tqIndex].endTime);
                await this.txtTqInstruction.fill(tqData[tqIndex].instruction);

                await this.commonButtons.clickButton(tqData[tqIndex]['repeatIntervalUnit']);

                const intervalUnit = tqData[tqIndex]['Schedule Interval Radio Value'].trim();
                const activeTab = await this.page.locator('.tab-pane.active');

                if (!isNaN(intervalUnit)) {
                    const num = Number(intervalUnit);
                    await this.page.locator('.tab-pane.active.in').waitFor({ state: 'visible' });
                    const scheduleInterval = (`${tqData[tqIndex]['repeatIntervalUnit']}`.toLowerCase()).trim();
                    const radio = await this.page.locator(`input[type="radio"][name="${scheduleInterval}-freq"][value="3"]`);
                    await radio.waitFor({ state: 'visible' });
                    await radio.check();
                    const dropdown = await activeTab.locator('select.selectpicker');
                    await dropdown.waitFor({ state: 'visible' });
                    await dropdown.selectOption(String(num));
                }
                else {
                    await activeTab.locator(`xpath=//label[contains(@class, 'control-label') and normalize-space(text())="${intervalUnit}"]/preceding::input[1]`).click();
                }

                if (tqData[tqIndex]['ScheduleIntervalValues']) {
                    const intervalValues = tqData[tqIndex]['ScheduleIntervalValues'].split(',');

                    if (tqData[tqIndex]['repeatIntervalUnit'] === 'Monthly') {
                        for (const date of intervalValues) {
                            await this.page.locator(`#months button:text-is("${date.trim()}")`).click();
                        }
                    }
                    else {

                        for (const day of intervalValues) {
                            await this.page.locator('#weeks button', { hasText: day.trim().toUpperCase() }).click();
                        }
                    }
                }

                await this.txtTqFrequency.click();
                await this.txtTqFrequency.fill(tqData[tqIndex].dailyFrequency);
                await this.page.locator('[data-dropdown="dropdown"]').last().click();
                await this.txtTqFrequency.press('Enter');

                const scheduleTimes = tqData[tqIndex].ScheduleTimes.split(',');
                const numberOfScheduleTimes = scheduleTimes.length;

                for (let scheduleIndex = processedTqCount * tqData[tqIndex].dailyFrequency; scheduleIndex < (processedTqCount * tqData[tqIndex].dailyFrequency) + numberOfScheduleTimes; scheduleIndex++) {
                    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i;

                    if (timeRegex.test(scheduleTimes[scheduleIndex - (processedTqCount * tqData[tqIndex].dailyFrequency)].trim())) {
                        await this.page.locator(`input[name="${scheduleIndex + 1}scheduleTime"]`).clear();
                        await this.page.locator(`input[name="${scheduleIndex + 1}scheduleTime"]`).fill(scheduleTimes[scheduleIndex - (processedTqCount * tqData[tqIndex].dailyFrequency)]);
                    }
                    else {
                        await this.page.selectOption(`[id="${scheduleIndex + 1}scheduleText"]`, scheduleTimes[scheduleIndex - (processedTqCount * tqData[tqIndex].dailyFrequency)]);
                    }
                }

                await this.commonButtons.clickButton('Add')
                processedTqCount++;
            }
        }
    }

    async fillRouteAndControl(data) {
        await this.txtRoute.fill(data.route);
        await this.txtRouteMethod.fill(data.administrationMethod);
        await this.txtRouteDevice.fill(data.administrationDevice);
        await this.txtRouteInstruction.fill(data.routeInstruction);

        if (data.ControlSubstance === 'Yes') {
            await this.chkControlledSubstance.check();
            await this.ddlControlType.selectOption({ label: data.ControlType });
        }
    }

    async fillAdditionalDetails(data) {

        if (data.homeMedication) {
            const label = this.page.locator(`.radio-inline >> label:text-is("${data.homeMedication}")`);
            await label.click();
        }

        if (data.prescriptionDrug) {
            await this.page.getByLabel(data.prescriptionDrug).check();
        }

        if (data.Category) {
            await this.ddlCategory.selectOption({ label: data.Category });
            await this.ddlSubCategorySelect.selectOption({ label: data.Subcategory });

        }

        await this.txtPurpose.fill(data.purpose);
        await this.txtSideEffects.fill(data.sideEffects);
        await this.txtComments.fill(data.comments);

        if (data.DrugCount === 'Enabled') {
            await this.chkDrugCountEnabled.check();
        }

        if (data.fileName) {
            await this.attachmentUtils.addAttachment(data)
        }
    }

    async addMedicationHistory(data, tqData) {
        await this.selectProgramAndReporter(data);
        await this.selectNotificationLevel(data.NotificationLevel);
        await this.selectPrescriber(data.Prescriber);
        await this.fillMedicationDetails(data);
        await this.addComponents(data);
        await this.addTimingAndSchedule(data, tqData);
        await this.fillRouteAndControl(data);
        await this.fillAdditionalDetails(data);
    }

    async writeValuesToMedHistoryExcel(RowNumber, SheetName) {
        await this.page.waitForLoadState("domcontentloaded");
        const formId = await this.medHistoryCommonUtils.fetchValueFromIBubbleByLabelName('Form ID');
        const timeZone = await this.medHistoryCommonUtils.fetchValueFromIBubbleByLabelName('Time Zone');
        const IndividualName = await this.medHistoryCommonUtils.getValueByLabel("Individual Name");
        const filePath = 'resources/medHistory/medicationHistory.xlsx';
        const sheetName = SheetName;

        writeExcelCell({ filePath, sheetName, row: RowNumber, col: 'Medication Name', value: medicationName });
        writeExcelCell({ filePath, sheetName, row: RowNumber, col: 'FormID', value: formId });
        writeExcelCell({ filePath, sheetName, row: RowNumber, col: 'TimeZone', value: timeZone });
        writeExcelCell({ filePath, sheetName, row: RowNumber, col: 'IndividualName', value: IndividualName });
    }

    async createMHFormAndStatusTraverse(testcase, tqData) {
        await this.commonUtils.navigateToDashboardLink("Health", "Medication History", "New");
        await this.listPage.selectFilteredFirstItem(testcase["Individual Name"])
        await this.addMedicationHistory(testcase, tqData);
        await this.statusTraverse.mhStatusTraverse(testcase);
        await this.writeValuesToMedHistoryExcel(testcase.RowIndex, 'MHForm');
    }

    async medicationName() {
        return medicationName;
    }
}