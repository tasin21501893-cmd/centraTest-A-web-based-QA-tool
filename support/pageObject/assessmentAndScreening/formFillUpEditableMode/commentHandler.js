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
        if ((child.canComment === true) && (child.code)) {   //since canComment is true for Generic tabular's children
            const childID = this.page.locator(`#item-${child.code}`);

            await childID.getByTitle('Comments').click();
            await this.page.locator(`[id="comment-${child.code}"]`).locator('textarea[class="form-control"]').fill(inputForComment);
        }
    }
}