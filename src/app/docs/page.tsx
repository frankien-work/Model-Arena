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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>🏛 AI Security Architecture & SE Battlecards</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Field Playbook
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Technical diagrams, sales engineering battlecards, and 5-minute customer pitch scripts.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Source: <span className="text-blue-600 font-semibold">/docs</span> in Git repository
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {DOC_SECTIONS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>{tab.title}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTab === tab.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Security Architecture */}
      {activeTab === 'arch' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Google Cloud Defense-in-Depth Pipeline</span>
          </h2>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-mono space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-1">
                <div className="text-blue-700 font-bold">1. Edge & Input</div>
                <div className="text-[11px] text-slate-600">Cloud Armor WAF</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Model Armor Pre-Filter</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-1">
                <div className="text-purple-700 font-bold">2. Data Inspection</div>
                <div className="text-[11px] text-slate-600">Cloud DLP PII Masking</div>
                <div className="text-[11px] text-slate-600">VPC Service Controls</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
                <div className="text-emerald-700 font-bold">3. Execution & Model</div>
                <div className="text-[11px] text-slate-600">Vertex AI Models</div>
                <div className="text-[11px] text-amber-700 font-semibold">Agent Gateway Tool Guard</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-red-200 shadow-2xs space-y-1">
                <div className="text-red-700 font-bold">4. SecOps & Audit</div>
                <div className="text-[11px] text-slate-600">Security Command Center (SCCe)</div>
                <div className="text-[11px] text-slate-600">BigQuery Telemetry</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 leading-relaxed">
            <strong className="text-blue-900 font-semibold">Why This Wins Deals:</strong> Instead of asking startups to stitch together open-source guardrail libraries (like LlamaGuard) that require expensive GPU instances, Google Cloud provides a fully managed, serverless AI defense perimeter with sub-20ms latency and native enterprise SecOps reporting.
          </div>
        </div>
      )}

      {/* Tab 2: SE Battlecards */}
      {activeTab === 'battlecards' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Startup Sales Engineering Battlecards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-sm font-bold text-blue-700">Model Armor vs DIY Open Source (LlamaGuard)</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                LlamaGuard requires provisioning and paying for dedicated GPUs 24/7 (~$500+/mo) and adds 200–400ms latency. Model Armor is 100% serverless, scales to zero, costs fractions of a cent per inspection, and adds &lt;20ms overhead.
              </p>
              <div className="text-[11px] text-emerald-800 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 inline-block">
                SE Pitch: &ldquo;Zero GPUs to manage, 10x lower latency.&rdquo;
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-sm font-bold text-amber-700">Protecting Third-Party Models (Claude Sonnet 5 &amp; Llama)</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Startups using Anthropic Claude or Meta Llama can run them on Google Cloud Vertex AI and wrap them in Model Armor + Cloud DLP. This provides an enterprise security perimeter that is impossible when using direct API keys to third-party endpoints.
              </p>
              <div className="text-[11px] text-emerald-800 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 inline-block">
                SE Pitch: &ldquo;Use Claude or Llama with Google&apos;s enterprise guardrails.&rdquo;
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-sm font-bold text-emerald-700">Agent Gateway vs Unrestricted Tool Calling</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous agents are vulnerable to prompt injections that trick them into executing destructive SQL (<code className="font-mono bg-slate-200/60 px-1 py-0.5 rounded text-slate-800">DROP TABLE</code>) or unauthorized financial refunds. Agent Gateway intercepts tool calls at the proxy layer, enforcing OpenAPI schema and IAM policies.
              </p>
              <div className="text-[11px] text-emerald-800 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 inline-block">
                SE Pitch: &ldquo;Eliminate the fear of autonomous agent data loss.&rdquo;
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-sm font-bold text-red-700">Security Command Center Enterprise (SCCe) Audit</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Point solutions don&apos;t connect to enterprise compliance. Model Armor and Agent Gateway stream every blocked threat directly into SCCe, giving startups instant SOC2 and HIPAA audit trails.
              </p>
              <div className="text-[11px] text-emerald-800 font-mono font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 inline-block">
                SE Pitch: &ldquo;Instant SOC2 &amp; HIPAA audit trail out of the box.&rdquo;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 5-Minute Pitch Script */}
      {activeTab === 'script' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
          <h2 className="text-lg font-bold text-slate-900">5-Minute Live Customer Demo Script</h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-blue-700 text-sm">Minute 1: The AI Security Reality Check</div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                &ldquo;Every startup building on LLMs faces the same terrifying risk: an attacker jailbreaks your model, extracts your proprietary system prompts, or tricks an autonomous agent into wiping a production database.&rdquo;
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-red-700 text-sm">Minute 2: Show the Unarmored Model (Security OFF)</div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Select <strong>Llama 3.2</strong> or <strong>Gemini 3.8 Flash</strong> in the Arena. Pick the <strong>System Prompt Extraction</strong> preset. Look at the left pane: the raw model gets completely compromised and spills confidential keys and database credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-emerald-700 text-sm">Minute 3: Show Model Armor in Action (Security ON)</div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Look at the right pane: <strong>Google Cloud Model Armor</strong> immediately intercepts and blocks the attack in 18ms. Point out the 98% risk confidence score and the zero latency penalty.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-purple-700 text-sm">Minute 4: Show Agent Gateway Tool Defense</div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Click over to the <strong>Agent Gateway</strong> tab. Show an agent being instructed to execute a destructive SQL injection (<code className="font-mono bg-slate-200/60 px-1 py-0.5 rounded text-slate-800">DROP TABLE</code>). With Agent Gateway ON, the proxy denies the execution before it can touch Cloud SQL.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-amber-700 text-sm">Minute 5: Close with SecOps &amp; Compliance</div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                &ldquo;Everything you just saw logs directly to Security Command Center Enterprise (SCCe). You don&apos;t have to build custom logging pipelines—you get SOC2 compliance ready on day one.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 4 Defense Layers */}
      {activeTab === 'layers' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
          <h2 className="text-lg font-bold text-slate-900">Technical Deep-Dive: The 4 Security Layers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-emerald-700">1. Google Cloud Model Armor</div>
              <p className="text-slate-600 leading-relaxed">
                Evaluates user prompts and model responses for prompt injections, DAN persona jailbreaks, malicious URIs, and toxic language. Adds &lt;20ms overhead.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-blue-700">2. Sensitive Data Protection (Cloud DLP)</div>
              <p className="text-slate-600 leading-relaxed">
                Detects and masks 150+ predefined infoTypes including SSNs, credit card numbers, tax IDs, and auth credentials, preventing PII from ever reaching the model.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-purple-700">3. Google Cloud Agent Gateway</div>
              <p className="text-slate-600 leading-relaxed">
                Enforces OpenAPI schema validation and least-privilege IAM policies on autonomous agent tool calling, blocking destructive SQL and unauthorized API actions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-red-700">4. Security Command Center Enterprise (SCCe)</div>
              <p className="text-slate-600 leading-relaxed">
                Centralizes AI security findings, threat intelligence, and compliance scoring across all your Google Cloud workloads.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cost Optimization */}
      {activeTab === 'cost' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Cost Discipline (&lt; $600/Month Guarantee)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Cloud Run Serverless</div>
              <div className="text-lg font-bold text-slate-900 mt-1">$0.00 Idle</div>
              <div className="text-slate-500 mt-1">Scale-to-zero (0-5 instances)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Cloud SQL (db-f1-micro)</div>
              <div className="text-lg font-bold text-slate-900 mt-1">~$8 - $15/mo</div>
              <div className="text-slate-500 mt-1">Paused off-hours with script</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500">Model Armor &amp; Vertex AI</div>
              <div className="text-lg font-bold text-slate-900 mt-1">Pay-Per-Token</div>
              <div className="text-slate-500 mt-1">Only billed during live runs</div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            ✓ Total expected monthly run rate: <strong>$75 – $190/month</strong> (leaving &gt; $400 safety buffer below the $600 ceiling).
          </div>
        </div>
      )}
    </div>
  );
}
