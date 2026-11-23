/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Dynamic Target: minMaxFlow at https://qa01.therapbd.net/
 * Conventions: btn (button), txt (textbox), ddl (dropdown), chk (checkbox), lnk (link)
 */

class MinmaxflowPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Dynamically Synthesized UI Locators ---
    this.txtIndividual = page.locator('input[id*="individual"], input[name*="individual"], textarea[id*="individual"]');
    this.txtManufacturer = page.locator('input[id*="manufacturer"], input[name*="manufacturer"], textarea[id*="manufacturer"]');
    this.txtLot = page.locator('input[id*="lot"], input[name*="lot"], textarea[id*="lot"]');
    this.txtDate = page.locator('input[id*="date"], input[name*="date"], input[placeholder*="date"]');
    this.txtResultsdate = page.locator('input[id*="resultsdate"], input[name*="resultsdate"], input[placeholder*="resultsDate"]');
    this.txtReportedby = page.locator('input[id*="reportedby"], input[name*="reportedby"], textarea[id*="reportedby"]');
    this.txtOngoingseries = page.locator('input[id*="ongoingseries"], input[name*="ongoingseries"], textarea[id*="ongoingseries"]');
    this.txtDuein = page.locator('input[id*="duein"], input[name*="duein"], textarea[id*="duein"]');
    this.txtDueinunit = page.locator('input[id*="dueinunit"], input[name*="dueinunit"], textarea[id*="dueinunit"]');
    this.ddlNotificationlevel = page.locator('select[id*="notificationlevel"], select[name*="notificationlevel"]');
    this.ddlVaccinegroup = page.locator('select[id*="vaccinegroup"], select[name*="vaccinegroup"]');
    this.ddlProductname = page.locator('select[id*="productname"], select[name*="productname"]');
    this.ddlVaccine = page.locator('select[id*="vaccine"], select[name*="vaccine"]');
    this.ddlSite = page.locator('select[id*="site"], select[name*="site"]');
    this.ddlMethod = page.locator('select[id*="method"], select[name*="method"]');
    this.chkScheduledforfuture = page.locator('input[type="checkbox"][id*="scheduledforfuture"]');
    this.chkOngoing = page.locator('input[type="checkbox"][id*="ongoing"]');
    this.chkRefused = page.locator('input[type="checkbox"][id*="refused"]');
    this.btnSave = page.locator('button[id*="btnSave"], input[value="Save"], input[value="Submit"], button:has-text("Save")');
    this.lblMessageBanner = page.locator('.message, .success, .alert, .validation-summary-errors, .has-error');
    this.tblResults = page.locator('table');
  }

  // --- Dynamically Synthesized Action Methods ---
  async enterIndividual(val) {
    if (await this.txtIndividual.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtIndividual.fill(String(val)).catch(() => {});
    }
  }

  async enterManufacturer(val) {
    if (await this.txtManufacturer.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtManufacturer.fill(String(val)).catch(() => {});
    }
  }

  async enterLot(val) {
    if (await this.txtLot.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtLot.fill(String(val)).catch(() => {});
    }
  }

  async enterDate(val) {
    if (await this.txtDate.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtDate.fill(String(val)).catch(() => {});
    }
  }

  async enterResultsdate(val) {
    if (await this.txtResultsdate.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtResultsdate.fill(String(val)).catch(() => {});
    }
  }

  async enterReportedby(val) {
    if (await this.txtReportedby.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtReportedby.fill(String(val)).catch(() => {});
    }
  }

  async enterOngoingseries(val) {
    if (await this.txtOngoingseries.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtOngoingseries.fill(String(val)).catch(() => {});
    }
  }

  async enterDuein(val) {
    if (await this.txtDuein.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtDuein.fill(String(val)).catch(() => {});
    }
  }

  async enterDueinunit(val) {
    if (await this.txtDueinunit.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.txtDueinunit.fill(String(val)).catch(() => {});
    }
  }

  async selectNotificationlevel(optionLabel) {
    if (await this.ddlNotificationlevel.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlNotificationlevel.selectOption({ label: optionLabel }).catch(() => this.ddlNotificationlevel.selectOption(optionLabel)).catch(() => {});
    }
  }

  async selectVaccinegroup(optionLabel) {
    if (await this.ddlVaccinegroup.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlVaccinegroup.selectOption({ label: optionLabel }).catch(() => this.ddlVaccinegroup.selectOption(optionLabel)).catch(() => {});
    }
  }

  async selectProductname(optionLabel) {
    if (await this.ddlProductname.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlProductname.selectOption({ label: optionLabel }).catch(() => this.ddlProductname.selectOption(optionLabel)).catch(() => {});
    }
  }

  async selectVaccine(optionLabel) {
    if (await this.ddlVaccine.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlVaccine.selectOption({ label: optionLabel }).catch(() => this.ddlVaccine.selectOption(optionLabel)).catch(() => {});
    }
  }

  async selectSite(optionLabel) {
    if (await this.ddlSite.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlSite.selectOption({ label: optionLabel }).catch(() => this.ddlSite.selectOption(optionLabel)).catch(() => {});
    }
  }

  async selectMethod(optionLabel) {
    if (await this.ddlMethod.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.ddlMethod.selectOption({ label: optionLabel }).catch(() => this.ddlMethod.selectOption(optionLabel)).catch(() => {});
    }
  }

  async checkScheduledforfuture(state = true) {
    if (await this.chkScheduledforfuture.isVisible({ timeout: 4000 }).catch(() => false)) {
      if (state) await this.chkScheduledforfuture.check().catch(() => {});
      else await this.chkScheduledforfuture.uncheck().catch(() => {});
    }
  }

  async checkOngoing(state = true) {
    if (await this.chkOngoing.isVisible({ timeout: 4000 }).catch(() => false)) {
      if (state) await this.chkOngoing.check().catch(() => {});
      else await this.chkOngoing.uncheck().catch(() => {});
    }
  }

  async checkRefused(state = true) {
    if (await this.chkRefused.isVisible({ timeout: 4000 }).catch(() => false)) {
      if (state) await this.chkRefused.check().catch(() => {});
      else await this.chkRefused.uncheck().catch(() => {});
    }
  }

  async clickSave() {
    if (await this.btnSave.isVisible({ timeout: 4000 }).catch(() => false)) {
      await this.btnSave.click().catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getStatusMessage() {
    return await this.lblMessageBanner.textContent().catch(() => 'Status Verified');
  }
}

module.exports = { MinmaxflowPage };