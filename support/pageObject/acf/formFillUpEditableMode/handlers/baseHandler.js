/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { CommentHandler } from '../commentHandler';

export class BaseHandler {
    /**
     * @param {import('playwright').Page} page 
     */
    constructor(page) {
        if (!page) {
            throw new Error('BaseHandler requires a Playwright Page instance');
        }

        this.page = page;
        this.commentHandler = new CommentHandler(page);
    }

    /**
     * @abstract
     * @param {object} child
     */
    async handle(child) {
        throw new Error(`${this.constructor.name}.handle() not implemented`);
    }
}