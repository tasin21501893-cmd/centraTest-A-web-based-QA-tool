/**
 * @author Nadia Motalib Laboni
 * @since 07/21/2025
 */

exports.GerResolutionLink = class GerResolutionLink {
    constructor(page) {
        this.page = page;
    }

    async navigateNewGerrURL(baseURL, data) {
        const params = new URLSearchParams();
        params.set('gerFormId', data.gerFormId);

        const url = `${baseURL}?${params.toString()}`;
        await this.page.goto(url);
    }
}