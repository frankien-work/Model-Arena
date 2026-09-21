import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_MODELS, calculateCost } from '@/lib/models';
import { inspectWithModelArmor } from '@/lib/model-armor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelIds, enableModelArmor = false } = body;

    if (!prompt || !modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json({ error: 'Prompt and at least one modelId are required' }, { status: 400 });
    }

    // 1. Model Armor Pre-Execution Inspection
    const armorResult = inspectWithModelArmor(prompt, enableModelArmor);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial security status
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'security', armorResult })}\n\n`)
        );

        if (armorResult.action === 'BLOCK') {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                message: 'Blocked by Google Cloud Model Armor: Security violation detected.',
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Run models concurrently
        const activePrompt = armorResult.sanitizedText || prompt;
        const inputTokens = Math.ceil(activePrompt.length / 4);

        // Simulate streaming tokens for each model with realistic latency profiles
        for (const modelId of modelIds) {
          const config = SUPPORTED_MODELS[modelId];
          if (!config) continue;

          const start = Date.now();
          
          // Realistic TTFT based on model characteristics
          let baseTTFT = 180;
          if (modelId === 'gemini-2.0-flash') baseTTFT = 140;
          if (modelId === 'gemini-1.5-pro') baseTTFT = 320;
          if (modelId === 'claude-3-5-sonnet') baseTTFT = 290;
          if (modelId === 'llama-3-3-70b') baseTTFT = 240;

          const actualTTFT = baseTTFT + Math.floor(Math.random() * 40);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'model_start',
                modelId,
                ttftMs: actualTTFT,
                startTime: start,
              })}\n\n`
            )
          );

          // Simulated response text chunks based on model type
          const responsesByModel: Record<string, string[]> = {
            'gemini-2.0-flash': [
              "Here is an optimized architectural breakdown for your requirement:\n\n",
              "1. **Core Processing Loop**: Use Google Cloud Run with concurrency set to 80 for scale-to-zero efficiency.\n",
              "2. **Event Ingestion**: Pub/Sub topic streaming events with backpressure handling.\n",
              "3. **Security Perimeter**: Google Cloud Model Armor inspecting prompts in sub-25ms.\n",
              "4. **Analytics Sink**: Streaming direct inserts to BigQuery for cost and latency dashboards.\n\n",
              "Total estimated monthly hosting cost remains well below $100."
            ],
            'gemini-1.5-pro': [
              "### Comprehensive Architecture & Implementation Specification\n\n",
              "To ensure enterprise resilience and strict cost governance on Google Cloud Platform:\n\n",
              "- **Data Access Layer**: PostgreSQL 15 deployed on Cloud SQL equipped with the `pgvector` extension for atomic relational + vector operations.\n",
              "- **Model Routing Strategy**: Vertex AI Model Garden provides unified quota, consolidated billing, and VPC Service Control protection.\n",
              "- **Cost Isolation**: Cloud Billing Budgets configured with programmatic thresholds ($300 / $480 / $600) and scale-to-zero Cloud Run containers.\n",
              "- **Compliance Posture**: SCCe integration captures real-time audit findings from Model Armor inspection filters."
            ],
            'claude-3-5-sonnet': [
              "Here is a nuanced technical implementation strategy:\n\n",
              "```python\nimport asyncio\nfrom google.cloud import storage, aiplatform\n\nasync def stream_processor(event_queue: asyncio.Queue):\n    while True:\n        payload = await event_queue.get()\n        # Process with Vertex AI Claude 3.5 Sonnet\n        print(f'Processed payload: {payload.id}')\n        event_queue.task_done()\n```\n\n",
              "This pattern provides clean asynchronous concurrency with full backpressure safety."
            ],
            'llama-3-3-70b': [
              "Deploying open-weights Llama 3.3 70B via Vertex AI Model Garden ensures full model weights autonomy.\n\n",
              "- Host using Vertex AI Serverless Prediction Endpoints.\n",
              "- Maintain zero egress fees when querying from Cloud Run in the same region (us-central1).\n",
              "- Pair with Google Cloud Model Armor for strict input sanitization."
            ]
          };

          const chunks = responsesByModel[modelId] || ["Standard model output stream completed successfully."];
          let outputTokens = 0;

          for (const chunk of chunks) {
            outputTokens += Math.ceil(chunk.length / 4);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'token_chunk',
                  modelId,
                  chunk,
                })}\n\n`
              )
            );
          }

          const totalDuration = actualTTFT + Math.floor(Math.random() * 250) + 120;
          const tokensPerSec = Number(((outputTokens / (totalDuration / 1000))).toFixed(1));
          const costUSD = calculateCost(modelId, inputTokens, outputTokens);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'model_complete',
                modelId,
                ttftMs: actualTTFT,
                totalDurationMs: totalDuration,
                tokensPerSec,
                inputTokens,
                outputTokens,
                costUSD,
              })}\n\n`
            )
          );
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
