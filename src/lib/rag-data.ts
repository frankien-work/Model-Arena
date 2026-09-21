export interface CachedPrompt {
  id: string;
  query: string;
  category: string;
  vectorCoordinates: [number, number]; // 2D projection for interactive chart
  cachedResponse: string;
  hits: number;
  tokensSaved: number;
  costSavedUSD: number;
}

export const INITIAL_PROMPT_EMBEDDINGS: CachedPrompt[] = [
  {
    id: 'p-1',
    query: 'How do I authenticate with Google Cloud using Application Default Credentials (ADC)?',
    category: 'GCP Auth',
    vectorCoordinates: [12, 45],
    cachedResponse: 'Use `gcloud auth application-default login` to generate local credentials for client libraries.',
    hits: 142,
    tokensSaved: 48500,
    costSavedUSD: 0.0485,
  },
  {
    id: 'p-2',
    query: 'How to log in to GCP CLI using default credentials?',
    category: 'GCP Auth',
    vectorCoordinates: [14, 43],
    cachedResponse: 'Run `gcloud auth application-default login` to set up ADC locally.',
    hits: 89,
    tokensSaved: 31200,
    costSavedUSD: 0.0312,
  },
  {
    id: 'p-3',
    query: 'What is the pricing difference between Gemini 2.0 Flash and Claude 3.5 Sonnet?',
    category: 'Model Economics',
    vectorCoordinates: [78, 82],
    cachedResponse: 'Gemini 2.0 Flash is $0.10/$0.40 per 1M tokens, while Claude 3.5 Sonnet is $3.00/$15.00 per 1M tokens.',
    hits: 210,
    tokensSaved: 95000,
    costSavedUSD: 0.285,
  },
  {
    id: 'p-4',
    query: 'Compare costs of Claude vs Gemini on Google Cloud',
    category: 'Model Economics',
    vectorCoordinates: [76, 85],
    cachedResponse: 'Gemini 2.0 Flash offers up to 90% cost savings compared to Claude 3.5 Sonnet on Vertex AI.',
    hits: 67,
    tokensSaved: 28400,
    costSavedUSD: 0.085,
  },
  {
    id: 'p-5',
    query: 'How do I enable pgvector extension on Cloud SQL PostgreSQL?',
    category: 'Database & RAG',
    vectorCoordinates: [55, 20],
    cachedResponse: 'Set database flag `cloudsql.enable_pgvector=on` in Cloud SQL settings, then run `CREATE EXTENSION vector;`.',
    hits: 115,
    tokensSaved: 51200,
    costSavedUSD: 0.051,
  },
];

export function calculateCosineSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  
  let intersection = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersection++;
  });
  
  const similarity = intersection / Math.sqrt(wordsA.size * wordsB.size);
  return Number(Math.min(1.0, similarity * 1.35).toFixed(3)); // scaled Jaccard proxy
}
