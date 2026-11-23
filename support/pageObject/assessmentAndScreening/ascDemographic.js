/**
 * @author Maksuda Islam (Lima)
 * @since 05/21/2025
 */

export class ASCDemographic {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
    }

    async getSecondValueOfLabel(labelText) {
        const rowLocator = this.page.locator(`#identificationData div.row:has(div.form-group:has(label.control-label:text-is("${labelText}")))`);
        const rowCount = await rowLocator.count();

        if (rowCount === 0) {
            return `Label "${labelText}" not found in identification section.`;
        }

        const groups = rowLocator.first().locator('> div.form-group');
        const groupsCount = await groups.count();

        let labelIndex = -1; // label not found initially
        for (let i = 0; i < groupsCount; i++) {
            const group = groups.nth(i);
            const groupText = (await group.innerText()).trim();

            if (groupText === labelText.trim()) {
                labelIndex = i;
                break;
            }
        }

        if (labelIndex === -1) {
            return `Label "${labelText}" found but no corresponding form group.`;
        }

        const valueIndex = labelIndex + 2;

        if (valueIndex >= groupsCount) {
            return `Label "${labelText}" found, but has no value group next to it.`;
        }

        const valueGroup = groups.nth(valueIndex);
        const imgCount = await valueGroup.locator('img').count();

        if (imgCount > 0) {
            return 'Not handled for img fields';
        }

        const valueText = (await valueGroup.innerText()).trim();
        return valueText || '';

    }

}