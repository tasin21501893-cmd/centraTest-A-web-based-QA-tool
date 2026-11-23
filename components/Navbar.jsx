"use client";

import { Cpu, Terminal, FileSpreadsheet, GitPullRequest, ExternalLink, BarChart3, Sparkles } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, metrics }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 relative z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Centra<span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Test</span></span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-900/60 to-purple-900/60 text-sky-300 border border-sky-700/50 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> LangGraph State Machine • MCP Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Zero-Codebase Autonomous SDET • Live DOM Crawl • Auto POM & Spec Synthesis
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge & Report Link */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Total Run:</span>
              <span className="font-semibold text-slate-200">{metrics.total}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">{metrics.passed} Passed</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 font-semibold">{metrics.failed} Failed</span>
            </div>

            <a
              href="/api/report"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white transition shadow-sm shadow-sky-600/30 border border-sky-400/30"
            >
              <span>Monocart Report</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "bulk"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>1. Bulk XLSX Upload</span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "manual"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. Test Case Writing (Form)</span>
          </button>

          <button
            onClick={() => setActiveTab("pr")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "pr"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>3. PR Link & AI Suggestions</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "reports"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Auditing & Centralized Reports</span>
          </button>
        </div>
      </div>
    </header>
  );
}
