/**
 * @author Abdullah Umar Nasib
 * @since 15/04/2025
 */

import { ListPage } from '../../commonPages/listPage';
import { CommonUtils } from '../../commonUtility/commonUtils';
import { CommonButtons } from '../../commonUtility/commonButtons';
import { schedulingProvPrefFlags } from '../../../resources/scheduling/schedulingProvPrefFlags';

export class SchedulingEvvCalProvPrefPage {
    
    constructor(page) {
        this.page = page;
        this.list = new ListPage(page);
        this.utils = new CommonUtils(page);
        this.button = new CommonButtons(page)
        this.ddlPayWeekStartDay = page.locator('[name="startingDayOfPayWeek"]');
        this.ddlSelfCheckInAbleService = page.locator('[name="selfCheckInAbleServiceDesCodeList"]');
        this.ddlDefaultSlotDuration = page.locator('[name="defaultSlotDuration"]');
        this.txtDailyWorkHourLimit = page.locator('[name="dailyWorkHourLimit"]');
        this.txtWeeklyWorkHourLimit = page.locator('[name="weeklyWorkHourLimit"]');
        this.txtLocationName = page.locator('[name="calendar-location-name-input"]');
        this.btnCalendarLocation = page.locator('[id="calendarLocationSection-collapse-btn"]');
    }

    async selectPayWeekStartDay(payWeekStartDay) {
        if (payWeekStartDay) {
            await this.ddlPayWeekStartDay.selectOption(payWeekStartDay);
        }
    }

    async selectSelfCheckInAbleService(selfCheckInAbleServices) {
        if (selfCheckInAbleServices) {
            const serviceList = await this.utils.parseCommaSeparatedList(selfCheckInAbleServices);

            for (const service of serviceList) {
                await this.ddlSelfCheckInAbleService.selectOption(service);
            }
        }
    }

    async selectDefaultSlotDuration(defaultSlotDuration) {
        if (defaultSlotDuration) {
            await this.ddlDefaultSlotDuration.selectOption(defaultSlotDuration);
        }
    }

    async fillupDailyWorkHourLimit(dailyWorkHourLimit) {
        await this.txtDailyWorkHourLimit.fill(dailyWorkHourLimit);
    }

    async fillupWeeklyWorkHourLimit(weeklyWorkHourLimit) {
        await this.txtWeeklyWorkHourLimit.fill(weeklyWorkHourLimit);
    }

    async enableProviderPreferenceFlags(data) {
        if (data.flags) {
            const flagList = await this.utils.parseCommaSeparatedList(data.flags);
            
            for (const flag of flagList) {
                await this.utils.selectCheckboxUsingFieldName(this.page, flag);
            }
        } else {
            for (const [flagName, flagValue] of Object.entries(schedulingProvPrefFlags)) {
                await this.utils.toggleCheckboxUsingValue(this.page, flagName, data[flagValue]);
            }
        }
    }

    async fillupCalendarLocation(calendarLocations) {
        if (calendarLocations) {
            const locationList = await this.utils.parseCommaSeparatedList(calendarLocations);
            await this.btnCalendarLocation.click();

            for (const location of locationList) {
                if (await this.list.isItemExist(location)) {
                    console.log(`A location with the name "${location}" already exists.`);
                } else {
                    await this.button.clickButton('Add New');
                    await this.txtLocationName.fill(location);
                    await this.button.clickButton('Add');
                }
            }

            await this.btnCalendarLocation.click();
        }
    }

    async configure(data) {
        await this.selectPayWeekStartDay(data.payWeekStartDay);
        await this.selectSelfCheckInAbleService(data.selfCheckInAbleServices);
        await this.selectDefaultSlotDuration(data.defaultSlotDuration);
        await this.fillupDailyWorkHourLimit(data.dailyWorkHourLimit);
        await this.fillupWeeklyWorkHourLimit(data.weeklyWorkHourLimit);
        await this.enableProviderPreferenceFlags(data);
        await this.fillupCalendarLocation(data.calendarLocations);
    }
}