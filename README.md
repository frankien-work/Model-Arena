# Model Arena ⚡️

> **Google Cloud AI Security, Guardrail & Model Armor Sandbox**  
> *Built for Google Cloud Sales Engineers (CEs/SEs) & Account Managers (AMs) partnering with Series A/B Startups.*

[![Platform](https://img.shields.io/badge/Google%20Cloud-Argolis%20Verified-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com)
[![Compute](https://img.shields.io/badge/Compute-Cloud%20Run%20Serverless-24C1E0?logo=googlecloud)](https://cloud.google.com/run)
[![Security](https://img.shields.io/badge/Security-Model%20Armor%20%2B%20Cloud%20DLP-34A853?logo=googlecloud)](https://cloud.google.com/security)
[![Gateway](https://img.shields.io/badge/Agentic-Agent%20Gateway-EA4335?logo=google)](https://cloud.google.com/vertex-ai)
[![SecOps](https://img.shields.io/badge/Audit-SCCe%20%2B%20BigQuery-669DF6?logo=googlecloud)](https://cloud.google.com/security-command-center)
[![Budget](https://img.shields.io/badge/Monthly%20Cost-%3C%24600%20(Est%20%2475--190)-00C853)](#cost-optimization--budget-guardrails)

---

## 🎯 Strategic Purpose

Fast-moving Series A and Series B startups building on Generative AI have serious security concerns:

1. **Adversarial Injections & IP Theft:** *"How do we prevent malicious prompts from jailbreaking our models or extracting proprietary system prompts?"*
2. **Data Leakage & Privacy:** *"How do we guarantee that customer SSNs, credit cards, and API secrets are never ingested or echoed by models?"*
3. **Agentic Tool Safety:** *"When our autonomous AI agents execute tool calls, how do we block destructive SQL injections (`DROP TABLE`) or unauthorized API actions?"*
4. **Third-Party Model Protection:** *"Can we use Anthropic Claude or Meta Llama while still benefiting from Google Cloud's enterprise security perimeter?"*

**Model Arena** answers these questions through a live, side-by-side **"Vulnerable (OFF) vs Protected (ON)"** demonstration across both Google-native and partner models hosted on Vertex AI.

---

## 🛡 The 4 Core Google Cloud Security Layers

1. **Google Cloud Model Armor:** Real-time pre/post execution filter neutralizing prompt injections, DAN jailbreaks, and indirect RAG poisoning in sub-20ms.
2. **Sensitive Data Protection (Cloud DLP):** Automated detection and synthetic token masking for 150+ PII infoTypes (Credit cards, SSNs, API tokens).
3. **Google Cloud Agent Gateway:** Intercepts agent function calling, enforcing OpenAPI schema validation and denying destructive SQL commands.
4. **Security Command Center Enterprise (SCCe):** Automated compliance logging and threat event generation for SOC2 and HIPAA audit trails.

---

## 🚀 Key Platform Views

- **🛡️ Security Arena (`/`):** Select any model (Gemini 2.0 Flash, Gemini 1.5 Pro, Claude 3.5 Sonnet, Llama 3.3 70B, Mistral Large) and choose an attack preset. Experience the **Dual-Pane Shield**:
  - *Left Pane:* Vulnerable (Security OFF) — The attack succeeds, model complies with jailbreak, or leaks credentials.
  - *Right Pane:* Protected (Security ON) — Model Armor blocks the prompt, Cloud DLP masks PII, risk score gauge displayed, <20ms overhead.
- **🤖 Agent Gateway & Tool Security Lab (`/agent-gateway`):** Test autonomous agent tool calling with live SQL injection detection.
- **📊 SCCe & Telemetry Audit (`/telemetry`):** BigQuery-backed live audit queue with threat distribution analytics.
- **🏛 Architecture & Battlecards (`/docs`):** In-app system diagrams, SE sales battlecards, and 5-minute customer pitch scripts.

---

## 💰 Cost Optimization & Budget Guardrails

Mode Arena strictly respects your **<$600/month budget ceiling** (typical spend: **$75 – $190/month**):

- **Cloud Run Scale-to-Zero:** $0.00 idle compute cost.
- **Cloud SQL Pause Script:** `./scripts/toggle-cloud-sql.sh pause` drops database cost to ~$8–$12/month off-hours.
- **Pay-per-inspection Model Armor:** Costs fractions of a cent per request.
- **Programmatic GCP Billing Budget:** Alerts configured at $300, $480, and $600.

---

## 🛠 Quick Start (Local Testing)

```bash
cd /Users/frankien/Work
export PATH="$HOME/.local/node/bin:$PATH"

# Run local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.
