/**
 * @author Md Asoad Alvi Yanur Saom
 * @since 01/14/2026
 */

import { expect } from '@playwright/test';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

const THREE_SECOND = 3000;

export class Service {
	constructor(page) {
		this.page = page;
		this.commonUtils = new CommonUtils(page);
		this.commonButtons = new CommonButtons(page);
		this.btnAddService = page.locator('[name = "addServiceButton"]');
		this.btnCreateServiceDirectory = page.locator('[name = "addServiceDirectoryButton"]');
		this.txtserviceDirectoryName = page.locator('[name = "serviceDirectory.name"]');
		this.txtServiceCode = page.locator('[name = "service.code"]');
		this.txtServiceName = page.locator('[name = "service.name"]');
		this.txtDescCode = page.locator('[name = "service.descriptionCode"]');
		this.txtServiceModifier1 = page.locator('[name="service.modifier1"]');
		this.txtServiceModifier2 = page.locator('[name="service.modifier2"]');
		this.txtServiceModifier3 = page.locator('[name="service.modifier3"]');
		this.txtServiceModifier4 = page.locator('[name="service.modifier4"]');
		this.ddlServiceCategory = page.locator('[name="service.serviceDetail.serviceCategory"]');
		this.dtpEffectiveFrom = page.locator('[name="service.serviceDetail.effectiveDateFrom"]');
		this.dtpEffectiveTo = page.locator('[name="service.serviceDetail.effectiveDateTo"]');
		this.ddlRateType = page.locator('[name="service.serviceDetail.rateType"]');
		this.ddlPriorAuthGenerator = page.locator('[name="service.serviceDetail.priorAuthNumberGenerator"]');
		this.ddlMethodOfDataCollection = page.locator('[name="service.serviceDetail.dataCollectionMethod"]');
		this.ddlRevenueCode = page.locator('[name="service.serviceDetail.revenueCode"]');
	}

	async createServiceWithDirectoryCheck(data) {
		if (await this.btnCreateServiceDirectory.isVisible({ timeout: THREE_SECOND })) {
			await this.createServiceDirectory(data);
		}
		await this.btnAddService.waitFor({ state: 'visible' });
		await this.createService(data);
	}

	async createServiceDirectory(data) {
		await this.btnCreateServiceDirectory.click();
		await this.txtserviceDirectoryName.fill(data.serviceDirectoryName);
		await this.commonButtons.clickButton('Save');
	}

	async createService(data) {
		await this.clickAddService();
		await this.fillServiceDetails(data);
		await this.commonButtons.clickButton('Save');
	}

	async clickAddService() {
		await this.btnAddService.scrollIntoViewIfNeeded();
		await expect(this.btnAddService).toBeEnabled();
		await this.btnAddService.click();
	}

	async fillServiceDetails(data) {
		await this.txtServiceCode.fill(data.serviceCode);
		await this.txtServiceName.fill(data.serviceName);
		await this.txtDescCode.fill(data.descCode);
		await this.txtServiceModifier1.fill(data.modifier1);
		await this.txtServiceModifier2.fill(data.modifier2);
		await this.txtServiceModifier3.fill(data.modifier3);
		await this.txtServiceModifier4.fill(data.modifier4);
		await this.ddlServiceCategory.selectOption(data.serviceCategory);
		await this.dtpEffectiveFrom.fill(data.effectiveDateFrom);
		await this.dtpEffectiveTo.fill(data.effectiveDateTo);
		await this.ddlRateType.selectOption(data.rateType);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Rate Tier Enabled', data.rateTierEnabled);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Specialized Service', data.specializedService);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Prior Auth Number Required for Authorization', data.priorAuthRequired);
		await this.ddlPriorAuthGenerator.selectOption(data.priorAuthGenerator);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Referring Provider Required for Authorization', data.referringProvRequired);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'EVV Service', data.evvService);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Billing Integration Enabled', data.billingIntegration);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Restrict Overlapping Pre Auth', data.restrictOverlapping);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Pre Auth Group Required', data.preAuthGroupRequired);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Enable Group Service', data.groupService);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Enable Linked Pre Auth', data.enableLlinkedProvider);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Enable Pre Auth Field Auto Calculation', data.preAuthFieldAutoCalculation);
		await this.ddlMethodOfDataCollection.selectOption(data.methodOfDataCollection);
		await this.ddlRevenueCode.selectOption(data.revenueCode);
		await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Task Required', data.taskRequired);
	}
}
