/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { BaseHandler } from './baseHandler.js';
import { GenericTabularInputHandler } from './genericTabularInputHandler.js';
import { FORM_INPUT } from '../../../../constants/acfCore/formInput.js';

export class GenericTabularHandler extends BaseHandler {

    /**
     * @param {import('playwright').Page} page
     */

    constructor(page) {
        super(page);
        this.fetchHandler = new GenericTabularInputHandler(page);
    }

    async handle(child, params) {
        const {
            noOfRowsForGenericTabular,
            mode
        } = params;
        const code = child.code || child.itemKey;
        FORM_INPUT.questionCodeInputValueObj[code] = noOfRowsForGenericTabular;

        await this.fetchHandler.handleGenericTabular(
            child,
            code,
            noOfRowsForGenericTabular,
            mode
        );
    }
}