/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Dynamic Target: Sheet1 at https://qa01.therapbd.net/
 * Conventions: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class Sheet1Page {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtTestCaseId = page.locator('input[id*="testCaseId"], input[name*="testCaseId"], textarea[id*="testCaseId"]');
    this.txtFeatureCriteriaFields = page.locator('input[id*="featureCriteriaFields"], input[name*="featureCriteriaFields"], textarea[id*="featureCriteriaFields"]');
    this.txtTestCaseTitleDescription = page.locator('input[id*="testCaseTitleDescription"], input[name*="testCaseTitleDescription"], textarea[id*="testCaseTitleDescription"]');
    this.txtPreconditions = page.locator('input[id*="preconditions"], input[name*="preconditions"], textarea[id*="preconditions"]');
    this.txtTestSteps = page.locator('input[id*="testSteps"], input[name*="testSteps"], textarea[id*="testSteps"]');
    this.txtExpectedResult = page.locator('input[id*="expectedResult"], input[name*="expectedResult"], textarea[id*="expectedResult"]');
    this.txtActualResult = page.locator('input[id*="actualResult"], input[name*="actualResult"], textarea[id*="actualResult"]');
    this.txtTester = page.locator('input[id*="tester"], input[name*="tester"], textarea[id*="tester"]');
    this.txtTester1 = page.locator('input[id*="tester1"], input[name*="tester1"], textarea[id*="tester1"]');
    this.ddlPreMergeStatus = page.locator('select[id*="preMergeStatus"], select[name*="preMergeStatus"]');
    this.ddlPostMergeStatus = page.locator('select[id*="postMergeStatus"], select[name*="postMergeStatus"]');
    this.ddlOption = page.locator('select[id*="option"], select[name*="option"]');
    this.btnSave = page.locator('button[id*="btnSave"], input[value="Save"], input[value="Submit"], button:has-text("Save")');
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterTestCaseId(val) {
    await this.txtTestCaseId.fill(String(val));
  }

  async enterFeatureCriteriaFields(val) {
    await this.txtFeatureCriteriaFields.fill(String(val));
  }

  async enterTestCaseTitleDescription(val) {
    await this.txtTestCaseTitleDescription.fill(String(val));
  }

  async enterPreconditions(val) {
    await this.txtPreconditions.fill(String(val));
  }

  async enterTestSteps(val) {
    await this.txtTestSteps.fill(String(val));
  }

  async enterExpectedResult(val) {
    await this.txtExpectedResult.fill(String(val));
  }

  async enterActualResult(val) {
    await this.txtActualResult.fill(String(val));
  }

  async enterTester(val) {
    await this.txtTester.fill(String(val));
  }

  async enterTester1(val) {
    await this.txtTester1.fill(String(val));
  }

  async selectPreMergeStatus(optionLabel) {
    await this.ddlPreMergeStatus.selectOption({ label: optionLabel }).catch(() => this.ddlPreMergeStatus.selectOption(optionLabel));
  }

  async selectPostMergeStatus(optionLabel) {
    await this.ddlPostMergeStatus.selectOption({ label: optionLabel }).catch(() => this.ddlPostMergeStatus.selectOption(optionLabel));
  }

  async selectOption(optionLabel) {
    await this.ddlOption.selectOption({ label: optionLabel }).catch(() => this.ddlOption.selectOption(optionLabel));
  }

  async clickSave() {
    await this.btnSave.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent();
  }
}

module.exports = { Sheet1Page };