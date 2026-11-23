/**
 * @author Md. Hasin Ibtida Alam
 * @since 05/19/25
 */

import { CommonUtils } from "../../../../commonUtility/commonUtils";
import { PlanTemplateConfigItem } from "./planTemplateConfigItem";

export class PlanTemplateProviderTypePage extends PlanTemplateConfigItem {

    constructor(page) {
        super(page, "Manage Provider Types"); 

        this.txtProviderTypeName = page.locator('[name = name]');
        this.chkAvailableForLinkedProvider = page.locator('[name = shareable]');

        this.commonUtils = new CommonUtils(page);
    }

    async fillupForm(data) {
        await this.txtProviderTypeName.fill(data.providerTypeName);

        if (await this.commonUtils.isElementAvailable(this.chkAvailableForLinkedProvider)) {
            if (['yes', 'y'].includes(data.isAvailableForLinkedProvider.toLowerCase())) {
                await this.commonUtils.selectCheckboxUsingFieldName(this.page, "Available for Linked Providers");
            }
        }
    }
}