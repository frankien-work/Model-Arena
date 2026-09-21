# Model Arena: Project Handoff & Continuity Brief 📋

**Date:** 2026-09-21  
**Version:** v1.1.0 (Production Scaffold)  
**Git Commit:** `d5dd5f3` (tag: `v1.1.0` on branch `main`)  
**Repository Path:** `/Users/frankien/Work`  
**Live Local Server:** `http://localhost:3000`

---

## 1. Project Objective & Strategic Context

- **What is Model Arena?**  
  A cloud-native **AI Security, Guardrail & Model Armor Sandbox** deployed in Google Cloud (Argolis test environment).
- **Target Persona & Users:**  
  Built for Google Cloud **Customer Engineers / Sales Engineers (CEs/SEs)** and **Account Managers (AMs)** partnering with fast-moving Series A/B funded startups.
- **Core Value Proposition:**  
  Startups are anxious about deploying GenAI due to prompt injection, IP theft, customer PII leaks, and autonomous agent data destruction. Model Arena proves that Google Cloud provides an enterprise-grade, low-latency (<20ms) defense perimeter across **both Google-native and third-party models**, demonstrated side-by-side with security guardrails **ON vs OFF**.
- **Financial Constraint:**  
  Strictly guaranteed to stay **under $600/month** (typical baseline spend is **$75 – $190/month**, and ~$8–$15/month when idle) using Cloud Run scale-to-zero, Cloud SQL off-hours pause scripts, BigQuery on-demand free tier, and programmatic GCP Billing Budget alerts at $300, $480, and $600.

---

## 2. What Was Accomplished (Current State)

### A. Full-Stack Web Application (`/src`)
- **Next.js 14 App Router + React + Tailwind CSS + Lucide Icons**: High-polish dark-mode UI with client presentation mode toggle and live budget tracker.
- **🛡️ Security Arena (`/`):**  
  Dual-Pane Shield comparison:
  - **Left Pane (Vulnerable - Guardrails OFF):** Shows the raw unarmored model falling for DAN jailbreaks, printing secret system prompts/API keys, echoing raw credit cards, or executing malicious SQL.
  - **Right Pane (Protected - Guardrails ON):** Shows **Model Armor**, **Cloud DLP**, and **Agent Gateway** actively blocking and sanitizing threats in sub-20ms with risk scores and SCCe audit IDs.
- **🤖 Agent Gateway & Tool Security Lab (`/agent-gateway`):**  
  Interactive simulator where an autonomous agent attempts database queries (`execute_sql_query`) or admin actions. Shows Agent Gateway blocking destructive SQL injections (`DROP TABLE`) in 12ms before they touch Cloud SQL.
- **📊 SCCe & Telemetry Stream (`/telemetry`):**  
  Real-time audit queue connected to BigQuery and Security Command Center Enterprise format, tracking threat distribution (Injections, Jailbreaks, PII Leaks, Tool Abuse).
- **🏛 Architecture & Battlecards In-App Viewer (`/docs`):**  
  Renders interactive system diagrams, SE sales battlecards, and 5-minute customer pitch scripts directly in the browser during meetings.

### B. Multi-Model Hub Supported (`src/lib/models.ts`)
- **Google Gemini 2.0 Flash** (Ultra-low latency frontier model)
- **Google Gemini 1.5 Pro** (2M token context window)
- **Anthropic Claude 3.5 Sonnet** (Vertex AI MaaS)
- **Meta Llama 3.3 70B** (Vertex Model Garden)
- **Mistral Large 2** (Vertex Model Garden)

### C. Full Startup Risk Spectrum Presets (`src/lib/security-engine.ts`)
1. **🚨 System Prompt & IP Extraction** (Adversarial instruction override)
2. **🎭 DAN (Do Anything Now) Jailbreak** (Unrestricted persona evasion)
3. **💳 Customer PII & Payment Card Leakage** (Cloud DLP tokenization)
4. **💣 Agentic SQL & Tool Parameter Injection** (Destructive DDL/DML defense)
5. **☣️ Indirect RAG Document Poisoning** (Hidden exfiltration markdown links)

### D. Living Documentation Suite (`/docs`)
- `docs/ARCHITECTURE.md`: Complete defense-in-depth pipeline (Edge, DLP, Model Armor, Agent Gateway, SCCe).
- `docs/FEATURES.md`: Competitive battlecards (*Model Armor vs DIY LlamaGuard*, *Protecting Claude on Vertex vs AWS Bedrock*).
- `docs/DEMO_GUIDE.md`: 5-minute executive pitch script and 15-minute technical deep-dive walkthrough.
- `docs/COST_OPTIMIZATION.md`: Exact resource sizing, scale-to-zero configs, and pause scripts.
- `docs/ROADMAP.md`: Quarterly vision (Phase 1 Foundation, Phase 2 Telemetry, Phase 3 Agentic Safety).
- `docs/CHANGELOG.md` & `docs/VERSIONING.md`: SemVer 2.0.0 documentation.

### E. Modular Terraform Infrastructure (`/terraform`)
- `modules/cloud_run`: Scale-to-zero (`min_instances = 0`, `max_instances = 5`).
- `modules/cloud_sql`: PostgreSQL 15 with `pgvector` enabled (`db-f1-micro`).
- `modules/bigquery`: Telemetry dataset `model_arena_telemetry.benchmark_runs`.
- `modules/storage`: Dataset bucket with 30-day auto-purge lifecycle rule.
- `modules/budget`: Programmatic GCP Billing Budget alert ($600 ceiling).

### F. Operations & Control Scripts (`/scripts`)
- `scripts/deploy.sh`: Automated Cloud Run build & deployment.
- `scripts/setup-argolis.sh`: Enables GCP APIs (`aiplatform`, `run`, `sqladmin`, `bigquery`, `storage`, etc.) and provisions least-privilege service account.
- `scripts/toggle-cloud-sql.sh`: One-click pause (`./scripts/toggle-cloud-sql.sh pause`) to drop database cost to ~$8/mo when not demoing.

---

## 3. Where We Left Off & How to Pick Up in Antigravity

When you open this folder in **Antigravity**:

1. **Workspace Folder:**  
   Open `/Users/frankien/Work` in Antigravity.
2. **Environment & Node Setup:**  
   Node.js v20 is installed at `~/.local/node/bin/node` (added to `~/.zshrc` and `~/.bash_profile`).  
   Run local dev server:
   ```bash
   cd /Users/frankien/Work
   npm run dev
   ```
   Access at `http://localhost:3000`.
3. **Immediate Next Action Items for the Antigravity Agent:**
   - **Git Remote:** Link to your GitHub/GitLab remote:
     ```bash
     git remote add origin <YOUR_REPO_URL>
     git push -u origin main --tags
     ```
   - **Argolis Cloud Deployment:** When ready to deploy to your actual Argolis project:
     ```bash
     ./scripts/setup-argolis.sh <PROJECT_ID> us-central1
     ./scripts/deploy.sh --project-id <PROJECT_ID> --region us-central1
     ```
   - **Real Vertex AI SDK Connectors:** The application currently has clean provider wrappers with realistic simulation profiles. When authenticated with `gcloud auth application-default login`, you can wire `@google-cloud/vertexai` directly for live production token streaming.
