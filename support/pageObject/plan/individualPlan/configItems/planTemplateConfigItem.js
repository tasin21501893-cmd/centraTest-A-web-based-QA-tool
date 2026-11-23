/**
 * @author Md. Hasin Ibtida Alam
 * @since 05/23/25
 */

import { CommonUtils } from "../../../../commonUtility/commonUtils";
import { CommonButtons } from "../../../../commonUtility/commonButtons";

export class PlanTemplateConfigItem {

    constructor(page, configItemLink) {
        this.page = page;
        this.configItemLink = configItemLink;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
    }

    async goToNewForm() {
        await this.page.goto('/');
        
        if (this.page.url().includes('ma/home')) {
            await this.commonUtils.navigateToDashboardLink("Admin", "Plan Template", this.configItemLink);

        } else if (this.page.url().includes('/ma/fpage/unifiedDashboard')) {
            await this.commonUtils.navigateToDashboardLink("Individual Plans", "Plan Template", this.configItemLink);

        } else {
            await this.commonUtils.navigateToDashboardLink("Admin", "Plan Template", this.configItemLink);
        }

        await this.commonButtons.clickButton("Create New");
    }
}