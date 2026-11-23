/**
 * @author Emran Hossain Rabbi
 * @since 23/05/2026
 */

import path from 'path';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class QuestionnairePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.pnlQuestionnaire = page.locator('#questionnairePanel');
        this.lstQuestionItems = page.locator('ol.qn-list > li');
        this.pnlQuestion = page.locator('#questionPanel');
        this.cntAnswer = page.locator('#questionPanel .answerOption');
        this.hdnAnswerType = page.locator('#questionPanel #answerType');
        this.lblQuestionText = page.locator('.succinct');
        this.txtStreet1 = page.locator('#street1');
        this.txtStreet2 = page.locator('#street2');
        this.txtCity = page.locator('#city');
        this.txtZip = page.locator('#zip');
        this.txtSingleText = page.locator('#questionPanel input[type="text"]');
        this.txtTextArea = page.locator('#qnrTextArea');
        this.txtDefaultInput = page.locator('#questionPanel .answerOption input[type="text"], #questionPanel .answerOption textarea');
        this.ddlCountry = page.locator('#countrySelect');
        this.ddlState = page.locator('#stateSelect');
        this.ddlQuestion = page.locator('#qnSelect');
        this.dtpQuestionDate = page.locator('#qnrDatePicker');
        this.txtQuestionTime = page.locator('#qnrTimePicker');
        this.chkAnswerOptions = page.locator('#questionPanel .answerOption input[type="checkbox"]');
        this.rdoAnswerOptions = page.locator('#questionPanel .answerOption input[type="radio"]');
        this.btnAddFile = page.locator('#questionPanel .attachment-button-group .add-file');
        this.divFileInput = page.locator('.file-input-div');
        this.btnUpload = page.getByRole('button', { name: 'Upload' });
        this.btnSaveAndNext = page.locator('#actionSaveNextButton');
        this.btnNext = page.locator('#actionNextButton');
        this.btnSave = page.locator('#actionSaveButton');
        this.btnClosePopup = page.getByRole('button', { name: 'Close Popup' });
    }

    async waitForPanelToLoad() {
        await this.pnlQuestionnaire.waitFor({ state: 'visible' });
    }

    async waitForQuestionPanelToLoad() {
        await this.pnlQuestion.waitFor({ state: 'visible', timeout: 5000 });
    }

    async getQuestionCount() {
        return await this.lstQuestionItems.count();
    }

    async saveAndProceed() {
        if (await this.btnSaveAndNext.isVisible()) {
            await this.btnSaveAndNext.click();
        } else {
            await this.btnSave.click();
        }
        await this.commonUtils.waitForChangeInDOM('#questionPanel')
    }

    async processAllQuestions(data) {
        await this.waitForPanelToLoad();
        const totalQuestions = await this.getQuestionCount();

        for (let i = 0; i < totalQuestions; i++) {
            const currentItem = this.lstQuestionItems.nth(i);

            await currentItem.click();
            await this.waitForQuestionPanelToLoad();

            const rawAnswerType = await this.hdnAnswerType.getAttribute('value');

            if (rawAnswerType === 'READONLY') {
                await this.btnNext.click();
                continue;
            }

            switch (rawAnswerType) {
                case 'ADDRESS':
                    await this.txtStreet1.fill(data.street1);
                    await this.txtStreet2.fill(data.street2);
                    await this.txtCity.fill(data.city);
                    await this.txtZip.fill(data.zip);

                    await this.ddlCountry.selectOption(data.country);
                    await this.ddlState.selectOption(data.state);
                    break;

                case 'DATE':
                    await this.dtpQuestionDate.fill(data.date);
                    break;

                case 'TIME':
                    await this.txtQuestionTime.fill(data.time);
                    break;

                case 'TEXT':
                    await this.txtSingleText.fill(data.text);
                    break;

                case 'TEXTAREA':
                    await this.txtTextArea.fill(data.textarea);
                    break;

                case 'NUMERIC':
                    await this.txtSingleText.fill(data.numeric);
                    break;

                case 'NUMERIC_INT':
                    await this.txtSingleText.fill(data.numericInteger);
                    break;

                case 'CHECKBOX': {
                    const randomCheckIdx = Math.floor(
                        Math.random() * (await this.chkAnswerOptions.count())
                    );

                    await this.chkAnswerOptions.nth(randomCheckIdx).click({ force: true });
                    break;
                }

                case 'RADIO': {
                    const randomRadioIdx = Math.floor(
                        Math.random() * (await this.rdoAnswerOptions.count())
                    );

                    await this.rdoAnswerOptions.nth(randomRadioIdx).click({ force: true });
                    break;
                }

                case 'DROPDOWN':
                    const firstValue = await this.ddlQuestion.locator('option').nth(1).getAttribute('value');
                    await this.ddlQuestion.selectOption(firstValue);
                    break;

                case 'ATTACHMENT':
                    await this.btnAddFile.click();

                    const filePath = path.resolve(data.attachment);

                    const [fileChooser] = await Promise.all([
                        this.page.waitForEvent('filechooser'),
                        this.divFileInput.click()
                    ]);

                    await fileChooser.setFiles(filePath);
                    await this.btnUpload.click();
                    break;

                default:
                    await this.txtDefaultInput.first().fill(data.default);
                    break;
            }

            await this.saveAndProceed();
        }

        await this.btnClosePopup.click();
    }
}