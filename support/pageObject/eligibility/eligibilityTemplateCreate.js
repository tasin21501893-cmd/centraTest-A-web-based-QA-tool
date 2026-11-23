/**
 * @author Emran Hosssain Rabbi
 * @since 10/08/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils';
import { writeExcelCell } from '../../commonUtility/write-xlsx';
import { DonePage } from '../../commonPages/donePage.js';
import { resourcePaths } from '../../constants/resourcePaths.js';

export class EligibilityTemplate {

    /**
         * @param {import('@playwright/test').Page} page
         */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
        this.txtName = page.locator('#template\\.name');
        this.chkValidateRequiredQnr = page.locator('#template\\.validateRequiredQnr');
        this.chkProviderMappingEnabled = page.locator('#template\\.providerMappingEnabled');
        this.chkCommentEnabled = page.locator('#template\\.commentEnabled');
        this.txtElgErrorMsg = page.locator("[class='alert alert-danger text-center']");
    }

    async fillUpEligibilityTemplateForm(data) {
        await this.page.waitForLoadState('load');
        if (await this.txtName.isVisible()) {
            await this.txtName.fill(data['Name']);
        }
        await this.selectDropdownValue('#template\\.checklistConfHolder', data['Document Checklist']);
        await this.selectDropdownValue('#template\\.questionnaire', data['Questionnaire']);
        await this.selectDropdownValue('#template\\.categories', data['Eligibility Categories']);
        await this.selectDropdownValue('#template\\.processingStatusList', data['Eligibility Processing Status']);
        await this.selectDropdownValue('#template\\.eligibilityReferredByList', data['Eligibility Referred By']);
        await this.selectDropdownValue('#template\\.eligibilityDenialReasonList', data['Eligibility Denial Reason']);

        if (CommonUtils.isAffirmative(data['Validate Required Questionnaire'])) {
            await this.chkValidateRequiredQnr.check();
        }
        if (CommonUtils.isAffirmative(data['Enable Provider Mapping'])) {
            await this.chkProviderMappingEnabled.check();
        }
        if (CommonUtils.isAffirmative(data['Enable Comments'])) {
            await this.chkCommentEnabled.check();
        }

    }

    async selectDropdownValue(selector, values) {

        if (values === null || values === undefined) return;
        if (typeof values === 'string' && !values.trim()) return;

        await this.page.evaluate(({ selector, values }) => {

            const isJQueryLoaded = typeof $ !== 'undefined';
            if (!isJQueryLoaded) {
                throw new Error('selectDropdownValue Failed: jQuery ($) is not loaded on this page context.');
            }

            var inputItems = [];
            if (Array.isArray(values)) {
                inputItems = values.map(item => item ? String(item).trim() : '').filter(Boolean);
            } else if (typeof values === 'string' || typeof values === 'number') {
                inputItems = String(values).split(',').map(item => item.trim()).filter(Boolean);
            }

            if (inputItems.length === 0) return;

            var $select = $(selector);
            if (!$select.length) return;

            var matchedValues = [];

            $select.find('option').each(function () {
                var optVal = $(this).val();
                var optText = $('<div>').html($(this).html()).text().trim();

                if (inputItems.includes(optVal) || inputItems.includes(optText)) {
                    matchedValues.push(optVal);
                }
            });

            if (matchedValues.length === 0) return;

            if ($select.prop('multiple')) {
                $select.val(matchedValues);
            } else {
                $select.val(matchedValues[0]);
            }

            if ($select.hasClass('selectpicker') || $select.data('selectpicker')) {
                $select.selectpicker('refresh');
            }

            $select.trigger('change');
        }, { selector, values });
    }

    async writeTemplateFormIds(rowIndex, sheetName) {
        const formID = await this.donePage.fetchFormIdFromDoneMessage();
        const filePath = resourcePaths.ELIGIBILITY;
        writeExcelCell({ filePath, sheetName, row: rowIndex, col: 'templateFormId', value: formID });
    }

    async countErrorMsg() {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.txtElgErrorMsg.count();
    }
}
