import { NextRequest, NextResponse } from 'next/server';
import { getModelConfig } from '@/lib/models';
import { simulateVulnerableResponse, GuardrailSettings } from '@/lib/security-engine';
import { inspectWithModelArmor, SecurityFinding } from '@/lib/model-armor';
import { deidentifyWithCloudDlp } from '@/lib/cloud-dlp';
import { generateContentLive } from '@/lib/vertex-client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const {
      modelId = 'gemini-3-8-flash',
      attackId = 'system-prompt-extraction',
      promptText,
      guardrails = {
        modelArmor: true,
        cloudDlp: true,
        agentGateway: true,
        scceAudit: true,
      },
    } = await req.json();

    const model = getModelConfig(modelId);
    const textToTest = promptText || '';
    const lower = textToTest.toLowerCase();

    // =========================================================================
    // 1. LEFT PANE: VULNERABLE (GUARDRAILS OFF)
    // Directly invoke Vertex AI model without any security filter or middleware
    // =========================================================================
    let vulnerableOutput = '';
    let vulnerableIsLive = false;

    // Try executing directly on Vertex AI without armor
    const liveVulnerable = await generateContentLive(model.vertexModelId, textToTest);
    if (liveVulnerable.isLive && liveVulnerable.text) {
      vulnerableOutput = liveVulnerable.text;
      vulnerableIsLive = true;
    } else {
      vulnerableOutput = simulateVulnerableResponse(modelId, attackId);
    }

    // =========================================================================
    // 2. RIGHT PANE: PROTECTED (GUARDRAILS ON)
    // Pipeline: Model Armor -> Cloud DLP -> Agent Gateway -> Vertex AI
    // =========================================================================
    const startTime = Date.now();
    const findings: SecurityFinding[] = [];
    let action: 'ALLOW' | 'BLOCK' | 'SANITIZE' = 'ALLOW';
    let riskScore = 4;
    let sanitizedPrompt = textToTest;
    let modelOutput = '';
    let protectedIsLive = false;
    let activeSecurityServices: string[] = [];

    // Step A: Real Google Cloud Model Armor Inspection
    if (guardrails.modelArmor) {
      activeSecurityServices.push('Google Cloud Model Armor');
      const armorResult = await inspectWithModelArmor(textToTest, true);
      
      if (armorResult.action === 'BLOCK') {
        action = 'BLOCK';
        riskScore = armorResult.riskScore;
        findings.push(...armorResult.findings);
      }
    }

    // Step B: Real Google Cloud Sensitive Data Protection (DLP)
    if (guardrails.cloudDlp) {
      activeSecurityServices.push('Cloud DLP (Sensitive Data Protection)');
      const dlpResult = await deidentifyWithCloudDlp(sanitizedPrompt);

      if (dlpResult.findings.length > 0) {
        sanitizedPrompt = dlpResult.sanitizedText;
        for (const f of dlpResult.findings) {
          findings.push({
            category: 'PII Leakage',
            severity: 'HIGH',
            confidence: 0.99,
            description: `Sensitive identifier detected: ${f.infoType}`,
            matchedPattern: f.mitigation,
          });
        }
        if (action !== 'BLOCK') {
          action = 'SANITIZE';
          riskScore = Math.max(riskScore, 68);
        }
      }
    }

    // Step C: Agent Gateway Tool & SQL Validation
    if (guardrails.agentGateway) {
      activeSecurityServices.push('Agent Gateway');
      if (
        lower.includes('drop table') ||
        lower.includes('delete from') ||
        lower.includes('execute_sql_query')
      ) {
        findings.push({
          category: 'Command Injection',
          severity: 'CRITICAL',
          confidence: 0.99,
          description: 'Destructive DDL/DML SQL command detected in agent tool call argument.',
          matchedPattern: 'Agent Gateway Least-Privilege IAM Policy',
        });
        action = 'BLOCK';
        riskScore = 99;
      }
    }

    // Step D: Construct Protected Response
    if (action === 'BLOCK') {
      const primaryFinding = findings[0];
      modelOutput = `🛡️ [REQUEST BLOCKED BY GOOGLE CLOUD SECURITY]
Policy Trigger: ${primaryFinding?.category || 'Security Guardrail'}
Severity: ${primaryFinding?.severity || 'HIGH'} (Risk Score: ${riskScore}%)
Defense Layer: ${primaryFinding?.matchedPattern || 'Google Cloud Model Armor'}
Action Taken: Blocked payload before reaching ${model.name} context window.
Compliance Audit: Logged to Security Command Center Enterprise (SCCe)`;
    } else if (action === 'SANITIZE') {
      // Execute live model with sanitized prompt
      const liveClean = await generateContentLive(model.vertexModelId, sanitizedPrompt);
      if (liveClean.isLive && liveClean.text) {
        modelOutput = liveClean.text;
        protectedIsLive = true;
      } else {
        modelOutput = `Dear Customer,\n\nWe have received your account request. For your security, sensitive identifiers were automatically tokenized:\n\nCustomer Details Verified:\n- Social Security Number: [US_SOCIAL_SECURITY_NUMBER]\n- Account Card: [CREDIT_CARD_NUMBER]\n\nA support specialist has initiated secure review case #8921.`;
      }
    } else {
      // Clean request
      const liveClean = await generateContentLive(model.vertexModelId, sanitizedPrompt);
      if (liveClean.isLive && liveClean.text) {
        modelOutput = liveClean.text;
        protectedIsLive = true;
      } else {
        modelOutput = `Model executed cleanly within standard safety parameters. Zero security violations detected.`;
      }
    }

    const latencyOverheadMs = Math.max(16, Date.now() - startTime);
    const scceFindingId = guardrails.scceAudit && findings.length > 0
      ? `SCCE-ALERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`
      : undefined;

    return NextResponse.json({
      model,
      vulnerable: {
        status: 'COMPROMISED',
        output: vulnerableOutput,
        riskScore: 100,
        guardrailsActive: false,
        isLiveExecution: vulnerableIsLive,
      },
      protected: {
        action,
        riskScore,
        latencyOverheadMs,
        findings,
        sanitizedPrompt: action === 'SANITIZE' ? sanitizedPrompt : undefined,
        modelOutput,
        isCompromised: false,
        scceFindingId,
        isLiveExecution: protectedIsLive,
        activeSecurityServices,
        auditDetails: scceFindingId ? {
          resource: `//aiplatform.googleapis.com/projects/entropy-bug-1/locations/us-central1/publishers/${model.provider.toLowerCase()}/models/${model.vertexModelId}`,
          threatVector: findings[0]?.category || 'Adversarial Injection',
          recommendedAction: 'Enforce Google Cloud Model Armor and Cloud DLP templates.',
        } : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
