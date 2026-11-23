/**
 * @author Shahil Azmayish
 * @since 02/17/2026
 */

export class GaIddsCommunicationPage {
	constructor(page) {
		this.page = page;
		this.#initLocators(page);
	}

	async fillupCommunication(data) {
		data.preferToUseOtherLanguage && await this.ddlPreferToUseOtherLanguage.selectOption(data.preferToUseOtherLanguage);
		data.otherPreferredLanguage && await this.ddlOtherPreferredLanguage.selectOption(data.otherPreferredLanguage);
		data.preferredCommunicationMode && await this.ddlPreferredCommunicationMode.selectOption(data.preferredCommunicationMode);
		data.difficultyInHearing && await this.ddlDifficultyInHearing.selectOption(data.difficultyInHearing);
		data.difficultyInVision && await this.ddlDifficultyInVision.selectOption(data.difficultyInVision);
	}

	#initLocators(page) {
		this.ddlPreferToUseOtherLanguage = page.locator('#gaApplication\\.individualCommunication\\.preferToUseOtherLanguage');
		this.ddlOtherPreferredLanguage = page.locator('#gaApplication\\.individualCommunication\\.otherPreferredLanguage');
		this.ddlPreferredCommunicationMode = page.locator('#gaApplication\\.individualCommunication\\.preferredCommunicationMode');
		this.ddlDifficultyInHearing = page.locator('#gaApplication\\.individualMedicalInfo\\.difficultyInHearing');
		this.ddlDifficultyInVision = page.locator('#gaApplication\\.individualMedicalInfo\\.difficultyInVision');
	}
}
