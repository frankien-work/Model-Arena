export interface ModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'Meta';
  tagline: string;
  contextWindow: string;
  inputPricePer1M: number;  // in USD
  outputPricePer1M: number; // in USD
  badgeColor: string;
  accentColor: string;
  recommendedFor: string;
}

export const SUPPORTED_MODELS: Record<string, ModelConfig> = {
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tagline: 'Ultra-low latency, next-generation frontier intelligence',
    contextWindow: '1,000,000 tokens',
    inputPricePer1M: 0.10,
    outputPricePer1M: 0.40,
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accentColor: '#4285F4',
    recommendedFor: 'Interactive chats, high-frequency agent loops, realtime classification',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    tagline: 'Deep multi-modal reasoning with massive 2M context',
    contextWindow: '2,000,000 tokens',
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.00,
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accentColor: '#8B5CF6',
    recommendedFor: 'Complex code generation, legal/financial analysis, massive document Q&A',
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'Industry benchmark for software engineering & nuanced writing',
    contextWindow: '200,000 tokens',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    accentColor: '#F59E0B',
    recommendedFor: 'Coding tasks, detailed synthesis, complex human-like dialogue',
  },
  'llama-3-3-70b': {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    tagline: 'Open-weights powerhouse hosted on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    inputPricePer1M: 0.35,
    outputPricePer1M: 0.40,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accentColor: '#10B981',
    recommendedFor: 'Private data compliance, custom fine-tuning, open-source alignment',
  },
};

export function calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const model = SUPPORTED_MODELS[modelId];
  if (!model) return 0;
  const inputCost = (inputTokens / 1_000_000) * model.inputPricePer1M;
  const outputCost = (outputTokens / 1_000_000) * model.outputPricePer1M;
  return Number((inputCost + outputCost).toFixed(6));
}
