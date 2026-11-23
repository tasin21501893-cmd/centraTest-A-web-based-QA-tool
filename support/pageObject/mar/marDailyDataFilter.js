/**
 * @author Emran Hossain Rabbi
 * @since 12/07/2025
 */
import { CommonButtons } from "../../commonUtility/commonButtons";
export class MarDailyDataFilter {
    static recordTab = "";

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.ddlFilter = page.locator('#filter-dropdown');
        this.ddlMedicationContainer = page.locator('[class="dropdown-select-input-close form-control"]').first();
        this.txtFilterDate = page.locator('[name="filter-date"]');
    }

    async filterMedicationFromDailyMAR(medName) {
        /**
         * Reload the page to clear the filter field and ensure 
         * a fresh state before applying the new search.
         */
        await this.page.reload();
        await this.ddlFilter.click();
        await this.ddlMedicationContainer.click();
        await this.page.locator('[placeholder="Search"]').fill(medName);
        await this.page.keyboard.press("ArrowDown");
        await this.page.keyboard.press("Enter");
        await this.ddlFilter.click();
        MarDailyDataFilter.recordTab = medName.split(" ")[0];
        await this.page.getByRole("tab", { name: MarDailyDataFilter.recordTab }).click();
        await this.commonButtons.clickButton('View Details');
    }

    async getTabName() {
        return MarDailyDataFilter.recordTab;
    }
}