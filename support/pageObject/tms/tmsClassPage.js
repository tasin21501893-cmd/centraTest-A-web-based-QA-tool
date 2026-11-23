/**
 * @author Waliul Hasnat Rahat
 * @since 07/30/2026
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';
import { tmsUtils } from './utility/tmsUtils.js';
import { tmsLabels } from './utility/tmsLabels.js';
import { DonePage } from '../../commonPages/donePage.js';

export class ClassPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.donePage = new DonePage(page);
        this.#initLocators(page);
    }

    async fillClassForm(data) {
        if (data.className) {
            await this.txtName.fill(`${data.className}_${Date.now()}`);
        }

        if (data.sponsor) {
            await this.txtSponsor.fill(data.sponsor);
        }

        if (data.description) {
            await this.txtDescription.fill(data.description);
        }

        if (data.certificationValidity) {
            await this.txtCertificationValidity.fill(data.certificationValidity);
        }

        if (data.validityUnit) {
            await this.#selectRadioByUnit(data.validityUnit, {
                [tmsLabels.DAY]: this.rdoValidityUnitDay,
                [tmsLabels.WEEK]: this.rdoValidityUnitWeek,
                [tmsLabels.MONTH]: this.rdoValidityUnitMonth,
                [tmsLabels.YEAR]: this.rdoValidityUnitYear,
            });
        }

        if (data.dueDateCalculatedBasedOn) {
            await this.#selectRadioByUnit(data.dueDateCalculatedBasedOn, {
                [tmsLabels.HIRE_DATE]: this.rdoDueCalculationHireDate,
                [tmsLabels.ASSIGNMENT_DATE]: this.rdoDueCalculationAssignmentDate,
            });
        }

        if (data.gracePeriod) {
            await this.txtGracePeriod.fill(data.gracePeriod);
        }

        if (data.graceUnit) {
            await this.#selectRadioByUnit(data.graceUnit, {
                [tmsLabels.DAY]: this.rdoGraceUnitDay,
                [tmsLabels.WEEK]: this.rdoGraceUnitWeek,
                [tmsLabels.MONTH]: this.rdoGraceUnitMonth,
                [tmsLabels.YEAR]: this.rdoGraceUnitYear,
            });
        }

        if (data.initialSessionLenHour) {
            await this.txtInitialSessionLenHour.fill(data.initialSessionLenHour);
        }

        if (data.initialSessionLenMinute) {
            await this.txtInitialSessionLenMinute.fill(data.initialSessionLenMinute);
        }

        if (data.initialSessionCount) {
            await this.txtInitialSessionCount.fill(data.initialSessionCount);
        }

        if (data.recertSessionLenHour) {
            await this.txtRecertSessionLenHour.fill(data.recertSessionLenHour);
        }

        if (data.recertSessionLenMinute) {
            await this.txtRecertSessionLenMinute.fill(data.recertSessionLenMinute);
        }

        if (data.recertSessionCount) {
            await this.txtRecertSessionCount.fill(data.recertSessionCount);
        }

        if (data.fileAttachment) {
            await tmsUtils.attachMaximumFiles(this.page, this.attachmentUtils, data);
        }
    }

    async clickSave() {
        await this.commonButtons.clickButton(tmsLabels.SAVE);
    }

    async clickCancel() {
        await this.commonButtons.clickButton(tmsLabels.CANCEL);
    }

    async verifySuccessMessage() {
        await this.donePage.verifyPartialDoneMessage(tmsLabels.SAVED_SUCCESSFULLY);
    }

    async #selectRadioByUnit(value, radioMap) {
        const radio = radioMap[String(value).toLowerCase()];

        if (radio) {
            await radio.check();
        }
    }

    #initLocators(page) {
        this.txtName = page.locator('input[id="name"]');
        this.txtSponsor = page.locator('input[id="sponsor"]');
        this.txtDescription = page.locator('textarea[id="description"]');
        this.txtCertificationValidity = page.locator('input[id="duration"]');
        this.rdoValidityUnitDay = page.locator('input[id="durationUnit1"]');
        this.rdoValidityUnitWeek = page.locator('input[id="durationUnit2"]');
        this.rdoValidityUnitMonth = page.locator('input[id="durationUnit3"]');
        this.rdoValidityUnitYear = page.locator('input[id="durationUnit4"]');
        this.rdoDueCalculationHireDate = page.locator('input[id="dueCalculationProcess1"]');
        this.rdoDueCalculationAssignmentDate = page.locator('input[id="dueCalculationProcess2"]');
        this.txtGracePeriod = page.locator('input[id="gracePeriod"]');
        this.rdoGraceUnitDay = page.locator('input[id="graceUnit1"]');
        this.rdoGraceUnitWeek = page.locator('input[id="graceUnit2"]');
        this.rdoGraceUnitMonth = page.locator('input[id="graceUnit3"]');
        this.rdoGraceUnitYear = page.locator('input[id="graceUnit4"]');
        this.txtInitialSessionLenHour = page.locator('input[id="initialSessionLenHour"]');
        this.txtInitialSessionLenMinute = page.locator('input[id="initialSessionLenMinute"]');
        this.txtInitialSessionCount = page.locator('input[id="initialSessionCount"]');
        this.txtRecertSessionLenHour = page.locator('input[id="recertSessionLenHour"]');
        this.txtRecertSessionLenMinute = page.locator('input[id="recertSessionLenMinute"]');
        this.txtRecertSessionCount = page.locator('input[id="recertSessionCount"]');
    }
}
