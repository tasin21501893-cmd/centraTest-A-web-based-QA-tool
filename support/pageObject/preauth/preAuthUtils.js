/**
* @author Paul Richie Gomes
* @since 12/30/2025
*/

import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { ACTION } from '../../../support/pageObject/preauth/moduleConstants.js'; 

const THREE_SECOND = 3000;
const ONE_SECOND = 1000;
const ONE_FIFTY_MILISECOND = 150;

export class PreAuthUtils {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.donePage = new DonePage(page);
  
        // Select Program
        this.dropdownMenuOption = (optionText, context = this.page) => context.locator(`div.dropdown-menu.open ul.dropdown-menu li a[role="option"] span.text:has-text("${optionText}")`).first();
        // --- Static Locators ---
        this.txtComments = page.locator("[name='comments']");

        // Manage Validation Rules
        this.linkAddRuleText = (context = this.page) => context.locator('a:has-text("Add Rule")').first();
        this.modalContentAddRule = (context = this.page) => context.locator('.modal-content').filter({ hasText: 'Add Rule' }).first();
        this.modalRule = (context = this.page) => context.locator('#ruleModal').first();
        this.inputRuleFromDateFiltered = (modalContainer) => modalContainer.locator('#validationRule\\.fromDate, [name*="fromDate"]').first();
        this.inputRuleToDateFiltered = (modalContainer) => modalContainer.locator('#validationRule\\.toDate, [name*="toDate"]').first();
        this.inputRuleTotalUnitFiltered = (modalContainer) => modalContainer.locator('#validationRule\\.totalUnit, [name*="totalUnit"]').first();
        this.btnRuleContinue = (modalContainer) => modalContainer.locator('input[value="Continue"], button:has-text("Continue")').first();

        // Clear Table
        this.dynamicTable = (selector, parentLocator = this.page) => parentLocator.locator(selector);
        this.btnVisiblePromptYes = (parentLocator = this.page) => parentLocator.locator('.therap-modal-prompt .btn-prompt-yes:visible').first();

        // Manage Tasks
        this.triggerAddTask = (parentLocator = this.page) => parentLocator.locator("a:has-text('Add Task'), button:has-text('Add Task'), input[value='Add Task']").first();
        this.btnEditTask = (parentLocator = this.page) => parentLocator.locator("a:has-text('Edit Task'), button:has-text('Edit Task'), input[value='Edit Task']").filter({ visible: true }).first();
        this.paTaskTable = (parentLocator = this.page) => parentLocator.locator('#paTaskTable');
        this.btnAddTaskAlternative = (parentLocator = this.page) => parentLocator.locator("a:has-text('Add Task'), button:has-text('Add Task')").first();
        this.modalContentAddTask = (parentLocator = this.page) => parentLocator.locator('.modal-content').filter({ hasText: 'Add Task' }).first();
        this.taskModal = (parentLocator = this.page) => parentLocator.locator('#taskModal');
        this.taskRowByName = (modalContainer, taskName) => modalContainer.locator('tbody tr').filter({ hasText: taskName }).first();
        this.taskCheckbox = (row) => row.locator('input[type="checkbox"]');
        this.btnTaskModalContinue = (modalContainer) => modalContainer.getByRole('button', { name: 'Continue' }).first();
        this.btnTaskModalClose = (modalContainer) => modalContainer.locator('.btn-close, .close').first();

