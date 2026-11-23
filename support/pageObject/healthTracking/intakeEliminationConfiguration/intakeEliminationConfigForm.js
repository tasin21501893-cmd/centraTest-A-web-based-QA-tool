/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { CommonButtons } from '../../../commonUtility/commonButtons';
import { ListPage } from '../../../commonPages/listPage';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';

export class IntakeEliminationConfigForm {
    constructor(page) {
        this.page = page;
        this.txtConfigurationName = page.locator('input[id="name"]');
        this.tblFluidIntake = page.locator('[data-value="Fluid Intake (ml)"]');
        this.tblRoute = page.locator('[data-value="Route"]');
        this.tblMealEaten = page.locator('[data-value="% of Meal Eaten"]');
        this.tblCalorieIntake = page.locator('[data-value="Calorie Intake (cal)"]');
        this.tblNumberOfFluidVoids = page.locator('[data-value="# of Fluid Voids"]');
        this.tblFluidVoidML = page.locator('[data-value="Fluid Void (ml)"]');
        this.tblBowelMovement = page.locator('[data-value="Bowel Movement (BM)"]');
        this.tblBmType = page.locator('[data-value="BM Type"]');
        this.tblBmAmount = page.locator('[data-value="BM Amount"]');
        this.tblBloodInBm = page.locator('[data-value="Blood in BM?"]');
        this.tblOstomy = page.locator('[data-value="Ostomy (ml)"]');
        this.tblBowelAids = page.locator('[data-value="Bowel Aids"]');
        this.tblEmesis = page.locator('[data-value="Emesis"]');
        this.tblBloodInEmesis = page.locator('[data-value="Blood in Emesis?"]');
        this.tblProtien = page.locator('[data-value="Protein (g)"]');
        this.tblSodium = page.locator('[data-value="Sodium (mg)"]');
        this.tblCarbohydrates = page.locator('[data-value="Carbohydrates (g)"]');
        this.tblCecostomy = page.locator('[data-value="Cecostomy (ml)"]');

        this.errMsgGlobal = page.locator('.alert-danger li');
        this.errMsgConfiguration = page.locator('#name\\.errors');
        this.errMsgColumns = page.locator('#configItems\\.errors');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        formObject.name && await this.txtConfigurationName.fill(formObject.name);

        formObject.FluidIntake && await this.tblFluidIntake.click();
        formObject.Route && await this.tblRoute.click();
        formObject.MealEaten && await this.tblMealEaten.click();
        formObject.CalorieIntake && await this.tblCalorieIntake.click();
        formObject.FluidVoids && await this.tblNumberOfFluidVoids.click();
        formObject.FluidVoidML && await this.tblFluidVoidML.click();
        formObject.BowelMovement && await this.tblBowelMovement.click();
        formObject.BmType && await this.tblBmType.click();
        formObject.BmAmount && await this.tblBmAmount.click();
        formObject.BloodInBm && await this.tblBloodInBm.click();
        formObject.Ostomy && await this.tblOstomy.click();
        formObject.BowelAids && await this.tblBowelAids.click();
        formObject.Emesis && await this.tblEmesis.click();
        formObject.BloodInEmesis && await this.tblBloodInEmesis.click();
        formObject.Protien && await this.tblProtien.click();
        formObject.Sodium && await this.tblSodium.click();
        formObject.Carbohydrates && await this.tblCarbohydrates.click();
        formObject.Cecostomy && await this.tblCecostomy.click();
    }

    async discontinueNonDefaultConfigs() {
        while (true) {
            await this.page.waitForSelector('#dataList thead th');

            /** 
            * Finding the status column index based on aria-label as it 
            * contains both text and a dropdown in header
            */

            const headerCells = this.page.locator('#dataList thead th');
            const headerCount = await headerCells.count();
            let statusIndex = -1;
            for (let i = 0; i < headerCount; i++) {
                const ariaLabel = (await headerCells.nth(i).getAttribute('aria-label'))?.trim().toLowerCase();
                if (ariaLabel === 'status') {
                    statusIndex = i;
                    break;
                }
            }
            const rows = this.page.locator('#dataList tbody tr');
            const rowCount = await rows.count();
            let discontinuedConfig = false;

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);

                /** 
                 * deafultText to identify if it is a Default configuration or not
                 *  statusText to check if the status is Active or Discontinued 
                 */

                const defaultText = (await row.locator('td').nth(4).innerText()).trim().toLowerCase();
                const statusText = (await row.locator('td').nth(statusIndex).innerText()).trim().toLowerCase();
                if (statusText === 'active') {
                    if (defaultText === 'yes') {
                        continue;
                    }
                    await row.locator('input[type="radio"].select-action').click();
                    await this.commonButtons.clickButton(ButtonLabels.DISCONTINUE);
                    await this.commonButtons.clickButton('Yes');
                    await this.commonButtons.clickButton('List');
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.page.waitForSelector('#dataList tbody tr');
                    discontinuedConfig = true;
                    break;
                }
            }
            if (!discontinuedConfig) {
                break;
            }
        }
    }
}