/**
 * @author Maksuda Islam (Lima)
 * @since 08/19/2025
 */

import { CommonUtils } from '../../../../../commonUtility/commonUtils';

export class BaseExternalDataFetchComponent {
    constructor(page) {
        if (!page) throw new Error('BaseExternalDataFetchComponent requires a Playwright Page instance');
        this.page = page;

        this.commonUtils = new CommonUtils(page);
    }

    async fetchData(child) {
        throw new Error(`${this.constructor.name}.fetchData() not implemented`);
    }

    async handle(child) {
        const componentType = child?.externalDataFetchProps?.componentType;
        try {
            await this.fetchData(child);

        } catch (error) {
            console.error(`Error handling external data fetch for ${componentType}:`, error);
        }
    }
}