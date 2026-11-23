/**
 * @author Sheikh Faiyaz Mahamud
 * @since 25/05/25
*/

export class CustomPdfInvoice {

    constructor(page) {
        this.page = page
        this.txtPdfName = page.locator(`[name='pdfName']`);
        this.txtTitle = page.locator(`[name='pdfTitle']`);
        this.txtHeader = page.locator(`[name='pdfHeader']`);
        this.txtFooter = page.locator(`[name='pdfFooter']`);
        this.chkShowSignature = page.locator(`[name='signatureEnabled']`);
    }

    async fillUpCustomPdfInvoiceForm(pdfName, data) {
        await this.txtPdfName.fill(pdfName);
        await this.txtTitle.fill(data.title);
        await this.txtHeader.fill(data.header);
        await this.txtFooter.fill(data.footer);
    }

    async updateCustomPdfInvoiceForm(data) {
        await this.txtHeader.fill(data.updatedHeader);
        await this.txtFooter.fill(data.updatedFooter);
    }
}