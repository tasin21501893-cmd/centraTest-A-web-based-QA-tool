/**
 * @author Ziaur Rahman
 * @since 07/19/25
 */

export class AggregatorConfigPage {

    constructor(page) {
        this.page = page;
        this.txtConfigName = page.locator('[name="name"]');
        this.ddlBillingProvider = page.locator('[name="billProviderId"]');
        this.ddlProviderQualifier = page.locator('[name="credential.providerQualifier"]');
        this.txtAggregatorId = page.locator('[name="credential.aggregatorId"]');
        this.txtClientId = page.locator('[name="credential.clientId"]');
        this.txtClientSecret = page.locator('[name="credential.clientSecret"]');
        this.txtBusinessId = page.locator('[name="credential.businessId"]');
        this.txtMedicaidId = page.locator('[name="credential.medicaidId"]');
        this.txtUserId = page.locator('[name="credential.userId"]');
        this.txtPassword = page.locator('[name="credential.password"]');
    }

    async fillUpConfigurationForm(data) {

        switch (data.aggregator) {
            case 'HHA':
                return this.fillUpHhaApiConfigFields(data);

            case 'Sandata':
                return this.fillUpSandataConfigFields(data);

            case 'Therap EVV':
                return this.fillUpTherapEvvConfigFields(data);
        }
    }

    async fillUpCommonFields(data) {
        await this.txtConfigName.fill(data.configName);
        await this.selectBillingProvider(data.billingProvider);
        await this.selectProviderQualifier(data.providerQualifier);
    }

    async fillUpHhaApiConfigFields(data) {
        await this.fillUpCommonFields(data);
        await this.fillUpClientDetails(data);
    }

    async fillUpSandataConfigFields(data) {
        await this.fillUpCommonFields(data);
        await this.txtBusinessId.fill(data.businessId);
        await this.txtMedicaidId.fill(data.medicaidId);
        await this.txtUserId.fill(data.userId);
        await this.txtPassword.fill(data.userPassword);
    }

    async fillUpTherapEvvConfigFields(data) {
        await this.txtAggregatorId.fill(data.aggregatorId);
        await this.fillUpClientDetails(data);
    }

    async fillUpClientDetails(data) {
        await this.txtClientId.fill(data.clientId);
        await this.txtClientSecret.fill(data.clientSecret);
    }

    async selectProviderQualifier(providerQualifier) {
        if (await this.ddlProviderQualifier.isVisible()) {
            await this.ddlProviderQualifier.selectOption({ label: providerQualifier });
        }
    }

    async selectBillingProvider(billingProvider) {

        const optionLocator = this.ddlBillingProvider.locator(`option:has-text("${billingProvider}")`);
        const count = await optionLocator.count();

        if (count !== 1) {
            const message = count === 0
                ? `No Billing Provider option found with text: "${billingProvider}"`
                : `Multiple Billing Provider options found with text: "${billingProvider}"`;
            throw new Error(message);
        }

        // Get the 'value' attribute from that specific option element.
        const providerValue = await optionLocator.getAttribute('value');

        await this.ddlBillingProvider.selectOption({ value: providerValue });
    }
}