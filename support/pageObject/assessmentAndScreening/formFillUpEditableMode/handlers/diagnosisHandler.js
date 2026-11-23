/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { DiagnosisFetchInputHandler } from './diagnosisFetchInputHandler.js';
import { FORM_INPUT } from '../../../../../support/constants/acfCore/formInput.js';
import { CommonUtils } from '../../../../commonUtility/commonUtils.js';

export class DiagnosisHandler extends BaseHandler {

    /**
     * @param {import('playwright').Page} page
     */

    constructor(page) {
        super(page);
        this.fetchHandler = new DiagnosisFetchInputHandler(page);
    }

    async handle(child, params) {
        const { shouldAddComment, inputComment, noOfRows, shouldFetchDiagnosis } = params;
        const code = child.code || child.itemKey;
        FORM_INPUT.questionCodeInputValueObj[code] = noOfRows;

        if (CommonUtils.isAffirmative(shouldFetchDiagnosis)) {
            await this.fetchHandler.handleDiagnosisFetchUsingFetchIndividualDiagnosis(
                child,
                code,
                noOfRows,
                inputComment,
                shouldAddComment
            );
        } else {
            await this.fetchHandler.handleDiagnosisFetchUsingAddNewDiagnosis(
                child,
                code,
                noOfRows,
                inputComment,
                shouldAddComment
            );
        }
    }
}