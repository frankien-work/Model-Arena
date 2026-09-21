export interface ModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'Meta' | 'Mistral';
  tagline: string;
  contextWindow: string;
  badgeColor: string;
  accentColor: string;
  vulnerabilityTendency: string; // What attacks this model is susceptible to when security is OFF
}

export const SUPPORTED_MODELS: Record<string, ModelConfig> = {
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tagline: 'Ultra-low latency frontier intelligence on Vertex AI',
    contextWindow: '1,000,000 tokens',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accentColor: '#4285F4',
    vulnerabilityTendency: 'Fast execution; susceptible to complex roleplay DAN jailbreaks if unarmored',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    tagline: 'High-reasoning multi-modal model with 2M context',
    contextWindow: '2,000,000 tokens',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accentColor: '#8B5CF6',
    vulnerabilityTendency: 'Strong instruction adherence; vulnerable to indirect RAG prompt poisoning in long context',
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'Frontier software engineering & reasoning via Vertex MaaS',
    contextWindow: '200,000 tokens',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    accentColor: '#F59E0B',
    vulnerabilityTendency: 'Nuanced output; can be manipulated into hypothetical persona bypasses without Model Armor',
  },
  'llama-3-3-70b': {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    tagline: 'Open-weights powerhouse on Vertex Model Garden',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accentColor: '#10B981',
    vulnerabilityTendency: 'High susceptibility to direct prompt injection, system prompt extraction, and raw SQL commands',
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    provider: 'Mistral',
    tagline: 'Leading European frontier model available on Vertex AI',
    contextWindow: '128,000 tokens',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    accentColor: '#EA580C',
    vulnerabilityTendency: 'Multilingual fluency; prone to cross-lingual jailbreaks and indirect tool exfiltration',
  },
};
