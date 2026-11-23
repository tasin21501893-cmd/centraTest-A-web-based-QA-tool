"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, FileCheck, Play, Sparkles, Download, Layers, FileSpreadsheet } from "lucide-react";

export default function BulkUploadView({ onExecute, isRunning }) {
  const [testCases, setTestCases] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [availableSheets, setAvailableSheets] = useState([]);
  const [currentSheet, setCurrentSheet] = useState("");
  const [workbook, setWorkbook] = useState(null);
  const [apiSheetsData, setApiSheetsData] = useState(null);

  const formatRows = (rows, sheetName) => {
    if (!rows || rows.length === 0) return [];
    return rows.map((row, idx) => {
      // Find key matching case-insensitively
      const findKey = (candidates) => {
        for (const c of candidates) {
          const found = Object.keys(row).find((k) => k.toLowerCase().trim() === c.toLowerCase().trim());
          if (found && row[found] !== undefined && row[found] !== null && String(row[found]).trim() !== "") {
            return String(row[found]).trim();
          }
        }
        return null;
      };

      const id =
        findKey(["testCaseNumber", "test_case_number", "test id", "tc id", "case id", "id", "sl", "no", "testcaseid"]) ||
        `TC-${sheetName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "SHEET"}-${idx + 1}`;

      const title =
        findKey(["testCaseName", "test_case_name", "title", "test title", "test case name", "summary", "scenario", "test scenario", "description", "test description", "objective"]) ||
        `Test Case #${idx + 1}`;

      const formatSheetName = (name) => {
        if (!name) return "Custom Module";
        return name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      };

      const module =
        findKey(["module", "module name", "screen", "screen name", "feature", "feature name", "form", "form name", "category", "section"]) ||
        formatSheetName(sheetName);

      let steps = findKey(["steps", "test steps", "actions", "action", "procedure", "test procedure", "step details", "instructions", "test instructions"]);

      if (!steps) {
        const parts = [];
        Object.entries(row).forEach(([k, v]) => {
          const l = k.toLowerCase().trim();
          if (
            !["id", "sl", "no", "title", "testcasenumber", "testcasename", "module", "expected", "expectedmessage", "status"].includes(l) &&
            v !== null &&
            v !== undefined &&
            String(v).trim() !== ""
          ) {
            parts.push(`Set ${k} to '${String(v).trim()}'.`);
          }
        });
        if (parts.length > 0) {
          parts.push("Click Save button.");
          steps = parts.join(" ");
        } else {
          steps = "1. Navigate to target module. 2. Verify form inputs. 3. Click Save button.";
        }
      }

      const expected =
        findKey(["expectedMessage", "expectedValidationMessage", "expected result", "expected", "expected output", "expected outcome", "acceptance criteria", "verification", "expectedFileName"]) ||
        "Form successfully submitted and verified.";

      return {
        id,
        module,
        title,
        steps,
        expected,
        status: "Pending",
        sheet: sheetName,
        rawData: row,
      };
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb);
        setAvailableSheets(wb.SheetNames);

        // Pick preferred sheet (or first sheet with data)
        const preferred = wb.SheetNames.find(
          (s) =>
            s.toLowerCase().includes("flow") ||
            s.toLowerCase().includes("test") ||
            s.toLowerCase().includes("vaccine") ||
            s.toLowerCase().includes("case")
        ) || wb.SheetNames[0];

        setCurrentSheet(preferred);
        const ws = wb.Sheets[preferred];
        const rows = ws ? XLSX.utils.sheet_to_json(ws) : [];
        const parsed = formatRows(rows, preferred);
        setTestCases(parsed);
      } catch (err) {
        setError("Failed to parse Excel file: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSheetChange = (sheetName) => {
    setCurrentSheet(sheetName);
    if (workbook) {
      const ws = workbook.Sheets[sheetName];
      const data = ws ? XLSX.utils.sheet_to_json(ws) : [];
      setTestCases(formatRows(data, sheetName));
    } else if (apiSheetsData && apiSheetsData[sheetName]) {
      setTestCases(formatRows(apiSheetsData[sheetName], sheetName));
    }
  };

  const handleLoadImmunizationXlsx = async () => {
    try {
      setError("");
      const res = await fetch("/api/load-immunization-xlsx");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setFileName("resources/healthTracking/immunization/immunization.xlsx");
      setAvailableSheets(data.sheets || ["functionalFlow", "vaccine"]);
      setApiSheetsData(data.sheetsData || null);
      setCurrentSheet("functionalFlow + vaccine");
      setTestCases(data.testCases);
    } catch (err) {
      setError("Failed to load immunization.xlsx: " + err.message);
    }
  };

  const loadSampleExcel = () => {
    const sampleData = [
      {
        id: "TC-IMM-001",
        module: "Immunization",
        title: "Create New Immunization Record for Individual",
        steps: "1. Click Health link. 2. Click Immunization New link. 3. Select Individual. 4. Select Vaccine 'COVID-19'. 5. Fill Given Date with today. 6. Click Save button.",
        expected: "Immunization record is created with 'Approved' status message.",
        status: "Pending",
      },
      {
        id: "TC-DEMO-002",
        module: "Individual Demographics",
        title: "Verify Mandatory Validation on Empty First Name",
        steps: "1. Click Individual link. 2. Click New Individual. 3. Leave First Name empty. 4. Enter Last Name 'Doe'. 5. Click Save.",
        expected: "Validation error banner: 'First Name is required'. Form is not submitted.",
        status: "Pending",
      },
      {
        id: "TC-BILL-003",
        module: "Billing Claim",
        title: "Generate Institutional Billing Claim Search",
        steps: "1. Click Billing link. 2. Select Claim Search. 3. Set Date Range to current month. 4. Click Search.",
        expected: "Claim list grid populates with matching claims table.",
        status: "Pending",
      },
    ];
    setFileName("Sample_Test_Suite.xlsx");
    setAvailableSheets(["GeneralSuite"]);
    setCurrentSheet("GeneralSuite");
    setTestCases(sampleData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-400" />
              1. Bulk XLSX Test Case Ingestion
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload any spreadsheet (.xlsx, .xls, .csv). You can select specific sheets, inspect parsed test cases, and launch LangGraph + Playwright MCP to crawl the live UI and execute in headless mode.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadImmunizationXlsx}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-md shadow-sky-600/30 transition border border-sky-400/30"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Load immunization.xlsx (resources)
            </button>
            <button
              onClick={loadSampleExcel}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sky-300 border border-slate-600 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Load Generic Sample
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mt-4">
          <label className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition group">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-sky-500/20 flex items-center justify-center text-slate-400 group-hover:text-sky-400 transition mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              {fileName ? fileName : "Click to select or drag and drop your .xlsx test case sheet"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports multi-sheet workbooks, custom column names, and automated step normalization.
            </p>
          </label>
        </div>

        {/* Sheet Selector (If multi-sheet) */}
        {availableSheets.length > 1 && (
          <div className="mt-4 p-3 bg-slate-900/80 border border-slate-700/60 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              Select Active Sheet:
            </span>
            <div className="flex flex-wrap gap-2">
              {availableSheets.map((sheet) => (
                <button
                  key={sheet}
                  type="button"
                  onClick={() => handleSheetChange(sheet)}
                  className={`text-xs px-3 py-1 rounded-md font-mono transition ${
                    currentSheet === sheet
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/50 font-semibold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  }`}
                >
                  {sheet}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Test Cases Table Preview */}
      {testCases.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Parsed Test Cases ({testCases.length} records in {currentSheet || "Sheet"})
              </h4>
            </div>

            <button
              onClick={() => onExecute(testCases, `Bulk XLSX Suite (${fileName || "Uploaded"})`)}
              disabled={isRunning}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>LangGraph Engine Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute via LangGraph ({testCases.length} Tests)</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700/60 max-h-96">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Test ID</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Title / Scenario</th>
                  <th className="py-2.5 px-3">Normalized Actions</th>
                  <th className="py-2.5 px-3">Expected Result</th>
                  <th className="py-2.5 px-3">Synthesis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {testCases.map((tc, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono text-sky-400 font-medium whitespace-nowrap">{tc.id}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                        {tc.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-100">{tc.title}</td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={tc.steps}>
                      {tc.steps}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={tc.expected}>
                      {tc.expected}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                        <Sparkles className="w-2.5 h-2.5" /> Scratch POM
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
