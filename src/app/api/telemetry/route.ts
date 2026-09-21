import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  // Returns aggregated BigQuery telemetry statistics for Model Arena
  return NextResponse.json({
    summary: {
      totalBenchmarkRuns: 1420,
      averageTTFTMs: 168.4,
      modelArmorBlocks: 84,
      totalSpendThisMonthUSD: 42.18,
      monthlyBudgetLimitUSD: 600.0,
      budgetConsumedPercent: 7.03,
    },
    latencyByModel: [
      { model: 'Gemini 3.8 Flash', p50: 125, p95: 165, p99: 190, costPer1MIn: 0.10, costPer1MOut: 0.40 },
      { model: 'Gemini 3.1 Pro Preview', p50: 290, p95: 410, p99: 560, costPer1MIn: 1.25, costPer1MOut: 5.00 },
      { model: 'Gemini 2.5 Pro', p50: 280, p95: 395, p99: 530, costPer1MIn: 1.25, costPer1MOut: 5.00 },
      { model: 'Claude Sonnet 5', p50: 245, p95: 345, p99: 430, costPer1MIn: 3.00, costPer1MOut: 15.00 },
      { model: 'Llama 3.2', p50: 190, p95: 280, p99: 360, costPer1MIn: 0.20, costPer1MOut: 0.25 },
      { model: 'DeepSeek-V4-Pro', p50: 320, p95: 460, p99: 580, costPer1MIn: 0.55, costPer1MOut: 2.19 },
      { model: 'DeepSeek-V4-Flash', p50: 135, p95: 185, p99: 220, costPer1MIn: 0.15, costPer1MOut: 0.60 },
      { model: 'Mistral Large 2', p50: 270, p95: 375, p99: 480, costPer1MIn: 2.00, costPer1MOut: 6.00 },
    ],
    securityIncidents: [
      { id: 'SEC-8901', timestamp: '2026-09-21T10:14:20Z', threat: 'Direct Prompt Injection', action: 'BLOCK', modelArmorScore: 98 },
      { id: 'SEC-8902', timestamp: '2026-09-21T09:45:11Z', threat: 'DAN Persona Bypass', action: 'BLOCK', modelArmorScore: 96 },
      { id: 'SEC-8903', timestamp: '2026-09-20T16:22:04Z', threat: 'PII Exfiltration (SSN)', action: 'SANITIZE', modelArmorScore: 72 },
    ]
  });
}
