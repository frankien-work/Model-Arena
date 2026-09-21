import { NextRequest, NextResponse } from 'next/server';
import { inspectWithModelArmor } from '@/lib/model-armor';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { prompt, enabled = true } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = inspectWithModelArmor(prompt, enabled);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
