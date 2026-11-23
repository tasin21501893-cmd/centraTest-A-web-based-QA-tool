/**
 * @author Tarikul Islam
 * @since 08/04/25
*/

import { CommonButtons } from '../../commonUtility/commonButtons';

export class ReferralDenialReasonsPage {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
    }

    async referralDenialReasonsCreate(referralDenialReasons) {
        const denialReasonList = referralDenialReasons
            .split(',')
            .map(reason => reason.trim())
            .filter(reason => reason);

        // Get all current input field values (exact, case-sensitive)
        const existingReasons = await this.page
            .locator('input.form-control')
            .evaluateAll(inputs => inputs.map(input => input.value.trim()));

        let nextReasonIndex = existingReasons.length;

        for (const reason of denialReasonList) {
            if (existingReasons.includes(reason)) {
                console.log(`Duplicate denial reason detected (skipped): ${reason}`);
                continue;
            }

            await this.commonButtons.clickButton('New');

            const newInput = this.page.locator(`input[id="reasonList[${nextReasonIndex}].denialReasonLabel"]`);
            await newInput.waitFor({ state: 'visible' });
            await newInput.fill(reason);

            existingReasons.push(reason);
            nextReasonIndex++;
        }
    }
}