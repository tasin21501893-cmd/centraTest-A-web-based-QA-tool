/**
 * @author Abdullah Umar Nasib
 * @since 02/03/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class JurisdictionPage {
    constructor(page) {
        this.page = page;
        this.commonButtons = new CommonButtons(page);
        this.commonUtils = new CommonUtils(page);
        this.txtRegionCounty = page.locator('[name="region"]');
        this.txtTheFundingAgency = page.locator('[name="dept"]');
    }

    async enterRegionCounty(regionCounty) {
        const regionCountyData = regionCounty?.trim();
    
        if (!regionCountyData) {
            throw new Error("Region/County is required");
        }
    
        await this.txtRegionCounty.fill(regionCountyData);
    }
    
    async enterTheFundingAgency(fundingAgency) {
        const fundingAgencyData = fundingAgency?.trim();
    
        if (!fundingAgencyData) {
            throw new Error("The Funding Agency is required");
        }
    
        await this.txtTheFundingAgency.fill(fundingAgencyData);
    }

    async fillUpJurisdictionForm(data) {
        await this.commonUtils.selectCountryAndState(data.country, data.state);
        await this.enterRegionCounty(data.regionCounty);
        await this.enterTheFundingAgency(data.fundingAgency);
    }
    
    async createNewJurisdiction(data) {
        await this.commonButtons.clickButton("Create New Jurisdiction");
        await this.fillUpJurisdictionForm(data);
        await this.commonButtons.clickButton('Save');
    }
}