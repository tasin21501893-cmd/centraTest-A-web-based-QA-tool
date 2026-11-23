/**
* @author Rifat Ara
* @since 08/02/2026
*/

import { ButtonLabels } from '../../commonUtility/buttonLabels';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class UserGroupDetailsPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.commonUtils = new CommonUtils(page);
		this.#initLocators();
	}

	async createGroupAndAddUsers(testcase) {
		await this.createGroup(testcase);
		await this.addUsers(testcase);
	}

	async createGroup(testcase) {
		const uniqueSuffix = Date.now().toString().slice(-6);
		const groupName = `${testcase.userGroupName}_${uniqueSuffix}`;
		const groupCode = `${testcase.userGroupCode}_${uniqueSuffix}`;
		await this.txtName.fill(groupName);
		await this.txtCode.fill(groupCode);
		await this.commonButtons.clickButton(ButtonLabels.SAVE_AND_ADD_USER);
		await this.commonButtons.clickButton(ButtonLabels.YES);

		if (testcase.saveMessage) {
			await this.commonUtils.verifyPartialItemText(this.divSuccessMessage, testcase.saveMessage);
		}
	}

	async addUsers(testcase) {
		if (CommonUtils.isAffirmative(testcase.isSearchFlow)) {
			await this.btnAdd.click(); 
		}
	
		await this.commonButtons.clickButton(ButtonLabels.ADD_USERS);
		await this.txtSearch.waitFor({ state: 'visible' });

		if (testcase.usersToAdd) {
			const userNames = await this.commonUtils.parseCommaSeparatedList(testcase.usersToAdd);
			
			for (const userName of userNames) {
				await this.txtSearch.fill(userName);
				await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
				const firstCheckbox = this.chkSelectAction.first();
				await this.commonUtils.toggleCheckboxUsingLocator(this.page, firstCheckbox, testcase.selectUser);
			}

		} else if (testcase.numberOfUsers) { 
			const targetCount = parseInt(testcase.numberOfUsers, 10) || 1;
			let usersChecked = 0;

			while (usersChecked < targetCount) {
				const countOnPage = await this.chkSelectAction.count();

				for (let i = 0; i < countOnPage && usersChecked < targetCount; i++) {
					const checkbox = this.chkSelectAction.nth(i);

					if (await checkbox.isVisible() && !(await checkbox.isChecked())) {
						await this.commonUtils.toggleCheckboxUsingLocator(this.page, checkbox, testcase.selectUser);
						usersChecked++;
					}
				}

				if (usersChecked >= targetCount) {
					break;
				} 

				if (await this.btnIframeNext.isVisible()) {
					await this.btnIframeNext.click();
					await this.commonUtils.waitForSpinnerToHideAndLoadDOM();

				} else {
					break; 
				}
			}
		}
	
		await this.commonButtons.clickButton(ButtonLabels.ADD_USERS, this.iframeLocator);
	}

	async removeUsers(testcase) {
		await this.btnUserListEdit.click();
		await this.txtRemoveSearch.waitFor({ state: 'visible' });

		if (testcase.usersToRemove) {
			const userNames = await this.commonUtils.parseCommaSeparatedList(testcase.usersToRemove);
			
			for (const userName of userNames) {
				await this.txtRemoveSearch.fill(userName);
				await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
				
				if (await this.btnRemove.first().isVisible()) {
					await this.btnRemove.first().click();
					await this.commonButtons.clickButton(ButtonLabels.YES);
					await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
				}
			}

		} else if (testcase.numberOfUsersToRemove) { 
			const targetCount = parseInt(testcase.numberOfUsersToRemove, 10) || 1;
			let usersRemoved = 0;

			while (usersRemoved < targetCount) {
				if (await this.btnRemove.first().isVisible()) {
					await this.btnRemove.first().click();
					await this.commonButtons.clickButton(ButtonLabels.YES);
					await this.commonUtils.waitForSpinnerToHideAndLoadDOM();
					usersRemoved++;
				
				} else {
					break; 
				}
			}
		}
	}

	#initLocators() {
		this.txtName = this.page.locator('input[id="userGroup.name"]');
		this.txtCode = this.page.locator('input[id="userGroup.code"]');
		this.iframeLocator = this.page.frameLocator('iframe');
		this.txtSearch = this.iframeLocator.locator('input[type="search"]');
		this.txtRemoveSearch = this.page.locator('input[id="dt-search-0"]');
		this.chkSelectAction = this.iframeLocator.locator('input.select-action');
		this.btnAdd = this.page.locator('a#add-user');
		this.btnUserListEdit = this.page.locator('a#edit-user-list');
		this.btnRemove = this.page.locator('input[name="_action_remove_user"]');
		this.btnIframeNext = this.iframeLocator.locator(':not(.disabled) > a.next:not(.disabled)').first();
		this.divSuccessMessage = this.page.locator('#msgDiv');
	}
}
