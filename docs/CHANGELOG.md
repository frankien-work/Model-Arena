# Model Arena Changelog 📜

All notable changes to **Model Arena** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-21

### Changed & Refactored
- **Dedicated AI Security Focus:** Refactored the core application to exclusively focus on showcasing Google Cloud AI Security Solutions with them **ON vs OFF** across diverse models.
- **Dual-Pane Shield Arena (`/`):** Replaced generic benchmark view with an instant side-by-side comparison:
  - **Left Pane:** Vulnerable (Security OFF) showing raw model exploits, leaked system prompts, and unmasked credit cards.
  - **Right Pane:** Protected (Security ON) showing **Model Armor**, **Cloud DLP**, and **Agent Gateway** actively blocking and sanitizing threats with risk scores.
- **Broad Multi-Provider Hub:** Added support for **Gemini 2.0 Flash**, **Gemini 1.5 Pro**, **Anthropic Claude 3.5 Sonnet** (Vertex MaaS), **Meta Llama 3.3 70B**, and **Mistral Large 2** (Vertex Model Garden).
- **Full Startup Risk Spectrum Presets:**
  - System Prompt & IP Extraction
  - DAN (Do Anything Now) Jailbreaks
  - Customer PII & Payment Card Exfiltration (SSN, Credit Cards)
  - Agentic SQL & Tool Parameter Injection
  - Indirect RAG Document Poisoning
- **Agent Gateway & Tool Security Lab (`/agent-gateway`):** New dedicated lab demonstrating autonomous agent tool validation and SQL defense.
- **Security Command Center Enterprise (`/telemetry`):** Audit findings and threat breakdown dashboard connected to BigQuery and Cloud Logging.
- **Updated Living Documentation:** Refactored `ARCHITECTURE.md`, `FEATURES.md`, `DEMO_GUIDE.md`, and `README.md` to align with the security mission.

---

## [1.0.0] - 2026-09-21

### Added
- Initial release of Model Arena scaffold.
- Modular Terraform infrastructure for Cloud Run, Cloud SQL, BigQuery, and Budget alerts.
- Operations scripts (`deploy.sh`, `setup-argolis.sh`, `toggle-cloud-sql.sh`).
