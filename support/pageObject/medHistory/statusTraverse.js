/**
 * @author Emran Hossain Rabbi
 * @since 09/17/2025
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../commonPages/donePage.js';

export class StatusTraverse {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
        this.statusText = page.locator('.status');
        this.btnDiscontinueModal = page.locator(".modal-content");
        this.txtReasonForDeletion = page.getByRole('textbox', { name: '* Reason for Deletion' });
        this.txtReasonForDiscontinuance = page.getByRole('textbox', { name: '* Reason for Discontinuance' });
    }

    async statusTextVerify(StatusText) {
        const statusText = (await this.statusText.textContent()).trim();
        expect(statusText).toEqual(StatusText);
    }

    async Draft() {
        await this.commonButtons.clickButton('Save');
        await this.donePage.verifyPartialDoneMessage('has been successfully saved');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Draft');
    }

    async Approve() {
        await this.commonButtons.clickButton('Approve');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully approved');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Approved');
    }

    async PendingApproval() {
        await this.commonButtons.clickButton('Submit');
        await this.commonButtons.clickButton('Yes');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully submitted');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Pending Approval');
    }

    async Return() {
        await this.commonButtons.clickButton('Return');
        await this.donePage.verifyPartialDoneMessage('has been successfully returned');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Returned');
    }

    async Delete() {
        await this.commonButtons.clickButton('Delete');
        await this.txtReasonForDeletion.fill('Delete');
        await this.commonButtons.clickButton('Yes');
        await this.donePage.verifyPartialDoneMessage('has been successfully deleted');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Deleted');
    }

    async Update() {
        await this.commonButtons.clickButton('Edit');
        await this.commonButtons.clickButton('Update');
        await this.page.waitForLoadState('load');

        while (!(await this.page.url()).includes('done2')) {
            await this.commonButtons.clickButton('Yes');
            await this.page.waitForLoadState('load');
        }

        await this.donePage.verifyPartialDoneMessage('has been successfully updated');
        await this.commonButtons.clickButton('Form');
    }

    async Discontinue() {
        await this.commonButtons.clickButton('Discontinue');
        await this.txtReasonForDiscontinuance.fill('Discontinue');
        await this.commonButtons.clickButton('Discontinue', this.btnDiscontinueModal)
        await this.donePage.verifyPartialDoneMessage('has been successfully discontinued');
        await this.commonButtons.clickButton('Form');
        await this.statusTextVerify('Discontinued');
    }

    async DiscontinueAndCopy() {
        await this.commonButtons.clickButton('Discontinue & Copy');
        await this.txtReasonForDiscontinuance.fill('Discontinue');
        await this.commonButtons.clickButton('Discontinue', this.btnDiscontinueModal)
        await this.page.waitForLoadState('load');
        await this.page.waitForURL(url => url.toString().includes('create'));
        await this.statusTextVerify('New');
        await this.Draft();
    }

    statusMatrix = {
        'New': {
            'Draft': ['Draft'],
            'Pending Approval': ['PendingApproval'],
            'Approve': ['Approve'],
        },
        'Draft': {
            'Update': ['Draft', 'Update'],
            'Pending Approval': ['Draft', 'PendingApproval'],
            'Approve': ['Draft', 'Approve'],
            'Delete': ['Draft', 'Delete']
        },
        'Pending Approval': {
            'Update': ['PendingApproval', 'Update'],
            'Approve': ['PendingApproval', 'Approve'],
            'Return': ['PendingApproval', 'Return']
        },
        'Return': {
            'Delete': ['PendingApproval', 'Return', 'Delete'],
            'Update': ['PendingApproval', 'Return', 'Update'],
            'Pending Approval': ['PendingApproval', 'Return', 'PendingApproval'],
            'Approve': ['PendingApproval', 'Return', 'Approve']
        },
        'Approve': {
            'Update': ['Approve', 'Update'],
            'Delete': ['Approve', 'Delete'],
            'Discontinue': ['Approve', 'Discontinue'],
            'Discontinue & Copy': ['Approve', 'DiscontinueAndCopy']
        }
    };

    async mhStatusTraverse(data) {
        let path = this.statusMatrix[data.FromStatus]?.[data.ToStatus];

        if (!path) {
            path = this.findTransitionActions(data.FromStatus, data.ToStatus);
        }

        if (!path) {
            throw new Error(`Transition from '${data.FromStatus}' to '${data.ToStatus}' is not defined.`);
        }

        for (const action of path) {
            await this[action]();
        }
    }

    /**
     * Figures out the steps needed to change the status from one state to another.
     * It first looks for a direct step. If it can't go directly, it looks for a way to get there by going through one other status first.
     *
     * Example: To go from 'New' to 'Approved', it might find it needs to go to 'New -> Draft -> Approved'.
     * 
     * @param {string} fromStatus - The status we are starting at.
     * @param {string} toStatus - The status we want to reach.
     * @returns {string[]|null} - The list of actions to take to get to the new status, or null if no path is found.
     */

    findTransitionActions(fromStatus, toStatus) {
        const transitions = this.statusMatrix[fromStatus] || {};

        for (const [nextStatus, actions] of Object.entries(transitions)) {

            if (nextStatus === toStatus) {
                return actions;
            }

            const childTransitions = this.statusMatrix[nextStatus] || {};

            for (const [childStatus, childActions] of Object.entries(childTransitions)) {

                if (childStatus === toStatus) {
                    return childActions;
                }
            }
        }
        return null;
    }
}