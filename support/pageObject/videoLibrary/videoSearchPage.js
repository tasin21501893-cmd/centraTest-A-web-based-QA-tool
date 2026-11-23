/**
 * @author Shahil Azmayish
 * @since 01/19/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { SearchPage } from '../../commonPages/searchPage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { ListPage } from '../../commonPages/listPage.js';
import { VideoLabels } from './utility/videoLabels.js';

export class VideoSearchPage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.searchPage = new SearchPage(page);
		this.commonUtils = new CommonUtils(page);
		this.listPage = new ListPage(page);
		this.#initializeLocators(page);
	}

	async fillSearchForm(data) {
		const searchFilters = {};

		if (data.formId) {
			searchFilters.formId = data.formId;
		}

		if (data.individualName) {
			searchFilters.clientIdLookup = data.individualName;
		}

		if (data.module) {
			searchFilters.tag = data.module;
		}

		if (data.status) {
			searchFilters.status = await this.commonUtils.parseCommaSeparatedList(data.status);
		}

		if (data.title) {
			searchFilters.title = data.title;
		}

		if (data.enteredDateFrom) {
			searchFilters.createdFrom = data.enteredDateFrom;
		}

		if (data.enteredDateTo) {
			searchFilters.createdTo = data.enteredDateTo;
		}

		if (Object.keys(searchFilters).length > 0) {
			await this.searchPage.fillUpFormByIds(searchFilters);
		}
	}

	async searchVideo(criteria) {
		const module = criteria.module;
		const title = criteria.videoSearchByTitle;
		const status = criteria.status;

		await this.fillSearchForm({
			module: module,
			title: title,
			status: status,
		});
		await this.clickSearch();
		await expect(this.tblSearchResults).toBeVisible();
		const filterItem = title;
		await this.listPage.selectFilteredFirstItem(filterItem);
	}

	async validateSearchResults(data) {
		await this.tblSearchResults.waitFor({ state: 'visible' });
		await this.listPage.fillFilterField(data.expectedValidationMessage);
		await expect(this.tblSearchResults).toContainText(data.expectedResult);
	}

	async searchIndividualByName({ individualName, individualInputLocator, lookupResultLocator }) {
		if (individualInputLocator && lookupResultLocator) {
			await this.searchPage.setIndividualField(individualName, individualInputLocator, lookupResultLocator);
			await expect(this.tblSearchResults).toBeVisible();
			await this.listPage.selectFilteredFirstItem(individualName);

		} else {
			await this.searchPage.setIndividualField(individualName);
		}
	}

	async clickSearch() {
		await this.commonButtons.clickButton(VideoLabels.SEARCH);
	}

	#initializeLocators(page) {
		this.txtFormId = page.locator('#formId');
		this.tblSearchResults = page.locator('#dataList, .dataTable');
		this.txtIndividual = page.locator('#clientIdLookup');
		this.atcIndividualLookup = page.locator('.ui-autocomplete');
		this.ddlModule = page.locator('#tag');
		this.ddlStatus = page.locator('#status');
		this.txtTitle = page.locator('#title');
		this.dtpEnteredDateFrom = page.locator('#createdFrom');
		this.dtpEnteredDateTo = page.locator('#createdTo');
		this.errMsgVideoSearchForm = page.locator('#video-library-search-form');
		this.errMsgFormDateTo = page.locator('.help-block');
	}
}
