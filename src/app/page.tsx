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
    vulnerable: { output: string; status: string; riskScore: number; isLiveExecution?: boolean };
    protected: {
      action: string;
      riskScore: number;
      latencyOverheadMs: number;
      findings: any[];
      sanitizedPrompt?: string;
      modelOutput: string;
      scceFindingId?: string;
      isLiveExecution?: boolean;
      activeSecurityServices?: string[];
    };
  } | null>(null);

  const handleSelectAttack = (preset: AttackPreset) => {
    setSelectedAttack(preset);
    setCustomPrompt(preset.prompt);
  };

  const handleRunSecurityEvaluation = async () => {
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
      console.error('Security evaluation failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    handleRunSecurityEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel, selectedAttack.id]);

  const activeModelConfig = getModelConfig(selectedModel);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>🛡️ AI Security Arena: Dual-Pane Shield</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Live Google Cloud Security
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Test any frontier or open model with Google Cloud AI Security solutions toggled <strong>ON vs OFF</strong>.
          </p>
        </div>

        {/* Pitch Mode Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            presentationMode
              ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
          }`}
        >
          <span>👔 Pitch Mode:</span>
          <span className="font-mono uppercase font-bold">{presentationMode ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Model Selection Bar (8 Models) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Select Target Model:</span>
          <span className="font-mono text-blue-600 font-semibold">Vertex AI Model Garden & MaaS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.values(SUPPORTED_MODELS).map((m: ModelConfig) => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs line-clamp-1 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {m.name}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    {m.provider}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{m.vulnerabilityTendency}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Solutions Granular Control Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Google Cloud Defense Layers (Toggle for Right Pane):
          </span>
          <span className="text-[11px] font-mono text-slate-400">Left Pane always runs Guardrails OFF</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Model Armor */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, modelArmor: !g.modelArmor }))}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.modelArmor
                ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🛡️ Model Armor</div>
              <div className="text-[10px] opacity-80">Injections & Jailbreaks</div>
            </div>
            <span className={`text-xs font-mono font-black ${guardrails.modelArmor ? 'text-blue-700' : 'text-slate-400'}`}>
              {guardrails.modelArmor ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Cloud DLP */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, cloudDlp: !g.cloudDlp }))}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.cloudDlp
                ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🔒 Cloud DLP</div>
              <div className="text-[10px] opacity-80">PII & Secret Redaction</div>
            </div>
            <span className={`text-xs font-mono font-black ${guardrails.cloudDlp ? 'text-blue-700' : 'text-slate-400'}`}>
              {guardrails.cloudDlp ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Agent Gateway */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, agentGateway: !g.agentGateway }))}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.agentGateway
                ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">🤖 Agent Gateway</div>
              <div className="text-[10px] opacity-80">Tool Call & SQL Guard</div>
            </div>
            <span className={`text-xs font-mono font-black ${guardrails.agentGateway ? 'text-blue-700' : 'text-slate-400'}`}>
              {guardrails.agentGateway ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* SCCe Audit */}
          <button
            onClick={() => setGuardrails(g => ({ ...g, scceAudit: !g.scceAudit }))}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
              guardrails.scceAudit
                ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div>
              <div className="font-bold text-xs">📋 SCCe Logging</div>
              <div className="text-[10px] opacity-80">Enterprise Security Audit</div>
            </div>
            <span className={`text-xs font-mono font-black ${guardrails.scceAudit ? 'text-blue-700' : 'text-slate-400'}`}>
              {guardrails.scceAudit ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Attack Presets Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Choose Adversarial Attack Preset:</span>
          <span className="text-slate-500 font-mono">Target: {selectedAttack.targetDefense}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {ATTACK_PRESETS.map(atk => (
            <button
              key={atk.id}
              onClick={() => handleSelectAttack(atk)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedAttack.id === atk.id
                  ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20 font-semibold'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="font-bold text-xs line-clamp-1">{atk.title}</div>
              <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{atk.category}</div>
            </button>
          ))}
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            rows={presentationMode ? 2 : 3}
            className="w-full bg-slate-50/60 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Edit or enter custom attack prompt payload..."
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Testing against: <strong className="text-slate-900">{activeModelConfig.name}</strong>
            </span>
            <button
              onClick={handleRunSecurityEvaluation}
              disabled={isRunning || !customPrompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isRunning ? 'Evaluating Security...' : '⚡️ Execute Security Comparison'}
            </button>
          </div>
        </div>
      </div>

      {/* DUAL-PANE SPLIT SHIELD VIEW: Vulnerable (OFF) vs Protected (ON) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANE: VULNERABLE (SECURITY SOLUTIONS OFF) */}
        <div className="bg-rose-50/40 border-2 border-rose-300/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span className="font-extrabold text-sm text-rose-900">
                  VULNERABLE (Security Guardrails OFF)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                ATTACK SUCCEEDED
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Raw model inference without Model Armor, Cloud DLP, or Agent Gateway:
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[200px] max-h-[340px] overflow-y-auto shadow-inner">
              {result?.vulnerable?.output || 'Executing attack without security filters...'}
            </div>
          </div>

          {/* Risk Metrics Card */}
          <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs font-mono space-y-1.5 text-slate-700 shadow-xs">
            <div className="flex justify-between">
              <span>Security Posture:</span>
              <span className="font-bold text-rose-600">100% UNPROTECTED</span>
            </div>
            <div className="flex justify-between">
              <span>Data Exposure / Exploit:</span>
              <span className="font-bold text-rose-700">CRITICAL RISK</span>
            </div>
            <div className="text-[10px] text-rose-600 pt-1 border-t border-rose-100 font-medium">
              ❌ Proprietary system prompts or PII leaked directly to the requester.
            </div>
          </div>
        </div>

        {/* RIGHT PANE: PROTECTED (GOOGLE CLOUD SECURITY SOLUTIONS ON) */}
        <div className="bg-emerald-50/40 border-2 border-emerald-300/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="font-extrabold text-sm text-emerald-900">
                  PROTECTED (Google Cloud Defense ON)
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  result?.protected?.action === 'BLOCK'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : result?.protected?.action === 'SANITIZE'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                {result?.protected?.action || 'PROTECTED'}
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Active defense via Model Armor, Cloud DLP, and Agent Gateway:
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[200px] max-h-[340px] overflow-y-auto shadow-inner">
              {result?.protected?.modelOutput || 'Evaluating protection layers...'}
            </div>
          </div>

          {/* Defense Telemetry Card */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs font-mono space-y-2 text-slate-700 shadow-xs">
            <div className="flex justify-between">
              <span>Inspection Latency:</span>
              <span className="font-bold text-blue-600">
                {result?.protected?.latencyOverheadMs || 18} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>Risk Confidence Score:</span>
              <span className="font-bold text-amber-600">
                {result?.protected?.riskScore || 98}% Confidence
              </span>
            </div>
            <div className="flex justify-between">
              <span>Enterprise Audit Sink:</span>
              <span className="text-slate-600">
                {result?.protected?.scceFindingId || 'SCCE-AUDIT-ACTIVE'}
              </span>
            </div>

            {/* Findings summary pill */}
            {result?.protected?.findings && result.protected.findings.length > 0 && (
              <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                {result.protected.findings.map((f: any, i: number) => (
                  <div key={i}>
                    <strong>✓ [{f.category}]:</strong> {f.matchedPattern || f.description}
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
