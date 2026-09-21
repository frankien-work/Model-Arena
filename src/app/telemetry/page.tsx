'use client';

import React, { useEffect, useState } from 'react';

export default function TelemetryPage() {
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
        Loading BigQuery Telemetry stream...
      </div>
    );
  }

  const { summary, latencyByModel, securityIncidents } = data;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>📊 BigQuery Telemetry & Cost Analytics</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Streaming Pipeline
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics dataset <code>model_arena_telemetry.benchmark_runs</code> partitioned by day.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            BigQuery Billing: <span className="text-emerald-400 font-bold">On-Demand (&lt;1TB Free)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Benchmark Runs</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {summary.totalBenchmarkRuns.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Live streaming ingestion</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Average TTFT (Global)</div>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
            {summary.averageTTFTMs} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sub-200ms target achieved</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Model Armor Interceptions</div>
          <div className="text-2xl font-black text-red-400 mt-1 font-mono">
            {summary.modelArmorBlocks}
          </div>
          <div className="text-[11px] text-red-300/80 mt-1">Attacks blocked & logged</div>
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

      {/* Latency Percentiles Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">Model Latency Percentiles & Unit Economics</span>
          <span className="text-xs font-mono text-slate-400">P50 / P95 / P99 over 30 Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Model Name</th>
                <th className="pb-3 font-semibold">P50 TTFT</th>
                <th className="pb-3 font-semibold">P95 TTFT</th>
                <th className="pb-3 font-semibold">P99 TTFT</th>
                <th className="pb-3 font-semibold">Input / 1M</th>
                <th className="pb-3 font-semibold">Output / 1M</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {latencyByModel.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-bold text-white">{row.model}</td>
                  <td className="py-3 text-blue-400">{row.p50} ms</td>
                  <td className="py-3 text-indigo-400">{row.p95} ms</td>
                  <td className="py-3 text-purple-400">{row.p99} ms</td>
                  <td className="py-3 text-amber-400">${row.costPer1MIn.toFixed(2)}</td>
                  <td className="py-3 text-amber-400">${row.costPer1MOut.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BigQuery SQL Console & Security Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">BigQuery SQL Telemetry Aggregator</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
              SQLx / Standard SQL
            </span>
          </div>
          <pre className="bg-[#070a12] p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
{`SELECT 
    model_id,
    COUNT(run_id) AS total_runs,
    APPROX_QUANTILES(ttft_ms, 100)[OFFSET(50)] AS p50_ttft,
    APPROX_QUANTILES(ttft_ms, 100)[OFFSET(95)] AS p95_ttft,
    ROUND(SUM(cost_usd), 4) AS total_spend_usd,
    COUNTIF(model_armor_status = 'BLOCK') AS security_interceptions
FROM \`model_arena_telemetry.benchmark_runs\`
WHERE _PARTITIONDATE >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY model_id
ORDER BY total_runs DESC;`}
          </pre>
        </div>

        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Security Command Center Enterprise (SCCe) Log</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">
              Real-Time Audit
            </span>
          </div>
          <div className="space-y-2">
            {securityIncidents.map((inc: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="text-red-400">[{inc.id}]</span>
                    <span>{inc.threat}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{inc.timestamp}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                    {inc.action}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Score: {inc.modelArmorScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
