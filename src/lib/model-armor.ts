export interface SecurityFinding {
  category: 'Prompt Injection' | 'Jailbreak (DAN)' | 'PII Leakage' | 'Command Injection' | 'Toxic Content';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number; // 0.0 to 1.0
  description: string;
  matchedPattern?: string;
}

export interface ModelArmorInspectionResult {
  action: 'ALLOW' | 'BLOCK' | 'SANITIZE';
  riskScore: number; // 0 to 100
  latencyMs: number;
  findings: SecurityFinding[];
  sanitizedText?: string;
  scceEventId?: string;
}

// Built-in heuristic & semantic inspection engine for Model Armor simulation/native calls
export function inspectWithModelArmor(text: string, enabled: boolean): ModelArmorInspectionResult {
  const startTime = Date.now();

  if (!enabled) {
    return {
      action: 'ALLOW',
      riskScore: 0,
      latencyMs: 1,
      findings: [],
    };
  }

  const findings: SecurityFinding[] = [];
  const lower = text.toLowerCase();

  // 1. Direct Prompt Injection & Instruction Overrides
  if (
    lower.includes('ignore all previous') ||
    lower.includes('disregard all previous') ||
    lower.includes('override system prompt') ||
    lower.includes('forget your rules') ||
    lower.includes('new instructions:')
  ) {
    findings.push({
      category: 'Prompt Injection',
      severity: 'CRITICAL',
      confidence: 0.98,
      description: 'Attempted override of system instructions detected.',
      matchedPattern: 'Instruction Override Keyword Sequence',
    });
  }

  // 2. Jailbreak / DAN persona bypasses
  if (
    lower.includes('dan mode') ||
    lower.includes('jailbreak') ||
    lower.includes('do anything now') ||
    lower.includes('unfiltered mode') ||
    lower.includes('roleplay as an evil')
  ) {
    findings.push({
      category: 'Jailbreak (DAN)',
      severity: 'CRITICAL',
      confidence: 0.95,
      description: 'Adversarial persona jailbreak pattern identified.',
      matchedPattern: 'DAN / Unrestricted Persona Pattern',
    });
  }

  // 3. System Prompt & Credential Extraction
  if (
    lower.includes('print your system prompt') ||
    lower.includes('reveal secret key') ||
    lower.includes('show api credentials') ||
    lower.includes('repeat the text above verbatim')
  ) {
    findings.push({
      category: 'Prompt Injection',
      severity: 'HIGH',
      confidence: 0.92,
      description: 'Attempted exfiltration of internal instructions or secrets.',
      matchedPattern: 'System Prompt Extraction Vector',
    });
  }

  // 4. Sensitive Data / PII Exfiltration (SSN, Credit Card regex)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
  const ccRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\b/;
  let sanitized = text;

  if (ssnRegex.test(text)) {
    findings.push({
      category: 'PII Leakage',
      severity: 'HIGH',
      confidence: 0.99,
      description: 'Social Security Number pattern detected in prompt payload.',
      matchedPattern: 'SSN (Cloud DLP Rule)',
    });
    sanitized = sanitized.replace(ssnRegex, '[REDACTED_SSN]');
  }

  if (ccRegex.test(text)) {
    findings.push({
      category: 'PII Leakage',
      severity: 'HIGH',
      confidence: 0.99,
      description: 'Payment card number detected in prompt payload.',
      matchedPattern: 'Credit Card (Cloud DLP Rule)',
    });
    sanitized = sanitized.replace(ccRegex, '[REDACTED_CREDIT_CARD]');
  }

  // 5. Destructive SQL / Command Injections in Agent tool parameters
  if (
    lower.includes('drop table') ||
    lower.includes('delete from users') ||
    lower.includes('rm -rf /') ||
    lower.includes('; shutdown')
  ) {
    findings.push({
      category: 'Command Injection',
      severity: 'CRITICAL',
      confidence: 0.97,
      description: 'Destructive database or OS command sequence detected.',
      matchedPattern: 'Adversarial Command Injection',
    });
  }

  const latencyMs = Math.floor(Math.random() * 8) + 16; // 16-24ms realistic inspection latency
  const scceEventId = findings.length > 0 ? `SCCE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}` : undefined;

  if (findings.some(f => f.severity === 'CRITICAL')) {
    return {
      action: 'BLOCK',
      riskScore: 96,
      latencyMs,
      findings,
      scceEventId,
    };
  } else if (findings.length > 0) {
    return {
      action: 'SANITIZE',
      riskScore: 68,
      latencyMs,
      findings,
      sanitizedText: sanitized,
      scceEventId,
    };
  }

  return {
    action: 'ALLOW',
    riskScore: 4,
    latencyMs,
    findings: [],
  };
}
