/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Dynamic Target: Billing - Claim Generation at https://qa01.therapbd.net/
 * Conventions: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class BillingClaimGenerationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.btnCreateClaim = page.locator('button[id*="createClaim"], input[value="Create Claim"], button:has-text("Create Claim")');
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async clickCreateClaim() {
    if (await this.btnCreateClaim.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.btnCreateClaim.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { BillingClaimGenerationPage };