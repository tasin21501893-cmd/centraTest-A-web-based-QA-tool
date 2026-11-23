/**
 * @author MD. Tabiul Hasan
 * @since 01/11/2026
 */

export class UB04PrintCalibration {

    constructor(page) {
        this.page = page;
        this.txtPrinterName = page.locator(`[name='printerName']`);
        this.txtVerShift = page.locator(`[name='verShift']`);
        this.txtHorShift = page.locator(`[name='horShift']`);

        this.btnVerShiftUp = page.locator(`[name='verShift'] ~ .input-group-btn-vertical button:first-child`);
        this.btnVerShiftDown = page.locator(`[name='verShift'] ~ .input-group-btn-vertical button:last-child`);

        this.btnHorShiftUp = page.locator(`[name='horShift'] ~ .input-group-btn-vertical button:first-child`);
        this.btnHorShiftDown = page.locator(`[name='horShift'] ~ .input-group-btn-vertical button:last-child`);
    }

    // method to Click the appropriate arrow (up/down) for required Numbers of times
    async adjustSpinnerValue(currentValue, targetValue, upButton, downButton) {
        const difference = targetValue - currentValue;
        const button = difference > 0 ? upButton : downButton;
        const clickCount = Math.abs(difference);

        for (let i = 0; i < clickCount; i++) {
            await button.click();
        }
    }

    async fillUpUB04PrintCalibrationForm(data) {
        await this.txtPrinterName.fill(data.name);

        const currentVerShift = parseInt(await this.txtVerShift.inputValue());
        const currentHorShift = parseInt(await this.txtHorShift.inputValue());

        await this.adjustSpinnerValue(currentVerShift, data.verShift, this.btnVerShiftUp, this.btnVerShiftDown);
        await this.adjustSpinnerValue(currentHorShift, data.horShift, this.btnHorShiftUp, this.btnHorShiftDown);
    }
    
    async updateUB04PrintCalibrationForm(data) {
        const currentVerShift = parseInt(await this.txtVerShift.inputValue());
        const currentHorShift = parseInt(await this.txtHorShift.inputValue());

        await this.adjustSpinnerValue(currentVerShift, data.updatedVerShift, this.btnVerShiftUp, this.btnVerShiftDown);
        await this.adjustSpinnerValue(currentHorShift, data.updatedHorShift, this.btnHorShiftUp, this.btnHorShiftDown);
    }

    async selectItem(itemName) {
        await this.page.getByText(itemName).first().click();
    }
}