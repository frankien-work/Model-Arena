'use client';

import React, { useState } from 'react';

const AGENT_TOOLS = [
  {
    name: 'execute_sql_query',
    label: '💾 Database Query Tool',
    category: 'SQL Execution',
    defaultParam: '{"query": "SELECT * FROM orders WHERE status = \'pending\' OR 1=1; DROP TABLE transactions; --"}',
    riskType: 'Adversarial SQL Injection & Data Destruction',
  },
  {
    name: 'admin_delete_account',
    label: '🗑️ Admin User Management Tool',
    category: 'Privileged Action',
    defaultParam: '{"user_id": "usr_superadmin", "reason": "Prompt-injected instruction"}',
    riskType: 'Privilege Escalation & Unauthorized Deletion',
  },
  {
    name: 'issue_customer_refund',
    label: '💸 Payment Gateway Tool',
    category: 'Financial Tool',
    defaultParam: '{"order_id": "ord_8819", "refund_amount": 99999.00, "currency": "USD"}',
    riskType: 'Financial Fraud & Unconstrained Tool Calling',
  },
];

export default function AgentGatewayPage() {
  const [selectedTool, setSelectedTool] = useState(AGENT_TOOLS[0]);
  const [paramInput, setParamInput] = useState(AGENT_TOOLS[0].defaultParam);
  const [gatewayEnabled, setGatewayEnabled] = useState(true);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectTool = (tool: typeof AGENT_TOOLS[0]) => {
    setSelectedTool(tool);
    setParamInput(tool.defaultParam);
    setExecutionResult(null);
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    try {
      let parsedParam = {};
      try {
        parsedParam = JSON.parse(paramInput);
      } catch {
        parsedParam = { raw: paramInput };
      }

      const res = await fetch('/api/agent-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: selectedTool.name,
          toolParameters: parsedParam,
          agentGatewayEnabled: gatewayEnabled,
        }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🤖 Agent Gateway & Tool Security Lab</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Autonomous Safety
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Intercept and validate autonomous agent tool calls, preventing SQL injection, unauthorized actions, and data exfiltration.
          </p>
        </div>

        {/* Big Gateway Toggle */}
        <button
          onClick={() => setGatewayEnabled(!gatewayEnabled)}
          className={`px-5 py-2.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all shadow-lg ${
            gatewayEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/10'
          }`}
        >
          <span>{gatewayEnabled ? '🛡️' : '⚠️'}</span>
          <span>Agent Gateway: {gatewayEnabled ? 'PROTECTED (ON)' : 'BYPASSED (OFF)'}</span>
        </button>
      </div>

      {/* Tool Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {AGENT_TOOLS.map(t => (
          <button
            key={t.name}
            onClick={() => handleSelectTool(t)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedTool.name === t.name
                ? 'bg-slate-800 border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 w-max mb-1">
              {t.category}
            </div>
            <div className="font-bold text-xs text-white">{t.label}</div>
            <div className="text-[10px] text-red-400/90 mt-1">Risk: {t.riskType}</div>
          </button>
        ))}
      </div>

      {/* Interactive Tool Calling Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tool Call Payload Editor */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              Agent Tool Call Payload ({selectedTool.name})
            </span>
            <span className="text-xs font-mono text-slate-500">JSON Schema</span>
          </div>

          <textarea
            value={paramInput}
            onChange={e => setParamInput(e.target.value)}
            rows={6}
            className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Gateway State: <strong className={gatewayEnabled ? 'text-emerald-400' : 'text-red-400'}>{gatewayEnabled ? 'Active Filtering' : 'Direct Execution'}</strong>
            </span>
            <button
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              {isExecuting ? 'Simulating Call...' : '⚡️ Dispatch Tool Call'}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Outcome */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white">Execution Result</span>
              {executionResult && (
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    executionResult.status === 'BLOCKED_BY_GATEWAY'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : executionResult.status === 'EXECUTED_UNSAFE'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {executionResult.status}
                </span>
              )}
            </div>

            <div className="mt-4">
              {executionResult ? (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                    executionResult.status === 'BLOCKED_BY_GATEWAY'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-950/20 border-red-500/30 text-red-200'
                  }`}
                >
                  {executionResult.message}
                  {executionResult.scceEvent && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[10px] text-slate-400">
                      Audit Finding Logged: <strong>{executionResult.scceEvent}</strong> ({executionResult.latencyMs}ms inspection)
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#070a12] border border-slate-800 text-xs font-mono text-slate-500 italic">
                  Click "Dispatch Tool Call" to observe how Agent Gateway protects backend databases and APIs from unauthorized tool calls.
                </div>
              )}
            </div>
          </div>

          {/* Technical Value Box */}
          <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <strong className="text-slate-200">How Google Cloud Agent Gateway Works:</strong>
            <p className="text-[11px]">
              Validates LLM-generated JSON tool parameters against OpenAPI contracts, sanitizes SQL statements, and enforces IAM least-privilege tokens before any backend request executes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
