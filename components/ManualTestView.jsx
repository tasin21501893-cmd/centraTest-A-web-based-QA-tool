"use client";

import { useState } from "react";
import { Terminal, Play, Sparkles, BookOpen, Wand2 } from "lucide-react";

export default function ManualTestView({ onExecute, isRunning }) {
  const [form, setForm] = useState({
    id: "TC-MANUAL-001",
    module: "Immunization",
    title: "Verify COVID-19 Vaccine Entry with Mandatory Batch Number",
    preconditions: "User is logged in with Provider Code and possesses Nurse/Medical role permissions.",
    steps: "1. Navigate to Health tab on the application dashboard.\n2. Click on 'Immunization' -> 'New' link.\n3. Search and select Individual 'Alex Smith'.\n4. Under Vaccine Details, select 'COVID-19' from vaccine dropdown.\n5. Fill 'Given Date' with today's date.\n6. Enter Manufacturer 'Pfizer' and Lot Number 'PF-2026-99'.\n7. Click the 'Save' button.",
    expected: "Form successfully submits. Green confirmation banner displayed: 'Immunization Record Successfully Created'."
  });

  const loadPreset = (presetType) => {
    if (presetType === "immunization") {
      setForm({
        id: "TC-IMM-002",
        module: "Health Tracking - Immunization",
        title: "Record Influenza Vaccine with Adverse Reaction Flag",
        preconditions: "Individual has an active profile in the current provider account.",
        steps: "1. Navigate to Health -> Immunization.\n2. Click 'New' action.\n3. Select Individual 'David Warner'.\n4. Select Vaccine 'Influenza, injectable'.\n5. Check 'Adverse Reaction Observed' checkbox.\n6. Fill Adverse Description 'Mild rash on left arm'.\n7. Click 'Save' button.",
        expected: "Record saved with Adverse Reaction tag flagged in red."
      });
    } else if (presetType === "demographic") {
      setForm({
        id: "TC-DEMO-005",
        module: "Individual Demographic",
        title: "Update Residential Address and Verify Audit History",
        preconditions: "Individual profile exists with verified Social Security Number.",
        steps: "1. Open Individual module.\n2. Search Individual 'Jane Doe'.\n3. Click 'Edit Demographics'.\n4. Modify Street Address to '742 Evergreen Terrace'.\n5. Click 'Submit Update'.",
        expected: "Address reflects '742 Evergreen Terrace' and audit entry is appended with current timestamp."
      });
    } else {
      setForm({
        id: "TC-BILL-009",
        module: "Billing - Claim Generation",
        title: "Submit Institutional 837P Claim and Verify Billing Code",
        preconditions: "Service authorization approved for current fiscal quarter.",
        steps: "1. Open Billing module.\n2. Click 'Create Claim'.\n3. Choose Service Code 'T1019 - Personal Care'.\n4. Select Provider Location 'Main Clinic'.\n5. Click 'Generate Claim'.",
        expected: "Claim status shifts to 'Ready for Batch Export' without EDI syntax errors."
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecute([form], "Manual Test Case Authoring");
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            2. Manual Test Case Authoring & Live Synthesis
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Write or paste functional test steps in plain English. The Playwright MCP Agent logs in, explores the screen, generates POM elements following <code className="text-sky-300">btn*</code>, <code className="text-sky-300">txt*</code>, <code className="text-sky-300">ddl*</code> standards, creates the test spec, and runs it.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset("immunization")}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sky-300 border border-slate-600 transition"
          >
            Immunization
          </button>
          <button
            type="button"
            onClick={() => loadPreset("demographic")}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-cyan-300 border border-slate-600 transition"
          >
            Demographics
          </button>
          <button
            type="button"
            onClick={() => loadPreset("billing")}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-teal-300 border border-slate-600 transition"
          >
            Billing
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Test Case ID
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-sky-400 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Module / Screen Name
            </label>
            <input
              type="text"
              value={form.module}
              onChange={(e) => setForm({ ...form, module: e.target.value })}
              placeholder="e.g. Immunization, Demographics, Billing"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Test Case Title / Objective
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Verify record creation with valid inputs"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Preconditions (Optional)
          </label>
          <input
            type="text"
            value={form.preconditions}
            onChange={(e) => setForm({ ...form, preconditions: e.target.value })}
            placeholder="e.g. User logged in with Medical Admin role"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span>Step-by-Step Instructions</span>
            <span className="text-[11px] text-slate-500 font-normal">One action per line</span>
          </label>
          <textarea
            rows={5}
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            placeholder="1. Click on Module link...&#10;2. Enter value in field...&#10;3. Click Save button..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Expected Results / Assertions
          </label>
          <textarea
            rows={2}
            value={form.expected}
            onChange={(e) => setForm({ ...form, expected: e.target.value })}
            placeholder="e.g. Success banner 'Record Saved' is visible and status is 'Approved'"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isRunning}
            className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Playwright MCP Crawling UI & Running...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Launch MCP: Crawl Screen, Build POM & Run</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
