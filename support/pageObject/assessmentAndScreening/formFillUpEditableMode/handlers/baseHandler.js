/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { CommonUtils } from '../../../../commonUtility/commonUtils';

export class BaseHandler {
    /**
     * @param {import('playwright').Page} page 
     */
    constructor(page) {
        if (!page) {
            throw new Error('BaseHandler requires a Playwright Page instance');
        }
        this.page = page;
    }

    /**
     * @abstract
     * @param {object} child
     */
    async handle(child) {
        throw new Error(`${this.constructor.name}.handle() not implemented`);
    }

    async addComment(child, code, shouldAddComment, inputComment) {
        if (CommonUtils.isAffirmative(shouldAddComment)) {
            if ((child.canComment === true) && (code)) {
                const commentBtn = this.page.locator(`#item-${code} [title="Comments"]`);
                const textarea = this.page.locator(`#comment-${code} textarea.form-control`);

                await commentBtn.click();
                await textarea.fill(inputComment);
            }
        }
    }
}