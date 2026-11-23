/**
 * @author Maksuda Islam (Lima)
 * @since 04/03/2025
 */

async function extractTableData(page) {
    let valueMap = {};
    let valueLabelMap = {};

    const tables = await page.$$('table.table.table-bordered.table-striped');

    for (let table of tables) {
        const rows = await table.$$('tbody tr');
        for (let row of rows) {
            const nameCell = await row.$('td:nth-child(2)');
            const valueCell = await row.$('td:nth-child(3)');
            const valueLabelCell = await row.$('td:nth-child(4)');

            if (nameCell && valueCell) {
                const name = (await nameCell.innerText()).trim();
                const value = (await valueCell.innerText()).trim();
                const valueLabel = valueLabelCell ? (await valueLabelCell.innerText()).trim() : "";

                valueMap[name] = value;
                valueLabelMap[name] = valueLabel;
            }
        }
    }
    return { valueMap, valueLabelMap };
}

export { extractTableData };