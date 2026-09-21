# Mode Arena ⚡️

> **Enterprise-Grade GenAI Evaluation, Model Armor Security & Multi-Model Benchmarking Platform**  
> *Built for Google Cloud Sales Engineers (CEs/SEs) & Account Managers (AMs) partnering with Series A/B Startups.*

[![Platform](https://img.shields.io/badge/Google%20Cloud-Argolis%20Verified-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com)
[![Compute](https://img.shields.io/badge/Compute-Cloud%20Run%20Serverless-24C1E0?logo=googlecloud)](https://cloud.google.com/run)
[![AI Hub](https://img.shields.io/badge/AI%20Hub-Vertex%20AI%20Model%20Garden-EA4335?logo=google)](https://cloud.google.com/vertex-ai)
[![Security](https://img.shields.io/badge/Security-Model%20Armor%20%2B%20SCCe-34A853?logo=googlecloud)](https://cloud.google.com/security)
[![Database](https://img.shields.io/badge/Database-Cloud%20SQL%20pgvector-336791?logo=postgresql)](https://cloud.google.com/sql)
[![Analytics](https://img.shields.io/badge/Analytics-BigQuery%20On--Demand-669DF6?logo=googlecloud)](https://cloud.google.com/bigquery)
[![Budget](https://img.shields.io/badge/Monthly%20Cost-%3C%24600%20(Est%20%2475--190)-00C853)](#cost-optimization--budget-guardrails)

---

## 🎯 Strategic Purpose

Fast-moving Series A and Series B startups make architectural decisions at breakneck speed. When evaluating Google Cloud, founders and CTOs consistently ask three pivotal questions:

1. **Model Portability & Performance:** *"How does Gemini 2.0 Flash / 1.5 Pro compare to Claude 3.5 Sonnet and open-weight models (Llama 3.3) on latency (TTFT), throughput, and cost per million tokens?"*
2. **AI Security & Guardrails:** *"How do we prevent prompt injection, jailbreaks, and PII leakage without building complex custom safety filters from scratch?"*
3. **Data Modernization & Cost:** *"Can we keep our relational PostgreSQL database, use vector search (`pgvector`), and stream real-time telemetry into BigQuery without massive infrastructure bills?"*

**Mode Arena** is a live, cloud-native showcase answering these exact questions. It runs in an **Argolis** test environment, strictly adheres to a **<$600/month budget ceiling**, and serves as both an interactive customer pitch tool and a living technical blueprint.

---

## 🚀 Key Capabilities

- **⚡️ Multi-Model Streaming Arena:** Side-by-side prompt execution comparing Gemini 2.0 Flash, Gemini 1.5 Pro, Claude 3.5 Sonnet (Vertex AI MaaS), and Llama 3.3.
- **⏱ Real-Time Latency & Cost Waterfalls:** Visual breakdown of Time to First Token (TTFT), tokens/second throughput, end-to-end duration, and exact query cost calculated from published GCP pricing.
- **🛡 Interactive Red-Team & Model Armor Lab:** Live demonstration of Google Cloud **Model Armor** blocking direct prompt injection, DAN jailbreaks, system prompt extraction, and sensitive data leakage with toggleable comparison (`OFF` vs `ON`).
- **🔍 Semantic Prompt Clustering & RAG:** Cloud SQL PostgreSQL with `pgvector` indexing prompt embeddings and evaluating retrieval accuracy.
- **📊 BigQuery Telemetry & Audit Stream:** Streaming benchmark events into BigQuery for historical latency analysis and cost forecasting.
- **👔 SE & AM Client Presentation Mode:** One-click executive view hiding developer debug panels, highlighting business ROI, cost comparisons, and architecture diagrams.
- **📖 In-App Architecture & Docs Explorer:** Live interactive architecture diagrams rendered directly in the application.

---

## 🏛 Solution Architecture

```mermaid
flowchart TB
    subgraph ClientLayer [Client Presentation Layer]
        User[SE / AM / Startup CTO]
        WebUI[Next.js 14/15 Dark-Mode App]
        User -->|Interacts with Arena & Red-Team Lab| WebUI
    end

    subgraph SecurityPerimeter [Security & Guardrails]
        IAP[Identity-Aware Proxy / Cloud IAM]
        ModelArmor[Google Cloud Model Armor]
        SCCe[Security Command Center Enterprise]
    end

    subgraph ServerlessCompute [Cloud Run Scale-to-Zero]
        Frontend[Frontend Web Service]
        ModelRouter[Unified Model Router API]
    end

    subgraph VertexAIHub [Vertex AI Model Garden]
        GeminiFlash[Gemini 2.0 Flash]
        GeminiPro[Gemini 1.5 Pro]
        ClaudeSonnet[Claude 3.5 Sonnet via Vertex]
        Llama[Llama 3.3 / Gemma 2 via Vertex]
        GeckoEmbed[Vertex Text Embeddings gecko]
    end

    subgraph DataStack [Data & Analytics Layer]
        CloudSQL[(Cloud SQL Postgres + pgvector)]
        BigQuery[(BigQuery Telemetry Warehouse)]
        GCS[(Cloud Storage Benchmark Suites)]
    end

    WebUI -->|HTTPS / WSS| IAP
    IAP --> Frontend
    Frontend --> ModelRouter

    ModelRouter -->|1. Inspect Prompt| ModelArmor
    ModelArmor -->|Safe / Sanitized| ModelRouter
    ModelRouter -->|2. Stream Inference| VertexAIHub
    VertexAIHub -->|3. Streaming Tokens| ModelRouter
    ModelRouter -->|4. Inspect Output| ModelArmor
    ModelArmor -.->|Log Security Events| SCCe

    ModelRouter -->|Store Prompts & Embeddings| CloudSQL
    ModelRouter -->|Stream Latency & Cost Logs| BigQuery
    ModelRouter -->|Load Test Suites| GCS
```

---

## 💰 Cost Optimization & Budget Guardrails

Mode Arena is specifically architected to run well under **$600/month** (typically **$75 – $190/month** for active demo usage, and **~$8 – $15/month** when idle):

| Service | Strategy | Idle Cost | Active Pitch Cost |
| :--- | :--- | :--- | :--- |
| **Cloud Run** | Min instances: 0 (Scale-to-Zero), max: 5 | $0.00 | $5.00 – $15.00 |
| **Cloud SQL** | `db-f1-micro` / `db-g1-small` with pause script | $8.00 (paused off-hours) | $20.00 – $35.00 |
| **Vertex AI** | Pay-per-token API calls during demos | $0.00 | $50.00 – $120.00 |
| **Model Armor** | Pay-per-request prompt inspection | $0.00 | $5.00 – $15.00 |
| **BigQuery** | On-demand (< 1 TB query/mo free tier) | $0.00 | < $1.00 |
| **Cloud Storage** | Standard tier (< 10 GB datasets) | $0.00 | < $0.50 |
| **Budget Alert** | Programmatic alerts at $300, $480, $600 | $0.00 | $0.00 |

Use the included helper script to pause Cloud SQL outside demo hours:
```bash
./scripts/toggle-cloud-sql.sh pause
./scripts/toggle-cloud-sql.sh resume
```

---

## 📚 Living Documentation Suite

Comprehensive technical and sales documentation is maintained in the [`docs/`](./docs) directory:

- 🏛 **[Architecture Deep-Dive](docs/ARCHITECTURE.md):** Complete component architecture, network topologies, and security boundaries.
- 🗺 **[Product Roadmap](docs/ROADMAP.md):** Planned quarterly milestones and future GCP integrations.
- ⚡️ **[Features & Battlecards](docs/FEATURES.md):** Feature catalog, startup pitch talking points, and competitor comparisons.
- 🎤 **[SE & AM Demo Guide](docs/DEMO_GUIDE.md):** 5-minute elevator pitch script and 15-minute technical deep-dive walkthrough.
- 💵 **[Cost Optimization Guide](docs/COST_OPTIMIZATION.md):** Detailed breakdown of budget controls and resource sizing.
- 📜 **[Changelog](docs/CHANGELOG.md):** Version history and feature release notes.
- 🏷 **[Versioning Strategy](docs/VERSIONING.md):** Semantic versioning and branching guidelines.

---

## 🛠 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ & npm
- Google Cloud CLI (`gcloud`) with ADC configured (`gcloud auth application-default login`)
- GCP Project with Vertex AI enabled (e.g. Argolis sandbox)

### 2. Setup & Installation
```bash
# Clone and enter directory
cd /Users/frankien/Work

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment to Google Cloud

Deploy the entire platform to Cloud Run in your Argolis project:

```bash
# Make deployment scripts executable
chmod +x scripts/*.sh

# Run automated deployment
./scripts/deploy.sh --project-id YOUR_ARGOLIS_PROJECT_ID --region us-central1
```

To provision infrastructure using Terraform:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform apply
```

---

## 🤝 Contributing & Best Practices

- Adhere to [Semantic Versioning 2.0.0](docs/VERSIONING.md).
- Keep all architecture documents in sync when introducing new GCP services.
- Never commit credentials or service account keys (`.gitignore` enforced).
- Run `npm test` and `npm run lint` before committing code.
