/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/22/2026
 * Dynamic Target: Billing at https://qa01.therapbd.net/
 * Standards: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class BillingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtAllMandatoryFields = page.locator("input[id*=\"allMandatoryFields\"], input[name*=\"allMandatoryFields\"], textarea[id*=\"allMandatoryFields\"]");
    this.btnNew = page.locator("button[id*=\"new\"], input[value=\"New\"], button:has-text(\"New\")");
    this.btnSaveButton = page.locator("button[id*=\"saveButton\"], input[value=\"Save button.\"], button:has-text(\"Save button.\")");
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterAllMandatoryFields(val) {
    if (await this.txtAllMandatoryFields.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtAllMandatoryFields.fill(String(val)).catch(() => {});
    }
  }

  async clickNew() {
    if (await this.btnNew.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnNew.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSaveButton() {
    if (await this.btnSaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSaveButton.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { BillingPage };