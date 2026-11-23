/**
* @author Rifat Ara
* @since 08/12/2026
*/

import { ButtonLabels } from '../../commonUtility/buttonLabels';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { ListPage } from '../../commonPages/listPage';

export class UserGroupSearchPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.#initLocators();
	}

	async searchGroupAndOpen(testcase) {
		testcase.userGroupName && await this.txtName.fill(testcase.userGroupName);
		testcase.userGroupCode && await this.txtCode.fill(testcase.userGroupCode);
		testcase.formId && await this.txtFormId.fill(testcase.formId);

		await this.commonButtons.clickButton(ButtonLabels.SEARCH);
		await this.commonUtils.waitForSpinnerToHideAndLoadDOM();

		testcase.userGroupName && await this.listPage.selectFilteredFirstItem(testcase.userGroupName);
		testcase.userGroupCode && await this.listPage.selectFilteredFirstItem(testcase.userGroupCode);
		testcase.formId && await this.listPage.selectFilteredFirstItem(testcase.formId);

		await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
	}

	#initLocators() {
		this.txtFormId = this.page.locator('input[id="formId"]');
		this.txtName = this.page.locator('input[id="name"]');
		this.txtCode = this.page.locator('input[id="code"]');
	}
}
