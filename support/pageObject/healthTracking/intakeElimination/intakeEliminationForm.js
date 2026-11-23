/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { expect } from '@playwright/test';
import { CommonButtons } from '../../../commonUtility/commonButtons';
import { CommonUtils } from '../../../commonUtility/commonUtils';
import { ListPage } from '../../../commonPages/listPage';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';

export class IntakeEliminationForm {
    constructor(page) {
        this.page = page;
        this.ddlReportedBy = page.locator('[name="reporterName"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlConfig = page.locator('[name="configId"]');
        this.chkNoIntakeEliminationRecord = page.locator('[name="noIeRecord"]');
        this.txtComments = page.locator('[name="comments"]');

        this.ddlTimeSlot = page.locator('[name="timeSlot"]');
        this.txtFluidIntake = page.locator('[name="fluidIntake"]');
        this.ddlRoute = page.locator('[name="route"]');
        this.txtMealEaten = page.locator('[name="percentageMealEaten"]');
        this.txtCalorieIntake = page.locator('[name="calorieIntake"]');
        this.txtNumberOfFluidVoids = page.locator('[name="noOfFluidVoids"]');
        this.txtFluidVoid = page.locator('[name="fluidVoidVolume"]');
        this.ddlBowelMovement = page.locator('[name="bowelMovement"]');
        this.ddlBmType = page.locator('[name="bowelMovementType"]');
        this.ddlBmAmount = page.locator('[name="bowelMovementAmount"]');
        this.rdoBloodInBMYes = page.locator('#bloodInBowelMovement1');
        this.rdoBloodInBMNo = page.locator('#bloodInBowelMovement2');
        this.ddlBowelAids = page.locator('[name="bowelAids"]');
        this.ddlEmesis = page.locator('[name="emesis"]');
        this.rdoBloodInEmesisYes = page.locator('#bloodInEmesis1');
        this.rdoBloodInEmesisNo = page.locator('#bloodInEmesis2');
        this.txtOstomy = page.locator('[name="ostomy"]');
        this.txtProtein = page.locator('[name="protein"]');
        this.txtSodium = page.locator('[name="sodium"]');
        this.txtCarbohydrates = page.locator('[name="carbohydrates"]');
        this.txtCecostomy = page.locator('[name="cecostomy"]');

        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporterName\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgComment = page.locator('#commentRequiredMessage');
        this.errMsgFluidIntake = page.locator('#fluidIntake\\.errors');
        this.errMsgPercentageMealEaten = page.locator('#percentageMealEaten\\.errors');
        this.errMsgCalorieIntake = page.locator('#calorieIntake\\.errors');
        this.errMsgNoOfFluidVoids = page.locator('#noOfFluidVoids\\.errors');
        this.errMsgFluidVoidMl = page.locator('#fluidVoidVolume\\.errors');
        this.errMsgOstomy = page.locator('#ostomy\\.errors');
        this.errMsgProtein = page.locator('#protein\\.errors');
        this.errMsgSodium = page.locator('#sodium\\.errors');
        this.errMsgCarbohydrate = page.locator('#carbohydrates\\.errors');
        this.errMsgCecostomy = page.locator('#cecostomy\\.errors');
        this.errMsgGlobal = page.locator('.alert-danger li');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
    }

    async fillupForm(formObject) {
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.page.waitForTimeout(1500);  
        (formObject.config && await this.ddlConfig.isVisible()) && await this.ddlConfig.selectOption(formObject.config);
        await this.commonButtons.clickButton(ButtonLabels.NEXT);
        
        if (formObject.addIntakeElimination) {
            await this.commonButtons.clickButton(ButtonLabels.ADD_INTAKE_ELIMINATION);
            await this.page.waitForLoadState();
            formObject.time && await this.ddlTimeSlot.selectOption(formObject.time);
            formObject.fluidIntake && await this.txtFluidIntake.fill(formObject.fluidIntake);
            formObject.route && await this.ddlRoute.selectOption(formObject.route);
            formObject.mealEaten && await this.txtMealEaten.fill(formObject.mealEaten);
            formObject.calorieIntake && await this.txtCalorieIntake.fill(formObject.calorieIntake);
            formObject.noFluidVoids && await this.txtNumberOfFluidVoids.fill(formObject.noFluidVoids);
            formObject.fluidVoid && await this.txtFluidVoid.fill(formObject.fluidVoid);
            formObject.bowelMovement && await this.ddlBowelMovement.selectOption(formObject.bowelMovement);
            formObject.bmType && await this.ddlBmType.selectOption(formObject.bmType);
            formObject.bmAmount && await this.ddlBmAmount.selectOption(formObject.bmAmount);
            formObject.bloodInBM && await this.commonUtils.selectRadioOption(formObject.bloodInBM, this.rdoBloodInBMYes, this.rdoBloodInBMNo);
            formObject.bowelAids && await this.ddlBowelAids.selectOption(formObject.bowelAids);
            formObject.emesis && await this.ddlEmesis.selectOption(formObject.emesis);
            formObject.bloodInEmesis && await this.commonUtils.selectRadioOption(formObject.bloodInEmesis, this.rdoBloodInEmesisYes, this.rdoBloodInEmesisNo);
            formObject.ostomy && await this.txtOstomy.fill(formObject.ostomy);
            formObject.protein && await this.txtProtein.fill(formObject.protein);
            formObject.sodium && await this.txtSodium.fill(formObject.sodium);
            formObject.carbohydrates && await this.txtCarbohydrates.fill(formObject.carbohydrates);
            formObject.cecostomy && await this.txtCecostomy.fill(formObject.cecostomy);

            formObject.reporter && await this.ddlReportedBy.selectOption(formObject.reporter);
            formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
            await this.commonButtons.clickButton(ButtonLabels.CONTINUE);
        }

        formObject.noIntakeEliminationRecord && await this.setNoIntakeEliminationRecord(formObject.noIntakeEliminationRecord)
        formObject.comments && await this.txtComments.fill(formObject.comments);
        if (['y', 'yes'].includes(formObject.addComments.trim().toLowerCase())) {
            await this.commonButtons.clickButton(ButtonLabels.ADD);
        }
    }

    async setNoIntakeEliminationRecord(noIntakeEliminationRecord) {
        if (['y', 'yes', 'check'].includes(noIntakeEliminationRecord.trim().toLowerCase())) {
            await this.chkNoIntakeEliminationRecord.check();
        }
    }
}