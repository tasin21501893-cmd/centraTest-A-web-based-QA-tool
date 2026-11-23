/**
 * @author Sayed Ahmed Tasin
 * @since 07/09/2026
 */

import { expect } from '@playwright/test';
import { ListPage } from '../../../commonPages/listPage.js';
import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { DateTimeUtils } from '../../../commonUtility/dateTimeUtils.js';

export class ImmunizationForm {
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.dateTimeUtils = new DateTimeUtils(page);
        this.listPage = new ListPage(page);

        this.lnkDisplayPdf = page.locator('a.pdf-view-link');
        this.lnkOpenPdfNewTab = page.locator('a.pdf-view-link ~ a.pdf-new-tab');
        this.dlgDisplayPdf = page.locator('div[role="dialog"]:has-text("Display PDF")');
        this.btnClosePdfDialog = this.dlgDisplayPdf.locator('button[aria-label="Close dialog"], button.close').first();

        this.btnAddNewImmunization = page.locator('input[name="_action_addEntry"][value="Add New Immunization"]');
        this.btnScheduleAnImmunization = page.locator('input[name="_action_addEntry"][value="Schedule an Immunization"]');
        this.btnAddOngoingImmunization = page.locator('input[name="_action_addEntry"][value="Add On-Going Immunization"]');

        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlVaccineGroup = page.locator('button[data-id="vaccineGroup"]');
        this.ddlProductName = page.locator('button[data-id="vaccineProduct"]');
        this.ddlVaccine = page.locator('button[data-id="vaccine"]');
        this.txtManufacturer = page.locator('[name="manufacturer"]');
        this.ddlSite = page.locator('[name="site"]');
        this.ddlMethod = page.locator('[name="method"]');
        this.txtLot = page.locator('[name="lotNumber"]');
        this.dtpDate = page.locator('[name="vaccineDate"]');
        this.chkScheduledForFuture = page.locator('[name="scheduled"]');
        this.txtCurrentCondition = page.locator('[name="individualCurrentCondition"]');
        this.dtpResultsDate = page.locator('[name="resultDate"]');
        this.txtResultsComments = page.locator('[name="resultComment"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReporterNameOther = page.locator('[name="reporterNameOther"]');
        this.chkOnGoing = page.locator('[name="onGoing"]');
        this.chkRefused = page.locator('[name="refused"]');
        this.txtRefusalReason = page.locator('[name="refusalReason"]');
        this.ddlOnGoingSeries = page.locator('[id="parentOngoingRow_bs_btn"]');
        this.dtpDueDate = page.locator('[name="dueDate"]');
        this.txtDueIn = page.locator('[name="dueIn"]');
        this.ddlDueInUnit = page.locator('[name="dueInUnit"]');
        this.errMsgVaccine = page.locator('[id="vaccine.errors"]');
        this.errMsgDate = page.locator('[id="vaccineDate.errors"]');
        this.errMsgReportedBy = page.locator('[id="reporter.errors"]');
        this.errMsgReporterNameOther = page.locator('[id="reporterNameOther.errors"]');
        this.errMsgOnGoingSeries = page.locator('[id="onGoingSeries.errors"]');
        this.errMsgDueDate = page.locator('[id="dueDate.errors"]');
        this.errMsgCurrentCondition = page.locator('[id="individualCurrentCondition.errors"]');
        this.errMsgResultsDate = page.locator('[id="resultDate.errors"]');
        this.errMsgResultsComments = page.locator('[id="resultComment.errors"]');
        this.errMsgDueIn = page.locator('[id="dueIn.errors"]');
        this.errMsgDueInUnit = page.locator('[id="dueInUnit.errors"]');
        this.errMsgRefusalReason = page.locator('[id="refusalReason.errors"]');
        this.errMsgGlobal = page.locator('.alert-danger li');
        this.errMsgConflictWithDueDate = this.errMsgGlobal;
    }

    /**
     * Selects an individual from the list page.
     * @param {string} individual 
     */
    async selectIndividual(individual) {
        if (CommonUtils.isValueValid(individual)) {
            await this.listPage.selectFilteredFirstItem(individual);
        }
    }

    /**
     * Selects notification level on the Immunization form.
     * @param {string} notificationLevel 
     */
    async selectNotificationLevel(notificationLevel) {
        if (CommonUtils.isValueValid(notificationLevel)) {
            await this.ddlNotificationLevel.selectOption(notificationLevel);
        }
    }

    /**
     * Selects individual and notification level on the Immunization form.
     * @param {string} individual 
     * @param {string} [notificationLevel] 
     */
    async selectIndividualAndNotificationLevel(individual, notificationLevel) {
        await this.selectIndividual(individual);
        await this.selectNotificationLevel(notificationLevel);
    }

    /**
     * Clicks the Add New Immunization button.
     */
    async clickAddNewImmunization() {
        await this.btnAddNewImmunization.click();
    }

    /**
     * Clicks the Schedule an Immunization button.
     */
    async clickScheduleAnImmunization() {
        await this.btnScheduleAnImmunization.click();
    }

    /**
     * Clicks the Add On-Going Immunization button.
     */
    async clickAddOngoingImmunization() {
        await this.btnAddOngoingImmunization.click();
    }

