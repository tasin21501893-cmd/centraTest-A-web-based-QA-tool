/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

import { CommentHandler } from '../commentHandler.js';
import { getRandomSelectValue, createRandomString, generateInteger } from '../../../../helper/acfCore/formFillUpDataProcessor.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';
import { CommonUtils } from '../../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../../commonUtility/commonButtons.js';

export class DiagnosisFetchInputHandler {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;

        this.commentHandler = new CommentHandler(page);
        this.commonButtons = new CommonButtons(page);
    }

    async handleDiagnosisFetchUsingAddNewDiagnosis(child, childCode, noOfRowsForDiagnosisTable, inputForComment, shouldAddComment) {
        FORM_INPUT.questionCodeInputValueObj[childCode] = noOfRowsForDiagnosisTable;

        for (let i = 0; i < noOfRowsForDiagnosisTable; i++) {
            await this.page.locator(`input[data-target="#diagnosisModal_${childCode}"][value="Add New Diagnosis"]`).click();
            await this.page.locator(`#diagnosisModal_${childCode}Diagnosis`).waitFor({ state: 'visible' });
            await this.page.locator(`#diagnosisModal_${childCode}Diagnosis`).fill(`diagnosis0${i}`);

            const diseaseCodeLocator = `#diagnosisModal_${childCode}DiseaseCode`;
            const randomValueOfDiseaseCodeDropdown = await getRandomSelectValue(this.page, diseaseCodeLocator);
            await this.page.locator(diseaseCodeLocator).selectOption(randomValueOfDiseaseCodeDropdown);

            const radioLocator = `#diagnosisModal_${childCode}CodingSystemDiv input[type="radio"]`;
            const codingSystemRadioButtons = await this.page.locator(radioLocator).all();

            if (codingSystemRadioButtons.length === 0) {
                throw new Error(`No radio buttons found for childCode: ${childCode}`);
            }

            const randomIndex = generateInteger(Number(codingSystemRadioButtons.length) - 1);
            await codingSystemRadioButtons[randomIndex].click();

            await this.page.locator(`#diagnosisModal_${childCode}IcdCode`).fill(createRandomString(5));

            await this.commonButtons.clickButton('Continue');
        }

        if (CommonUtils.isAffirmative(shouldAddComment)) {
            await this.commentHandler.handleCommentInput(child, inputForComment);
        }
    }

    async handleDiagnosisFetchUsingFetchIndividualDiagnosis(child, childCode, noOfRowsForDiagnosisTable, inputForComment, shouldAddComment) {
        FORM_INPUT.questionCodeInputValueObj[childCode] = noOfRowsForDiagnosisTable;

        await this.commonButtons.clickButton('Fetch Individual Diagnosis');
        let noDiagnosisFoundMsg = await this.page.getByText('No diagnosis found for this').count();

        if (noDiagnosisFoundMsg > 0) {
            throw new Error(`No Diagnosis found for childCode: ${childCode}`);
        }

        const modalLocator = this.page.locator(`#individualDiagnosisModal_${childCode}`);
        await modalLocator.waitFor({ state: 'visible' });
        const diagnosisTable = modalLocator.locator('table.table-bordered.table-striped');
        await diagnosisTable.waitFor({ state: 'visible' });
        const trCount = await diagnosisTable.locator('tbody tr').count();
        let maxLengthOfLoop;

        if (trCount >= noOfRowsForDiagnosisTable) {
            maxLengthOfLoop = noOfRowsForDiagnosisTable;
        } else {
            maxLengthOfLoop = trCount;
        }

        await this.commonButtons.clickButton('×');
        FORM_INPUT.questionCodeInputValueObj[childCode] = maxLengthOfLoop;

        for (let i = 0; i < maxLengthOfLoop; i++) {
            await this.commonButtons.clickButton('Fetch Individual Diagnosis');
            const diseaseCodeLocator = `#select${i}`;
            const randomValueOfDiseaseCodeDropdown = await getRandomSelectValue(this.page, diseaseCodeLocator);
            await this.page.locator(diseaseCodeLocator).selectOption(randomValueOfDiseaseCodeDropdown);

            await this.page.locator('a', { hasText: 'Add' }).nth(i).click();
        }

        if (CommonUtils.isAffirmative(shouldAddComment)) {
            await this.commentHandler.handleCommentInput(child, inputForComment);
        }
    }

}