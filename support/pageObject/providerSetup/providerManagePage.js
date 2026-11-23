/**
 * @author Aymanur Rahman
 * @since 02/23/2025
*/

import { expect } from '@playwright/test'
import { CommonButtons } from "../../commonUtility/commonButtons.js"
import { CommonUtils } from "../../commonUtility/commonUtils.js"

export class ProviderManage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {

        this.page = page
        this.osProviderCodeFilterField = this.page.getByLabel('Filter by Code')
        this.assignableProviderCodeFilterField = this.page.locator("#assignableProviderDataTable_head th[aria-label='Code'] input")
        this.chkShowLinkedProvFromDiffState = this.page.locator("#showLinkedProvidersFromDifferentState div.ui-chkbox-box")
        this.commonUtils = new CommonUtils(page)
        this.commonButtons = new CommonButtons(page)
    }

    /**
     * Navigates to the Oversight Provider List for Managing Oversight Provider.
     * Should be logged into THERAP-TH with the appropriate super roles. 
     */

    async goToManageOversightProviderPage() {
        await this.commonUtils.navigateToDashboardLink("Therap Admin", "Oversight Provider", "Manage")
    }

    /**
     * Search and select the oversight provider from the oversight provider list.
     * @param {string} osProviderCode 
     * @throws {Error} If the given oversight provider code is not found.
     */
    async filterAndSelectOversightProvider(osProviderCode) {

        await this.osProviderCodeFilterField.pressSequentially(osProviderCode)
        await this.commonUtils.waitForChangeInDOM("#providerDataTable")
        await this.commonUtils.waitForSpinnerHidden()
        const oversightProviderRow = this.page.locator('tbody#providerDataTable_data tr', { has: this.page.locator(`td:text-is("${osProviderCode}")`) })

        if (!await oversightProviderRow.isVisible()) {
            throw new Error(`Oversight provider "${osProviderCode}" was not found in the Oversight Provider List`)
        }

        await oversightProviderRow.getByRole('link', { name: 'Manage' }).click()

        await this.page.waitForURL("**\/admin\/provider\/manageParentProvider.xhtml?*")
    }

    /**
     * Clicks on the "Show Non 'XX' Providers" checkbox.
     * @private
     */
    async checkShowLinkedProvFromDiffState() {

        if (await this.chkShowLinkedProvFromDiffState.isVisible()) {

            await this.chkShowLinkedProvFromDiffState.click()
            await this.commonUtils.waitForChangeInDOM("#assignableProviderDataTable")
            return
        }

        console.log("\"Show Providers from Different State\" checkbox is not present")

    }

    /**
     * Add providers to be assigned to the selected oversight provider.
     * @param {string} linkedProviderCodes Provider codes of the linked providers that will be assigned to the oversight provider. The provider codes can be passed as comma separated.
     * @param {"yes" | "y"} [showLinkedProvFromDiffState] (Optional) Clicks the "Show Non 'XX' Providers" checkbox if "yes" or "y" is given
     * @throws {Error} if none of the given Provider Codes are not found in the Assignable Provider(s) Table
     */
    async assignProvider(linkedProviderCodes, showLinkedProvFromDiffState) {

        if (["yes", "y"].includes(showLinkedProvFromDiffState.trim().toLowerCase())) {
            await this.checkShowLinkedProvFromDiffState()
        }

        const linkedProviderCodesArr = linkedProviderCodes.split(",").map(el => el.trim())
        const linkedProviderCodesArrLength = linkedProviderCodesArr.length
        let numberOfFailedAssigns = 0

        for (let i = 0; i < linkedProviderCodesArrLength; i++) {

            const provider = linkedProviderCodesArr[i]

            await this.assignableProviderCodeFilterField.clear()
            await this.assignableProviderCodeFilterField.pressSequentially(provider)
            await this.commonUtils.waitForChangeInDOM("#assignableProviderDataTable")
            await this.commonUtils.waitForSpinnerHidden()
            const providerRow = this.page.locator("#assignableProviderDataTable_data tr", {
                has: this.page.locator(`td:nth-of-type(3):text-is("${provider.toUpperCase()}")`)
            })

            if (await providerRow.isVisible()) {
                await providerRow.getByRole("link", { name: "Add" }).click()

                await this.page.waitForResponse("**/admin/provider/manageParentProvider.xhtml?*")

                await expect(providerRow).toHaveCount(0)

                continue
            }

            console.log(`Provider "${provider}" does not exist in the Assignable Provider(s) Table or is already linked to the Oversight Provider`)
            numberOfFailedAssigns++

            if (numberOfFailedAssigns === linkedProviderCodesArrLength) {
                throw new Error("None of the Providers exist in the Assignable Provider(s) Table or they are already linked to the Oversight Provider.")
            }
        }
    }

    async clickSaveButton() {
        await this.commonButtons.clickButton("Save")
    }
}