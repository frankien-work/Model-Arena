'use client';

import React, { useState, useEffect } from 'react';
import { SUPPORTED_MODELS, ModelConfig, getModelConfig } from '@/lib/models';
import { ATTACK_PRESETS, AttackPreset, GuardrailSettings } from '@/lib/security-engine';

export default function SecurityArenaPage() {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-8-flash');
  const [selectedAttack, setSelectedAttack] = useState<AttackPreset>(ATTACK_PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(ATTACK_PRESETS[0].prompt);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Granular Security Solution Toggles
  const [guardrails, setGuardrails] = useState<GuardrailSettings>({
    modelArmor: true,
    cloudDlp: true,
    agentGateway: true,
    scceAudit: true,
  });

  const [result, setResult] = useState<{
    vulnerable: { output: string; status: string; riskScore: number };
    protected: {
      action: string;
      riskScore: number;
      latencyOverheadMs: number;
      findings: any[];
      sanitizedPrompt?: string;
      modelOutput: string;
      scceFindingId?: string;
    };
  } | null>(null);

  const handleSelectAttack = (preset: AttackPreset) => {
    setSelectedAttack(preset);
    setCustomPrompt(preset.prompt);
  };

  const handleRunSecurityEvaluation = async () => {
    if (!customPrompt.trim() || isRunning) return;
    setIsRunning(true);

    try {
      const res = await fetch('/api/security-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel,
          attackId: selectedAttack.id,
          promptText: customPrompt,
          guardrails,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to run security evaluation:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Run on first load to immediately display side-by-side demonstration
  useEffect(() => {
    handleRunSecurityEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel, selectedAttack.id]);

  const activeModelConfig = getModelConfig(selectedModel);

  return (
    <div className="space-y-6">
      {/* Top Banner & Persona Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🛡️ AI Security Arena: Dual-Pane Shield</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Model Armor & DLP
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test any frontier or open model with Google Cloud AI Security solutions toggled <strong>ON vs OFF</strong>.
          </p>
        </div>

        {/* Presentation Pitch Mode Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            presentationMode
              ? 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <span>👔 Pitch Mode:</span>
          <span className="font-mono uppercase">{presentationMode ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Model Selection Bar (Broad Multi-Provider Hub) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Select Target Model:</span>
          <span className="font-mono text-blue-400">Vertex AI Model Garden & MaaS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Object.values(SUPPORTED_MODELS).map((m: ModelConfig) => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500/80 ring-2 ring-blue-500/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white line-clamp-1">{m.name}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                    {m.provider}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{m.vulnerabilityTendency}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Solutions Granular Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Google Cloud Defense Layers (Toggle for Right Pane):
          </span>
          <span className="text-[11px] font-mono text-slate-500">Left Pane always runs Guardrails OFF</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Model Armor */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, modelArmor: !g.modelArmor }))}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.modelArmor
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🛡️ Model Armor</div>
              <div className="text-[10px] opacity-75">Injections & Jailbreaks</div>
            </div>
            <span className="text-xs font-mono font-black">{guardrails.modelArmor ? 'ON' : 'OFF'}</span>
          </button>

          {/* Cloud DLP */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, cloudDlp: !g.cloudDlp }))}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.cloudDlp
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🔒 Cloud DLP</div>
              <div className="text-[10px] opacity-75">PII & Secret Redaction</div>
            </div>
            <span className="text-xs font-mono font-black">{guardrails.cloudDlp ? 'ON' : 'OFF'}</span>
          </button>

          {/* Agent Gateway */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, agentGateway: !g.agentGateway }))}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.agentGateway
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🤖 Agent Gateway</div>
              <div className="text-[10px] opacity-75">Tool Call & SQL Guard</div>
            </div>
            <span className="text-xs font-mono font-black">{guardrails.agentGateway ? 'ON' : 'OFF'}</span>
          </button>

          {/* SCCe Audit */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, scceAudit: !g.scceAudit }))}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.scceAudit
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">📋 SCCe Logging</div>
              <div className="text-[10px] opacity-75">Enterprise Security Audit</div>
            </div>
            <span className="text-xs font-mono font-black">{guardrails.scceAudit ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Attack Presets Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Choose Adversarial Attack Preset:</span>
          <span className="text-slate-500 font-mono">Target: {selectedAttack.targetDefense}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {ATTACK_PRESETS.map(atk => (
            <button
              key={atk.id}
              onClick={() => handleSelectAttack(atk)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack.id === atk.id
                  ? 'bg-red-500/15 border-red-500/60 text-red-300 ring-2 ring-red-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs line-clamp-1">{atk.title}</div>
              <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{atk.category}</div>
            </button>
          ))}
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            rows={presentationMode ? 2 : 3}
            className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            placeholder="Edit or enter custom attack prompt payload..."
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Testing against: <strong className="text-white">{activeModelConfig.name}</strong>
            </span>
            <button
              onClick={handleRunSecurityEvaluation}
              disabled={isRunning || !customPrompt.trim()}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isRunning ? 'Evaluating Security...' : '⚡️ Execute Security Comparison'}
            </button>
          </div>
        </div>
      </div>

      {/* DUAL-PANE SPLIT SHIELD VIEW: Vulnerable (OFF) vs Protected (ON) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANE: VULNERABLE (SECURITY SOLUTIONS OFF) */}
        <div className="bg-red-950/20 border-2 border-red-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl shadow-red-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span className="font-extrabold text-sm text-red-400">
                  VULNERABLE (Security Guardrails OFF)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                ATTACK SUCCEEDED
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Raw model inference without Model Armor, Cloud DLP, or Agent Gateway:
            </div>

            <div className="bg-[#070a12] p-4 rounded-xl border border-red-500/20 text-xs font-mono text-red-200/90 whitespace-pre-wrap leading-relaxed min-h-[200px] max-h-[340px] overflow-y-auto">
              {result?.vulnerable?.output || 'Executing attack without security filters...'}
            </div>
          </div>

          {/* Risk Metrics Card */}
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono space-y-1 text-red-300">
            <div className="flex justify-between">
              <span>Security Posture:</span>
              <span className="font-bold text-red-400">100% UNPROTECTED</span>
            </div>
            <div className="flex justify-between">
              <span>Data Exposure / Exploit:</span>
              <span className="font-bold">CRITICAL RISK</span>
            </div>
            <div className="text-[10px] text-red-400/80 pt-1 border-t border-red-500/20">
              ❌ Proprietary system prompts or PII leaked directly to the requester.
            </div>
          </div>
        </div>

        {/* RIGHT PANE: PROTECTED (GOOGLE CLOUD SECURITY SOLUTIONS ON) */}
        <div className="bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl shadow-emerald-950/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="font-extrabold text-sm text-emerald-400">
                  PROTECTED (Google Cloud Defense ON)
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  result?.protected?.action === 'BLOCK'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : result?.protected?.action === 'SANITIZE'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {result?.protected?.action || 'PROTECTED'}
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Active defense via Model Armor, Cloud DLP, and Agent Gateway:
            </div>

            <div className="bg-[#070a12] p-4 rounded-xl border border-emerald-500/20 text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed min-h-[200px] max-h-[340px] overflow-y-auto">
              {result?.protected?.modelOutput || 'Evaluating protection layers...'}
            </div>
          </div>

          {/* Defense Telemetry Card */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono space-y-2 text-emerald-300">
            <div className="flex justify-between">
              <span>Inspection Latency:</span>
              <span className="font-bold text-blue-400">
                {result?.protected?.latencyOverheadMs || 18} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>Risk Confidence Score:</span>
              <span className="font-bold text-amber-400">
                {result?.protected?.riskScore || 98}% Confidence
              </span>
            </div>
            <div className="flex justify-between">
              <span>Enterprise Audit Sink:</span>
              <span className="text-slate-300">
                {result?.protected?.scceFindingId || 'SCCE-AUDIT-ACTIVE'}
              </span>
            </div>

            {/* Findings summary pill */}
            {result?.protected?.findings && result.protected.findings.length > 0 && (
              <div className="text-[10px] text-emerald-200 bg-black/40 p-2 rounded-lg border border-emerald-500/20 space-y-0.5">
                {result.protected.findings.map((f: any, i: number) => (
                  <div key={i}>
                    <strong>✓ [{f.category}]:</strong> {f.mitigationApplied}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
