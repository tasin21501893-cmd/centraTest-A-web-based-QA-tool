/**
 * @author Tarikul Islam
 * @since 19/03/25
*/

import { expect } from '@playwright/test';

export class ManageOversightProgramsPage {

    constructor(page){
        this.page = page;
        this.lnkCreateOversightProgram = page.locator('a', {hasText: 'Create Oversight Program'});
        this.txtOversightProgramName = page.locator('[name="oversightProgram.name"]');
    }

    async clickCreateOversightProgramForm(){
        await this.lnkCreateOversightProgram.click();
    }

    async oversightProgramFormFillUp(data){
        await this.txtOversightProgramName.fill(data.oversightProgramName);
    }

    async availabilityOfCreateOversightProgramLink(){
        await this.page.waitForLoadState("domcontentloaded");

        const noLinkAvailableCount = await this.lnkCreateOversightProgram.count();
        return noLinkAvailableCount === 0;
    }

    async validateNewlyCreatedOversightProgramFromList(oversightProgramName){
        await this.page.waitForLoadState("domcontentloaded");

        const getRow = this.page.locator('tbody > tr').first();
        const getElement =  getRow.locator('td:nth-child(1)');
        await expect(getElement).toContainText(oversightProgramName);
    }
}