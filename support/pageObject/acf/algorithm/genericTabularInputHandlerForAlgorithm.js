/**
 * @author Maksuda Islam (Lima)
 * @since 10/26/2025
 */
import { parseBrokenItemKeyObjectStrings } from './algoDataProcessor';
import { GenericTabularInputHandler } from '../formFillUpEditableMode/handlers/genericTabularInputHandler';

export class GenericTabularInputHandlerForAlgorithm {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.genericTabularInputHandler = new GenericTabularInputHandler(page);
    }

    async clickAddNewButtonForTabularQuestionItem(childCode) {
        await this.page.locator(`[id="item-${childCode}"]`).filter({ hasText: 'Add New' }).getByRole('button', { name: 'Add New' }).click();
    }

    async clickContinueButton() {
        await this.page.frameLocator('iframe').getByRole('button', { name: 'Continue' }).click();
    }

    async handleGenericTabularInput(child) {
        let childInputValue = parseBrokenItemKeyObjectStrings(child.inputValue)

        for (let row of childInputValue) {
            await this.clickAddNewButtonForTabularQuestionItem(child.code);

            for (let childrenCode in row) {
                const matchedChild = child.children.find(c => c.itemKey === childrenCode);
                if (matchedChild) {
                    await this.genericTabularInputHandler.handleChildTypeForGenericTabular(matchedChild, child.code, row[childrenCode], row[childrenCode], row[childrenCode], row[childrenCode], row[childrenCode]);
                }
            }

            await this.clickContinueButton();
        }
    }
}