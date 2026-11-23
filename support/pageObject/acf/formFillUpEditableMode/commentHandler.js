/**
 * @author Maksuda Islam (Lima)
 * @since 01/08/2024
 */

export class CommentHandler {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
    }

    async handleCommentInput(child, inputForComment) {
        if (await this.page.locator(`[id="item-${child.code}"]`).count() > 0) {
            const commentDataIcon = this.page.locator(`[id="item-${child.code}"]`).locator('[data-icon="message"]').first();
            await commentDataIcon.click();
            const textarea = this.page.locator(`[name="comment-${child.code}"]`).first();
            await textarea.waitFor({ state: 'visible', timeout: 5000 });
            await textarea.fill(inputForComment);
        }
    }
}