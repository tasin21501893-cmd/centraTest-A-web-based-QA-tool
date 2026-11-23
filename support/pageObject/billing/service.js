/**
 * @author Sheikh Faiyaz Mahamud
 * @since 13/07/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class Service {
    constructor(page) {
        this.page = page;
        this.isPopupClosed = false;
    }

    // Re-assigning locators based on the new page (popup)
    setPage(page2) {
        this.page = page2;
        this.commonUtils = new CommonUtils(page2);

        this.isPopupClosed = page2.isClosed();
        page2.on('close', () => {
            this.isPopupClosed = true;
        });

        this.btnDescriptionCode = page2.locator(`#descriptionCodeIdPickerBtn`);
        this.txtUnitOfMeasure = page2.locator(`[name='unitMeasure']`);
        this.txtTotalBillableUnits = page2.locator(`[name='totalUnits']`);
        this.txtDefaultUnitRate = page2.locator(`[name='unitCost']`);
        this.txtIcd10Code = page2.locator('#primaryDiagnosisCodeIcd10Lookup');
        this.firstAutocompleteMenuItem = page2.locator('.ui-autocomplete:visible .ui-menu-item').first();
        this.btnUnitOfMeasureCalculation = page2.locator('#unitMeasureForCalculationPickerBtn');
        this.btnAttendanceType = page2.locator(`#attendanceTypeIdPickerBtn`);
        this.btnUnitCalculationRule = page2.locator(`#unitCalculationRuleIdPickerBtn`);
        this.btnDurationCalculationRule = page2.locator(`#durationCalculationRuleIdPickerBtn`);
        this.btnAddIspProgram = page2.locator('a[href*="addIspSuppDocLink()"]');
        this.btnLinkIspProgram = page2.locator('a[href*="addIspBillLink()"]');

        // iframe modal handling
        this.modalFrame = page2.frameLocator('.modal-content iframe');  // iframe under modal-content
        this.txtModalSearch = this.modalFrame.locator('#dt-search-0'); // search box inside iframe
        this.btnAdd = this.modalFrame.locator(`[value='Add']`);

        // Radio button inside iframe
        this.getRadioByFormId = (formId) => this.modalFrame.locator(`input[type='radio'][name='select-radio'][value='${formId}']`);

        this.rdoMethodOfDataCollectionMap = {
            'Billing Data Input': page2.locator('#dataCollectionMethod1'),
            'Attendance': page2.locator('#dataCollectionMethod2'),
            'ISP Data': page2.locator('#dataCollectionMethod3'),
            'Case Note': page2.locator('#dataCollectionMethod4'),
            'EVV': page2.locator('#dataCollectionMethod5')
        };

        this.rdoRoundingAlgorithmMap = {
            'Half Up': page2.locator('#roundingAlgorithmType1'),
            'Half Down': page2.locator('#roundingAlgorithmType2'),
            'Up': page2.locator('#roundingAlgorithmType3'),
            'Down': page2.locator('#roundingAlgorithmType4'),
            'Quarter Up': page2.locator('#roundingAlgorithmType5'),
            'Quarter Down': page2.locator('#roundingAlgorithmType6'),
            'Two Third Up': page2.locator('#roundingAlgorithmType7'),
            'Two Third Down': page2.locator('#roundingAlgorithmType8'),
            'Three Quarter Up': page2.locator('#roundingAlgorithmType9'),
            'Three Quarter Down': page2.locator('#roundingAlgorithmType10'),
            'Thirteen By Fifteen Up': page2.locator('#roundingAlgorithmType11'),
            'None': page2.locator('#roundingAlgorithmType12')
        };

        this.rdoSmallestAllowedIncrementMap = {
            '5 Min': page2.locator('#smallestAllowedIncrementInMins1'),
            '6 Min': page2.locator('#smallestAllowedIncrementInMins2'),
            '7.5 Min': page2.locator('#smallestAllowedIncrementInMins3'),
            '10 Min': page2.locator('#smallestAllowedIncrementInMins4'),
            '15 Min': page2.locator('#smallestAllowedIncrementInMins5'),
            '20 Min': page2.locator('#smallestAllowedIncrementInMins6'),
            '30 Min': page2.locator('#smallestAllowedIncrementInMins7'),
            '45 Min': page2.locator('#smallestAllowedIncrementInMins8'),
            '60 Min': page2.locator('#smallestAllowedIncrementInMins9'),
            '120 Min': page2.locator('#smallestAllowedIncrementInMins10')
        };

        this.commonButtons = new CommonButtons(page2);
    }

    async checkMethodOfDataCollection(data) {
        await this.rdoMethodOfDataCollectionMap[data]?.click();
    }

    async checkRoundingAlgorithm(data) {
        await this.rdoRoundingAlgorithmMap[data]?.click();
    }

    async checkSmallestAllowedIncrement(data) {
        await this.rdoSmallestAllowedIncrementMap[data]?.click();
    }

    async selectIcd10Code(icd10Code) {
        await this.txtIcd10Code.click();
        await this.txtIcd10Code.focus();
        await this.txtIcd10Code.clear();
        await this.txtIcd10Code.pressSequentially(icd10Code, { delay: 100 });

        try {
            await this.firstAutocompleteMenuItem.waitFor({ state: 'visible', timeout: 5000 });
            await this.firstAutocompleteMenuItem.click();
        } catch (error) {
            console.log(`Autocomplete results for ICD-10 Code "${icd10Code}" did not appear within 5s.`);
        }
    }

    async fillUpServiceForm(originalPage, data) {
        // Wait for the popup to open and load, then switch context to it
        const popup = await this.page.waitForEvent('popup');
        await popup.waitForLoadState('domcontentloaded');
        this.setPage(popup);

        await this.commonUtils.selectBootstrapCustomDropdown(this.btnDescriptionCode, data.serviceDescriptionCode);
        await this.txtUnitOfMeasure.fill(data.unitOfMeasure);

        if (data.totalBillableUnits) { await this.txtTotalBillableUnits.fill(data.totalBillableUnits); }
        if (data.defaultUnitRate) { await this.txtDefaultUnitRate.fill(data.defaultUnitRate); }
        if (data.icd10Code) { await this.selectIcd10Code(data.icd10Code); }
        
        await this.checkMethodOfDataCollection(data.dataCollectionMethod);

        const method = data.dataCollectionMethod.trim().toLowerCase();

        if (method.includes('attendance')) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnAttendanceType, data.attendanceType);
        }

        if (['case note', 'evv', 'isp data'].includes(method)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnUnitCalculationRule, data.unitCalculationRule);
        }

        if (method.includes('evv')) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnDurationCalculationRule, data.durationCalculationRule);
        }

        if (data.unitOfMeasureCalculation) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnUnitOfMeasureCalculation, data.unitOfMeasureCalculation);
        }

        if (data.roundingAlgorithm) {
            await this.checkRoundingAlgorithm(data.roundingAlgorithm);
        }

        if (data.smallestAllowedIncrement) {
            await this.checkSmallestAllowedIncrement(data.smallestAllowedIncrement);
        }

        await Promise.all([
            this.commonButtons.clickButton('Save')
        ]);

        try {
            if (this.isPopupClosed || this.page.isClosed()) {
                // Expected successful behavior without warnings
            } else {
                const btnYes = this.page.locator(`input[name='ignoreWarning'][value='Yes']`);
                if (await btnYes.isVisible({ timeout: 3000 })) {
                    await btnYes.click();
                }
            }
        } catch (err) {
            // Quietly ignore since page closing on Save is expected behavior
        }

        // Bring the main page to front again
        await originalPage.bringToFront();
        return originalPage;
    }
}
