/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Dynamic Target: Individual Demographic at https://qa01.therapbd.net/
 * Conventions: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class IndividualDemographicPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.btnEditDemographics = page.locator('button[id*="editDemographics"], input[value="Edit Demographics"], button:has-text("Edit Demographics")');
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async clickEditDemographics() {
    await this.btnEditDemographics.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent();
  }
}

module.exports = { IndividualDemographicPage };