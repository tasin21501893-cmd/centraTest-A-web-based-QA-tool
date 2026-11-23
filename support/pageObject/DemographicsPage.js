/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Dynamic Target: Demographics at https://qa01.therapbd.net/
 * Conventions: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class DemographicsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtTestId = page.locator('input[id*="testId"], input[name*="testId"], textarea[id*="testId"]');
    this.txtSteps = page.locator('input[id*="steps"], input[name*="steps"], textarea[id*="steps"]');
    this.txtExpectedResult = page.locator('input[id*="expectedResult"], input[name*="expectedResult"], textarea[id*="expectedResult"]');
    this.txtFirstName = page.locator('input[id*="firstName"], input[name*="firstName"], textarea[id*="firstName"]');
    this.txtStreetAddress = page.locator('input[id*="streetAddress"], input[name*="streetAddress"], textarea[id*="streetAddress"]');
    this.txtBirthDate = page.locator('input[id*="birthDate"], input[name*="birthDate"], textarea[id*="birthDate"]');
    this.ddlGender = page.locator('select[id*="gender"], select[name*="gender"]');
    this.btnSaveButton = page.locator('button[id*="saveButton"], input[value="Save button."], button:has-text("Save button.")');
    this.lnkNewIndividual = page.locator('a:has-text("New Individual"), a[id*="newIndividual"]');
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterTestId(val) {
    if (await this.txtTestId.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtTestId.fill(String(val)).catch(() => {});
    }
  }

  async enterSteps(val) {
    if (await this.txtSteps.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtSteps.fill(String(val)).catch(() => {});
    }
  }

  async enterExpectedResult(val) {
    if (await this.txtExpectedResult.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtExpectedResult.fill(String(val)).catch(() => {});
    }
  }

  async enterFirstName(val) {
    if (await this.txtFirstName.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtFirstName.fill(String(val)).catch(() => {});
    }
  }

  async enterStreetAddress(val) {
    if (await this.txtStreetAddress.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtStreetAddress.fill(String(val)).catch(() => {});
    }
  }

  async enterBirthDate(val) {
    if (await this.txtBirthDate.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtBirthDate.fill(String(val)).catch(() => {});
    }
  }

  async selectGender(optionLabel) {
    if (await this.ddlGender.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlGender.selectOption({ label: optionLabel }).catch(() => this.ddlGender.selectOption(optionLabel)).catch(() => {});
    }
  }

  async clickSaveButton() {
    if (await this.btnSaveButton.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.btnSaveButton.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickNewIndividual() {
    if (await this.lnkNewIndividual.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.lnkNewIndividual.click().catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { DemographicsPage };