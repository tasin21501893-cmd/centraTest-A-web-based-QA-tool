/**
 * @author Md Asoad Alvi Yanur Saom
 * @since 02/12/2026
 */

import { ListPage } from '../../commonPages/listPage.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class SubService {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.listPage = new ListPage(page);
		this.lnkShow = page.getByRole('link', { name: 'Show' });
		this.txtSubServiceCode = page.locator('[name = "subService.code"]');
		this.txtServiceName = page.locator('[name = "subService.name"]');
		this.txtDescCode = page.locator('[name = "subService.descriptionCode"]');
		this.txtServiceModifier1 = page.locator('[name="subService.modifier1"]');
		this.txtServiceModifier2 = page.locator('[name="subService.modifier2"]');
		this.txtServiceModifier3 = page.locator('[name="subService.modifier3"]');
		this.txtServiceModifier4 = page.locator('[name="subService.modifier4"]');
	}

	async createSubService(data) {
		await this.searchAndClickService(data);
		await this.clickSubService();
		await this.fillSubServiceDetails(data);
		await this.commonButtons.clickButton('Save');
	}

	async searchAndClickService(data) {
		const uniqueServiceIdentifier = `${data.serviceCode} ${data.serviceName}`.trim();
		await this.listPage.selectFilteredFirstItemUponAvailability(uniqueServiceIdentifier);
		await this.lnkShow.first().click();
	}

	async clickSubService() {
		await this.commonButtons.clickButton('Add Sub Service');
	}

	async fillSubServiceDetails(data) {
		await this.txtSubServiceCode.fill(data.subServiceCode);
		await this.txtServiceName.fill(data.subServiceName);
		await this.txtDescCode.fill(data.descCode);
		await this.txtServiceModifier1.fill(data.modifier1);
		await this.txtServiceModifier2.fill(data.modifier2);
		await this.txtServiceModifier3.fill(data.modifier3);
		await this.txtServiceModifier4.fill(data.modifier4);
	}
}

