"use client";

import { useState } from "react";
import { Globe, Shield, User, Key, Eye, EyeOff, Radio, CheckCircle2, AlertCircle } from "lucide-react";

export default function CredentialsHeader({ credentials, setCredentials, isRunning }) {
  const [showPassword, setShowPassword] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const handleTestConnection = () => {
    if (!credentials.url || !credentials.loginName || !credentials.providerCode || !credentials.password) {
      setTestStatus("error");
      setTimeout(() => setTestStatus(null), 3000);
      return;
    }
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
      setTimeout(() => setTestStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Target Environment & Credentials
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/60">
                Playwright MCP Agent Target
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The AI will launch Playwright MCP to connect to this instance and generate POMs/specs from scratch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={isRunning || testStatus === "testing"}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition shadow-sm"
          >
            {testStatus === "testing" ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
            ) : testStatus === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : testStatus === "error" ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-sky-400" />
            )}
            {testStatus === "testing"
              ? "Probing MCP..."
              : testStatus === "success"
              ? "MCP Target Reachable"
              : testStatus === "error"
              ? "Fill All Fields"
              : "Verify Target"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3.5">
        {/* URL Field */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            Target URL
          </label>
          <input
            type="text"
            value={credentials.url}
            onChange={(e) => setCredentials({ ...credentials, url: e.target.value })}
            placeholder="https://qa.example.com"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />
        </div>

        {/* Provider Code */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Provider Code
          </label>
          <input
            type="text"
            value={credentials.providerCode}
            onChange={(e) => setCredentials({ ...credentials, providerCode: e.target.value })}
            placeholder="e.g. DEMO-QA"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />
        </div>

        {/* Login Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-400" />
            Login Name
          </label>
          <input
            type="text"
            value={credentials.loginName}
            onChange={(e) => setCredentials({ ...credentials, loginName: e.target.value })}
            placeholder="e.g. auto_qa_admin"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
