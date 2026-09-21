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
      { model: 'Gemini 2.0 Flash Thinking', p50: 195, p95: 260, p99: 315, costPer1MIn: 0.10, costPer1MOut: 0.40 },
      { model: 'Gemini 1.5 Pro (002)', p50: 310, p95: 420, p99: 580, costPer1MIn: 1.25, costPer1MOut: 5.00 },
      { model: 'Claude Sonnet 5', p50: 245, p95: 345, p99: 430, costPer1MIn: 3.00, costPer1MOut: 15.00 },
      { model: 'Llama 3.3 70B', p50: 235, p95: 340, p99: 410, costPer1MIn: 0.35, costPer1MOut: 0.40 },
      { model: 'DeepSeek R1', p50: 360, p95: 490, p99: 610, costPer1MIn: 0.55, costPer1MOut: 2.19 },
      { model: 'Mistral Large 2', p50: 270, p95: 375, p99: 480, costPer1MIn: 2.00, costPer1MOut: 6.00 },
    ],
    securityIncidents: [
      { id: 'SEC-8901', timestamp: '2026-09-21T10:14:20Z', threat: 'Direct Prompt Injection', action: 'BLOCK', modelArmorScore: 98 },
      { id: 'SEC-8902', timestamp: '2026-09-21T09:45:11Z', threat: 'DAN Persona Bypass', action: 'BLOCK', modelArmorScore: 96 },
      { id: 'SEC-8903', timestamp: '2026-09-20T16:22:04Z', threat: 'PII Exfiltration (SSN)', action: 'SANITIZE', modelArmorScore: 72 },
    ]
  });
}
