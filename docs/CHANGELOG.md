# Mode Arena Changelog 📜

All notable changes to **Mode Arena** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-21

### Added
- **Multi-Model Streaming Arena:** Side-by-side prompt execution and streaming comparison across **Gemini 2.0 Flash**, **Gemini 1.5 Pro**, **Anthropic Claude 3.5 Sonnet** (Vertex AI MaaS), and **Meta Llama 3.3 70B**.
- **Real-Time Latency Waterfalls:** Visual breakdown of Time to First Token (TTFT), tokens/sec, and total duration.
- **Dynamic Cost Ticker:** Calculates cost per query using published Google Cloud Vertex AI pricing.
- **Interactive Red-Team & Model Armor Lab:** Live demonstration of Google Cloud **Model Armor** blocking prompt injections, DAN jailbreaks, and PII leakage with side-by-side `OFF` vs `ON` toggle.
- **Cloud SQL pgvector Integration:** Relational prompt storage and semantic vector similarity search using PostgreSQL 15 and `pgvector`.
- **BigQuery Telemetry Pipeline:** Streaming table schema and analytics view for tracking model latency and cost metrics.
- **Client Presentation Mode:** One-click toggle in the navigation bar that transforms the UI into an executive-ready pitch presentation.
- **In-App Architecture & Docs Explorer:** Live interactive rendering of Mermaid architecture diagrams and living documentation directly in the web UI.
- **Terraform Infrastructure as Code:** Modular Terraform configuration for Cloud Run, Cloud SQL, BigQuery, Cloud Storage, IAM, and Billing Budget alerts (<$600 ceiling).
- **Operations & Control Scripts:**
  - `scripts/deploy.sh` for one-command Cloud Run deployment.
  - `scripts/toggle-cloud-sql.sh` for pausing/resuming Cloud SQL instances.
  - `scripts/setup-argolis.sh` for enabling GCP APIs and setting up service accounts.
- **Living Documentation Suite:** Complete set of documentation in `/docs` (Architecture, Roadmap, Features & Battlecards, Demo Guide, Cost Optimization, Changelog, Versioning).
