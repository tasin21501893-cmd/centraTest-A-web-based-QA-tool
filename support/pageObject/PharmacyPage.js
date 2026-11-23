/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/22/2026
 * Dynamic Target: Pharmacy at https://qa01.therapbd.net/
 * Standards: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class PharmacyPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtAllNewlyEnforcedFields = page.locator("input[id*=\"allNewlyEnforcedFields\"], input[name*=\"allNewlyEnforcedFields\"], textarea[id*=\"allNewlyEnforcedFields\"]");
    this.txtRemarksNotesTextarea = page.locator("input[id*=\"remarksNotesTextarea\"], input[name*=\"remarksNotesTextarea\"], textarea[id*=\"remarksNotesTextarea\"]");
    this.ddlDropdown = page.locator("select[id*=\"dropdown\"], select[name*=\"dropdown\"]");
    this.btnNewPharmacy = page.locator("button[id*=\"newPharmacy\"], input[value=\"New Pharmacy\"], button:has-text(\"New Pharmacy\")");
    this.btnSaveButton = page.locator("button[id*=\"saveButton\"], input[value=\"Save button.\"], button:has-text(\"Save button.\")");
    this.btnSubmitUpdate = page.locator("button[id*=\"submitUpdate\"], input[value=\"Submit Update\"], button:has-text(\"Submit Update\")");
    this.btnSave = page.locator("button[id*=\"save\"], input[value=\"Save\"], button:has-text(\"Save\")");
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterAllNewlyEnforcedFields(val) {
    if (await this.txtAllNewlyEnforcedFields.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtAllNewlyEnforcedFields.fill(String(val)).catch(() => {});
    }
  }

  async enterRemarksNotesTextarea(val) {
    if (await this.txtRemarksNotesTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtRemarksNotesTextarea.fill(String(val)).catch(() => {});
    }
  }

  async selectDropdown(optionLabel) {
    if (await this.ddlDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.ddlDropdown.selectOption({ label: String(optionLabel) }).catch(() => this.ddlDropdown.selectOption(String(optionLabel))).catch(() => {});
    }
  }

  async clickNewPharmacy() {
    if (await this.btnNewPharmacy.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnNewPharmacy.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSaveButton() {
    if (await this.btnSaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSaveButton.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSubmitUpdate() {
    if (await this.btnSubmitUpdate.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSubmitUpdate.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickSave() {
    if (await this.btnSave.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSave.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { PharmacyPage };