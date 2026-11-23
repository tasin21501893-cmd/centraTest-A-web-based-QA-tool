/**
 * @author Ishraq Ahmed Esha
 * @since 01/18/2026
 */

export class PayerSetting {

    constructor(page) {
        this.page = page;
        // Locator for the table body rows
        this.tableRows = page.locator('#payerList tbody tr');
    }

    async setPayerActive(name, payerId, active = true) {
        const row = this.tableRows
            .filter({ hasText: name })
            .filter({ hasText: payerId});
        
        const checkbox = row.locator('input[type="checkbox"]');
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.setChecked(active);
    }
}