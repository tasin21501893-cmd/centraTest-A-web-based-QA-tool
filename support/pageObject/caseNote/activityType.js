/**
 * @author Dibya Nath
 * @since 03/15/2026
 */
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class CaseNoteManageActivityType {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);

        this.txtActivityType = page.locator('[name="value"]');
        this.btnExpandTable = page.locator('#expandTable');
    }

    async processCaseNoteActivityType(data) { 
        await this.txtActivityType.fill(data.activityType);
        await this.commonButtons.clickButton('Create');
    }

    async generateActivityTypeName(data) {
        const text = await this.commonUtils.generateString(data.activityType);
        
        await this.txtActivityType.fill(text);
        await this.commonButtons.clickButton('Create');
    }

    async maxlengthValidationCheck(data) {
        await this.navigateToActivityType(data);
        await this.commonUtils.removeMaxLengthAndFill(this.txtActivityType, data.activityType);

        const text = await this.commonUtils.generateString(data.activityType);

        await this.txtActivityType.fill(text);
        await this.commonButtons.clickButton('Create');
    }

    async navigateToActivityType(data) {
        if (CommonUtils.isAffirmative(data.isOversight)) {
            await this.commonUtils.navigateToDashboardLink('Module Configuration', 'Case Note Template', 'Manage Activity Type');
        } else {
            await this.commonUtils.navigateToDashboardLink('Admin', 'Case Note Template', 'Manage Activity Type');
        }
    } 

    async duplicateCheck(data) {
        await this.navigateToActivityType(data);
        await this.btnExpandTable.click();
        await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
        
        if (await this.listPage.isItemExistInColumnByName(data.activityType, 'Name')) {
            await this.processCaseNoteActivityType(data); 
        } else{
            await this.processCaseNoteActivityType(data);
            await this.navigateToActivityType(data);
            await this.processCaseNoteActivityType(data);
        }
    }
}