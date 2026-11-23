/**
* @author Paul Richie Gomes
* @since 12/30/2025
*/

import { CommonUtils } from '../../../support/commonUtility/commonUtils.js';
import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { ListPage } from '../../commonPages/listPage.js';
import { WorkflowController } from '../../../support/pageObject/preauth/workflowController.js';
import { PreAuthUtils } from '../../../support/pageObject/preauth/preAuthUtils.js';
import { IBubbleUtils } from '../../../support/commonUtility/iBubbleUtils.js';
import { STATUS, ACTION, EXCEL_YES } from '../../../support/pageObject/preauth/moduleConstants.js';

const REQUIRED_FIELDS = ['oversightID', 'programCode', 'programName', 'serviceCode', 'serviceName', 'fromDate', 'toDate', 'rateAmount', 'status'];

export class CommonPreAuthPage {
    constructor(page, providerCode = '', serviceTasks = []) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.workflowController = new WorkflowController(page);
        this.preAuthUtils = new PreAuthUtils(page);
        this.iBubbleUtils = new IBubbleUtils(page);
        this.commonButtons = new CommonButtons(page);
        
        this.dashboardProviderCode = providerCode;
        this.serviceTasks = serviceTasks;

        this.linkToCreatePreauth = this.page.getByRole('link', { name: 'Create Pre Auth' });
        this.ddlProgram = page.locator("button[data-id='preAuth.waiver']");
        this.ddlProgramSearchInput = page.locator('div.dropdown-menu.open .bs-searchbox input[type="search"]');
        this.ddlService = page.locator("[name='preAuth.service']");
        this.ddlServiceProvider = page.locator("[name='preAuth.serviceProvider']");
        this.ddlUnitOfMeasure = page.locator("[name='preAuth.unitOfMeasure']");
        this.ddlFrequency = page.locator("[name='preAuth.unitFrequency']");
        this.dtpFromDate = page.locator("[name='preAuth.fromDate']");
        this.dtpToDate = page.locator("[name='preAuth.toDate']");
        this.txtTotalUnit = page.locator("[name='preAuth.totalUnit']");
        this.txtServiceAmount = page.locator("[name='preAuth.serviceAmount']");
        this.txtDescription = page.locator("[name='preAuth.description']");
        this.txtPriorAuthNumber = page.locator("[name='preAuth.priorAuthNumber']");
        this.linkToAddTask = this.page.getByRole('link', { name: 'Add Task' });
        this.linkToAddRule = this.page.getByRole('link', { name: 'Add Rule' });
        this.btnNext = page.locator('input[value="Next"]');
    }

    async fillForm(data) {
        await this.preAuthUtils.selectProgramUsingSelectPicker(this.ddlProgram, this.ddlProgramSearchInput, data.programCode, data.programName); 
        await this.commonButtons.clickButton('Next');
        await this.page.waitForLoadState('domcontentloaded');
        await this.ddlService.selectOption({ label: `${data.serviceCode} - ${data.serviceName}` });
        await this.dtpFromDate.fill(data.fromDate);
        await this.dtpToDate.fill(data.toDate);
        await this.txtTotalUnit.fill(data.totalUnit);
        if(data.serviceAmount){
            await this.txtServiceAmount.fill(data.serviceAmount);
        }
        if(data.unitOfMeasure){
            await this.page.waitForLoadState('domcontentloaded');
            await this.ddlUnitOfMeasure.selectOption(data.unitOfMeasure);
        }
        if(data.frequency){
            await this.page.waitForLoadState('domcontentloaded');
            await this.ddlFrequency.selectOption(data.frequency);
        }
        if(data.description){
            await this.txtDescription.fill(data.description)
        }
        if(data.nonShareable){
            await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Non Shareable', data.nonShareable);
        }
        await this.preAuthUtils.commonButtons.clickButton('Next');
        await this.page.waitForLoadState('domcontentloaded');
        let relevantTasks = [];
        if (await this.linkToAddTask.isVisible()) {
            if (data.hasTask && data.hasTask === 'Yes') {
                relevantTasks = this.serviceTasks.filter(task => String(task.serviceCode) === String(data.serviceCode));
                await this.preAuthUtils.manageTasks(relevantTasks,ACTION.CREATE);
                await this.commonButtons.clickButton('Next');
                await this.page.waitForLoadState('domcontentloaded');
                if(data.addTaskInAllStatus === 'Yes'){
                    await this.commonButtons.clickButton('Back');
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.preAuthUtils.manageTasks(relevantTasks, ACTION.REPLACE);
                    await this.page.waitForLoadState('domcontentloaded');
                    await this.commonButtons.clickButton('Next');
                    await this.page.waitForLoadState('domcontentloaded');
                }
            }else{
              await this.commonButtons.clickButton('Next');
              await this.page.waitForLoadState('domcontentloaded'); 
             }
        }
        await this.ddlServiceProvider.selectOption({ label: `${data.serviceProviderCode} - ${data.serviceProviderName}` });    
        await this.commonButtons.clickButton('Next');
        await this.page.waitForLoadState('domcontentloaded');
        if (await this.linkToAddRule.isVisible()) {
            if (data.utilizationValidationRule) {
                await this.preAuthUtils.manageValidationRules(data.utilizationValidationRule, ACTION.CREATE);
            }
            await this.commonButtons.clickButton('Next');
            await this.page.waitForLoadState('domcontentloaded');
            if(data.addUVRInAllStatus==='Yes'){
                await this.commonButtons.clickButton('Back');
                await this.page.waitForLoadState('domcontentloaded');
                await this.preAuthUtils.manageValidationRules(data.utilizationValidationRule, ACTION.REPLACE);
                await this.page.waitForLoadState('domcontentloaded');
                await this.commonButtons.clickButton('Next');
                await this.page.waitForLoadState('domcontentloaded');
            }
        }
        if(data.priorAuthNumber){
            await this.txtPriorAuthNumber.fill(data.priorAuthNumber);
        }
        await this.preAuthUtils.manageRateSelection(data.rateAmount);
        if (data.deductCustomerObligation){
            await this.commonUtils.toggleCheckboxUsingValue(this.page, 'Deduct Customer Obligation', data.deductCustomerObligation);
        }
        
    }
    
    async formCreate(data) {
        try {
            const missing = REQUIRED_FIELDS.filter(field => !data[field]);
            const auxFlags = [data.addTaskInAllStatus, data.addUVRInAllStatus, data.doCopyInAllStatus, data.addCommentInAllStatus];
            const activeFlags = auxFlags.filter(val => val === EXCEL_YES);
            const MAX_AUXILIARY_YES_ALLOWED = 1;
            if (missing.length > 0) {
                throw new Error(`Missing required fields: ${missing.join(', ')}`);
            }
            if (activeFlags.length > MAX_AUXILIARY_YES_ALLOWED) {
                throw new Error(`[${data.testCaseNumber}] More than one auxiliary flow is active. Only one is allowed.`);
            }

            await this.page.goto('/');

            if (this.page.url().includes('ma/home')) {
                await this.commonUtils.navigateToDashboardLink('Fiscal', 'Pre Auth', 'New');
            } else {
                await this.commonUtils.navigateToDashboardLink('Pre Auth', 'New');
            }

            await this.listPage.selectFilteredFirstItemUponAvailability(`${data.oversightID} (${this.dashboardProviderCode})`);
            await this.page.waitForLoadState('domcontentloaded');
            
            if (await this.linkToCreatePreauth.isVisible()) {
                await this.linkToCreatePreauth.click();
            }

            await this.page.waitForLoadState('domcontentloaded');
            await this.fillForm(data);

            const relevantTasks = data.hasTask === EXCEL_YES
                ? this.serviceTasks.filter(t => String(t.serviceCode) === String(data.serviceCode)) 
                : [];

            const workflowConfig = {
                returnText: data.returnComment,
                deleteText: data.deleteComment,
                commonComment: data.preauthComment,
                doCopyInAllStatus: data.doCopyInAllStatus,
                addCommentInAllStatus: data.addCommentInAllStatus,
                addUVRInAllStatus: data.addUVRInAllStatus,
                addTaskInAllStatus: data.addTaskInAllStatus,
                relevantTasks: relevantTasks,
                uvrData: data.utilizationValidationRule
            };

            if (data.status) {
                await this.workflowController.executeStatusflow(STATUS.NEW, data.status, workflowConfig);
            }
            
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            const paFormID = await this.iBubbleUtils.fetchValueByLabel('Form ID');
            const uiStatus = await this.commonUtils.fetchFormStatus();
            
            if (uiStatus !== data.status) {
                throw new Error(`Status mismatch. Expected: ${data.status}, Actual: ${uiStatus}`);
            }

            console.log(`${data.testCaseNumber} :: Created Preauth with FormID: ${paFormID} and status: ${uiStatus}`);

        } catch (e) {
            console.error(`${data.testCaseNumber} :: Failed to create preauth: ${e.message}`);
            throw e;
        }
    }
}