"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Code2, FileCode, CheckCircle2, XCircle, Copy, Download, Sparkles, ExternalLink } from "lucide-react";

export default function ExecutionConsole({ logs, generatedPom, generatedSpec, executionResult, isRunning, onOpenReport }) {
  const [activeView, setActiveView] = useState("logs");
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Console Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <button
            onClick={() => setActiveView("logs")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition ${
              activeView === "logs"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>MCP Live Stream</span>
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveView("pom")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition ${
              activeView === "pom"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Synthesized POM ({generatedPom ? "Ready" : "Waiting"})</span>
          </button>

          <button
            onClick={() => setActiveView("spec")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition ${
              activeView === "spec"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>Playwright Spec</span>
          </button>
        </div>

        {/* Status / Actions */}
        <div className="flex items-center gap-2">
          {executionResult && (
            <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700">
              {executionResult.status === "passed" ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED ({executionResult.duration})
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> FAILED
                </span>
              )}
            </div>
          )}

          {activeView !== "logs" && (
            <button
              onClick={() => handleCopy(activeView === "pom" ? generatedPom : generatedSpec)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Copy Code"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {executionResult && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded bg-sky-600/80 hover:bg-sky-600 text-white transition shadow-sm"
            >
              <span>View Report</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Console Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-slate-950/95 leading-relaxed">
        {activeView === "logs" && (
          <div className="space-y-1 text-slate-300">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-16 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700" />
                <p>Playwright MCP Engine in Standby.</p>
                <p className="text-[11px] text-slate-600">
                  Select or input test cases above and click execute to trigger live UI inspection & zero-base synthesis.
                </p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 text-[10px] select-none pt-0.5">[{log.time}]</span>
                  <span
                    className={
                      log.type === "mcp"
                        ? "text-sky-400"
                        : log.type === "code"
                        ? "text-amber-400"
                        : log.type === "success"
                        ? "text-emerald-400 font-semibold"
                        : log.type === "error"
                        ? "text-rose-400 font-semibold"
                        : "text-slate-400"
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        )}

        {activeView === "pom" && (
          <pre className="text-amber-300 whitespace-pre font-mono text-[11.5px]">
            {generatedPom || "// No POM synthesized yet. Run a test case to trigger Playwright MCP live crawler."}
          </pre>
        )}

        {activeView === "spec" && (
          <pre className="text-purple-300 whitespace-pre font-mono text-[11.5px]">
            {generatedSpec || "// No Playwright spec generated yet. Run a test case to trigger synthesis."}
          </pre>
        )}
      </div>
    </div>
  );
}
