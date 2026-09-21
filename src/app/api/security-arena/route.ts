import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_MODELS } from '@/lib/models';
import {
  simulateVulnerableResponse,
  inspectAndProtect,
  GuardrailSettings,
} from '@/lib/security-engine';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const {
      modelId = 'gemini-2.0-flash',
      attackId = 'system-prompt-extraction',
      promptText,
      guardrails = {
        modelArmor: true,
        cloudDlp: true,
        agentGateway: true,
        scceAudit: true,
      },
    } = await req.json();

    const model = SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS['gemini-2.0-flash'];

    // 1. Compute Vulnerable Result (Guardrails OFF)
    const vulnerableOutput = simulateVulnerableResponse(modelId, attackId);

    // 2. Compute Protected Result (Guardrails ON)
    const protectedEvaluation = inspectAndProtect(
      modelId,
      attackId,
      promptText,
      guardrails as GuardrailSettings
    );

    return NextResponse.json({
      model,
      vulnerable: {
        status: 'COMPROMISED',
        output: vulnerableOutput,
        riskScore: 100,
        guardrailsActive: false,
      },
      protected: protectedEvaluation,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
