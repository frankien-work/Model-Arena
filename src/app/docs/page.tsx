'use client';

import React, { useState } from 'react';

const DOC_SECTIONS = [
  { id: 'arch', title: '🏛 Security Architecture', badge: 'Defense-in-Depth' },
  { id: 'battlecards', title: '⚡️ SE Battlecards', badge: 'Competitive Edge' },
  { id: 'script', title: '🎤 5-Min Security Pitch', badge: 'Customer Playbook' },
  { id: 'layers', title: '🛡️ 4 Defense Layers', badge: 'Technical Specs' },
  { id: 'cost', title: '💵 Cost & Budget Guardrail', badge: '<$600 Ceiling' },
];

export default function SecurityDocsPage() {
  const [activeTab, setActiveTab] = useState('arch');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🏛 AI Security Architecture & SE Battlecards</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Field Playbook
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Technical diagrams, sales engineering battlecards, and 5-minute customer pitch scripts.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Source: <span className="text-blue-400">/docs</span> in Git repository
        </div>
      </div>

      {/* Navigation Tabs */}
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

      {/* Tab 1: Security Architecture */}
      {activeTab === 'arch' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Google Cloud Defense-in-Depth Pipeline</span>
          </h2>

          <div className="bg-[#070a12] p-5 rounded-xl border border-slate-800 text-xs font-mono space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/30 space-y-1">
                <div className="text-blue-400 font-bold">1. Edge & Input</div>
                <div className="text-[11px] text-slate-400">Cloud Armor WAF</div>
                <div className="text-[11px] text-emerald-400 font-semibold">Model Armor Pre-Filter</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 space-y-1">
                <div className="text-purple-400 font-bold">2. Data Inspection</div>
                <div className="text-[11px] text-slate-400">Cloud DLP PII Masking</div>
                <div className="text-[11px] text-slate-400">VPC Service Controls</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-400 font-bold">3. Execution & Model</div>
                <div className="text-[11px] text-slate-400">Vertex AI Models</div>
                <div className="text-[11px] text-amber-400 font-semibold">Agent Gateway Tool Guard</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
                <div className="text-red-400 font-bold">4. SecOps & Audit</div>
                <div className="text-[11px] text-slate-400">Security Command Center (SCCe)</div>
                <div className="text-[11px] text-slate-400">BigQuery Telemetry</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong>Why This Wins Deals:</strong> Instead of asking startups to stitch together open-source guardrail libraries (like LlamaGuard) that require expensive GPU instances, Google Cloud provides a fully managed, serverless AI defense perimeter with sub-20ms latency and native enterprise SecOps reporting.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: SE Battlecards */}
      {activeTab === 'battlecards' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Startup Sales Engineering Battlecards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-blue-400">Model Armor vs DIY Open Source (LlamaGuard)</div>
              <p className="text-xs text-slate-300">
                LlamaGuard requires provisioning and paying for dedicated GPUs 24/7 (~$500+/mo) and adds 200–400ms latency. Model Armor is 100% serverless, scales to zero, costs fractions of a cent per inspection, and adds &lt;20ms overhead.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Pitch: "Zero GPUs to manage, 10x lower latency."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-amber-400">Protecting Third-Party Models (Claude Sonnet 5 & Llama)</div>
              <p className="text-xs text-slate-300">
                Startups using Anthropic Claude or Meta Llama can run them on Google Cloud Vertex AI and wrap them in Model Armor + Cloud DLP. This provides an enterprise security perimeter that is impossible when using direct API keys to third-party endpoints.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Pitch: "Use Claude or Llama with Google's enterprise guardrails."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-emerald-400">Agent Gateway vs Unrestricted Tool Calling</div>
              <p className="text-xs text-slate-300">
                Autonomous agents are vulnerable to prompt injections that trick them into executing destructive SQL (`DROP TABLE`) or unauthorized financial refunds. Agent Gateway intercepts tool calls at the proxy layer, enforcing OpenAPI schema and IAM policies.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Pitch: "Eliminate the fear of autonomous agent data loss."</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-red-400">Security Command Center Enterprise (SCCe) Audit</div>
              <p className="text-xs text-slate-300">
                Point solutions don't connect to enterprise compliance. Model Armor and Agent Gateway stream every blocked threat directly into SCCe, giving startups instant SOC2 and HIPAA audit trails.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">SE Pitch: "Instant SOC2 & HIPAA audit trail out of the box."</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 5-Minute Pitch Script */}
      {activeTab === 'script' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-lg font-bold text-white">5-Minute Live Customer Demo Script</h2>

          <div className="space-y-3 text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-blue-400 text-sm">Minute 1: The AI Security Reality Check</div>
              <p className="mt-1 text-slate-400">
                "Every startup building on LLMs faces the same terrifying risk: an attacker jailbreaks your model, extracts your proprietary system prompts, or tricks an autonomous agent into wiping a production database."
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-red-400 text-sm">Minute 2: Show the Unarmored Model (Security OFF)</div>
              <p className="mt-1 text-slate-400">
                Select <strong>Llama 3.3</strong> or <strong>Gemini 2.0 Flash</strong> in the Arena. Pick the <strong>System Prompt Extraction</strong> preset. Look at the left pane: the raw model gets completely compromised and spills confidential keys and database credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-emerald-400 text-sm">Minute 3: Show Model Armor in Action (Security ON)</div>
              <p className="mt-1 text-slate-400">
                Look at the right pane: <strong>Google Cloud Model Armor</strong> immediately intercepts and blocks the attack in 18ms. Point out the 98% risk confidence score and the zero latency penalty.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-purple-400 text-sm">Minute 4: Show Agent Gateway Tool Defense</div>
              <p className="mt-1 text-slate-400">
                Click over to the <strong>Agent Gateway</strong> tab. Show an agent being instructed to execute a destructive SQL injection (`DROP TABLE`). With Agent Gateway ON, the proxy denies the execution before it can touch Cloud SQL.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-amber-400 text-sm">Minute 5: Close with SecOps & Compliance</div>
              <p className="mt-1 text-slate-400">
                "Everything you just saw logs directly to Security Command Center Enterprise (SCCe). You don't have to build custom logging pipelines—you get SOC2 compliance ready on day one."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 4 Defense Layers */}
      {activeTab === 'layers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-lg font-bold text-white">Technical Deep-Dive: The 4 Security Layers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-emerald-400">1. Google Cloud Model Armor</div>
              <p className="text-slate-300">
                Evaluates user prompts and model responses for prompt injections, DAN persona jailbreaks, malicious URIs, and toxic language. Adds &lt;20ms overhead.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-blue-400">2. Sensitive Data Protection (Cloud DLP)</div>
              <p className="text-slate-300">
                Detects and masks 150+ predefined infoTypes including SSNs, credit card numbers, tax IDs, and auth credentials, preventing PII from ever reaching the model.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-purple-400">3. Google Cloud Agent Gateway</div>
              <p className="text-slate-300">
                Enforces OpenAPI schema validation and least-privilege IAM policies on autonomous agent tool calling, blocking destructive SQL and unauthorized API actions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-red-400">4. Security Command Center Enterprise (SCCe)</div>
              <p className="text-slate-300">
                Centralizes AI security findings, threat intelligence, and compliance scoring across all your Google Cloud workloads.
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
              <div className="text-slate-400">Model Armor &amp; Vertex AI</div>
              <div className="text-lg font-bold text-white mt-1">Pay-Per-Token</div>
              <div className="text-slate-500 mt-1">Only billed during live runs</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            ✓ Total expected monthly run rate: <strong>$75 – $190/month</strong> (leaving &gt; $400 safety buffer below the $600 ceiling).
          </div>
        </div>
      )}
    </div>
  );
}
