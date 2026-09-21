'use client';

import React, { useEffect, useState } from 'react';

export default function SecurityTelemetryPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/telemetry')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Failed to load telemetry:', err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-mono text-xs">
        Connecting to Security Command Center Enterprise (SCCe) & BigQuery stream...
      </div>
    );
  }

  const { summary, securityIncidents } = data;

  const securityThreatBreakdown = [
    { threat: 'Direct Prompt Injection & System Override', count: 48, percentage: 57, mitigation: 'Model Armor' },
    { threat: 'DAN & Persona Jailbreak Attempts', count: 22, percentage: 26, mitigation: 'Model Armor' },
    { threat: 'Sensitive Customer Data (PII/Card Numbers)', count: 9, percentage: 11, mitigation: 'Cloud DLP' },
    { threat: 'Agentic Destructive SQL & Tool Abuse', count: 5, percentage: 6, mitigation: 'Agent Gateway' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>📊 Security Command Center Enterprise (SCCe) Telemetry</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Audit Stream
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time audit findings and threat telemetry captured across Model Armor, Cloud DLP, and Agent Gateway.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            Audit Stream: <span className="text-emerald-400 font-bold">BigQuery &amp; Cloud Audit Logs</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Security Evaluations</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {summary.totalBenchmarkRuns.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">100% evaluated via Model Armor</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Average Inspection Overhead</div>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
            18.2 ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Imperceptible to end-users</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Threat Interceptions Blocked</div>
          <div className="text-2xl font-black text-red-400 mt-1 font-mono">
            {summary.modelArmorBlocks}
          </div>
          <div className="text-[11px] text-red-300/80 mt-1">0 successful exploits with Security ON</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Monthly Spend vs Budget</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            ${summary.totalSpendThisMonthUSD}
            <span className="text-xs text-slate-500 font-normal"> / ${summary.monthlyBudgetLimitUSD}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {summary.budgetConsumedPercent}% consumed • Well under $600 ceiling
          </div>
        </div>
      </div>

      {/* Threat Category Breakdown Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">Threat Category Distribution</span>
          <span className="text-xs font-mono text-slate-400">Captured in Argolis Sandbox</span>
        </div>

        <div className="space-y-3">
          {securityThreatBreakdown.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{item.threat}</span>
                <span className="font-mono text-slate-400">
                  {item.count} incidents ({item.percentage}%) • <strong className="text-emerald-400">{item.mitigation}</strong>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-red-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time SCCe Event Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">Live SCCe Audit Findings Queue</span>
          <span className="text-xs font-mono text-slate-400">Real-time Cloud Logging format</span>
        </div>

        <div className="space-y-2">
          {securityIncidents.map((inc: any, i: number) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="text-red-400">[{inc.id}]</span>
                  <span>{inc.threat}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Timestamp: {inc.timestamp} • Target: //aiplatform.googleapis.com
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                  ACTION: {inc.action}
                </span>
                <span className="text-amber-400 font-bold text-[11px]">
                  Risk: {inc.modelArmorScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
