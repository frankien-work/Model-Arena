import { VertexAI } from '@google-cloud/vertexai';
import { getGcpProjectId, getGcpRegion } from './gcp-auth';

let vertexInstance: VertexAI | null = null;

export function getVertexClient(projectId: string, region: string): VertexAI {
  if (!vertexInstance) {
    vertexInstance = new VertexAI({
      project: projectId,
      location: region,
    });
  }
  return vertexInstance;
}

export interface VertexGenerationResult {
  text: string;
  isLive: boolean;
  latencyMs: number;
  modelRequested: string;
  modelActual: string;
  tokenCount?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
  apiStatus: string;
  error?: string;
  rawRequest?: any;
  rawResponse?: any;
}

// Map user-selected model IDs to valid, callable Google Cloud Vertex AI publisher model IDs
const VERTEX_MODEL_FALLBACK_CANDIDATES: Record<string, string[]> = {
  'gemini-3-8-flash': ['gemini-2.0-flash', 'gemini-1.5-flash-002', 'gemini-1.5-flash', 'gemini-1.5-flash-001'],
  'gemini-3-1-pro-preview': ['gemini-1.5-pro-002', 'gemini-1.5-pro', 'gemini-1.5-pro-001'],
  'gemini-2-5-pro': ['gemini-1.5-pro-002', 'gemini-1.5-pro'],
  'claude-sonnet-5': ['gemini-1.5-pro', 'gemini-1.5-flash'],
  'llama-3-2': ['gemini-1.5-flash', 'gemini-1.5-flash-002'],
  'deepseek-v4-pro': ['gemini-1.5-pro', 'gemini-1.5-flash'],
  'deepseek-v4-flash': ['gemini-1.5-flash', 'gemini-1.5-flash-002'],
  'mistral-large': ['gemini-1.5-pro', 'gemini-1.5-flash'],
};

export async function generateContentLive(
  modelId: string,
  prompt: string,
  systemInstruction?: string
): Promise<VertexGenerationResult> {
  const startTime = Date.now();
  const projectId = await getGcpProjectId();
  const region = getGcpRegion();

  const candidateModels = VERTEX_MODEL_FALLBACK_CANDIDATES[modelId] || [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ];

  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      const vertex = getVertexClient(projectId, region);
      const model = vertex.getGenerativeModel({
        model: candidate,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      const reqPayload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      };

      const response = await model.generateContent(reqPayload);
      const candidateObj = response.response?.candidates?.[0];
      const text = candidateObj?.content?.parts?.[0]?.text;
      const usage = response.response?.usageMetadata;

      if (text && text.trim().length > 0) {
        return {
          text,
          isLive: true,
          latencyMs: Date.now() - startTime,
          modelRequested: modelId,
          modelActual: candidate,
          tokenCount: {
            promptTokens: usage?.promptTokenCount,
            candidatesTokens: usage?.candidatesTokenCount,
            totalTokens: usage?.totalTokenCount,
          },
          apiStatus: '200 OK (Vertex AI)',
          rawRequest: {
            endpoint: `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${candidate}:generateContent`,
            systemInstruction: systemInstruction || 'None',
            prompt,
          },
          rawResponse: {
            finishReason: candidateObj?.finishReason,
            usageMetadata: usage,
          },
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Vertex candidate ${candidate} failed: ${err?.message || err}`);
    }
  }

  // If live Vertex AI call failed across all candidates (e.g. offline / no ADC locally)
  return {
    text: '',
    isLive: false,
    latencyMs: Date.now() - startTime,
    modelRequested: modelId,
    modelActual: 'None (ADC Unavailable or Permission Denied)',
    apiStatus: lastError ? `Error: ${lastError.message || lastError}` : 'OFFLINE_LOCAL',
    error: lastError?.message || 'Could not connect to Vertex AI endpoints with current credentials.',
  };
}
