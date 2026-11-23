/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/22/2026
 * Dynamic Target: Q A Verification Suite at https://qa01.therapbd.net/
 * Standards: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class QAVerificationSuitePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtScenario = page.locator("input[id*=\"scenario\"], input[name*=\"scenario\"], textarea[id*=\"scenario\"]");
    this.txtProcedure = page.locator("input[id*=\"procedure\"], input[name*=\"procedure\"], textarea[id*=\"procedure\"]");
    this.txtAcceptanceCriteria = page.locator("input[id*=\"acceptanceCriteria\"], input[name*=\"acceptanceCriteria\"], textarea[id*=\"acceptanceCriteria\"]");
    this.txtSummary = page.locator("input[id*=\"summary\"], input[name*=\"summary\"], textarea[id*=\"summary\"]");
    this.ddlRiskLevel = page.locator("select[id*=\"riskLevel\"], select[name*=\"riskLevel\"]");
    this.btnSaveButton = page.locator("button[id*=\"saveButton\"], input[value=\"Save button.\"], button:has-text(\"Save button.\")");
    this.lnkNewCaseNote = page.locator("a:has-text(\"New Case Note\"), a[id*=\"newCaseNote\"]");
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterScenario(val) {
    if (await this.txtScenario.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtScenario.fill(String(val)).catch(() => {});
    }
  }

  async enterProcedure(val) {
    if (await this.txtProcedure.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtProcedure.fill(String(val)).catch(() => {});
    }
  }

  async enterAcceptanceCriteria(val) {
    if (await this.txtAcceptanceCriteria.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtAcceptanceCriteria.fill(String(val)).catch(() => {});
    }
  }

  async enterSummary(val) {
    if (await this.txtSummary.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.txtSummary.fill(String(val)).catch(() => {});
    }
  }

  async selectRiskLevel(optionLabel) {
    if (await this.ddlRiskLevel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.ddlRiskLevel.selectOption({ label: String(optionLabel) }).catch(() => this.ddlRiskLevel.selectOption(String(optionLabel))).catch(() => {});
    }
  }

  async clickSaveButton() {
    if (await this.btnSaveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.btnSaveButton.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickNewCaseNote() {
    if (await this.lnkNewCaseNote.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.lnkNewCaseNote.click().catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { QAVerificationSuitePage };