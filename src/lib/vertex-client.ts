import { VertexAI } from '@google-cloud/vertexai';
import { getGcpProjectId, getGcpRegion } from './gcp-auth';

let vertexInstance: VertexAI | null = null;

export function getVertexClient(): VertexAI {
  if (!vertexInstance) {
    vertexInstance = new VertexAI({
      project: process.env.GCP_PROJECT_ID || 'entropy-bug-1',
      location: process.env.GCP_REGION || 'us-central1',
    });
  }
  return vertexInstance;
}

export interface VertexGenerationResult {
  text: string;
  isLive: boolean;
  latencyMs: number;
  modelUsed: string;
}

export async function generateContentLive(
  vertexModelId: string,
  prompt: string
): Promise<VertexGenerationResult> {
  const startTime = Date.now();
  try {
    const vertex = getVertexClient();
    const model = vertex.getGenerativeModel({
      model: vertexModelId,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text && text.trim().length > 0) {
      return {
        text,
        isLive: true,
        latencyMs: Date.now() - startTime,
        modelUsed: vertexModelId,
      };
    }
  } catch (err: any) {
    console.warn(`Vertex AI live generation for ${vertexModelId} unavailable:`, err?.message || err);
  }

  return {
    text: '',
    isLive: false,
    latencyMs: Date.now() - startTime,
    modelUsed: vertexModelId,
  };
}
