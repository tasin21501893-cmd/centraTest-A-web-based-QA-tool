/**
 * @author Ashique Mohammad
 * @since 23/02/25
*/

import { expect } from '@playwright/test';
import { CommonButtons } from "../../../commonUtility/commonButtons";
import { CommonUtils } from '../../../commonUtility/commonUtils';
import { ButtonLabels } from '../../../commonUtility/buttonLabels';
import { ListPage } from '../../../commonPages/listPage';
import { DonePage } from '../../../commonPages/donePage';
import { AttachmentUtils } from '../../../commonUtility/attachmentUtils';

export class SkinWoundForm {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.dtpEventDate = page.locator('[name="eventDate"]');
        this.ddlNotificationLevel = page.locator('[name="notifLevel"]');
        this.ddlReportedBy = page.locator('[name="reporter"]');
        this.txtReportedByOther = page.locator('[name="reporterNameOther"]');
        this.rdoSkinWoundPresentYes = page.locator('#woundPresent1');
        this.rdoSkinWoundPresentNo = page.locator('#woundPresent2');
        this.tpEventTime = page.locator('[name="eventTime"]');
        this.ddlBodyPart = page.locator('#locationsOnBody');
        this.dtpPhotoDate = page.locator('[name="imageDate"]');
        this.txtWoundTypeOther = page.locator('[name="woundTypeOther"]');
        this.ddlWoundType = page.locator('#woundType');
        this.txtWoundStageOther = page.locator('[name="woundStageOther"]');
        this.ddlWoundStage = page.locator('#woundStage');
        this.txtWoundSizeLength = page.locator('[name="woundSizeLength"]');
        this.txtWoundSizeWidth = page.locator('[name="woundSizeWidth"]');
        this.txtWoundSizeDepth = page.locator('[name="woundSizeDepth"]');
        this.txtWoundBaseColorOther = page.locator('[name="woundBaseColorOther"]');
        this.ddlWoundBaseColor = page.locator('#woundBaseColor');
        this.ddlSurroundingSkin = page.locator('#surroundingSkinFirst');
        this.ddlSkinColor = page.locator('#surroundingSkinSecond');
        this.ddlSkinTone = page.locator('#surroundingSkinThird');
        this.rdoWoundInfectedYes = page.locator('#woundInfected1');
        this.rdoWoundInfectedNo = page.locator('#woundInfected2');
        this.ddlDrainageColor = page.locator('#drainageColor');
        this.ddlDrainageAmount = page.locator('#drainageAmount');
        this.ddlDrainageOdor = page.locator('#drainageOdor');
        this.rdoDressingChangeCompletedYes = page.locator('#dressingChangeCompleted1');
        this.rdoDressingChangeCompletedNo = page.locator('#dressingChangeCompleted2');
        this.ddlTreatmentDressing = page.locator('#dressing');
        this.txtTreatmentDressingOther = page.locator('[name="dressingOther"]');
        this.rdoWoundResolvedYes = page.locator('#woundResolved1');
        this.rdoWoundResolvedNo = page.locator('#woundResolved2');
        this.txtComments = page.locator('[name="comments"]');
        this.txtReasonForDeletion = page.locator('[name="deleteComments"]');
        this.iframe = page.frameLocator("iframe[frameborder='0']");
        this.iframeInfectionName = this.iframe.getByPlaceholder('Filter');
        this.errMsgEventDate = page.locator('#eventDate\\.errors');
        this.errMsgReporter = page.locator('#reporter\\.errors');
        this.errMsgOtherReporter = page.locator('#reporterNameOther\\.errors');
        this.errMsgEventTime = page.locator('#eventTime\\.errors');
        this.errMsgPhotoDate = page.locator('#imageDate\\.errors');
        this.errMsgWoundTypeOther = page.locator('#woundTypeOther\\.errors');
        this.errMsgWoundStageOther = page.locator('#woundStageOther\\.errors');
        this.errMsgWoundSizeLength = page.locator('#woundSizeLength\\.errors');
        this.errMsgWoundSizeWidth = page.locator('#woundSizeWidth\\.errors');
        this.errMsgWoundSizeDepth = page.locator('#woundSizeDepth\\.errors');
        this.errMsgWoundSizeColorOther = page.locator('#woundBaseColorOther\\.errors');
        this.errMsgTreatmentDressingOther = page.locator('#dressingOther\\.errors');
        this.errMsgComments = page.locator('#comments\\.errors');
        this.errMsgDeleteRequired = page.locator('#deleteRequiredMessage');

