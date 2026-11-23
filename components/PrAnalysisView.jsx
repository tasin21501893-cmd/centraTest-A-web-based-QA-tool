"use client";

import { useState } from "react";
import { GitPullRequest, Sparkles, CheckSquare, Square, Play, GitCommit, AlertCircle, ExternalLink } from "lucide-react";

export default function PrAnalysisView({ onExecute, isRunning }) {
  const [prUrl, setPrUrl] = useState("https://github.com/org/billing-platform/pull/482");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedTests, setSuggestedTests] = useState([]);
  const [prSummary, setPrSummary] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyzePr = async (overrideUrl) => {
    const targetUrl = overrideUrl || prUrl;
    if (!targetUrl) return;
    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/analyze-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prUrl: targetUrl }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setPrSummary(data.summary);
      setSuggestedTests(data.testCases.map((tc) => ({ ...tc, selected: true })));
    } catch (err) {
      setError("Failed to analyze PR link: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPresetPr = (url) => {
    setPrUrl(url);
    handleAnalyzePr(url);
  };

  const toggleSelect = (idx) => {
    setSuggestedTests((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleRunSelected = () => {
    const selected = suggestedTests.filter((t) => t.selected);
    if (selected.length === 0) return;
    onExecute(selected, `PR #${prSummary?.prNumber || "101"} AI Suite (${prSummary?.detectedModule || "CoreModule"})`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-sky-400" />
              3. Pull Request (PR) Link & AI Test Case Synthesizer
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide any GitHub, GitLab, Bitbucket, or internal repository PR link. The AI extracts changed files, detects affected modules, and synthesizes complete functional test coverage (Positive, Negative, Boundary, Role-Based).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() => loadPresetPr("https://github.com/org/billing-claims/pull/482")}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sky-300 border border-slate-600 transition"
            >
              Billing PR (#482)
            </button>
            <button
              type="button"
              onClick={() => loadPresetPr("https://github.com/org/demographics-ehr/pull/731")}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-cyan-300 border border-slate-600 transition"
            >
              Demographics PR (#731)
            </button>
            <button
              type="button"
              onClick={() => loadPresetPr("https://github.com/org/casenote-service/pull/105")}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-teal-300 border border-slate-600 transition"
            >
              Case Note PR (#105)
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="e.g. https://github.com/org/billing-claims/pull/482"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-24 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500 uppercase">
              Git Diff
            </span>
          </div>

          <button
            onClick={() => handleAnalyzePr()}
            disabled={isAnalyzing || isRunning}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition shadow-md shadow-sky-600/30 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Inspecting PR Changes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze PR & Suggest Tests</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {prSummary && (
          <div className="p-3.5 rounded-lg bg-sky-950/40 border border-sky-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-300">
              <GitCommit className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>
                <strong>PR #{prSummary.prNumber}:</strong> {prSummary.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="text-sky-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Module: {prSummary.detectedModule}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">+{prSummary.additions} lines</span>
              <span>•</span>
              <span className="text-rose-400 font-mono">-{prSummary.deletions} lines</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{prSummary.changedFiles} files affected</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Test Cases */}
      {suggestedTests.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>AI-Synthesized Functional Test Cases for {prSummary?.detectedModule}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-normal">
                  Full Coverage
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Select test cases to automate from scratch using LangGraph and Playwright MCP.
              </p>
            </div>

            <button
              onClick={handleRunSelected}
              disabled={isRunning || suggestedTests.filter((t) => t.selected).length === 0}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>LangGraph Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    Execute Selected ({suggestedTests.filter((t) => t.selected).length}) via LangGraph
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {suggestedTests.map((tc, idx) => (
              <div
                key={idx}
                onClick={() => toggleSelect(idx)}
                className={`p-3.5 rounded-lg border transition cursor-pointer flex items-start gap-3 ${
                  tc.selected
                    ? "bg-slate-900/90 border-sky-500/50 shadow-sm shadow-sky-500/10"
                    : "bg-slate-900/40 border-slate-700/50 opacity-60 hover:opacity-100"
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-sky-400 hover:text-sky-300 focus:outline-none"
                >
                  {tc.selected ? (
                    <CheckSquare className="w-4 h-4 fill-sky-500/20" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-sky-400">{tc.id}</span>
                    <span className="text-xs font-semibold text-slate-100">{tc.title}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.2 rounded border ${
                        tc.category === "Positive"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                          : tc.category === "Negative"
                          ? "bg-rose-950/60 text-rose-300 border-rose-800/60"
                          : "bg-amber-950/60 text-amber-300 border-amber-800/60"
                      }`}
                    >
                      {tc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.2 rounded border border-slate-700">
                      Module: {tc.module}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono text-[11px] leading-relaxed pt-1">
                    <strong>Steps:</strong> {tc.steps}
                  </p>

                  <p className="text-xs text-emerald-400/90 text-[11px]">
                    <strong>Expected:</strong> {tc.expected}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
