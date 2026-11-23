/**
 * @author Ashik Ahmed
 * @since 03/09/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { ButtonLabels } from '../../commonUtility/buttonLabels.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';

export class NyIdfExtensionPage {
  constructor(page) {
    this.page = page;
    this.btnAddCco = page.locator('input[name="_action_add_cco"]');
    this.btnAddLced = page.locator('input[name="_action_add_lced"]');
    this.ddlCco = page.locator('select[id="tmpNyIdfCco.careCoordinationOrganization"]');
    this.dtpCcoValidFrom = page.locator('input[id="tmpNyIdfCco.validFrom"]');
    this.dtpCcoValidTo = page.locator('input[id="tmpNyIdfCco.validTo"]');
    this.dtpLcedValidFrom = page.locator('input[id="tmpNyAttachedLced.validFrom"]');
    this.dtpLcedValidTo = page.locator('input[id="tmpNyAttachedLced.validTo"]');
    this.rdoRenewal = page.locator('input[id="tmpNyAttachedLced.lcedType1"]');
    this.rdoInitial = page.locator('input[id="tmpNyAttachedLced.lcedType2"]');
    this.txtSignedBy = page.locator('input[id="tmpNyAttachedLced.signedBy"]');
    this.btnRemoveCcoRows = page.locator('#ccoTable tbody button.remove');
    this.btnRemoveLcedRows = page.locator('#lcedTable tbody button.remove');
    this.errMsgLcedValidFrom = page.locator('[id="tmpNyAttachedLced.validFrom.errors"]');
    this.errMsgLcedValidTo = page.locator('[id="tmpNyAttachedLced.validTo.errors"]');
    this.errMsgLcedSignedBy = page.locator('[id="tmpNyAttachedLced.signedBy.errors"]');
    this.errMsgCcoOrganization = page.locator('[id="tmpNyIdfCco.careCoordinationOrganization.errors"]');
    this.errMsgCcoValidFrom = page.locator('[id="tmpNyIdfCco.validFrom.errors"]');
    this.errMsgCcoValidTo = page.locator('[id="tmpNyIdfCco.validTo.errors"]');
    this.errMsgGlobalAlert = page.locator('div.alert.alert-danger');
    this.commonButtons = new CommonButtons(page);
    this.listPage = new ListPage(page);
    this.attachmentUtils = new AttachmentUtils(page);
  }

  async selectIndividualAndCleanUpForm(individualName, shouldCleanUp = true) {
    if (individualName) {
      await this.listPage.selectFilteredFirstItem(individualName);
      await this.page.waitForLoadState('domcontentloaded');
    }
    if (shouldCleanUp) {
      await this.clearExistingSubFormItems();
    }
  }

  async clearExistingCcoRecords() {
    while ((await this.btnRemoveCcoRows.count()) > 0) {
      const btn = this.btnRemoveCcoRows.first();
      await Promise.all([
        this.page.waitForResponse(response =>
          response.status() === 200 && response.url().toLowerCase().includes('cco')
        ),
        btn.click()
      ]);
    }
  }

  async clearExistingLcedRecords() {
    while ((await this.btnRemoveLcedRows.count()) > 0) {
      const btn = this.btnRemoveLcedRows.first();
      await Promise.all([
        this.page.waitForResponse(response =>
          response.status() === 200 && response.url().toLowerCase().includes('lced')
        ),
        btn.click()
      ]);
    }
  }

  async clearExistingSubFormItems() {
    await this.clearExistingCcoRecords();
    await this.clearExistingLcedRecords();
  }

  async addCareCoordinationOrganization(ccoInput) {
    if (!ccoInput) return;
    if (!Array.isArray(ccoInput)) ccoInput = [ccoInput];
    for (const ccoObject of ccoInput) {
      await this.btnAddCco.click();
      await this.ddlCco.waitFor({ state: 'visible' });
      const { ccoOrganizationLabel, ccoValidFrom, ccoValidTo } = ccoObject;
      if (ccoOrganizationLabel) {
        await this.ddlCco.selectOption({ label: ccoOrganizationLabel });
      }
      ccoValidFrom && await this.dtpCcoValidFrom.fill(ccoValidFrom);
      ccoValidTo && await this.dtpCcoValidTo.fill(ccoValidTo);
      await this.commonButtons.clickButton(ButtonLabels.CONTINUE);
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async addLced(lcedInput) {
    if (!lcedInput) return;
    if (!Array.isArray(lcedInput)) lcedInput = [lcedInput];
    for (const lcedObject of lcedInput) {
      await this.btnAddLced.click();
      await this.dtpLcedValidFrom.waitFor({ state: 'visible' });
      const { lcedValidFrom, lcedValidTo, lcedSignedBy, lcedIsInitial, lcedFilePath } = lcedObject;
      lcedValidFrom && await this.dtpLcedValidFrom.fill(lcedValidFrom);
      lcedValidTo && await this.dtpLcedValidTo.fill(lcedValidTo);
      lcedSignedBy && await this.txtSignedBy.fill(lcedSignedBy);
      if (CommonUtils.isValueValid(lcedIsInitial)) {
        if (CommonUtils.isAffirmative(lcedIsInitial)) {
          await this.rdoInitial.check();
        } else {
          await this.rdoRenewal.check();
        }
      }
      if (lcedFilePath) {
        await this.attachmentUtils.addAttachment({ fileName: lcedFilePath });
      }
      await this.commonButtons.clickButton(ButtonLabels.CONTINUE);
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async submitOrUpdateForm(buttonLabel) {
    if (buttonLabel) {
      await this.commonButtons.clickButton(buttonLabel);
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }

    const submitBtn = this.commonButtons.getButtonLocator(ButtonLabels.SUBMIT);
    const updateBtn = this.commonButtons.getButtonLocator(ButtonLabels.UPDATE);
    const actionBtn = submitBtn.or(updateBtn);
    await expect(actionBtn.first(), 'Expected Submit or Update button to be visible on the form').toBeVisible();

    const targetLabel = (await submitBtn.isVisible()) ? ButtonLabels.SUBMIT : ButtonLabels.UPDATE;
    await this.commonButtons.clickButton(targetLabel);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillUpForm(formObject, shouldCleanUp = true) {
    if (!formObject || typeof formObject !== 'object') {
      throw new Error('invalid formObject provided');
    }
    await this.selectIndividualAndCleanUpForm(formObject.individual, shouldCleanUp);
    const hasCcoData = formObject.cco || formObject.ccoOrganizationLabel;
    if (hasCcoData) {
      const ccoPayload = formObject.cco ? formObject.cco : formObject;
      await this.addCareCoordinationOrganization(ccoPayload);
    }
    const hasLcedData = formObject.lced || formObject.lcedValidFrom;
    if (hasLcedData) {
      const lcedPayload = formObject.lced ? formObject.lced : formObject;
      await this.addLced(lcedPayload);
    }
  }
}