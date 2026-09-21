'use client';

import React, { useState } from 'react';

const DOC_SECTIONS = [
  { id: 'arch', title: '🏛 System Architecture', badge: 'GCP Design' },
  { id: 'roadmap', title: '🗺 Product Roadmap', badge: 'Living Vision' },
  { id: 'battlecards', title: '⚡️ Features & Battlecards', badge: 'SE Pitch' },
  { id: 'demo', title: '🎤 SE & AM Demo Scripts', badge: 'Sales Playbook' },
  { id: 'cost', title: '💵 Cost & Budget Guardrails', badge: '<$600 Ceiling' },
  { id: 'changelog', title: '📜 Changelog & Versioning', badge: 'SemVer' },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('arch');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🏛 Architecture & Living Documentation Explorer</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              In-App Viewer
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access system diagrams, sales battlecards, and demo scripts directly during client pitches.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Source: <span className="text-blue-400">/docs</span> in Git repository
        </div>
      </div>

      {/* Document Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {DOC_SECTIONS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{tab.title}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-800 text-slate-400'}`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'arch' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Cloud-Native Serverless Topology</span>
            </h2>

            {/* Visual Architecture Diagram Box */}
            <div className="bg-[#070a12] p-6 rounded-xl border border-slate-800 text-xs font-mono space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Edge */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-blue-400 font-bold">1. Edge & Security</div>
                  <div className="text-[11px] text-slate-400">Identity-Aware Proxy (IAP)</div>
                  <div className="text-[11px] text-slate-400">Google Cloud Model Armor</div>
                  <div className="text-[11px] text-slate-400">Security Command Center (SCCe)</div>
                </div>

                {/* Compute */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold">2. Serverless Compute</div>
                  <div className="text-[11px] text-slate-400">Cloud Run (Scale-to-Zero)</div>
                  <div className="text-[11px] text-slate-400">Next.js App & API Routes</div>
                  <div className="text-[11px] text-slate-400">SSE Real-Time Streamer</div>
                </div>

                {/* AI & Data */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-purple-400 font-bold">3. Vertex AI & Data</div>
                  <div className="text-[11px] text-slate-400">Gemini 2.0 Flash / 1.5 Pro</div>
                  <div className="text-[11px] text-slate-400">Claude 3.5 Sonnet (Vertex MaaS)</div>
                  <div className="text-[11px] text-slate-400">Cloud SQL (pgvector) + BigQuery</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Key Architectural Advantage:</strong> By decoupling compute via Cloud Run scale-to-zero, hosting costs drop to $0 when not actively demoing. Database costs are held under $15/month via Cloud SQL <code>db-f1-micro</code> and the automated off-hours pause script.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Model Arena Quarterly Roadmap</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Phase 1: Foundation (v1.0.0 - Current)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">COMPLETED</span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Model Arena, Model Armor Red-Team Lab, Cloud SQL pgvector integration, living documentation suite, and modular Terraform.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Phase 2: Enterprise Telemetry (v1.1.0 - Q4 2026)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">IN PROGRESS</span>
              </div>
              <p className="text-xs text-slate-400">
                BigQuery streaming ingestion pipeline, Looker Studio embedded executive report, and automated nightly Cloud SQL pause scheduler.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Phase 3: Autonomous Agents & Tool Security (v1.2.0 - Q1 2027)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">PLANNED</span>
              </div>
              <p className="text-xs text-slate-400">
                Vertex AI Agent Builder multi-turn workflows, Agent Gateway OpenAPI tool security filters, and direct SCCe event bus streaming.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Battlecards */}
      {activeTab === 'battlecards' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Startup Sales Engineering Battlecards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-blue-400">Gemini 2.0 Flash vs GPT-4o-mini</div>
              <p className="text-xs text-slate-300">
                33% lower input token cost ($0.10 vs $0.15) with sub-180ms Time-to-First-Token and 1M+ token context window.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Talking Point: "Dramatically cuts agentic loop costs."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-amber-400">Claude 3.5 Sonnet on Vertex AI</div>
              <p className="text-xs text-slate-300">
                Run Anthropic's flagship coding model without third-party API keys, within your GCP VPC-SC perimeter, counting toward your Google Cloud commitment.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Talking Point: "Single billing and unified security perimeter."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-red-400">Google Cloud Model Armor</div>
              <p className="text-xs text-slate-300">
                Managed security inspection adding &lt;25ms overhead. Defends against direct prompt injection, DAN jailbreaks, and PII leaks with zero GPU servers to maintain.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Talking Point: "Zero GPU management for enterprise guardrails."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-purple-400">Cloud SQL + pgvector</div>
              <p className="text-xs text-slate-300">
                Eliminate specialized vector databases. PostgreSQL 15 stores users, transactions, and embeddings in one ACID-compliant database.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Talking Point: "No data sync lag between database and vector store."</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Demo Script */}
      {activeTab === 'demo' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">5-Minute Executive Pitch Script</h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-blue-400">Minute 1 - The Multi-Model Dilemma:</strong>
              <p className="mt-1 text-slate-400">
                "Startups don't want vendor lock-in. You want the flexibility to use Gemini for massive context, Claude for code synthesis, and open models like Llama—all secured under one roof."
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400">Minute 2-3 - Live Stream & Cost Comparison:</strong>
              <p className="mt-1 text-slate-400">
                Run Gemini 2.0 Flash side-by-side with Claude 3.5 Sonnet. Point out the sub-150ms TTFT and live pricing ticker ($0.10/1M vs $3.00/1M).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-red-400">Minute 4-5 - Model Armor Security Lab:</strong>
              <p className="mt-1 text-slate-400">
                Toggle Model Armor OFF, run a prompt injection attack (it executes). Toggle Model Armor ON, run the same attack (immediate BLOCK in 20ms with risk score).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cost Optimization */}
      {activeTab === 'cost' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Cost Discipline (&lt; $600/Month Guarantee)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">Cloud Run Serverless</div>
              <div className="text-lg font-bold text-white mt-1">$0.00 Idle</div>
              <div className="text-slate-500 mt-1">Scale-to-zero (0-5 instances)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">Cloud SQL (db-f1-micro)</div>
              <div className="text-lg font-bold text-white mt-1">~$8 - $15/mo</div>
              <div className="text-slate-500 mt-1">Paused off-hours with script</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">Vertex AI Models</div>
              <div className="text-lg font-bold text-white mt-1">Pay-Per-Token</div>
              <div className="text-slate-500 mt-1">Only billed during live runs</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            ✓ Total expected monthly run rate: <strong>$75 – $190/month</strong> (leaving &gt; $400 safety buffer below the $600 ceiling).
          </div>
        </div>
      )}

      {/* Tab 6: Changelog */}
      {activeTab === 'changelog' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-lg font-bold text-white">Version History (SemVer)</h2>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-400">v1.0.0 - Initial Production Release</span>
              <span className="font-mono text-slate-500">2026-09-21</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Multi-Model Streaming Arena (Gemini 2.0 Flash, Gemini 1.5 Pro, Claude 3.5 Sonnet, Llama 3.3).</li>
              <li>Real-time TTFT and cost waterfall tickers.</li>
              <li>Interactive Model Armor Red-Team Lab with ON/OFF comparison.</li>
              <li>Cloud SQL pgvector RAG and semantic cache simulation.</li>
              <li>BigQuery telemetry dataset and live metric views.</li>
              <li>Modular Terraform infrastructure configuration.</li>
              <li>Complete living documentation suite in <code>/docs</code>.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
