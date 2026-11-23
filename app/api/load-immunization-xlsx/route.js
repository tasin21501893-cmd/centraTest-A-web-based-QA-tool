import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const filePath = path.resolve(
      process.cwd(),
      "../resources/healthTracking/immunization/immunization.xlsx"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found at " + filePath }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const wb = XLSX.read(fileBuffer, { type: "buffer" });

    const allSheetsData = {};
    wb.SheetNames.forEach((sheetName) => {
      allSheetsData[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName] || {});
    });

    const functionalFlow = allSheetsData["functionalFlow"] || [];
    const vaccine = allSheetsData["vaccine"] || [];

    const defaultTestCases = [
      ...functionalFlow.map((row, idx) => ({
        id: `TC-FUNC-0${idx + 1}`,
        module: row["Module"] || row["module"] || row["Screen"] || row["screen"] || "functionalFlow",
        title: row["testCaseName"] || `Functional Flow #${idx + 1}`,
        steps: idx === 0 
          ? `1. Navigate to Health -> Immunization -> New.\n2. Select Individual '${row["individual"]}'.\n3. Click Display PDF link.\n4. Trigger PDF download and verify valid magic header (%PDF-) and file size.`
          : `1. Navigate to Health -> Immunization -> New.\n2. Select Individual '${row["individual"]}' and Notification Level '${row["notificationLevel"]}'.\n3. Fill Vaccine '${row["vaccine"]}', Date '${row["date"]}', Lot '${row["lot"]}'.\n4. Click Continue -> Submit.\n5. Capture Form ID from Done Page.\n6. Navigate to Health -> Immunization -> Search.\n7. Query Form ID and assert record in results grid.`,
        expected: idx === 0 
          ? "PDF downloaded successfully with valid .pdf extension and non-empty byte stream."
          : `Form submitted with expected message '${row["expectedMessage"]}' and retrieved via Searcher.`,
        category: "Functional Flow",
        rawData: row,
      })),
      ...vaccine.map((row, idx) => ({
        id: `TC-VAC-0${idx + 1}`,
        module: row["Module"] || row["module"] || row["Screen"] || row["screen"] || "vaccine",
        title: row["testCaseName"] || "Admin Vaccine Creation & Form Dropdown Verification",
        steps: `1. Authenticate with Therap Admin Provider Code '${row["providerCode"]}' (User: '${row["loginName"]}').\n2. Navigate to Therap Admin -> Vaccine -> New.\n3. Input unique Vaccine Name '${row["vaccineName"]}', CVX '${row["cvxCode"]}', Status '${row["status"]}'.\n4. Submit and verify confirmation.\n5. Re-authenticate with Provider Code 'SQA-TH' (User: 'ifty-u1').\n6. Navigate to Immunization New -> Select Individual '${row["individual"]}'.\n7. Verify newly created vaccine is populated in Vaccine dropdown.`,
        expected: "Admin created vaccine successfully appears in user's live Immunization dropdown options.",
        category: "Admin & Dropdown Integration",
        rawData: row,
      })),
    ];

    return NextResponse.json({
      fileName: "immunization.xlsx",
      sheets: wb.SheetNames,
      sheetsData: allSheetsData,
      testCases: defaultTestCases,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
