/**
* @author Paul Richie Gomes
* @since 12/30/2025
*/

import { CommonButtons } from '../../../support/commonUtility/commonButtons.js';
import { CommonUtils } from '../../../support/commonUtility/commonUtils.js';
import { PreAuthUtils } from '../../../support/pageObject/preauth/preAuthUtils.js';
import { IBubbleUtils } from '../../../support/commonUtility/iBubbleUtils.js';
import { STATUS, ACTION, TRANSITION_PATHS,EXCEL_YES} from '../../../support/pageObject/preauth/moduleConstants.js'; 

const NON_EDITABLE_STATUSES = [STATUS.PENDING, STATUS.PENDING_UPDATE,STATUS.DELETED,STATUS.REJECTED,STATUS.SENT,STATUS.READY_TRANSFER];

export class WorkflowController {

    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.preAuthUtils = new PreAuthUtils(page);
        this.iBubbleUtils = new IBubbleUtils(page);

        this.dtpDescription = page.locator("[name='preAuth.description']");
        this.linkAddTask = this.page.getByRole('link', { name: 'Add Task' })
        this.linkAddRule = this.page.getByRole('link', { name: 'Add Rule' })
    }

    async executeStatusflow(fromStatus, targetStatus = null, configOptions = {}) {
        let currentStatus = fromStatus;
        const auxiliaryFlow = this.auxiliaryFlowHandler(configOptions);
        const actionPath =  this.resolveTransitionPath(currentStatus, targetStatus) || [];

        if (!actionPath.length && !auxiliaryFlow.allowEmptyPath) {
            throw new Error(`No path found for ${currentStatus} -> ${targetStatus}`);
        }

        for (const actionName of actionPath) {
            if (currentStatus !== fromStatus) {
                currentStatus = await this.commonUtils.fetchFormStatus();
            }
            await this.executeUIAction(actionName, configOptions);
            await auxiliaryFlow.stepHandler(actionName, configOptions);   
            currentStatus = await this.commonUtils.fetchFormStatus();
        }
    }

    async executeUIAction(actionName, config = {}) {
        const { returnText, deleteText, commonComment } = config;
        const traverseActions = [ACTION.SUBMIT, ACTION.APPROVE, ACTION.UPDATE, ACTION.SAVE];
        const waitActions = traverseActions.concat(ACTION.RETURN,ACTION.DELETE,ACTION.ADD_COMMENTS);
        const defaultTexts = {
            [ACTION.RETURN]: 'Default Return Reason',
            [ACTION.DELETE]: 'Default Delete Reason',
            [ACTION.ADD_COMMENTS]: 'Default Comment'
        };

        let comment;

        if (actionName === ACTION.RETURN){
            comment = returnText || defaultTexts[ACTION.RETURN];
        } 
        else if (actionName === ACTION.DELETE){
            comment = deleteText || defaultTexts[ACTION.DELETE];
        } 
        else if (traverseActions.concat(ACTION.ADD_COMMENTS).includes(actionName)) {
            comment = commonComment || defaultTexts[ACTION.ADD_COMMENTS];
        }

        const runAction = async () => {
            if (actionName === ACTION.EDIT) {
                await this.commonButtons.clickButton(ACTION.EDIT);
            } else {
                await this.preAuthUtils.actionResolver(actionName, comment);
            }
        };

        if (await this.commonButtons.isButtonPresent(actionName)) {
            await runAction();
        } 
        else if (traverseActions.includes(actionName)) {
            await this.traversePages(async () => {
                if (await this.commonButtons.isButtonPresent(actionName)) {
                    await runAction();
                    return true; 
                }
                return false;
            });
        } 
        else {
            await runAction();
        }

        if (waitActions.includes(actionName)) {
            try { 
                await this.page.waitForLoadState('domcontentloaded'); 
            } catch (e) { 
                throw new Error(`Failed to wait for DOM content to load during action: ${actionName}. Original error: ${e.message}`);
            }
        }
    }

    resolveTransitionPath(currentStatus, targetStatus) {
        if (currentStatus === targetStatus) {
            return [];
        }
        const queue = [{ status: currentStatus, path: [] }];
        const visited = new Set();
        visited.add(currentStatus);
        while (queue.length > 0) {
            const { status, path } = queue.shift();
            const moves = TRANSITION_PATHS[status];
            if (!moves) {
                continue;
            } 
            for (let next of Object.keys(moves)) {
                const newPath = path.concat(moves[next]);
                if (next === targetStatus){
                    return newPath;
                }
                if (!visited.has(next)) {
                    visited.add(next);
                    queue.push({ status: next, path: newPath });
                }
            }
        }
        return null;
    }

    auxiliaryFlowHandler(config) {
        const { doCopyInAllStatus, addCommentInAllStatus, addTaskInAllStatus, addUVRInAllStatus, relevantTasks, uvrData, commonComment } = config;
        if (addTaskInAllStatus === EXCEL_YES && relevantTasks) {
            return {
                name: 'TaskFlow',
                requiresActionInMaintenance: true,
                allowEmptyPath: false,
                stepHandler: async () => {
                    const currentStatus = await this.commonUtils.fetchFormStatus();

                    if (NON_EDITABLE_STATUSES.includes(currentStatus) || currentStatus === STATUS.NEW ) {
                        return;
                    }

                    let taskAdded = false;

                    if (currentStatus === STATUS.DRAFT || currentStatus === STATUS.RETURNED) {
                        await this.ensureEditMode();
                        await this.traversePages(async () => {
                            if (await this.linkAddTask.isVisible()) {
                                await this.preAuthUtils.manageTasks(relevantTasks, ACTION.REPLACE);
                                taskAdded = true;
                            }
                        });
                    } 

                    if(currentStatus === STATUS.APPROVED || currentStatus === STATUS.UPDATING || currentStatus === STATUS.RETURNED_UPDATER) {
                        if (await this.commonButtons.isButtonPresent('Edit Task')) {
                            await this.preAuthUtils.manageTasks(relevantTasks, ACTION.REPLACE);
                            taskAdded = true;
                        }
                    }
                    
                    if (taskAdded) {
                         await this.preAuthUtils.actionResolver(ACTION.UPDATE);
                         await this.page.waitForLoadState('domcontentloaded');
                    }else{
                        console.log('Task Page was not Found for Auxiliary Flow')
                    }
                }
            };
        }
        if (addUVRInAllStatus === EXCEL_YES && uvrData) {
            return {
                name: 'UVRFlow',
                requiresActionInMaintenance: true,
                allowEmptyPath: false,
                stepHandler: async () => {
                    const currentStatus = await this.commonUtils.fetchFormStatus();
                    if (NON_EDITABLE_STATUSES.includes(currentStatus) || currentStatus === STATUS.NEW ){
                        return;
                    } 
            
                    let rulesAdded = false;

                    if (currentStatus === STATUS.DRAFT || currentStatus === STATUS.RETURNED) {
                        await this.ensureEditMode();
                        await this.traversePages(async () => {
                            if (await this.linkAddRule.isVisible()) {
                                await this.preAuthUtils.manageValidationRules(uvrData, ACTION.REPLACE);
                                rulesAdded = true;
                            }
                        });
                    } 
                    if(currentStatus === STATUS.UPDATING || currentStatus === STATUS.RETURNED_UPDATER) {
                        await this.ensureEditMode();
                        if (await this.linkAddRule.isVisible()) {
                            await this.preAuthUtils.manageValidationRules(uvrData, ACTION.REPLACE);
                            rulesAdded = true;
                        }
                    }
                    if(currentStatus === STATUS.APPROVED && await this.linkAddRule.isVisible()) {
                            await this.preAuthUtils.manageValidationRules(uvrData, ACTION.REPLACE);
                            rulesAdded = true;

                    }
                    if (rulesAdded) {
                         await this.preAuthUtils.actionResolver(ACTION.UPDATE);
                         await this.page.waitForLoadState('domcontentloaded');
                    }else{
                        console.log('Validation Rule Page was not Found for Auxiliary Flow')
                    }
                }
            };
        }

        if (doCopyInAllStatus === EXCEL_YES) {
            return {
                name: 'CopyFlow',
                requiresActionInMaintenance: false, 
                allowEmptyPath: true,
                stepHandler: async (lastAction) => {
                    const currentStatus = await this.commonUtils.fetchFormStatus();
                    await this.executeCopyFlow(lastAction, currentStatus);
                }
            };
        }

        if (addCommentInAllStatus === EXCEL_YES) {
            return {
                name: 'CommentFlow',
                requiresActionInMaintenance: true,
                allowEmptyPath: false,
                stepHandler: async (lastAction) => {
                    const currentStatus = await this.commonUtils.fetchFormStatus();
                    if (lastAction === ACTION.EDIT){
                        return;
                    } 
                    if (currentStatus !== STATUS.NEW && commonComment) {
                        await this.executeUIAction(ACTION.ADD_COMMENTS, { commonComment });
                    }
                },
            };
        }
        return {
            name: 'DefaultFlow',
            requiresActionInMaintenance: false,
            allowEmptyPath: false,
            stepHandler: async () => {}
        };
    }

    async ensureEditMode() {
        if (await this.commonButtons.isButtonPresent(ACTION.EDIT)) {
            await this.commonButtons.clickButton(ACTION.EDIT);
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    async traversePages(checkFn) {
        const MAX_PRE_AUTH_PAGES = 10;
        for (let i = 0; i < MAX_PRE_AUTH_PAGES; i++) {
            
            if (await checkFn()){
                return true;
            } 
            const nextBtn = this.page.locator(`input[value="${ACTION.NEXT}"], button:has-text("${ACTION.NEXT}")`);
            
            if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
                await this.commonButtons.clickButton(ACTION.NEXT);
                await this.page.waitForLoadState('domcontentloaded');
            }
            else {
                break;
            }
        }
        return false;
    }

    async executeCopyFlow(lastAction, fallbackStatus) {
        if (!await this.commonButtons.isButtonPresent(ACTION.COPY)) return;
        const originalUrl = this.page.url();
        const originalFormID = await this.iBubbleUtils.fetchValueByLabel('Form ID');

        try {
            await this.commonButtons.clickButton(ACTION.COPY);
            const canSave = await this.traversePages(async () => {
                await this.preAuthUtils.tracePreauthOrigin(this.dtpDescription, originalFormID, fallbackStatus, lastAction);
                return await this.commonButtons.isButtonPresent(ACTION.SAVE);
            });
            if (canSave) {
                await this.executeStatusflow(STATUS.NEW, STATUS.DRAFT, { 
                    doCopyInAllStatus: 'No', 
                    commonComment: 'Copy Validation', 
                });
            }
        } catch (e) {
            throw new Error(`Error Occured during Copy Flow. Original error: ${e.message}`);
        } finally {
            if (this.page.url() !== originalUrl) {
                const copiedPreauthFormID = await this.iBubbleUtils.fetchValueByLabel('Form ID');
                console.log('Original Pre Auth Status: '+fallbackStatus+', Copied Pre Auth Form ID: '+copiedPreauthFormID);
                await this.page.goto(originalUrl, { waitUntil: 'domcontentloaded' });
            }
        }
    }
}