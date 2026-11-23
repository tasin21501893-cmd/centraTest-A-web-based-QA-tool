/**
 * @author Sheikh Faiyaz Mahamud
 * @since 09/02/2026
 */

import { CommonButtons } from "../../commonUtility/commonButtons.js";
import { CommonUtils } from "../../commonUtility/commonUtils.js";

export class NewInstitutionalClaimTemplate {

    constructor(page) {
        this.page = page;
        this.btnTemplateGroupName = page.locator('#groupId_bs_btn');
        this.ddlClientId = page.locator('#clientId');
        this.txtTypeOfBill = page.locator('#typeOfBill');
        this.ddlAdmissionType = page.locator('#admissionType');
        this.btnPatientStatus = page.locator('#patientStatus_bs_btn');
        this.btnBillingProvider = page.locator('#billingProviderId_bs_btn');
        this.txtPrincipalDiagnosisIcd10Lookup = page.locator('#principalDiagnosisIcd10Lookup');
        this.firstAutocompleteMenuItem = page.locator('.ui-autocomplete:visible .ui-menu-item').first();
        this.chkDescCodeIds = page.locator('input[type="checkbox"][name="descCodeIds"]');

        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
    }

    async fillUpNewInstitutionalClaimTemplateForm(data) {
        if (data.templateGroupName) {
            await this.commonUtils.selectBootstrapCustomDropdown(this.btnTemplateGroupName, data.templateGroupName);
        }
        await this.ddlClientId.selectOption({ label: data.individualName });
        await this.txtTypeOfBill.fill(data.typeOfBill);
        await this.ddlAdmissionType.selectOption({ label: data.admissionType });
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnPatientStatus, data.patientStatus);
        await this.commonUtils.selectBootstrapCustomDropdown(this.btnBillingProvider, data.billingProvider);

        if (data.icd10PrincipalDiagnosis) {
            await this.txtPrincipalDiagnosisIcd10Lookup.click();
            await this.txtPrincipalDiagnosisIcd10Lookup.focus();
            await this.txtPrincipalDiagnosisIcd10Lookup.pressSequentially(data.icd10PrincipalDiagnosis, { delay: 100 });

            try {
                await this.firstAutocompleteMenuItem.waitFor({ state: 'visible', timeout: 5000 });
                await this.firstAutocompleteMenuItem.click();
            } catch (error) {
                console.log(`Autocomplete results for ICD-10 Code "${data.icd10PrincipalDiagnosis}" did not appear.`);
            }
        }

        await this.checkAllServiceLinkCheckboxes();
    }

    async checkAllServiceLinkCheckboxes() {
        // Wait for checkboxes in the Service Link section to load (if any)
        await this.chkDescCodeIds.first().waitFor({ state: 'attached', timeout: 5000 }).catch((error) => {
            console.warn('Warning: Checkboxes for descCodeIds did not attach within timeout.', error);
        });

        // Check all unchecked checkboxes under Service Link
        const checkboxes = await this.chkDescCodeIds.all();
        for (const checkbox of checkboxes) {
            if (!(await checkbox.isChecked())) {
                await checkbox.check();
            }
        }
    }

    async updateNewInstitutionalClaimTemplateForm() {
        await this.txtTypeOfBill.waitFor({ state: 'visible' });
        await this.checkAllServiceLinkCheckboxes();
        await this.commonButtons.clickButton('Update');
    }
}
