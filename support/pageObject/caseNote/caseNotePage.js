/**
 * @author Muhammad Muntasir Mamoor
 * @author Dibya Nath
 * @author Timon Protik Mondal
 * @since 03/01/26
 */
import { expect } from '@playwright/test';
import { filterObjects } from "../../commonUtility/read-xlsx.js";

import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { ListPage } from '../../../support/commonPages/listPage.js';
import { DateTimeUtils } from '../../commonUtility/dateTimeUtils.js';
import { DonePage } from '../../commonPages/donePage.js';
import { NotificationProfilePage } from '../../pageObject/notification/notificationProfilePage.js';
import { UserPersonalDetailsPage } from '../user/userPersonalDetailsPage.js';
import urlData from '../../../resources/commonResources/urlData.json';

export class CaseNotePage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.dateTimeUtils = new DateTimeUtils(page);
        this.donePage = new DonePage(page);
        this.notificationProfilePage = new NotificationProfilePage(page);
        this.userPersonalDetailsPage = new UserPersonalDetailsPage(page);

        this.dtpServiceDate = page.locator("[name='caseNote.serviceDate']");
        this.btnSelectTemplate = page.locator("button[data-id='caseNote.template']");
        this.btnProgram = page.locator("button[data-id='caseNote.programDto']");
        this.btnServiceProvider = page.locator("button[data-id='caseNote.serviceProvider']");
        this.dtpTimeFrom = page.locator("[name='caseNote.beginTimeStr']");
        this.dtpTimeTo = page.locator("[name='caseNote.endTimeStr']");
        this.txtTimeDuration = page.locator("[name='caseNote.duration']");
        this.txtBillingUnits = page.locator("[name='caseNote.billingUnits']");
        this.ddlServiceCode = page.locator("[name='caseNote.billServiceId']");
        this.btnActivityType = page.locator("button[data-id='caseNote.activityTypeDto']");
        this.btnLocation = page.locator("button[data-id='caseNote.locationDto']");
        this.btnPlaceOfService = page.locator("button[data-id='caseNote.placeOfService']");
        this.rdoBillableYes = page.locator("[id='caseNote.billable1']");
        this.rdoBillableNo = page.locator("[id='caseNote.billable2']");
        this.rdoFaceToFaceYes = page.locator("[id='caseNote.faceToFace1']");
        this.rdoFaceToFaceNo = page.locator("[id='caseNote.faceToFace2']");
        this.divAttachment = page.locator('#attachments');
        this.btnPersonContacted = page.locator('button[data-id="caseNote.personSeenList"]');
        this.txtPersonContactedSearch = page.locator('[id="caseNote.personSeenList-multi-select-wrapper"] input[type="search"]');
        this.overrideComment = page.locator("[name='caseNote.overrideComment']");
        this.menuPersonContacted = page.locator('div.dropdown-menu.open');
        this.fieldsetNote = page.locator('.sub-section-fieldset').filter({ hasText: 'Note' });
        this.iframeNote = page.frameLocator('iframe[id="caseNote.zzzNote_ifr"]');
        this.iframeNoteBody = this.iframeNote.locator('body');
        this.tblHeaderOversightId = page.locator('th').filter({ hasText: 'Oversight ID' }).first();
        this.tblHeader = page.locator('#clientList tbody tr');
        this.errNote = page.locator(`#caseNote\\.zzzNote\\.errors`);
        this.pageTitle = page.locator('h1#title, #page-title-text');
        this.panelTitle = page.locator('.panel-title:visible');
        this.pageTitleText = page.locator('#page-title-text');
        this.statusText = page.locator('#form-status-text');
        this.errTimeFrom = page.locator('#caseNote\\.beginTimeStr\\.errors');
        this.errTimeTo = page.locator('#caseNote\\.endTimeStr\\.errors');
        this.txtReasonForDeletion = page.locator('#caseNote\\.deletionReason');
        this.divDeleteCaseNote = page.locator('#cn-delete-buttons');
        this.btnDetailsIcon = page.locator('#info');
        this.lnkUpdateHistory = page.locator('#update-history-link:visible');
        this.iframe = page.frameLocator('iframe[src*="/ma/archiver/updateHistoryList"]');

        this.modalLocator = this.iframe.locator('#pageContent');
        this.tblCaseNoteFirstRow = this.page.locator('#dataList tbody tr td:first-child').first();
        this.tblUpdateHistory = this.modalLocator.locator('#dataList');
        this.tblUpdateHistoryFirstRow = this.tblUpdateHistory.locator('tbody tr').first();
        this.tblUpdateHistoryLastRow = this.tblUpdateHistory.locator('tbody tr').last();
        this.tblArchiveDataRows = this.iframe.locator('.archive-data tr');
        this.btnQuestionnaire = page.locator('#openBtn');
        this.answerQuestion = page.locator('input.form-control.qnrInput');
        this.txtCaseNoteDeletionReason = page.locator("[name='caseNote\\.deletionReason']");
        this.txtLoginNameFilter = page.locator('th:has-text("Login Name") input.ui-column-filter');
        this.txtCaseNoteFormId = page.locator('[name="formId"]');
        this.tblSelectCaseNote = (text) => this.page.locator('tr', { has: this.page.locator('td', { hasText: text }) });
        this.txtCaseNoteClientLookup = page.locator('#clientLookup');
        this.dtpServiceDateFrom = page.locator('[name="serviceDateFrom"]');
        this.dtpServiceDateTo = page.locator('[name="serviceDateTo"]');
        this.btnCaseNoteTemplate = page.locator('[data-id="templates"]');
        this.txtDeletionReason = page.locator('[name="caseNote.deletionReason"]');
        this.dtpDashboardFromDate = page.locator('[name="fromDate"]');
        this.dtpDashboardToDate = page.locator('[name="toDate"]');
        this.msgPrivilegeError = page.locator('.alert.alert-danger');
        this.btnEdit = page.locator('input[name="_action_edit"]');
        this.btnSave = page.locator('input[name="_action_save"]');
        this.btnSubmit = page.locator('input[name="_action_submit"]');
        this.btnUpdate = page.locator('input[name="_action_update"]');
        this.btnDelete = page.locator('input[name="_action_delete"]');
    }

    async navigateToCaseNote(isOversight, action) {
        if (CommonUtils.isAffirmative(isOversight)) {
            await this.commonUtils.navigateToDashboardLink("Case Management", "Case Note", action);
        } else {
            await this.commonUtils.navigateToDashboardLink("Individual", "Case Note", action);
        }
    }

    async selectIndividual(data) {
        const fullName = `${data.individualFirstName} ${data.individualLastName}`;

        await this.page.waitForLoadState('domcontentloaded');

        if (!await this.listPage.isItemExist(fullName)) {
            throw new Error(`Individual: "${fullName}" does not Exist.`);
        }

        if (await this.tblHeader.count() === 1) {
            await this.tblHeader.click();
        } else {
            let exactRow = await this.tblHeader
                .filter({ has: await this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('First Name')}):text-is("${data.individualFirstName}")`) })
                .filter({ has: await this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Last Name')}):text-is("${data.individualLastName}")`) })
                .filter({ has: await this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Individual ID')}):text-is("${data.individualID}")`) })
                .filter({ has: await this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Birth Date')}):text-is("${data.birthDate}")`) });

            // Conditionally CHAIN the extra filter if the oversight ID column exists
            if (await this.commonUtils.isElementAvailable(this.tblHeaderOversightId)) {
                exactRow = exactRow.filter({ has: await this.page.locator(`td:nth-child(${await this.listPage.getColumnIndexByName('Oversight ID')}):text-is("${data.oversightId}")`) });
            }

            if (await exactRow.count() > 0) {
                await exactRow.first().click();
            } else {
                throw new Error(`${fullName} with respective given data does not match with any individual.`);
            }
        }
    }

    async navigateAndSelectIndividual(data) {
        await this.navigateToCaseNote(data.isOversight, "New");
        await this.selectIndividual(data);
    }

    async selectPersonContacted(data) {
        if (CommonUtils.isAffirmative(data.manualEntry)) {
            await this.btnPersonContacted.click();

            if (!data.manualPersonContacted || typeof data.manualPersonContacted !== 'string') return [];

            const manualPersonContactedList = data.manualPersonContacted.split('|').map(item => item.trim()).filter(Boolean);
            await expect(this.txtPersonContactedSearch).toBeVisible();

            for (let manualContact of manualPersonContactedList) {
                await this.txtPersonContactedSearch.fill(manualContact);
                await this.txtPersonContactedSearch.press('Enter', { delay: 100 });
                await this.txtPersonContactedSearch.press('Enter');
            }

            await this.page.keyboard.press('Escape');
        }

        await this.commonUtils.selectBootstrapCustomDropdown(this.btnPersonContacted, data.personContacted);
    }

    async fillUpNoteField(data) {
        await this.iframeNoteBody.waitFor({ state: 'attached' });
        await this.iframeNoteBody.click();
        await this.iframeNoteBody.fill(data);
    }

    async selectDateAndTemplate(data) {
        await this.page.waitForLoadState('domcontentloaded');
        await this.dtpServiceDate.fill(await this.dateTimeUtils.getDate(data.serviceDate));
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnSelectTemplate, data.templateName);
        await this.commonButtons.clickButton('Next');
    }

    async fillUpCaseNoteDetails(data, attachmentData) {
        await this.page.waitForLoadState('domcontentloaded');

        if (await this.commonUtils.isElementAvailable(this.btnProgram)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnProgram, data.program);
        }

        if (await this.commonUtils.isElementAvailable(this.btnServiceProvider)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnServiceProvider, data.serviceProvider);
        }

        if (await this.commonUtils.isElementAvailable(this.txtTimeDuration)) {
            await this.txtTimeDuration.fill(data.timeDuration);
        }

        if (await this.commonUtils.isElementAvailable(this.dtpTimeFrom)) {
            await this.dtpTimeFrom.fill(data.timeFrom);
            await this.dtpTimeTo.fill(data.timeTo);
        }

        if (await this.commonUtils.isElementAvailable(this.txtBillingUnits)) {
            await this.txtBillingUnits.fill(data.billingUnits);
        }

        if (await this.commonUtils.isElementAvailable(this.ddlServiceCode)) {
            if (!await CommonUtils.isDropdownOptionExist(this.ddlServiceCode, data.serviceCode)) {
                throw new Error(`Service Code : ${data.serviceCode} does not exist`);
            }
            await this.ddlServiceCode.selectOption(data.serviceCode);
        }

        if (await this.commonUtils.isElementAvailable(this.btnActivityType)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnActivityType, data.caseNoteActivityType);
        }

        if (await this.commonUtils.isElementAvailable(this.btnLocation)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnLocation, data.location);
        }

        if (await this.commonUtils.isElementAvailable(this.btnPlaceOfService)) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnPlaceOfService, data.placeOfService);
        }

        if (await this.commonUtils.isElementAvailable(this.rdoBillableYes)) {
            if (data.billable) await this.commonUtils.selectRadioOption(data.billable, this.rdoBillableYes, this.rdoBillableNo);
        }

        if (await this.commonUtils.isElementAvailable(this.rdoFaceToFaceYes)) {
            if (data.faceToFace) await this.commonUtils.selectRadioOption(data.faceToFace, this.rdoFaceToFaceYes, this.rdoFaceToFaceNo);
        }

        if (await this.commonUtils.isElementAvailable(this.overrideComment)) {

            if (data.overrideComment) {
                await this.overrideComment.fill(data.overrideComment);
            } else {
                await this.overrideComment.fill(await this.commonUtils.generateString(data.overrideCommentLength));
            }
        }

        if (await this.commonUtils.isElementAvailable(this.btnPersonContacted)) {
            await this.selectPersonContacted(data);
        }

        if (await this.commonUtils.isElementAvailable(this.btnQuestionnaire)) {
            await this.commonButtons.clickButton('Open');
            await this.answerQuestion.fill(data.answerQuestion);

            const dialog = this.page.locator('.ui-dialog').filter({ hasText: 'Answer Questionnaire' });

            await this.commonButtons.clickButton('Save', dialog);
            await this.commonButtons.clickButton('Close Popup', dialog);
        }

        if (await this.commonUtils.isElementAvailable(this.divAttachment) && (CommonUtils.isAffirmative(data.hasAttachment))) {
            await this.attachmentUtils.addFile(data.testCaseNumber, attachmentData);
        }

        if (await this.commonUtils.isElementAvailable(this.fieldsetNote)) {
            await this.fillUpNoteField(data.note);
        }
    }

    async navigateToNewCaseNoteForm(data) {
        await this.navigateAndSelectIndividual(data);
        await this.selectDateAndTemplate(data);
    }

    async formSubmission(action) {
        await this.commonButtons.clickButton(action);

        if (action === 'Submit') {
            await this.commonButtons.clickButton('Yes');
        }
    }

    async deleteCaseNote(data) {
        await this.page.waitForLoadState('domcontentloaded');

        if (data.reasonForDeletion) {
            await this.txtReasonForDeletion.fill(data.reasonForDeletion);
        } else {
            await this.txtReasonForDeletion.fill(await this.commonUtils.generateString(data.reasonForDeletionNumberOfCharacter));
        }

        if (await this.commonUtils.isElementAvailable(this.overrideComment)) {

            if (data.overrideComment) {
                await this.overrideComment.fill(data.overrideComment);
            } else {
                await this.overrideComment.fill(await this.commonUtils.generateString(data.overrideCommentLength));
            }
        }

        await this.commonButtons.clickButton('Delete', this.divDeleteCaseNote);
    }

    async verifyFormActionsByRole() {

        if (['Draft', 'Submitted'].includes(await this.commonUtils.fetchFormStatus())) {

            if (await this.commonButtons.isButtonPresent('Edit')) {
                await this.commonButtons.clickButton('Edit');
            } else if (await this.commonButtons.isButtonPresent('Delete')) {
                await this.commonButtons.clickButton('Delete');
            } else {
                console.log('User with Case Note View Super Role does not have access to Edit link');
                return;
            }
        } else {
            throw new Error(`Case Note form already deleted`);
        }
    }

    async processCaseNoteForm(data, attachmentData, action) {
        await this.fillUpCaseNoteDetails(data, attachmentData);
        await this.formSubmission(action);
    }

    // High-performance alternative to process form fields natively in one step
    async getCaseNoteFormValueByLabel() {
        return await this.page.evaluate(() => {
            const targetKeys = {
                'Individual': 'individual',
                'Program': 'program',
                'Service Provider': 'serviceProvider',
                'Service Date': 'serviceDate',
                'Time Duration (Minutes)': 'timeDuration',
                'Billing Unit(s)': 'billingUnits',
                'Service & Unit Rate ($)': 'serviceCode',
                'Activity Type': 'activityType',
                'Location': 'location',
                'Place of Service': 'placeOfService',
                'Billable': 'billable',
                'Face to Face': 'faceToFace',
                'Person Contacted': 'personContacted',
                'Override Comment': 'overrideComment'
            };

            const output = Object.values(targetKeys).reduce((acc, k) => ({ ...acc, [k]: '' }), {});

            document.querySelectorAll('.row').forEach(row => {
                const labelEl = row.querySelector('label');
                if (!labelEl) return;

                const labelTxt = labelEl.innerText.trim();
                const propertyKey = targetKeys[labelTxt];

                if (propertyKey) {
                    const valueEl = row.querySelector('.form-group:not(:has(label))');
                    output[propertyKey] = valueEl ? valueEl.innerText.trim() : '';
                }
            });

            return output;
        });
    }

    async formatPersonContactList(personContacted = '', manualPersonContacted = '', shouldSort = false) {
        const rawInputs = [personContacted, manualPersonContacted].filter(Boolean);

        let allPersonContacts = rawInputs
            .flatMap(input => input.split('|'))
            .map(contact => contact.trim())
            .filter(Boolean);

        if (shouldSort) {
            allPersonContacts.sort((a, b) => a.localeCompare(b));
        }

        return allPersonContacts.join('\n');
    }

    async verifyAttachmentDetails() {
        // 1. Scope to the exact fieldset to avoid interacting with other tables on the page
        const attachmentSection = this.page.locator('fieldset').filter({
            has: this.page.getByRole('heading', { name: 'Attachment(s)' })
        });

        try {
            // Wait for the table body to be visible before parsing
            await attachmentSection.locator('tbody').waitFor({ state: 'visible', timeout: 5000 });

            // 2. Fetch column indexes ONCE outside the loop to optimize performance
            const fileNameIdx = await this.listPage.getColumnIndexByName('File Name', 0);
            const descriptionIdx = await this.listPage.getColumnIndexByName('Description', 0);
            const dateIdx = await this.listPage.getColumnIndexByName('Date', 0);
            const attachedByIdx = await this.listPage.getColumnIndexByName('Attached By', 0);

            // 3. Locate all rows inside the table body
            const allRows = await attachmentSection.locator('tbody tr').all();

            // Map each row to a Promise, then resolve them all at once
            const allAttachments = await Promise.all(
                allRows.map(async (currentRow) => {
                    const [fileNameText, descriptionText, dateText, attachedByText] = await Promise.all([
                        currentRow.locator('td').nth(fileNameIdx).innerText(),
                        currentRow.locator('td').nth(descriptionIdx).innerText(),
                        currentRow.locator('td').nth(dateIdx).innerText(),
                        currentRow.locator('td').nth(attachedByIdx).innerText()
                    ]);

                    return {
                        fileName: fileNameText.trim(),
                        description: descriptionText.trim(),
                        date: dateText.trim(),
                        attachedBy: attachedByText.trim()
                    };
                })
            );

            return allAttachments;

        } catch (error) {
            throw new Error(`[Automation Error]: Failed to retrieve attachment details from the table.\n${error.message}`);
        }
    }

    async navigateToArchivedForm() {
        await this.btnDetailsIcon.click();
        await this.lnkUpdateHistory.click();
        await this.tblUpdateHistoryFirstRow.hover();
        await this.tblUpdateHistoryFirstRow.click();
    }

    async navigateToExistingFormArchive() {
        await this.btnDetailsIcon.click();
        await this.lnkUpdateHistory.click();
        await this.tblUpdateHistoryLastRow.hover();
        await this.tblUpdateHistoryLastRow.click();
    }

    /**
     * Extracts values from the archive table by checking UI labels against an explicit target schema.
     * Unconfigured or completely missing fields from the DOM safely default to an empty string.
     * @returns {Promise<Object>} Object mapping the exact UI target labels to their extracted values
     */
    async getCaseNoteArchiveValueByLabel() {
        // Enforce structural row targeting precision using explicit table hierarchy
        await this.tblArchiveDataRows.first().waitFor({ state: 'attached', timeout: 5000 });

        const targetKeys = {
            'Form ID': 'Form ID',
            'Status': 'Status',
            'Time Zone': 'Time Zone',
            'Individual Name': 'Individual Name',
            'Provider': 'Provider',
            'Reason for Deletion': 'Reason for Deletion',
            'Template Name': 'Template Name',
            'Program': 'Program',
            'Service Provider': 'Service Provider',
            'Service Date': 'Service Date',
            'Time Duration (Minutes)': 'Time Duration (Minutes)',
            'Place of Service': 'Place of Service',
            'Billing Unit(s)': 'Billing Unit(s)',
            'Activity Type': 'Activity Type',
            'Location': 'Location',
            'Service & Unit Rate ($)': 'Service & Unit Rate ($)',
            'Billing Diagnosis Code': 'Billing Diagnosis Code',
            'Billable': 'Billable',
            'Face to Face': 'Face to Face',
            'Person Contacted': 'Person Contacted',
            'Note': 'Note',
            'Override Comment': 'Override Comment'
        };

        return await this.tblArchiveDataRows.evaluateAll((rows, keysSchema) => {
            // Pre-seed all target elements as empty strings to handle missing elements gracefully
            const output = Object.fromEntries(
                Object.values(keysSchema).map(propKey => [propKey, ''])
            );

            rows.forEach(row => {
                const labelEl = row.querySelector('.label');
                const valueEl = row.querySelector('td:not(.label)');

                if (labelEl && valueEl) {
                    const labelTxt = labelEl.innerText.trim();
                    const targetPropertyKey = keysSchema[labelTxt];

                    if (targetPropertyKey) {
                        // Check if the target field is an explicit multi-line list wrapper
                        if (row.querySelector('ul')) {
                            output[targetPropertyKey] = Array.from(row.querySelectorAll('li'))
                                .map(li => li.innerText.trim())
                                .join('\n');
                        } else {
                            // Standardize all forms of spaces (\u00a0, tabs, newlines) and collapse them into a single space
                            output[targetPropertyKey] = valueEl.innerText
                                .replace(/\s+/g, ' ')
                                .trim();
                        }
                    }
                }
            });

            return output;
        }, targetKeys);
    }

    _replaceCommentInTestcase(attachmentData, formIndex) {
        const data = filterObjects(attachmentData, [{ "formIndex": formIndex }]);
        const comment = `File name: ${data[0].fileName}`;
        return comment;
    }

    async removeSingleAttachment() {
        await this.commonButtons.clickButton('Remove');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Save');
    }

    async navigateToUser(action) {
        await this.commonUtils.navigateToDashboardLink('Admin', 'User', action);
    }

    async handleCaseNoteNotification(action, testcase, attachmentData = null) {
        switch (action.toLowerCase()) {
            case 'create':
                await this.userPersonalDetailsPage.navigateToPersonalDetailsPage(testcase);
                await this.notificationProfilePage.checkEnableNotificationsOption();
                await this.notificationProfilePage.setupNotificationProfile(testcase, testcase.expectedNotifSuccessMsg);

                await this.navigateToNewCaseNoteForm(testcase);
                await this.processCaseNoteForm(testcase, attachmentData, 'Submit');

                await this.donePage.verifyPartialDoneMessage(testcase.expectedSubmitMsg);

                const formID = await this.donePage.fetchFormIdFromDoneMessage();
                await this.donePage.clickLinkByText('Form');
                return formID;

            case 'update':
                await this.commonButtons.clickButton('Edit');
                await this.processCaseNoteForm(testcase, attachmentData, 'Update');

                await this.donePage.verifyPartialDoneMessage(testcase.expectedUpdateOrDeleteMsg);
                break;

            case 'delete':
                await this.commonButtons.clickButton('Delete');
                await this.deleteCaseNote(testcase);

                await this.donePage.verifyPartialDoneMessage(testcase.expectedUpdateOrDeleteMsg);
                break;
        }
    }

    async openFirstCaseNoteRow() {

        try {
            await this.tblCaseNoteFirstRow.click({ timeout: 10000 });
        } catch (error) {
            throw new Error(`No Case Note Available in Search Result Page`);
        }
    }

    async navigateToCaseNoteDashboard(data) {
        await this.page.goto(urlData.searchCaseNoteDashboardUrl);
        await this.dtpDashboardFromDate.fill(data);
        await this.dtpDashboardToDate.fill(data);
        await this.commonButtons.clickButton('Generate Dashboard');


        try {
            await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            return true;
        } catch (error) {
            throw new Error(`Failed to load Case Note Dashboard`);
        }
    }
}