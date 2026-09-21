export interface ModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'Meta' | 'Mistral' | 'DeepSeek';
  vertexModelId: string; // Exact Vertex AI / Model Garden publisher endpoint
  tagline: string;
  contextWindow: string;
  badgeColor: string;
  accentColor: string;
  vulnerabilityTendency: string; // What attacks this model is susceptible to when security is OFF
}

export const SUPPORTED_MODELS: Record<string, ModelConfig> = {
  'gemini-3-8-flash': {
    id: 'gemini-3-8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google',
    vertexModelId: 'gemini-3.8-flash',
    tagline: 'Latest frontier speed & intelligence on Vertex AI',
    contextWindow: '1,000,000 tokens',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accentColor: '#4285F4',
    vulnerabilityTendency: 'Ultra-low latency execution; susceptible to complex roleplay DAN jailbreaks if unarmored',
  },
  'gemini-2.0-flash-thinking': {
    id: 'gemini-2.0-flash-thinking',
    name: 'Gemini 2.0 Flash Thinking',
    provider: 'Google',
    vertexModelId: 'gemini-2.0-flash-thinking-exp-01-21',
    tagline: 'Built-in reasoning & chain-of-thought traces on Vertex AI',
    contextWindow: '1,000,000 tokens',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accentColor: '#06B6D4',
    vulnerabilityTendency: 'Exposes internal reasoning traces & secret instructions unless filtered by Model Armor',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro (002)',
    provider: 'Google',
    vertexModelId: 'gemini-1.5-pro-002',
    tagline: 'High-reasoning multi-modal model with 2M context',
    contextWindow: '2,000,000 tokens',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accentColor: '#8B5CF6',
    vulnerabilityTendency: 'Strong instruction adherence; vulnerable to indirect RAG prompt poisoning in massive context',
  },
  'claude-3-7-sonnet': {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    vertexModelId: 'claude-3-7-sonnet@20250219',
    tagline: 'Frontier hybrid reasoning & extended thinking on Vertex MaaS',
    contextWindow: '200,000 tokens',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    accentColor: '#F59E0B',
    vulnerabilityTendency: 'Extended reasoning traces can leak internal system instructions or follow hypothetical jailbreaks without Model Armor',
  },
  'llama-3-3-70b': {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    vertexModelId: 'meta/llama-3.3-70b-instruct-maas',
    tagline: 'Matches 405B capabilities at 70B price & latency in Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accentColor: '#10B981',
    vulnerabilityTendency: 'High susceptibility to direct prompt injection, system prompt extraction, and raw SQL commands',
  },
  'deepseek-r1': {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    vertexModelId: 'deepseek-ai/deepseek-r1-maas',
    tagline: 'Open-weights reasoning powerhouse on Vertex Model Garden',
    contextWindow: '64,000 tokens',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    accentColor: '#6366F1',
    vulnerabilityTendency: 'Reasoning tokens can leak private system constraints or execute unverified agent tools',
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large 2 (2407)',
    provider: 'Mistral',
    vertexModelId: 'mistralai/mistral-large-2407',
    tagline: 'Leading European frontier model available on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    accentColor: '#EA580C',
    vulnerabilityTendency: 'Multilingual fluency; prone to cross-lingual jailbreaks and indirect tool exfiltration',
  },
};

export function getModelConfig(modelId: string): ModelConfig {
  if (modelId === 'claude-3-5-sonnet') return SUPPORTED_MODELS['claude-3-7-sonnet'];
  if (modelId === 'gemini-2.0-flash') return SUPPORTED_MODELS['gemini-3-8-flash'];
  return SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS['gemini-3-8-flash'];
}
