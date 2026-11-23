/**
 * @author Nabil Hossain
 * @since 07/01/24
 */

import { expect } from '@playwright/test'
import { CommonButtons } from "../../commonUtility/commonButtons.js";
import { CommonUtils } from "../../commonUtility/commonUtils.js";
import { DateTimeUtils } from '../../commonUtility/dateTimeUtils.js';
import { ListPage } from "../../commonPages/listPage.js";

export class OrderPage {
	constructor(page) {
		this.page = page;
		this.txtOrderName = page.locator('[name="orderName"]');
		this.ddlOrderType = page.locator('select[name="orderType"]');
		this.dtpStartDate = page.locator('[name="startDate"]');
		this.dtpEndDate = page.locator('[name="endDate"]');
		this.ddlOrderedBy = page.locator('select[name="orderedBy"]');
		this.ddlOrderReceivedBy = page.locator('select[name="receivedBy"]');
		this.txtDescription = page.locator('[name="description"]');
		this.ddlLinkedDiagnoses = page.locator('select[name="linkedDiagnoses"]');

		this.rdoVerbalOrderYes = page.locator('[name="verbalOrder"][value="true"]');
		this.rdoVerbalOrderNo = page.locator('[name="verbalOrder"][value="false"]');

		this.rdoReadBackDoneYes = page.locator('[name="readBack"][value="true"]');
		this.rdoReadBackDoneNo = page.locator('[name="readBack"][value="false"]');

		this.orderTypeErrorMsg = page.locator('#orderType\\.errors');
		this.otherOrderTypeErrorMsg = page.locator('#otherOrderType\\.errors');
		this.startDateErrorMsg = page.locator('#startDate\\.errors');
		this.endDateErrorMsg = page.locator('#endDate\\.errors');
		this.descriptionErrorMsg = page.locator('#description\\.errors');

		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.dateTimeUtils = new DateTimeUtils(page);
		this.listPage = new ListPage(page);
	}

	async createOrder(data) {
		await this.listPage.selectFilteredFirstItem(data.individualName);
		await this._populateOrderData(data);
		await this.commonButtons.clickButton("Save");
	}

	async validateErrorMsg(errorMsgLocator, expectedErrorMsg) {
		await expect(errorMsgLocator).toHaveText(`${expectedErrorMsg}`);
	}

	async _populateOrderData(data) {
		await this._setOrderName(data.orderName);
		await this._setOrderType(data.type);
		await this._setOrderStartDate(data.startDate);
		await this._setOrderEndDate(data.endDate);
		await this._setOrderedBy(data.orderedBy);
		await this._setReceivedBy(data.orderReceivedBy);
		await this._setDescription(data.description, data.descriptionLength);
		await this._setRadioField(this.rdoVerbalOrderYes, this.rdoVerbalOrderNo, data.verbalOrder);
		await this._setRadioField(this.rdoReadBackDoneYes, this.rdoReadBackDoneNo, data.readBackDone);
		await this._setLinkedDiagnosis(data.linkedDiagnoses);
	}

	async _setOrderName(orderName) {
		await this.txtOrderName.fill(orderName);
	}

	async _setOrderType(orderType) {
		await this.ddlOrderType.selectOption(orderType);
	}

	async _setOrderStartDate(orderStartDate) {
		const date = await this.dateTimeUtils.getDate(orderStartDate);
		await this.dtpStartDate.fill(date);
	}

	async _setOrderEndDate(orderEndDate) {
		const date = await this.dateTimeUtils.getDate(orderEndDate);
		await this.dtpEndDate.fill(date);
	}

	async _setOrderedBy(orderedBy) {
		await this.ddlOrderedBy.selectOption(orderedBy);
	}

	async _setReceivedBy(receivedBy) {
		await this.ddlOrderReceivedBy.selectOption(receivedBy);
	}

	async _setDescription(description, descriptionLength) {
		if (descriptionLength) {
			description = await this.commonUtils.generateString(descriptionLength);
		}

		await this.txtDescription.first().fill(description);
	}

	async _setRadioField(rdoYes, rdoNo, value) {
		if (['y', 'yes'].includes(value.toLowerCase())) {
			await this.commonUtils.selectRadioButton(rdoYes);
		} else if (['n', 'no'].includes(value.toLowerCase())) {
			await this.commonUtils.selectRadioButton(rdoNo);
		}
	}
	
	async _setLinkedDiagnosis(value) {
		if (value) {
			await this.ddlLinkedDiagnoses.selectOption(value.split(";"));
		}
	}
}