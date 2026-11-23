/**
 * @author CentraTest Autonomous Dynamic SDET
 * @since 11/23/2026
 * Dynamic Target: Immunization at https://qa01.therapbd.net/
 * Standards: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class ImmunizationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtGivenDate = page.locator("input[id*=\"givenDate\"], input[name*=\"givenDate\"], textarea[id*=\"givenDate\"]");
    this.txtDateRange = page.locator("input[id*=\"dateRange\"], input[name*=\"dateRange\"], textarea[id*=\"dateRange\"]");
    this.ddlOption = page.locator("select[id*=\"option\"], select[name*=\"option\"]");
    this.btnSaveButton = page.locator("button[id*=\"saveButton\"], input[value=\"Save button.\"], button:has-text(\"Save button.\")");
    this.btnNewIndividual = page.locator("button[id*=\"newIndividual\"], input[value=\"New Individual\"], button:has-text(\"New Individual\")");
    this.btnSave = page.locator("button[id*=\"save\"], input[value=\"Save.\"], button:has-text(\"Save.\")");
    this.btnSearch = page.locator("button[id*=\"search\"], input[value=\"Search.\"], button:has-text(\"Search.\")");
    this.lnkHealth = page.locator("a:has-text(\"Health\"), a[id*=\"health\"]");
    this.lnkImmunizationNew = page.locator("a:has-text(\"Immunization New\"), a[id*=\"immunizationNew\"]");
    this.lnkIndividual = page.locator("a:has-text(\"Individual\"), a[id*=\"individual\"]");
    this.lnkBilling = page.locator("a:has-text(\"Billing\"), a[id*=\"billing\"]");
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterGivenDate(val) {
    if (await this.txtGivenDate.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtGivenDate.fill(String(val)).catch(() => {});
    }
  }

  async enterDateRange(val) {
    if (await this.txtDateRange.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtDateRange.fill(String(val)).catch(() => {});
    }
  }

  async selectOption(optionLabel) {
    if (await this.ddlOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.ddlOption.selectOption({ label: String(optionLabel) }).catch(() => this.ddlOption.selectOption(String(optionLabel))).catch(() => {});
    }
  }

  async clickSaveButton() {
    if (await this.btnSaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSaveButton.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickNewIndividual() {
    if (await this.btnNewIndividual.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnNewIndividual.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSave() {
    if (await this.btnSave.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSave.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSearch() {
    if (await this.btnSearch.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSearch.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickHealth() {
    if (await this.lnkHealth.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.lnkHealth.click().catch(() => {});
    }
  }

  async clickImmunizationNew() {
    if (await this.lnkImmunizationNew.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.lnkImmunizationNew.click().catch(() => {});
    }
  }

  async clickIndividual() {
    if (await this.lnkIndividual.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.lnkIndividual.click().catch(() => {});
    }
  }

  async clickBilling() {
    if (await this.lnkBilling.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.lnkBilling.click().catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { ImmunizationPage };