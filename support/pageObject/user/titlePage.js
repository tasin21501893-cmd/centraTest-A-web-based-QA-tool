/**
 * @author Md. Shajjad Howlader
 * @since 3/1/25
 */

import { expect } from '@playwright/test';

export class TitlePage {

    constructor(page) {
        this.page = page;

        this.txtTitle = page.locator('[name="title"]');
        this.txtDescription = page.locator('[name="description"]');

        this.titleErrorMsg = page.locator('#title\\.errors');
        this.descriptionErrorMsg = page.locator('#description\\.errors');
    }

    async fillUpForm(data) {
        await this.txtTitle.fill(data.title);
        await this.txtDescription.fill(data.description);
    }

    async validateErrorMsg(errorMsgLocator, expectedMsg) {
        await expect(errorMsgLocator).toHaveText(expectedMsg);
    }
};
