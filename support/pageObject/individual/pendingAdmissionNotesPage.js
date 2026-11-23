/**
 * @author Ziaur Rahman
 * @since 03/20/2026
 */

import { CommonUtils } from '../../commonUtility/commonUtils.js';

export class PendingAdmissionNotesPage {

    constructor(page) {
        this.page = page;
        this.commonUtils = new CommonUtils(page);

        this.txtNote = page.locator('[name="note"]');
    }

    async pendingAdmissionNotesFillUp(data) {
        // Generate string if charLength is provided, otherwise use the note value
        const noteValue = data.charLength
            ? await this.commonUtils.generateString(data.charLength)
            : (data.note || '');

        await this.txtNote.fill(noteValue);
    }
}