        this.commonButtons = new CommonButtons(page);
        this.listPage = new ListPage(page);
        this.commonUtils = new CommonUtils(page);
        this.donePage = new DonePage(page);
        this.attachmentUtils = new AttachmentUtils(page);
    }

    async setBodyPartsValue(values) {
        const inputs = values.split(',').map(input => input.trim());
        await this.ddlBodyPart.selectOption(inputs);
    }

    async fillupForm(formObject) {
        formObject.program && await this.listPage.selectFilteredFirstItem(formObject.program);
        formObject.individual && await this.listPage.selectFilteredFirstItem(formObject.individual);

        await this.ddlReportedBy.selectOption(formObject.reporter);
        formObject.otherReporter && await this.txtReportedByOther.fill(formObject.otherReporter);
        await this.dtpEventDate.fill(formObject.eventDate);
        await this.ddlNotificationLevel.selectOption(formObject.notification);
        formObject.skinWoundPresent && await this.commonUtils.selectRadioOption(formObject.skinWoundPresent, this.rdoSkinWoundPresentYes, this.rdoSkinWoundPresentNo);
        await this.txtComments.fill(formObject.comments);

        if (CommonUtils.isAffirmative(formObject.skinWoundPresent)) {
            formObject.eventTime && await this.tpEventTime.clear();
            formObject.eventTime && await this.tpEventTime.fill(formObject.eventTime);
            formObject.bodyPart && await this.setBodyPartsValue(formObject.bodyPart);
            await this.dtpPhotoDate.fill(formObject.photoDate);

            if (CommonUtils.isAffirmative(formObject.hasAttachment)) {
                await this.attachmentUtils.addImage({ fileName: "custom/skinWoundPhoto.jpg" });
            }

            formObject.woundType && await this.ddlWoundType.selectOption(formObject.woundType);
            formObject.woundTypeOther && await this.txtWoundTypeOther.fill(formObject.woundTypeOther);
            formObject.woundStage && await this.ddlWoundStage.selectOption(formObject.woundStage);
            formObject.woundStageOther && await this.txtWoundStageOther.fill(formObject.woundStageOther);

            await this.txtWoundSizeLength.fill(formObject.woundSizeLength);
            await this.txtWoundSizeWidth.fill(formObject.woundSizeWidth);
            await this.txtWoundSizeDepth.fill(formObject.woundSizeDepth);

            await this.ddlWoundBaseColor.selectOption(formObject.woundBasedColor);
            formObject.woundBasedColorOther && await this.txtWoundBaseColorOther.fill(formObject.woundBasedColorOther);

            await this.ddlSurroundingSkin.selectOption(formObject.surroundingSkin);
            await this.ddlSkinColor.selectOption(formObject.skinColor);
            await this.ddlSkinTone.selectOption(formObject.skinTone);
            formObject.woundInfection && await this.commonUtils.selectRadioOption(formObject.woundInfection, this.rdoWoundInfectedYes, this.rdoWoundInfectedNo);

            if (formObject.woundInfection && formObject.infection) {
                await this.commonButtons.clickButton(ButtonLabels.ADD);
                await this.iframeInfectionName.fill(formObject.infection);
                await this.iframe.getByRole('radio').first().check();
                await this.commonButtons.clickButton(ButtonLabels.ADD, this.iframe);
            }

            await this.ddlDrainageColor.selectOption(formObject.drainageColor);
            await this.ddlDrainageAmount.selectOption(formObject.drainageAmount);
            await this.ddlDrainageOdor.selectOption(formObject.drainageOdor);
            formObject.dressingChangeCompleted && await this.commonUtils.selectRadioOption(formObject.dressingChangeCompleted, this.rdoDressingChangeCompletedYes, this.rdoDressingChangeCompletedNo);
            await this.ddlTreatmentDressing.selectOption(formObject.dressing);
            formObject.dressingOther && await this.txtTreatmentDressingOther.fill(formObject.dressingOther);
            formObject.woundResolved && await this.commonUtils.selectRadioOption(formObject.woundResolved, this.rdoWoundResolvedYes, this.rdoWoundResolvedNo);
        }
    }

    async deleteForm(reasonForDeletion) {
        await this.donePage.clickLinkByText("Form");
        await this.commonButtons.clickButton(ButtonLabels.DELETE);
        await this.page.waitForLoadState();
        reasonForDeletion && await this.txtReasonForDeletion.fill(reasonForDeletion);
        await this.commonButtons.clickButton(ButtonLabels.CONFIRM);
    }

    async errMsgValidate(locator, expectedMsg) {
        expect(await locator.textContent()).toContain(expectedMsg);
    }
}