import { VertexAI } from '@google-cloud/vertexai';
import { getGcpProjectId, getGcpRegion } from './gcp-auth';
import { getModelConfig } from './models';

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

export async function generateContentLive(
  modelId: string,
  prompt: string,
  systemInstruction?: string,
  thinkingLevel: 'off' | 'low' | 'medium' | 'high' = 'medium'
): Promise<VertexGenerationResult> {
  const startTime = Date.now();
  const projectId = await getGcpProjectId();
  const region = getGcpRegion();

  const modelConfig = getModelConfig(modelId);
  const targetModel = modelConfig?.vertexModelId || modelId;

  // Primary model target is always the EXACT configured model (e.g. gemini-3.8-flash)
  const candidateModels = [
    targetModel,
    // Optional fallbacks if a regional endpoint is temporarily routing or testing
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  // Thinking level budget configuration
  let thinkingBudget = 0;
  if (thinkingLevel === 'low') thinkingBudget = 2048;
  else if (thinkingLevel === 'medium') thinkingBudget = 4096;
  else if (thinkingLevel === 'high') thinkingBudget = 8192;

  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      const vertex = getVertexClient(projectId, region);
      
      const genConfig: any = {
        maxOutputTokens: 2048,
        temperature: 0.7,
      };

      // If thinking is enabled on Flash, pass thinking budget
      if (candidate.includes('flash') && thinkingBudget > 0) {
        genConfig.thinkingConfig = {
          thinkingBudget,
        };
      }

      const model = vertex.getGenerativeModel({
        model: candidate,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: genConfig,
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
          modelRequested: modelConfig?.name || modelId,
          modelActual: candidate,
          tokenCount: {
            promptTokens: usage?.promptTokenCount,
            candidatesTokens: usage?.candidatesTokenCount,
            totalTokens: usage?.totalTokenCount,
          },
          apiStatus: `200 OK (${candidate})`,
          rawRequest: {
            endpoint: `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${candidate}:generateContent`,
            systemInstruction: systemInstruction || 'None',
            thinkingLevel: candidate.includes('flash') ? thinkingLevel : 'N/A',
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
      console.warn(`Vertex model attempt ${candidate} failed: ${err?.message || err}`);
    }
  }

  return {
    text: '',
    isLive: false,
    latencyMs: Date.now() - startTime,
    modelRequested: modelConfig?.name || modelId,
    modelActual: targetModel,
    apiStatus: lastError ? `Error: ${lastError.message || lastError}` : 'OFFLINE_LOCAL',
    error: lastError?.message || 'Could not connect to Vertex AI endpoints with current credentials.',
  };
}
