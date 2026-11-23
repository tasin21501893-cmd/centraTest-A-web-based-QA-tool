/**
 * @author Mohaimen Abid Mahadi
 * @since 22/09/24
 */

import { CommonUtils } from '../../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../../commonUtility/commonButtons.js';
import { ListPage } from "../../../commonPages/listPage.js";
import { DonePage } from "../../../commonPages/donePage.js";
import { SearchPage } from "../../../commonPages/searchPage.js";
import { EmployerPage } from "../../../pageObject/employmentHistory/agency/employerPage.js";
import { CorporateEntityPage } from "../../../pageObject/employmentHistory/agency/corporateEntityPage.js";
import { JobTemplatePage } from "../../../pageObject/employmentHistory/agency/jobTemplatePage.js";
import { ContactPersonPage } from "../../../pageObject/employmentHistory/agency/contactPersonPage.js";
import { JobDetailPage } from "../../../pageObject/employmentHistory/individual/jobDetailPage.js";

export class EmploymentHistoryUtils {

    constructor(page) {
        this.page = page;
        this.btnStatus = this.page.locator("[id='statusPickerBtn']");
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.searchPage = new SearchPage(page);
        this.employerPage = new EmployerPage(page);
        this.corporateEntityPage = new CorporateEntityPage(page);
        this.jobTemplatePage = new JobTemplatePage(page);
        this.contactPersonPage = new ContactPersonPage(page);
        this.jobDetailPage = new JobDetailPage(page);
    }

    async searchWithStatus(entity, action, status, extraSetup = null) {
        await this.commonUtils.navigateToDashboardLink('Employment', entity, action);
        if (extraSetup) await extraSetup();
        await this.btnStatus.click();
        await this.page.getByText(status, { exact: true }).click();
        await this.commonButtons.clickButton('Search');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async checkAndCreateCorporateEntity({ corporateEntityName }) {
        await this.commonUtils.navigateToDashboardLink('Employment', 'Corporate Entity', 'List');
        await this.page.waitForLoadState('domcontentloaded');

        if (!(await this.listPage.isItemExist(corporateEntityName))) {
            await this.commonUtils.navigateToDashboardLink('Employment', 'Corporate Entity', 'New');
            await this.corporateEntityPage.fillUpForm({ name: corporateEntityName });
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage("successfully saved");
        }
    }

    async checkAndCreateEmployer({ employerName }) {
        await this.searchWithStatus('Employer', 'Search', 'Active');

        if (!(await this.listPage.isItemExist(employerName))) {
            await this.commonUtils.navigateToDashboardLink('Employment', 'Employer', 'New');
            await this.employerPage.fillUpForm({ organizationName: employerName });
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage("successfully saved");
        }
    }

    async checkAndCreateJobTemplate({ jobTemplateName, employerName }) {
        await this.searchWithStatus('Job Template', 'Search', 'Active');

        if (!(await this.listPage.isItemExist(jobTemplateName + ' ' + employerName))) {
            await this.commonUtils.navigateToDashboardLink('Employment', 'Job Template', 'New');
            await this.listPage.selectFilteredFirstItem(employerName);
            await this.jobTemplatePage.fillUpForm({ positionTitle: jobTemplateName });
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage("successfully saved");
        }
    }

    async checkAndCreateContactPerson({ contactPersonName, employerName }) {
        let contactPerson = contactPersonName.split(',');
        await this.searchWithStatus('Contact Person', 'Search', 'Active');

        if (!(await this.listPage.isItemExist(employerName + ' ' + contactPerson[1] + ' ' + contactPerson[0]))) {
            await this.commonUtils.navigateToDashboardLink('Employment', 'Contact Person', 'New');
            await this.listPage.selectFilteredFirstItem(employerName);
            await this.contactPersonPage.fillUpForm({ firstName: contactPerson[1], lastName: contactPerson[0] });
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage("successfully saved");
        }
    }

    async checkAndCreateJobDetail({ individual, jobType, jobStatus, jobStartDate, jtPositionTitle, employerName }) {
        await this.checkAndCreateEmployer({ employerName });
        await this.checkAndCreateJobTemplate({ jobTemplateName: jtPositionTitle, employerName });

        await this.searchWithStatus('Job Detail', 'Search', 'Approved', async () => {
            await this.searchPage.setIndividualField(individual);
        });

        if (!(await this.listPage.isItemExist(jobStartDate))) {
            await this.commonUtils.navigateToDashboardLink('Employment', 'Job Detail', 'New');
            await this.listPage.selectFilteredFirstItem(individual);
            await this.listPage.selectFilteredFirstItem(employerName);
            await this.listPage.selectFilteredFirstItem(jtPositionTitle);
            await this.jobDetailPage.fillUpForm({ jobType: jobType, jobStatus: jobStatus, jobStartDate: jobStartDate });
            await this.commonButtons.clickButton('Save');
            await this.donePage.verifyPartialDoneMessage("successfully saved");
        }
    }

}