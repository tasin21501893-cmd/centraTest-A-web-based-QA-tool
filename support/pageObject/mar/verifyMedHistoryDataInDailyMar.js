/**
* @author Emran Hossain Rabbi
* @since 09 / 17 / 2025
*/

import { expect } from '@playwright/test';
import { THIRTY_SECOND, CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { MedHistoryCommonUtils } from '../medHistory/medHistoryCommonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';

exports.VerifyMedHistoryDataInDailyMar = class VerifyMedHistoryDataInDailyMar {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.medHistoryCommonUtils = new MedHistoryCommonUtils(page);

        this.medTitle = page.locator('.med-title');
        this.medSummaryChips = page.locator('.rounded-pill.me-1.mb-2.med-info-chip');
        this.extendedInfoContainer = page.locator('.med-extended-info-container');
        this.infoBorderItems = this.extendedInfoContainer.locator('[class="me-md-3 pe-md-3 info-border"]');
        this.infoDivs = this.extendedInfoContainer.locator('.info-border');
        this.controlledSubstanceIcon = page.getByRole('img', { name: 'controlled-substance' });
        this.controlledSubstanceTooltip = page.getByRole('tooltip', { name: 'Controlled Substance (' });
        this.scheduleDetailsContainer = page.locator('div.schedule-details-container');
        this.programInput = page.locator('[id="programLookup"]');
        this.tqTable = page.locator('#tqTable');
        this.tqTableHeaders = page.locator('#tqTable thead th');
        this.tqTableRows = page.locator('#tqTable tbody tr');
        this.attachmentTableLinks = page.locator('table.table-bordered.table-hover tbody tr td a');
    }

    async getDailyMarGeneralData(medicationName) {
        let marGeneralData = {
            "medTitle": "",
            "medsummary": "",
            "Strength": "",
            "Attachment": "",
            "Controlled Substance": "",
            "Prescriber": "",
            "Indication/Purpose": "",
            "Instruction/Comments": ""
        };

        marGeneralData["medTitle"] = medicationName;

        const summaryTexts = await this.medSummaryChips.allTextContents();
        marGeneralData["medsummary"] = summaryTexts.map(t => t.trim()).join(', ');

        const count = await this.infoBorderItems.count();

        for (let infoIndex = 0; infoIndex <= count / 2; infoIndex++) {
            const keyElement = this.infoDivs.nth(infoIndex).locator('span.me-1.fw-bold');
            const key = await keyElement.textContent();
            const cleanKey = key.replace(':', '').trim();
            const value = await keyElement.evaluate(el => el.nextSibling.textContent.trim());

            if (cleanKey in marGeneralData) {
                marGeneralData[cleanKey] = value;
            }
        }

        if ((await this.controlledSubstanceIcon.count()) > 0) {
            await this.controlledSubstanceIcon.hover();
            const tooltipText = await this.controlledSubstanceTooltip.textContent();
            const controlSunstance = tooltipText.replace(/^Controlled Substance\s*/, "");
            marGeneralData["Controlled Substance"] = 'Yes ' + controlSunstance;
        }
        return marGeneralData;
    }

    async getDailyMarTQData() {
        const tqDetails = await this.scheduleDetailsContainer.elementHandles();
        let allTqValues = [];

        for (let tqIndex = 0; tqIndex < tqDetails.length; tqIndex++) {
            let tqvalues = {};
            const keyAndValues = await tqDetails[tqIndex].$$('div.me-2.me-lg-3.mt-sm-3.pt-2.pt-sm-0.d-flex.flex-column.info-border');

            for (let itemIndex = 0; itemIndex < keyAndValues.length; itemIndex++) {
                const key = await keyAndValues[itemIndex].$eval('span.font-12', el => el.textContent.trim());
                const value = await keyAndValues[itemIndex].$eval('span.mt-0.mt-sm-1.font-14.fw-bold.th-text-primary.pre-wrap', el => el.textContent.trim());
                tqvalues[key] = value;
            }

            const tqInstructions = await tqDetails[tqIndex].$('xpath=following-sibling::div[1]');

            if ((await tqInstructions?.getAttribute('class')) === 'me-2 me-lg-3 pb-3 flex-grow-1 d-flex tq-instruction') {
                const [label, value] = (await tqInstructions.textContent())
                    .split(':')
                    .map(v => v.trim());

                tqvalues[label] = value;
            }


            if (Object.keys(tqvalues).length > 0) {
                allTqValues.push(tqvalues);
            }
        }
        return allTqValues;
    }

    async getMedicalHistoryTQData() {
        await this.tqTable.waitFor({ state: 'visible', timeout: THIRTY_SECOND });

        const headers = await this.tqTableHeaders.allInnerTexts();
        const rows = await this.tqTableRows.elementHandles();
        let tableData = [];

        const headerOrder = [
            'Begin Date & Time', 'End Date & Time', 'Frequency',
            'Give Amount / Quantity', 'Schedule Interval',
            'Schedule Time(s)', 'Days in Interval', 'Instruction'
        ];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let rowData = {};
            const cells = await rows[rowIndex].$$('td');
            let quantity = '';
            let measurementUnit = '';

            for (let colIndex = 0; colIndex < cells.length; colIndex++) {
                let cellValue = await cells[colIndex].evaluate(cell => cell.innerText.trim());
                if (headers[colIndex] === "Schedule Interval") {
                    cellValue = cellValue.replace(/\n/g, ' ');
                }

                if (cellValue) {
                    if (headers[colIndex] === "Give Amount / Quantity") {
                        quantity = cellValue;
                    } else if (headers[colIndex] === "Measurement Unit") {
                        measurementUnit = cellValue;
                    } else if (headers[colIndex] === "Days in Interval") {
                        if (cellValue !== "N/A") rowData[headers[colIndex]] = cellValue;
                    } else {
                        rowData[headers[colIndex]] = cellValue;
                    }
                }
            }

            if (quantity && measurementUnit) {
                rowData["Give Amount / Quantity"] = `${quantity}${measurementUnit}`.trim();
            } else if (quantity) {
                rowData["Give Amount / Quantity"] = quantity;
            }

            let orderedRowData = {};
            for (const header of headerOrder) {
                if (rowData[header]) orderedRowData[header] = rowData[header];
            }

            if (Object.keys(orderedRowData).length > 0) {
                tableData.push(orderedRowData);
            }
        }
        return tableData;
    }

    async getMedicalHistoryGeneralData(data) {
        let mhGeneralData = {
            "medTitle": "", "medsummary": "", "Strength": "", "Attachment": "",
            "Controlled Substance": "", "Prescriber": "",
            "Indication/Purpose": "", "Instruction/Comments": ""
        };

        mhGeneralData["medTitle"] = await this.medHistoryCommonUtils.getValueByLabel("Medication Name");
        const doseForm = await this.medHistoryCommonUtils.getValueByLabel("Dose Form");
        const medRoute = await this.medHistoryCommonUtils.getValueByLabel("Route");
        const medType = await this.medHistoryCommonUtils.getValueByLabel("Medication Type");
        mhGeneralData["medsummary"] = doseForm + ', ' + medRoute + ', ' + medType;

        const strengthValue = await this.medHistoryCommonUtils.getValueByLabel("Strength");
        const strengthUnit = await this.medHistoryCommonUtils.getValueByLabel("Strength Unit");
        mhGeneralData["Strength"] = strengthValue + strengthUnit;

        if (data.Attachment != '') {
            const attachmentName = (await this.attachmentTableLinks.first().textContent()).trim();
            const attachmentSize = (await this.page.locator(`table.table-bordered.table-hover tbody tr:has-text("${attachmentName}") td:nth-child(3)`).textContent()).trim();
            mhGeneralData["Attachment"] = attachmentName + '(' + attachmentSize + ')';
        } else {
            mhGeneralData["Attachment"] = '';
        }

        const controlledType = await this.medHistoryCommonUtils.getValueByLabel("Control Type");
        const controlledSubstanceValue = await this.medHistoryCommonUtils.getValueByLabel("Controlled Substance");
        mhGeneralData["Controlled Substance"] = controlledSubstanceValue + ' (' + controlledType + ')';

        mhGeneralData["Prescriber"] = await this.medHistoryCommonUtils.getValueByLabel("Prescriber");
        mhGeneralData["Indication/Purpose"] = await this.medHistoryCommonUtils.getValueByLabel("Indication/Purpose");
        mhGeneralData["Instruction/Comments"] = await this.medHistoryCommonUtils.getValueByLabel("Instruction/Comments");

        return mhGeneralData;
    }

    async matchMedHistoryDataWithDailyMarData(testcase, medicationName) {
        const marGeneralData = await this.getDailyMarGeneralData(medicationName);
        const marTQData = await this.getDailyMarTQData();

        await this.commonUtils.navigateToDashboardLink('Health', 'Medication History', 'Search');
        await this.programInput.fill(`${testcase['Program Name']} (${testcase['Site']})`);
        await this.page.locator('.ui-menu-item-wrapper').getByText(`${testcase['Program Name']} (${testcase['Site']})`).click();
        await this.commonButtons.clickButton('Search');
        await this.listPage.selectFilteredFirstItem(medicationName);

        const mhTQData = await this.getMedicalHistoryTQData();
        const mhGeneralData = await this.getMedicalHistoryGeneralData(testcase);

        expect(marGeneralData).toEqual(mhGeneralData);

        const normalizeValue = (value) => value.trim().replace(/\s+/g, ' ');
        const allValuesofMHTQ = mhTQData.flatMap(Object.values).map(normalizeValue);
        const allValuesofMarTQ = marTQData.flatMap(Object.values).map(normalizeValue);
        expect(allValuesofMHTQ).toEqual(allValuesofMarTQ);
    }
}
