import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mode Arena ⚡️ | Google Cloud GenAI & Security Sandbox',
  description: 'Enterprise-grade GenAI Evaluation, Model Armor Security, and Multi-Model Benchmarking for Google Cloud Sales Engineers and Account Managers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        {/* Top Header / Navigation */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Environment Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  ⚡️
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Mode Arena
                  </span>
                  <span className="ml-1.5 text-xs font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Argolis
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-sm">
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all font-medium flex items-center gap-1.5"
              >
                <span>⚡️</span>
                <span>Arena</span>
              </Link>
              <Link
                href="/red-team"
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all font-medium flex items-center gap-1.5"
              >
                <span>🛡</span>
                <span>Red-Team Lab</span>
              </Link>
              <Link
                href="/rag"
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all font-medium flex items-center gap-1.5"
              >
                <span>🔍</span>
                <span>pgvector RAG</span>
              </Link>
              <Link
                href="/telemetry"
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all font-medium flex items-center gap-1.5"
              >
                <span>📊</span>
                <span>BigQuery Metrics</span>
              </Link>
              <Link
                href="/docs"
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all font-medium flex items-center gap-1.5"
              >
                <span>🏛</span>
                <span>Architecture & Docs</span>
              </Link>
            </nav>

            {/* Right Status / Budget Guardrail Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-400">Monthly Budget</span>
                <span className="font-mono font-semibold text-emerald-400">
                  $42.18 <span className="text-slate-500 font-normal">/ $600.00</span>
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" title="All GCP services healthy" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-[#070a12] py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>Mode Arena v1.0.0 • Built for Google Cloud Sales Engineering & Account Managers</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="hover:text-slate-300 transition-colors">Documentation</Link>
              <span>•</span>
              <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Vertex AI</a>
              <span>•</span>
              <a href="https://cloud.google.com/security" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Model Armor</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