        // Manage Rate Selection
        this.inputRateAmountFiltered = (parentLocator = this.page) => parentLocator.locator("[name='preAuth.rateAmount'], [data-testid='rateAmount']").filter({ visible: true }).first();
        this.btnAddRateAction = (parentLocator = this.page) => parentLocator.locator('a, button').filter({ hasText: 'Add Rate' }).first();
        this.btnSelectRate = (parentLocator = this.page) => parentLocator.locator('#selectRate');
        this.tableRateList = (parentLocator = this.page) => parentLocator.locator('#rateList, table.pa-table-header').filter({ hasText: 'Rate Amount' }).filter({ visible: true }).first();
        this.rateTableHeaders = (rateTable) => rateTable.locator('thead th');
        this.btnModalCloseFiltered = (parentLocator = this.page) => parentLocator.locator('.modal-header .close, .btn-close').filter({ visible: true }).first();
        this.rateColumnCells = (rateTable, colIdx) => rateTable.locator(`tbody tr td:nth-child(${colIdx + 1})`);
        this.rateTableRow = (rateTable, index) => rateTable.locator('tbody tr').nth(index);
        this.btnSelectRateRow = (row) => row.locator('.addRateLink, button:has-text("Select")').first();
        this.inputVariableRate = (parentLocator = this.page) => parentLocator.locator('.inputRateAmount, input[name="rateAmount"], input[data-testid="rateAmount"]').filter({ visible: true }).first();
        this.btnConfirmVariableRate = (parentLocator = this.page) => parentLocator.locator('input[value="Continue"], button, input[type="submit"]').filter({ hasText: /Add Rate|Continue/i }).filter({ visible: true }).last();
    }
    
    async actionResolver(actionButton, commentText) {
        await this.commonButtons.clickButton(actionButton);
        if (commentText && [ACTION.RETURN, ACTION.DELETE, ACTION.ADD_COMMENTS].includes(actionButton)){
            await this.txtComments.fill(commentText);
            await this.commonButtons.clickButton('Done');
        }
        await this.donePage.clickLinkByText('Form');
    }

    async selectProgramUsingSelectPicker(dropdownLocator,searchLocator, waiverCode, waiverName) {
        const optionText = `${waiverCode} - ${waiverName}`;
        const currentSelection = await dropdownLocator.textContent();
        if (currentSelection && currentSelection.includes(waiverCode)) {
            return;
        }
        await dropdownLocator.click();
        await searchLocator.waitFor({ state: 'visible' });
        await searchLocator.fill(optionText);
        await this.dropdownMenuOption(optionText, this.page).click();
        await searchLocator.waitFor({ state: 'hidden' });
    }
    
    async manageValidationRules(rulesInput, actionType = ACTION.CREATE, context = this.page) {
        const isIframe = context !== this.page;

        if (actionType === ACTION.REMOVE || actionType === ACTION.REPLACE) {
            await this.page.waitForLoadState('domcontentloaded');
            await this.clearTable('#tblUtlValidation', '.btnRemoveRule', context);
            
            if (actionType === ACTION.REMOVE) {
                return;
            }
        }

        if (!rulesInput) {
            return;
        }
        let rules = rulesInput;
        if (typeof rulesInput === 'string') {
            rules = rulesInput.split('#').filter(part => part.trim().length > 0).map(part => {
                const [from, to, unit] = part.split(',').map(s => s.trim());
                return { from, to, unit };
            });
        } 

        if (actionType === ACTION.CREATE || actionType === ACTION.REPLACE) {
            for (const rule of rules) {
                if (isIframe) {
                    await this.commonButtons.clickButton('Add Rule', context);
                } else {
                    await this.linkAddRuleText(context).click();
                }
                
                const modalContainer = isIframe 
                    ? this.modalContentAddRule(context)
                    : this.modalRule(context);
                await modalContainer.waitFor({ state: 'visible', timeout: THREE_SECOND });
                const fromLoc = this.inputRuleFromDateFiltered(modalContainer);
                const toLoc = this.inputRuleToDateFiltered(modalContainer);
                const unitLoc = this.inputRuleTotalUnitFiltered(modalContainer);
                await fromLoc.fill(rule.from);
                await fromLoc.press('Tab'); 
                await toLoc.fill(rule.to);
                await toLoc.press('Tab');

                if (rule.unit) {
                    await unitLoc.fill(rule.unit);
                }
                
                await this.btnRuleContinue(modalContainer).click();

                await modalContainer.waitFor({ state: 'hidden', timeout: THREE_SECOND }).catch(() => {});
            }
        }
    }

    async clearTable(tableSelector, deleteBtnSelector, parentLocator = this.page) {
        const table = this.dynamicTable(tableSelector, parentLocator);

        if (!await table.isVisible()) {
            return;
        }

        while (true) {
            const deleteBtns = table.locator(deleteBtnSelector);
            const initialCount = await deleteBtns.count();
            
            if (initialCount === 0) break;

            await deleteBtns.first().click();
            
            const visibleYesBtn = this.btnVisiblePromptYes(parentLocator);
            
            await visibleYesBtn.waitFor({ state: 'visible' });
            await visibleYesBtn.click();
            await visibleYesBtn.waitFor({ state: 'hidden' });

            while ((await deleteBtns.count()) >= initialCount) {
                await this.page.waitForTimeout(ONE_SECOND); 
            }
        }
    }
    
    async tracePreauthOrigin(element, formId, status, action) {
        if (await element.isVisible()) {
            const log = `[Trace] Status:${status} | Action:${action} | ID:${formId || "?"} | ${new Date().toLocaleString()}`;
            await element.fill(log);
        }
    }

    async manageTasks(taskList, actionType = ACTION.CREATE, parentLocator = this.page)  {
        const isIframe = parentLocator !== this.page;

        let trigger = this.triggerAddTask(parentLocator);
        
        if (!await trigger.isVisible()) {
            const editTaskBtn = this.btnEditTask(parentLocator);
            if (await editTaskBtn.isVisible()) {
                await editTaskBtn.click();
                if (!isIframe) await this.page.waitForLoadState('domcontentloaded');
                await this.page.waitForTimeout(ONE_SECOND); 
                try {
                    await trigger.waitFor({ state: 'visible', timeout: THREE_SECOND });
                } catch (e) {
                    throw new Error("[ModuleUtils] Clicked 'Edit Task' but 'Add Task' button did not appear.");
                }
            }
        }

        if (actionType === ACTION.REMOVE || actionType === ACTION.REPLACE) {
            await this.paTaskTable(parentLocator).waitFor({ state: 'visible' });
            await this.clearTable('#paTaskTable', '.btnRemoveTask', parentLocator);

            if (actionType === ACTION.REMOVE){
                return;
            } 
        }

        if (!taskList?.length) {
            return;
        }

        if (actionType === ACTION.CREATE || actionType === ACTION.REPLACE) {
            const btnTrigger = this.btnAddTaskAlternative(parentLocator);
            await btnTrigger.click();

            const modalContainer = isIframe 
                ? this.modalContentAddTask(parentLocator)
                : this.taskModal(parentLocator);

            await modalContainer.waitFor({ state: 'visible', timeout: THREE_SECOND });

            let itemsFound = 0;
            for (const task of taskList) {
                const taskName = task.taskName.trim();
                const row = this.taskRowByName(modalContainer, taskName);

                if (await row.isVisible()) {
                    const checkbox = this.taskCheckbox(row);
                    const isChecked = await checkbox.isChecked();
                    
                    if (!isChecked) {
                        await checkbox.check({ force: true }); 
                        await this.page.waitForTimeout(ONE_FIFTY_MILISECOND);
                    }
                    itemsFound++;
                }
            }

            if (itemsFound > 0) {
                await this.btnTaskModalContinue(modalContainer).click();
            } else {
                await this.btnTaskModalClose(modalContainer).click();
            }

            await modalContainer.waitFor({ state: 'hidden' });
        }
    }

    async manageRateSelection(targetRate, parentLocator = this.page) {
        if (!targetRate) return;

        const rateInput = this.inputRateAmountFiltered(parentLocator);
        if (await rateInput.isVisible()) {
            await rateInput.fill(targetRate.toString());
            return;
        }

        const isIframe = parentLocator !== this.page;

        if (isIframe) {
            await this.btnAddRateAction(parentLocator).click();
        } else {
            const btn = this.btnSelectRate(parentLocator);
            if (await btn.isVisible()) await btn.click();
            else await this.btnAddRateAction(parentLocator).click();
        }

        const rateTable = this.tableRateList(parentLocator);

        try {
            await rateTable.waitFor({ state: 'visible', timeout: THREE_SECOND });
        } catch (e) {
            return;
        }

        const headers = await this.rateTableHeaders(rateTable).allInnerTexts();        
        const rateColIdx = headers.findIndex(h => h.includes('Rate Amount') || h.includes('Rate Amount($)'));
        const typeColIdx = headers.findIndex(h => h.includes('Rate Amount Type') || h.includes('Type'));

        if (rateColIdx === -1) {
            await this.btnModalCloseFiltered(parentLocator).click();
            return;
        }

        const rateValues = await this.rateColumnCells(rateTable, rateColIdx).allInnerTexts();
        const cleanNumber = (str) => parseFloat(str.replace(/[$,]/g, '').trim());
        const targetVal = parseFloat(targetRate.toString());
        const matchIndex = rateValues.findIndex(val => cleanNumber(val) === targetVal);
        let variableIndex = -1;

        if (matchIndex === -1) {            
            if (typeColIdx !== -1) {
                const typeValues = await this.rateColumnCells(rateTable, typeColIdx).allInnerTexts();
                variableIndex = typeValues.findIndex(val => val.includes('Variable'));
            }
            if (variableIndex === -1) {
                variableIndex = rateValues.findIndex(val => val.includes('Variable'));
            }
        }
        if (matchIndex !== -1) {
            const row = this.rateTableRow(rateTable, matchIndex);
            await this.btnSelectRateRow(row).click();
            await rateTable.waitFor({ state: 'hidden', timeout: THREE_SECOND });
        }
        else if (variableIndex !== -1) {
            const row = this.rateTableRow(rateTable, variableIndex);
            await this.btnSelectRateRow(row).click();
            const variableInput = this.inputVariableRate(parentLocator);
            await variableInput.waitFor({ state: 'visible', timeout: THREE_SECOND });
            await variableInput.fill(targetRate.toString());
            const confirmBtn = this.btnConfirmVariableRate(parentLocator); 
            if (await confirmBtn.isVisible()) {
                await confirmBtn.click();
            }
            await rateTable.waitFor({ state: 'hidden', timeout: THREE_SECOND });
        } 
        else {
            await this.btnModalCloseFiltered(parentLocator).click();
        }
    }
}