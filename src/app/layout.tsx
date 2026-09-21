import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Model Arena ⚡️ | Google Cloud AI Security Sandbox',
  description: 'Enterprise AI Security & Defense Sandbox featuring Model Armor, Cloud DLP, Agent Gateway, and SCCe across Gemini, Claude, Llama, and Mistral.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafd] text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        {/* Top Header / Navigation */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Subtitle */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900">
                      Model Arena
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      Security Sandbox
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Google Cloud AI Defense & Guardrails
                  </div>
                </div>
              </Link>
            </div>

            {/* 4 Focused Security Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-sm">
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all font-medium flex items-center gap-1.5"
              >
                <span>🛡️</span>
                <span>Security Arena</span>
              </Link>
              <Link
                href="/agent-gateway"
                className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all font-medium flex items-center gap-1.5"
              >
                <span>🤖</span>
                <span>Agent Gateway</span>
              </Link>
              <Link
                href="/telemetry"
                className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all font-medium flex items-center gap-1.5"
              >
                <span>📊</span>
                <span>SCCe & Telemetry</span>
              </Link>
              <Link
                href="/docs"
                className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all font-medium flex items-center gap-1.5"
              >
                <span>🏛</span>
                <span>Architecture & Battlecards</span>
              </Link>
            </nav>

            {/* Right Status / Budget Guardrail Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-500 font-medium">Monthly Budget</span>
                <span className="font-mono font-bold text-slate-800">
                  <span className="text-emerald-600">$42.18</span> <span className="text-slate-400 font-normal">/ $600.00</span>
                </span>
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
                title="Google Cloud Security Perimeter Active (Model Armor, Cloud DLP, Agent Gateway)"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-medium">Model Arena v1.1.0 • Google Cloud AI Security & Guardrail Sandbox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="hover:text-slate-800 transition-colors">SE Battlecards</Link>
              <span>•</span>
              <a href="https://cloud.google.com/security" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">Model Armor</a>
              <span>•</span>
              <a href="https://cloud.google.com/sensitive-data-protection" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">Cloud DLP</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
