/**
 * @author Tarikul Islam
 * @since 24/12/24
*/

export class ManageRegionsPage {

    constructor(page){
        this.page = page;
        this.lnkManageProviders = page.getByRole('link', { name: 'Manage Providers' }).first();
        this.txtfilterField = page.getByPlaceholder('Filter');
        this.txtRegionName = page.locator('[name="region.name"]');
    };

    async regionFormFillUp(data){
        await this.txtRegionName.fill(data.regionName);
    }

    async  goToManageProvidersForm(regionName){
        await this.txtfilterField.fill(regionName);
        await this.lnkManageProviders.click();
    }
}
