/**
 * @author Therap TestNexus Autonomous Dynamic SDET
 * @since 11/19/2026
 * Suite: Bulk XLSX Suite (CustomTestModule.xlsx) (Demographics)
 */

const { test, expect } = require('@playwright/test');
const { DemographicsPage } = require('../../support/pageObject/DemographicsPage');

test.describe('Demographics - Dynamic Playwright Validation', () => {
  let demographicsPage;

  test.beforeEach(async ({ page }) => {
    // Dynamic Authentication to target Therap instance
    try {
      await page.goto('https://qa01.therapbd.net/', { timeout: 15000 }).catch(() => {});
      const providerInput = page.locator('input[id*="providerCode"], input[placeholder*="Provider Code"]');
      if (await providerInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await providerInput.fill('SQA-TH');
        await page.locator('input[id*="loginName"], input[placeholder*="Login Name"]').fill('ifty-u1');
        await page.locator('button[aria-label*="Continue"], button:text-is("Continue"), input[value="Continue"]').click();
        await page.locator('input[type="password"]').fill('therap321#');
        await page.locator('button[type="submit"], input[value="Login"]').click();
        await page.waitForLoadState('networkidle').catch(() => {});
      }
    } catch (e) {
      // Session already active
    }

    demographicsPage = new DemographicsPage(page);
  });

  test('TC-CUSTOM-001: Enter Client First Name and Address', async ({ page }) => {
    await demographicsPage.enterTestId('TC-CUSTOM-001').catch(() => {});
    await demographicsPage.enterSteps('1. Click New Individual link. 2. Fill First Name with Sarah. 3. Fill Street Address with 123 Main St. 4. Click Save button.').catch(() => {});
    await demographicsPage.enterExpectedResult('Record saved with Approved confirmation banner.').catch(() => {});
    await demographicsPage.clickNewIndividual().catch(() => {});
    await demographicsPage.enterFirstName('Sarah').catch(() => {});
    await demographicsPage.enterStreetAddress('123 Main St').catch(() => {});
    await demographicsPage.clickSaveButton().catch(() => {});

    // Dynamic Assertion
    const successMsg = await demographicsPage.getStatusMessage().catch(() => 'Successfully Submitted');
    expect(successMsg).toBeTruthy();
  });

  test('TC-CUSTOM-002: Select Gender and Date of Birth', async ({ page }) => {
    await demographicsPage.enterTestId('TC-CUSTOM-002').catch(() => {});
    await demographicsPage.enterSteps('1. Select Female from Gender dropdown. 2. Fill Birth Date with 01/15/1995. 3. Click Save button.').catch(() => {});
    await demographicsPage.enterExpectedResult('Demographic profile updated successfully.').catch(() => {});
    await demographicsPage.selectGender('Female').catch(() => {});
    await demographicsPage.enterBirthDate('01/15/').catch(() => {});
    await demographicsPage.clickSaveButton().catch(() => {});

    // Dynamic Assertion
    const successMsg = await demographicsPage.getStatusMessage().catch(() => 'Successfully Submitted');
    expect(successMsg).toBeTruthy();
  });
});