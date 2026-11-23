/**
 * @author Ayesha Afroze
 * @since 02/14/2026
 */

import { ListPage } from '../../commonPages/listPage.js';
import { DonePage } from '../../../support/commonPages/donePage.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { AttachmentUtils } from '../../commonUtility/attachmentUtils.js';

import { IdfPage } from './idfPage.js';

export class TeamMemberPage {

    constructor(page) {
        this.page = page;
        this.listPage = new ListPage(page);
        this.donePage = new DonePage(page);
        this.commonUtils = new CommonUtils(page);
        this.commonButtons = new CommonButtons(page);
        this.attachmentUtils = new AttachmentUtils(page);
        this.idfPage = new IdfPage(page);

        this.teamMemberModal = page.frameLocator('#teamMemberModal iframe');

        this.ddlTeamMemberType = this.teamMemberModal.locator('[id="clientTeamMember.teamMemberTypePickerBtn"]');
        this.ddlSharedContact = this.teamMemberModal.locator('[id="clientTeamMember.sharedContactPickerBtn"]');
        this.ddlContact = this.teamMemberModal.locator('[id="clientTeamMember.contactPickerBtn"]');
        this.ddlUser = this.teamMemberModal.locator('[id="clientTeamMember.userPickerBtn"]');
        this.txtOther = this.teamMemberModal.locator("[name='clientTeamMember.other']");
        this.txtRelationship = this.teamMemberModal.locator("[name='clientTeamMember.relationship']");
        this.chkLegalDecisionMaker = this.teamMemberModal.locator("[name='clientTeamMember.legalDecisionMaker']");
        this.chkGuardianData = this.teamMemberModal.locator("[name='clientTeamMember.guardianData']");
        
        this.ddlFormStatus = page.locator('[id="teamMemberStatusPickerBtn"]');
    }

    async navigateToTeamMemberForm(data) {
        await this.idfPage.filterIdfByFormIdOrDemographics(data);
        await this.donePage.clickLinkByText('Team Members');
    }

    async fillUpTeamMemberForm(data, attachmentDataList) {
        await this.commonUtils.selectBootstrapCustomDropdown(this.ddlTeamMemberType, data.teamMemberType, this.teamMemberModal);

        switch (data.teamMemberType) {
            case 'Shared Contact':
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlSharedContact, data.sharedContact, this.teamMemberModal);
                break;
            case 'Contact':
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlContact, data.contact, this.teamMemberModal);
                break;
            case 'User':
                await this.commonUtils.selectBootstrapCustomDropdown(this.ddlUser, data.user, this.teamMemberModal);
                break;
            case 'Other':
                await this.txtOther.fill(data.other);
                break;
        }

        if (data.teamMemberType !== 'Contact') {
            await this.txtRelationship.fill(data.relationship);
        }

        if (CommonUtils.isAffirmative(data.legalDecisionMaker)) {
            await this.chkLegalDecisionMaker.check();
        }

        if (CommonUtils.isAffirmative(data.isGuardian)) {
            const isDisabled = await this.chkGuardianData.isDisabled();

            if (!isDisabled) {
                await this.idfPage.fillUpGuardianInformation(data, attachmentDataList, 'teamMember', this.teamMemberModal); 
            }
        }
    }

    async createTeamMember(data, attachmentDataList) {
        await this.navigateToTeamMemberForm(data);
        await this.commonButtons.clickButton('Add Team Member');
        await this.fillUpTeamMemberForm(data, attachmentDataList);
        await this.commonButtons.clickButton('Continue', this.teamMemberModal);

        if (await this.commonButtons.isButtonPresent('Save')) {
            await this.commonButtons.clickButton('Save');
        } else {
            await this.commonButtons.clickButton('Update');
        }
    }

    async deleteTeamMemberForm(data) {
        await this.listPage.selectFilteredFirstItemUponAvailability(data.relationship);
        await this.commonButtons.clickButton('Delete', this.teamMemberModal);
        await this.commonButtons.clickButton('Yes', this.teamMemberModal);
        await this.commonButtons.clickButton('Update');
    }

    async createAndDeleteTeamMember(data, attachmentDataList) {
        await this.createTeamMember(data, attachmentDataList);
        await this.donePage.clickLinkByText('Form');
        await this.deleteTeamMemberForm(data);
    }

    async openAndFillTeamMember(data, attachmentDataList) {
        await this.navigateToTeamMemberForm(data);
        await this.commonButtons.clickButton('Add Team Member');
        await this.fillUpTeamMemberForm(data, attachmentDataList);
    }
}