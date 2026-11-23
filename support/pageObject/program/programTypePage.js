/**
 * @author Abdullah Umar Nasib
 * @since 02/03/2025
 */

import { CommonButtons } from '../../commonUtility/commonButtons.js';

export class ProgramTypePage {
  constructor(page) {
    this.page = page;
    this.commonButtons = new CommonButtons(page);
    this.txtProgramTypeName = page.locator('[name="name"]');
    this.rdoProgramTypeDay = page.getByLabel("Day", { exact: true });
    this.rdoProgramTypeResidential = page.getByLabel("Residential", { exact: true });
    this.rdoProgramTypeOther = page.getByLabel("Other", { exact: true });
  }

  async fillUpProgramTypeDetails(typeName, type) {
    const typeNameData = typeName?.trim();
    const typeData = type?.trim();
    const radioButton = this[`rdoProgramType${typeData}`];

    if (!typeNameData) {
      throw new Error("Program Type Name is required");
    }

    if (!radioButton || !["Day", "Residential", "Other"].includes(typeData)) {
      throw new Error("Invalid program type. Use 'Day', 'Residential', or 'Other'.");
    }

    await this.txtProgramTypeName.fill(typeNameData);
    await radioButton.check();
  }

  async createNewProgramType(data) {
    await this.commonButtons.clickButton("Create New Program Type");
    await this.fillUpProgramTypeDetails(data.programTypeName, data.programType);
    await this.commonButtons.clickButton('Save');
  }
};
