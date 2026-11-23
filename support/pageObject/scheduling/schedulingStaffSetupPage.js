/**
 * @author Abdullah Umar Nasib
 * @since 24/04/2025
 */

import { ListPage } from '../../commonPages/listPage';
import { CommonUtils } from '../../commonUtility/commonUtils';

export class SchedulingStaffSetupPage {
    
    constructor(page) {
        this.page = page;
        this.list = new ListPage(page);
        this.utils = new CommonUtils(page);
        this.ddlServiceDescCode = page.locator('[name="serviceDesCodeList"]');
        this.txtDailyWorkHourLimit = page.locator('[name="dailyWorkHourLimit"]');
        this.txtWeeklyWorkHourLimit = page.locator('[name="weeklyWorkHourLimit"]');
    }

    async enableStaffSetupFlags(data) {
        if (data.flags) {
            const flagList = await this.utils.parseCommaSeparatedList(data.flags);

            for (const flag of flagList) {
                await this.utils.selectCheckboxUsingFieldName(this.page, flag);
            }
        } else {
            const flagMappings = {
                'Schedulable': data.schedulable,
                'TeleHealth Service': data.teleHealthService,
                'Enable Self Scheduling': data.enableSelfScheduling,
                'Enable Staff Scheduling': data.enableStaffScheduling,
                'Enable Self Check-In': data.enableSelfCheckIn
            };

            for (const [flagName, flagValue] of Object.entries(flagMappings)) {
                await this.utils.toggleCheckboxUsingValue(this.page, flagName, flagValue);
            }
        }
    }

    async selectServiceDescCode(serviceDescCodes) {
        if (serviceDescCodes) {
            const serviceList = await this.utils.parseCommaSeparatedList(serviceDescCodes);

            for (const service of serviceList) {
                await this.ddlServiceDescCode.selectOption(service);
            }
        }
    }

    async fillupDailyWorkHourLimit(dailyWorkHourLimit) {
        await this.txtDailyWorkHourLimit.fill(dailyWorkHourLimit);
    }

    async fillupWeeklyWorkHourLimit(weeklyWorkHourLimit) {
        await this.txtWeeklyWorkHourLimit.fill(weeklyWorkHourLimit);
    }

    async configureScheduleStaffSetup(data) {
        if (await this.list.isItemExist(data.firstName + ' ' + data.lastName + ' ' + data.title)) {
            await this.list.clickFirstListItem();

            await this.enableStaffSetupFlags(data);
            await this.selectServiceDescCode(data.serviceDescCodes);
            await this.fillupDailyWorkHourLimit(data.dailyWorkHourLimit);
            await this.fillupWeeklyWorkHourLimit(data.weeklyWorkHourLimit);
        } else {
            console.error('[ERROR] Staff does not exist!');
        }
    }
}