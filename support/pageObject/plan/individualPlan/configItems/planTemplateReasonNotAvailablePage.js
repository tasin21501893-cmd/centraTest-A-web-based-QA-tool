/**
 * @author Md. Hasin Ibtida Alam
 * @since 05/19/25
 */

import { CommonUtils } from "../../../../commonUtility/commonUtils";
import { PlanTemplateConfigItem } from "./planTemplateConfigItem";

export class PlanTemplateReasonNotAvailablePage extends PlanTemplateConfigItem {

    constructor(page) {
        super(page, "Manage Reasons Not Available");

        this.txtReasonName = page.locator('[name = name]');
        this.chkAvailableForLinkedProvider = page.locator('[name = shareable]');

        this.commonUtils = new CommonUtils(page);
    }

    async fillupForm(data) {
        await this.txtReasonName.fill(data.reasonName);

        if (await this.commonUtils.isElementAvailable(this.chkAvailableForLinkedProvider)) {
            if (['yes', 'y'].includes(data.isAvailableForLinkedProvider.toLowerCase())) {
                await this.commonUtils.selectCheckboxUsingFieldName(this.page, "Available for Linked Providers");
            }
        }
    }
}