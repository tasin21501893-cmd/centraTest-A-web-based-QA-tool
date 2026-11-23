/**
 * @author Sheikh Faiyaz Mahamud
 * @since 04/09/25
  */

export class AttendanceTestUtils {

    constructor(page) {
        this.page = page;
    }

    /**
     * Converts a date string from "MM/DD/YYYY" to "YYYYMMDD" format.
     *
     * @param {string} date - Date in "MM/DD/YYYY" format.
     * @returns {string} Formatted date in "YYYYMMDD" format.
     */

    formatDateRangeToStrings(startDate, endDate) {
        if (!startDate) return [];

        // Split start date
        const [startMonth, startDay, startYear] = startDate.split('/').map(Number);
        const start = new Date(startYear, startMonth - 1, startDay);

        let end;
        if (endDate) {
            const [endMonth, endDay, endYear] = endDate.split('/').map(Number);
            end = new Date(endYear, endMonth - 1, endDay);
        } else {
            end = start;
        }

        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            dates.push(`${y}${m}${day}`);
        }

        return dates;
    }


}