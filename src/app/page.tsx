'use client';

import React, { useState, useEffect } from 'react';
import { SUPPORTED_MODELS, getModelConfig } from '@/lib/models';
import { ATTACK_PRESETS, AttackPreset } from '@/lib/security-engine';

export default function SecurityArenaPage() {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-8-flash');
  const [selectedAttack, setSelectedAttack] = useState<AttackPreset>(ATTACK_PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(ATTACK_PRESETS[0].prompt);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showRawDiagnostics, setShowRawDiagnostics] = useState<boolean>(false);
  const [thinkingLevel, setThinkingLevel] = useState<'off' | 'low' | 'medium' | 'high'>('medium');

  const [guardrails, setGuardrails] = useState({
    modelArmor: true,
    cloudDlp: true,
    agentGateway: true,
    scceAudit: true,
  });

  const [result, setResult] = useState<{
    vulnerable: {
      output: string;
      status: string;
      isLive?: boolean;
      latencyMs?: number;
      modelActual?: string;
      tokenCount?: {
        promptTokens?: number;
        candidatesTokens?: number;
        totalTokens?: number;
      };
      apiStatus?: string;
      rawDiagnostics?: any;
    };
    protected: {
      action: string;
      riskScore: number;
      latencyOverheadMs: number;
      findings: any[];
      sanitizedPrompt?: string;
      modelOutput: string;
      scceFindingId?: string;
      isLive?: boolean;
      activeSecurityServices?: string[];
      rawDiagnostics?: any;
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
          thinkingLevel,
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
  }, [selectedModel, selectedAttack.id, thinkingLevel]);

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
            Compare frontier models with Google Cloud AI Security solutions toggled <strong>ON vs OFF</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawDiagnostics(!showRawDiagnostics)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              showRawDiagnostics
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <span>🔍</span>
            <span>{showRawDiagnostics ? 'Hide Raw Telemetry' : 'Show Raw API Telemetry'}</span>
          </button>

          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              presentationMode
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <span>👔 Pitch Mode:</span>
            <span className="font-mono uppercase font-bold">{presentationMode ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Model Selection Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Select Model to Evaluate:</span>
          <span className="text-slate-500 font-mono">
            Provider: <strong className="text-slate-900">{activeModelConfig.provider}</strong> • Context: {activeModelConfig.contextWindow}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.values(SUPPORTED_MODELS).map(m => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 truncate">{m.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{m.provider}</div>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Model info banner */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900">{activeModelConfig.name}: </span>
            <span className="text-slate-600">{activeModelConfig.tagline}</span>
          </div>

          {selectedModel === 'gemini-3-8-flash' && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
              <span className="text-slate-500 font-semibold">Thinking:</span>
              {(['off', 'low', 'medium', 'high'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setThinkingLevel(lvl)}
                  className={`px-2 py-0.5 rounded capitalize transition-all ${
                    thinkingLevel === lvl
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}

          <div className="text-[11px] font-mono text-slate-500">
            Unprotected Tendency: <span className="text-amber-700 font-semibold">{activeModelConfig.vulnerabilityTendency}</span>
          </div>
        </div>
      </div>

      {/* Guardrail Controls Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="text-xs font-bold text-slate-700 mb-3">Google Cloud Security Controls (Right Pane Shield):</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={guardrails.modelArmor}
              onChange={e => setGuardrails({ ...guardrails, modelArmor: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">Google Cloud Model Armor</div>
              <div className="text-[10px] text-slate-500">Jailbreak &amp; Prompt Injection Sanitizer</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={guardrails.cloudDlp}
              onChange={e => setGuardrails({ ...guardrails, cloudDlp: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">Cloud DLP (Sensitive Data)</div>
              <div className="text-[10px] text-slate-500">SSN, Card Number &amp; PII Redaction</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={guardrails.agentGateway}
              onChange={e => setGuardrails({ ...guardrails, agentGateway: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">Agent Gateway Proxy</div>
              <div className="text-[10px] text-slate-500">OpenAPI &amp; Least-Privilege IAM Guard</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={guardrails.scceAudit}
              onChange={e => setGuardrails({ ...guardrails, scceAudit: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">SCCe Compliance Stream</div>
              <div className="text-[10px] text-slate-500">Real-time BigQuery Audit Logging</div>
            </div>
          </label>
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
              <div className="flex items-center gap-1.5">
                {result?.vulnerable?.isLive ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    LIVE VERTEX AI
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    API NOT CONNECTED
                  </span>
                )}
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {result?.vulnerable?.isLive ? 'RAW UNARMORED' : 'PENDING'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Direct model execution without Model Armor or DLP:</span>
              {result?.vulnerable?.modelActual && (
                <span className="font-mono text-[11px] text-slate-700 font-semibold">
                  Model: {result.vulnerable.modelActual}
                </span>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[200px] max-h-[340px] overflow-y-auto shadow-inner">
              {result?.vulnerable?.output || 'Executing attack directly on Vertex AI...'}
            </div>
          </div>

          {/* Risk Metrics Card */}
          <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs font-mono space-y-1.5 text-slate-700 shadow-xs">
            <div className="flex justify-between">
              <span>Execution Status:</span>
              <span className={`font-bold ${result?.vulnerable?.isLive ? 'text-emerald-700' : 'text-amber-700'}`}>
                {result?.vulnerable?.apiStatus || 'Ready'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Execution Latency:</span>
              <span className="font-bold text-slate-900">{result?.vulnerable?.latencyMs ? `${result.vulnerable.latencyMs} ms` : '—'}</span>
            </div>
            {result?.vulnerable?.tokenCount && (
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Tokens Generated:</span>
                <span>
                  {result.vulnerable.tokenCount.candidatesTokens || 0} output tokens (Total: {result.vulnerable.tokenCount.totalTokens || 0})
                </span>
              </div>
            )}
            <div className="text-[10px] text-rose-600 pt-1 border-t border-rose-100 font-medium">
              ⚠️ Without Model Armor, models directly process and adhere to adversarial instructions.
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
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  LIVE GCP DEFENSE
                </span>
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
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Live defense via Model Armor, Cloud DLP &amp; Agent Gateway:</span>
              <span className="font-mono text-[11px] text-emerald-800 font-semibold">
                Risk Score: {result?.protected?.riskScore !== undefined ? `${result.protected.riskScore}%` : '—'}
              </span>
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
                {result?.protected?.latencyOverheadMs ? `${result.protected.latencyOverheadMs} ms` : '—'}
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

      {/* RAW API DIAGNOSTICS ACCORDION */}
      {showRawDiagnostics && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🔬 Real Google Cloud API Telemetry &amp; Payloads</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Inspect Raw Network Calls
              </span>
            </h2>
            <span className="text-xs font-mono text-slate-400">REST &amp; gRPC payloads</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Left Column: Vertex AI API Call */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">Vertex AI (aiplatform.googleapis.com)</div>
              <div className="text-[11px] text-slate-600">
                <div><strong>Status:</strong> {result?.vulnerable?.apiStatus}</div>
                <div><strong>Model Executed:</strong> {result?.vulnerable?.modelActual}</div>
                <div><strong>Latency:</strong> {result?.vulnerable?.latencyMs}ms</div>
                <div><strong>Tokens:</strong> {JSON.stringify(result?.vulnerable?.tokenCount || {})}</div>
              </div>
              <pre className="p-2.5 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-700 overflow-x-auto max-h-48">
                {JSON.stringify(result?.vulnerable?.rawDiagnostics || {}, null, 2)}
              </pre>
            </div>

            {/* Right Column: Model Armor & Cloud DLP */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">Model Armor &amp; Cloud DLP (modelarmor / dlp.googleapis.com)</div>
              <div className="text-[11px] text-slate-600">
                <div><strong>Action:</strong> {result?.protected?.action}</div>
                <div><strong>Confidence:</strong> {result?.protected?.riskScore}%</div>
                <div><strong>Inspection Latency:</strong> {result?.protected?.latencyOverheadMs}ms</div>
              </div>
              <pre className="p-2.5 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-700 overflow-x-auto max-h-48">
                {JSON.stringify(result?.protected?.rawDiagnostics || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
