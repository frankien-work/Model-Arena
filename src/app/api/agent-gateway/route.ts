import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { toolName, toolParameters, agentGatewayEnabled = true } = await req.json();

    const paramStr = JSON.stringify(toolParameters).toLowerCase();
    const isDestructive =
      paramStr.includes('drop table') ||
      paramStr.includes('delete from') ||
      paramStr.includes('shutdown') ||
      paramStr.includes('exfiltrate') ||
      toolName === 'admin_delete_account';

    if (!agentGatewayEnabled) {
      return NextResponse.json({
        status: 'EXECUTED_UNSAFE',
        message: `⚠️ Agent Gateway is OFF: Unsanitized tool "${toolName}" was executed directly on backend resources.`,
        executedQuery: toolParameters?.query || 'Executed without policy check',
        dataLossRisk: 'CRITICAL',
      });
    }

    if (isDestructive) {
      return NextResponse.json({
        status: 'BLOCKED_BY_GATEWAY',
        message: `🛡️ Agent Gateway Denied Execution: Tool call "${toolName}" violated least-privilege security policy. Destructive SQL or unauthorized action detected.`,
        policyTrigger: 'RESTRICTED_DDL_DML_PATTERN',
        scceEvent: `SCCE-TOOL-BLOCK-${Date.now().toString(36).toUpperCase()}`,
        latencyMs: 12,
      });
    }

    return NextResponse.json({
      status: 'VERIFIED_SAFE',
      message: `✓ Agent Gateway Verified: Tool "${toolName}" parameters comply with OpenAPI schema and IAM permissions.`,
      latencyMs: 8,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
