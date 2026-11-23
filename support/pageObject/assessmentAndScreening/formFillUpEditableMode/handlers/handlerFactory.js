/**
 * @author Maksuda Islam (Lima)
 * @since 05/28/2025
 */

import { IntegerHandler } from './integerHandler.js';
import { DoubleHandler } from './doubleHandler.js';
import { TextAreaHandler } from './textAreaHandler.js';
import { TextFieldHandler } from './textFieldHandler.js';
import { CheckboxHandler } from './checkboxHandler.js';
import { RadioHandler } from './radioHandler.js';
import { DropdownHandler } from './dropdownHandler.js';
import { DateHandler } from './dateHandler.js';
import { DiagnosisHandler } from './diagnosisHandler.js';
import { GenericTabularHandler } from './genericTabularHandler.js';
import { MedicationHandler } from './medicationHandler.js';
import { SurgeryHandler } from './surgeryHandler.js';
import { ReadOnlyText } from './readOnlyTextHandler.js';

const map = {
    Q_INTEGER: IntegerHandler,
    Q_DOUBLE: DoubleHandler,
    Q_TEXT_FIELD: TextFieldHandler,
    Q_TEXT_AREA: TextAreaHandler,
    Q_DATE: DateHandler,
    Q_DROPDOWN: DropdownHandler,
    Q_RADIO: RadioHandler,
    Q_CHECKBOX: CheckboxHandler,
    Q_DIAGNOSIS: DiagnosisHandler,
    Q_GENERIC_TABULAR: GenericTabularHandler,
    Q_MEDICATION: MedicationHandler,
    Q_SURGERY: SurgeryHandler,
    READONLY_TEXT: ReadOnlyText
};

export class HandlerFactory {

    constructor(page) {
        this.page = page;
    }

    get(type) {
        const DataTypeClass = map[type];

        if (!DataTypeClass) {
            throw new Error(`No handler for type ${type}`);
        }
        return new DataTypeClass(this.page);
    }
}