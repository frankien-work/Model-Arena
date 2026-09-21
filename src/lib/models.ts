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
    tagline: 'Ultra-low latency frontier intelligence with adjustable thinking levels',
    contextWindow: '1,000,000 tokens',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accentColor: '#4285F4',
    vulnerabilityTendency: 'Ultra-low latency execution; susceptible to complex roleplay DAN jailbreaks if unarmored',
  },
  'gemini-3-1-pro-preview': {
    id: 'gemini-3-1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    provider: 'Google',
    vertexModelId: 'gemini-3.1-pro-preview',
    tagline: 'Flagship frontier high-reasoning intelligence with massive multimodal context',
    contextWindow: '2,000,000 tokens',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accentColor: '#8B5CF6',
    vulnerabilityTendency: 'Deep instruction adherence; vulnerable to indirect RAG prompt poisoning in massive context',
  },
  'gemini-2-5-pro': {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    vertexModelId: 'gemini-2.5-pro',
    tagline: 'Production-hardened enterprise reasoning on Vertex AI',
    contextWindow: '2,000,000 tokens',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    accentColor: '#6366F1',
    vulnerabilityTendency: 'Complex multi-step reasoning; can be tricked into exfiltrating developer guidance',
  },
  'claude-sonnet-5': {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    vertexModelId: 'claude-sonnet-5',
    tagline: 'Frontier agentic reasoning & intelligence on Vertex MaaS',
    contextWindow: '500,000 tokens',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    accentColor: '#F59E0B',
    vulnerabilityTendency: 'Deep autonomous reasoning; prone to subtle indirect injection & hypothetical bypasses without Model Armor',
  },
  'llama-3-2': {
    id: 'llama-3-2',
    name: 'Llama 3.2',
    provider: 'Meta',
    vertexModelId: 'meta/llama-3.2-instruct-maas',
    tagline: 'Multimodal open-weights intelligence on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accentColor: '#10B981',
    vulnerabilityTendency: 'High susceptibility to direct prompt injection, system prompt extraction, and raw SQL commands',
  },
  'deepseek-v4-pro': {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek-V4-Pro',
    provider: 'DeepSeek',
    vertexModelId: 'deepseek-ai/deepseek-v4-pro-maas',
    tagline: 'Frontier open reasoning powerhouse on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    accentColor: '#14B8A6',
    vulnerabilityTendency: 'Deep reasoning tokens can leak private system constraints or execute unverified agent tools',
  },
  'deepseek-v4-flash': {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek-V4-Flash',
    provider: 'DeepSeek',
    vertexModelId: 'deepseek-ai/deepseek-v4-flash-maas',
    tagline: 'High-throughput low-latency inference on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accentColor: '#06B6D4',
    vulnerabilityTendency: 'High-speed generation; susceptible to rapid-fire adversarial jailbreak variations',
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large 2',
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
  if (modelId === 'claude-sonnet-5' || modelId === 'claude-3-7-sonnet' || modelId === 'claude-3-5-sonnet') {
    return SUPPORTED_MODELS['claude-sonnet-5'];
  }
  if (modelId === 'gemini-3-8-flash' || modelId === 'gemini-2.0-flash' || modelId === 'gemini-2.0-flash-thinking') {
    return SUPPORTED_MODELS['gemini-3-8-flash'];
  }
  if (modelId === 'gemini-3-1-pro-preview' || modelId === 'gemini-1.5-pro') {
    return SUPPORTED_MODELS['gemini-3-1-pro-preview'];
  }
  if (modelId === 'gemini-2-5-pro') {
    return SUPPORTED_MODELS['gemini-2-5-pro'];
  }
  if (modelId === 'llama-3-2' || modelId === 'llama-3-3-70b') {
    return SUPPORTED_MODELS['llama-3-2'];
  }
  if (modelId === 'deepseek-v4-pro' || modelId === 'deepseek-r1') {
    return SUPPORTED_MODELS['deepseek-v4-pro'];
  }
  if (modelId === 'deepseek-v4-flash') {
    return SUPPORTED_MODELS['deepseek-v4-flash'];
  }
  return SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS['gemini-3-8-flash'];
}