    /**
     * Fills up the complete context fields using parsed Excel matrix objects
     */
    async fillupForm(formObject) {
        if (formObject.vaccineGroup) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlVaccineGroup, formObject.vaccineGroup);
        }
        if (formObject.productName) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlProductName, formObject.productName);
        }
        if (formObject.vaccine) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.ddlVaccine, formObject.vaccine);
        }
        if (formObject.manufacturer) {
            await this.txtManufacturer.fill(formObject.manufacturer);
        }
        if (formObject.site) {
            await this.ddlSite.selectOption(formObject.site);
        }
        if (formObject.method) {
            await this.ddlMethod.selectOption(formObject.method);
        }
        if (formObject.lot) {
            await this.txtLot.fill(formObject.lot);
        }
        if (formObject.date) {
            const dateVal = await this.dateTimeUtils.getDate(String(formObject.date));
            await this.dtpDate.fill(dateVal);
        }
        if (formObject.reportedBy) {
            await this.ddlReportedBy.selectOption(formObject.reportedBy);
        }
        if (formObject.reporterNameOther) {
            await this.txtReporterNameOther.fill(formObject.reporterNameOther);
        }
        if (formObject.resultsDate) {
            const resultsDateVal = await this.dateTimeUtils.getDate(String(formObject.resultsDate));
            await this.dtpResultsDate.fill(resultsDateVal);
        }
        if (formObject.individualCurrentCondition) {
            await this.txtCurrentCondition.fill(formObject.individualCurrentCondition);
        }
        if (formObject.resultsComments) {
            await this.txtResultsComments.fill(formObject.resultsComments);
        }

        if (formObject.scheduledForFuture !== undefined && formObject.scheduledForFuture !== '') {
            const isScheduled = this.commonUtils.toBoolean(formObject.scheduledForFuture);
            isScheduled ? await this.chkScheduledForFuture.check() : await this.chkScheduledForFuture.uncheck();
        }

        if (formObject.refused !== undefined && formObject.refused !== '') {
            const isRefused = this.commonUtils.toBoolean(formObject.refused);
            isRefused ? await this.chkRefused.check() : await this.chkRefused.uncheck();
            if (isRefused && formObject.refusalReason) {
                await this.txtRefusalReason.fill(formObject.refusalReason);
            }
        }

        if (formObject.onGoing !== undefined && formObject.onGoing !== '') {
            const isOnGoing = this.commonUtils.toBoolean(formObject.onGoing);
            if (isOnGoing) {
                await this.chkOnGoing.check();
                const onGoingSeries = formObject.onGoingSeries || formObject.selectOnGoingSeries;
                if (onGoingSeries) await this.commonUtils.selectBootstrapCustomDropdown(this.ddlOnGoingSeries, onGoingSeries);
                if (formObject.dueDate) {
                    const dueDateVal = await this.dateTimeUtils.getDate(String(formObject.dueDate));
                    await this.dtpDueDate.fill(dueDateVal);
                }
                if (formObject.dueIn) await this.txtDueIn.fill(formObject.dueIn);
                if (formObject.dueInUnit) await this.ddlDueInUnit.selectOption(formObject.dueInUnit);
            } else {
                await this.chkOnGoing.uncheck();
            }
        }
    }

    /**
     * Clicks the Display PDF link and waits for the modal dialog to be visible.
     */
    async clickDisplayPdf() {
        await this.lnkDisplayPdf.click();
        await expect(this.dlgDisplayPdf).toBeVisible();
    }

    /**
     * Closes the Display PDF modal dialog if open.
     */
    async closePdfDialog() {
        if (await this.dlgDisplayPdf.isVisible()) {
            await this.btnClosePdfDialog.click();
            await expect(this.dlgDisplayPdf).toBeHidden();
        }
    }

    /**
     * Downloads the PDF file through the form's PDF link.
     * Switches vpdf=true to vpdf=false to trigger server attachment download.
     * @returns {Promise<import('@playwright/test').Download>}
     */
    async downloadPdfThroughLink() {
        const pdfLink = this.lnkOpenPdfNewTab.first();
        await expect(pdfLink).toBeVisible();

        const rawHref = await pdfLink.getAttribute('href');
        const downloadUrl = rawHref.replace('vpdf=true', 'vpdf=false');

        await pdfLink.evaluate((el, url) => el.setAttribute('href', url), downloadUrl);

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            pdfLink.click()
        ]);

        return download;
    }

    /**
     * Checks if a vaccine with the given name exists in the Vaccine dropdown options.
     * @param {string} vaccineName
     * @returns {Promise<boolean>}
     */
    async isVaccinePresentInDropdown(vaccineName) {
        await this.ddlVaccine.waitFor({ state: 'visible' });
        return await this.page.evaluate((name) => {
            const select = document.querySelector('select#vaccine, select[name="vaccine"]');
            if (!select) return false;
            return Array.from(select.options).some(opt => opt.text.toLowerCase().includes(name.toLowerCase()));
        }, vaccineName);
    }

    /**
     * Verifies that the specified vaccine name is added to the Vaccine dropdown and selectable.
     * @param {string} vaccineName
     */
    async verifyVaccineInDropdown(vaccineName) {
        await this.ddlVaccine.waitFor({ state: 'visible' });
        const isPresent = await this.isVaccinePresentInDropdown(vaccineName);
        expect(isPresent, `Expected vaccine "${vaccineName}" to be in the Vaccine dropdown`).toBe(true);

        // Open dropdown and assert matching option is visible in the UI
        await this.ddlVaccine.click();
        const optionLocator = this.page.locator('.bootstrap-select.open ul.dropdown-menu li a').filter({ hasText: vaccineName });
        await expect(optionLocator.first()).toBeVisible();
        await optionLocator.first().click();
        await expect(this.ddlVaccine).toContainText(vaccineName);
    }
}
