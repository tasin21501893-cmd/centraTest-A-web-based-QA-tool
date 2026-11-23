/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { IdfCoreFetchComponent } from './idfCoreFetchComponent.js';
import { IdfDetailFetchComponent } from './idfDetailFetchComponent.js';
import { IdfAllergyProfileFetchComponent } from './idfAllergyProfileFetchComponent.js';
import { IdfActiveAllergyFetchComponent } from './idfActiveAllergyFetchComponent.js';
import { IdfDiagnosisListFetchComponent } from './idfDiagnosisListFetchComponent.js';
import { ServiceProviderFetchComponent } from './serviceProviderFetchComponent.js';
import { CaseManagerFetchComponent } from './caseManagerFetchComponent.js';
import { IdfGuardianListFetchComponent } from './idfGuardianListFetchComponent.js';
import { ProviderProgramFetchComponent } from './providerProgramFetchComponent.js';
import { ClientProgramFetchComponent } from './clientProgramFetchComponent.js';
import { IdfAdvancedDirectivesFetchComponent } from './idfAdvancedDirectivesFetchComponent.js';
import { CaseManagementProviderFetchComponent } from './caseManagementProviderFetchComponent.js';
import { MedicationHistoryDataFetchComponent } from './medicationHistoryDataFetchComponent.js';
import { IndividualCarePlanFetchComponent } from './individualCarePlanFetchComponent.js';
import { IdfPrimaryDiagnosisFetchComponent } from './idfPrimaryDiagnosisFetchComponent.js';
import { LinkedBehaviorPlanFetchComponent } from './linkedBehaviorPlanFetchComponent.js';

const componentMap = {
    IDF_CORE: IdfCoreFetchComponent,
    IDF_DETAIL: IdfDetailFetchComponent,
    IDF_ALLERGY_PROFILE: IdfAllergyProfileFetchComponent,
    IDF_ACTIVE_ALLERGY: IdfActiveAllergyFetchComponent,
    IDF_DIAGNOSIS_LIST: IdfDiagnosisListFetchComponent,
    SERVICE_PROVIDER: ServiceProviderFetchComponent,
    CASE_MANAGER: CaseManagerFetchComponent,
    IDF_GUARDIAN_LIST: IdfGuardianListFetchComponent,
    PROVIDER_PROGRAM: ProviderProgramFetchComponent,
    CLIENT_PROGRAM: ClientProgramFetchComponent,
    IDF_ADVANCED_DIRECTIVES: IdfAdvancedDirectivesFetchComponent,
    CASE_MANAGEMENT_PROVIDER: CaseManagementProviderFetchComponent,
    MEDICATION_HISTORY: MedicationHistoryDataFetchComponent,
    INDIVIDUAL_CARE_PLAN: IndividualCarePlanFetchComponent,
    IDF_PRIMARY_DIAGNOSIS: IdfPrimaryDiagnosisFetchComponent,
    LINKED_BEHAVIOR_PLAN: LinkedBehaviorPlanFetchComponent
};

export class ExternalDataFetchComponentFactory {
    /**
     * @param {import('playwright').Page} page
     */
    constructor(page) {
        if (!page) {
            throw new Error('ExternalDataFetchComponentFactory requires a Playwright Page instance');
        }
        this.page = page;
    }

    create(componentType) {
        const ComponentClass = componentMap[componentType];

        if (!ComponentClass) {
            throw new Error(
                `Unsupported component type: ${componentType}. ` +
                `Supported types: ${Object.keys(componentMap).join(', ')}`
            );
        }

        return new ComponentClass(this.page);
    }
}