'use client';

import React, { useState } from 'react';
import { INITIAL_PROMPT_EMBEDDINGS, calculateCosineSimilarity, CachedPrompt } from '@/lib/rag-data';

export default function RagPage() {
  const [prompts, setPrompts] = useState<CachedPrompt[]>(INITIAL_PROMPT_EMBEDDINGS);
  const [searchQuery, setSearchQuery] = useState('How to sign in to Google Cloud with ADC?');
  const [selectedPrompt, setSelectedPrompt] = useState<CachedPrompt>(INITIAL_PROMPT_EMBEDDINGS[0]);
  const [similarityResults, setSimilarityResults] = useState<{
    prompt: CachedPrompt;
    similarity: number;
  }[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const scored = prompts.map(p => ({
      prompt: p,
      similarity: calculateCosineSimilarity(searchQuery, p.query),
    }));
    scored.sort((a, b) => b.similarity - a.similarity);
    setSimilarityResults(scored);
    if (scored.length > 0) {
      setSelectedPrompt(scored[0].prompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>🔍 Cloud SQL pgvector RAG & Semantic Cache</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              PostgreSQL 15
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store relational application data and 768-dimensional vector embeddings in a single atomic database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            Cloud SQL: <span className="text-emerald-400 font-bold">db-f1-micro</span> (~$15/mo)
          </div>
        </div>
      </div>

      {/* Semantic Search & Cache Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="text-sm font-bold text-white flex items-center justify-between">
          <span>Semantic Vector Search (`pgvector` Cosine Distance)</span>
          <span className="text-xs font-mono text-blue-400">SELECT 1 - (embedding &lt;=&gt; $1) AS similarity</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Enter a user prompt to find nearest vector neighbor..."
            className="flex-1 bg-[#070a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
          >
            Vector Query
          </button>
        </div>

        {/* Search Results / Nearest Neighbors */}
        {similarityResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-xs font-bold text-slate-400">Nearest Neighbor Matches:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {similarityResults.slice(0, 2).map((res, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition-all ${
                    res.similarity > 0.7
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300">
                      {res.prompt.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Similarity: {(res.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white">{res.prompt.query}</p>
                  <div className="mt-2 text-[11px] text-slate-400 bg-black/30 p-2 rounded-lg font-mono">
                    {res.prompt.cachedResponse}
                  </div>
                  {res.similarity > 0.7 && (
                    <div className="mt-2 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                      <span>⚡️ Semantic Cache Hit:</span>
                      <span>LLM API avoided • Saved ~400 tokens ($0.0004)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cloud SQL Vector Schema & SE Pitch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>💻 PostgreSQL Schema with pgvector</span>
          </h3>
          <p className="text-xs text-slate-400">
            Enabling pgvector on Cloud SQL requires zero specialized vector database subscriptions.
          </p>
          <pre className="bg-[#070a12] p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
{`-- 1. Enable Vector Extension in Cloud SQL
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Relational Table with 768-dim Embeddings
CREATE TABLE prompt_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL,
    prompt_text TEXT NOT NULL,
    category VARCHAR(64),
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create HNSW Index for Sub-Millisecond Search
CREATE INDEX ON prompt_knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`}
          </pre>
        </div>

        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎯 Sales Engineering Value Proposition</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="font-bold text-white">Unified ACID + Vector Storage:</span>
              <p className="text-slate-400 mt-0.5">
                No need to maintain synchronization between a primary Postgres database and a separate vector DB like Pinecone.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="font-bold text-white">Semantic Cache Economics:</span>
              <p className="text-slate-400 mt-0.5">
                Serving repeated customer questions directly from pgvector cache saves 30–50% on downstream LLM token costs.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="font-bold text-white">Cloud SQL Auto-Stop Script:</span>
              <p className="text-slate-400 mt-0.5">
                Included <code>./scripts/toggle-cloud-sql.sh</code> halts compute billing outside work hours, dropping database cost to under $10/month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
