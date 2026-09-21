# Model Arena Features & Security Battlecards ⚡️

This document catalogs every capability of **Model Arena**, complete with technical explanations and **Sales Engineering (SE) & Account Manager (AM) battlecards** focused on Google Cloud's AI Security Solutions.

---

## 1. Feature Catalog

### 1.1 Dual-Pane Security Arena (Vulnerable vs Protected)
- **What it does:** Allows SEs and AMs to test any model with Google Cloud security solutions toggled **ON vs OFF** side-by-side.
- **Left Pane (Vulnerable - Guardrails OFF):** Demonstrates how raw models fail, fall for DAN jailbreaks, leak confidential system prompts, or echo raw payment card numbers.
- **Right Pane (Protected - Guardrails ON):** Demonstrates **Model Armor**, **Cloud DLP**, and **Agent Gateway** actively neutralizing the attack in sub-20ms, showing risk scores and audit findings.

### 1.2 Granular Security Control Panel
- Individual toggle switches to isolate which layer stops which threat:
  - **🛡️ Model Armor:** Defends against prompt injections and jailbreaks.
  - **🔒 Cloud DLP:** Masks PII and secrets (SSNs, Credit Cards).
  - **🤖 Agent Gateway:** Validates tool parameters and blocks destructive SQL.
  - **📋 SCCe Logging:** Dispatches findings to Security Command Center Enterprise.

### 1.3 Full Startup Risk Spectrum Presets
- One-click presets for real-world startup AI vulnerabilities:
  1. **🚨 System Prompt & IP Extraction:** Attempted theft of proprietary system instructions.
  2. **🎭 DAN Jailbreak:** Persona manipulation to bypass ethical safeguards.
  3. **💳 Customer PII Leakage:** Credit card and SSN tokenization via Cloud DLP.
  4. **💣 Agentic SQL Injection:** Destructive SQL commands inside agent tool calling.
  5. **☣️ Indirect RAG Poisoning:** Hidden exfiltration links in retrieved documentation.

### 1.4 Agent Gateway & Tool Security Lab
- Dedicated simulation of autonomous agent tool calling.
- Intercepts calls to databases, admin tools, and financial APIs before they execute on backend Cloud SQL or third-party webhooks.

### 1.5 Security Command Center Enterprise (SCCe) Telemetry
- Real-time audit finding queue visualizing threat severity, confidence scores, and compliance mapping (SOC2, HIPAA).

---

## 2. Sales Engineering (SE) & Account Manager (AM) Battlecards

### Battlecard 1: Model Armor vs DIY Open Source (LlamaGuard)
| Feature | Google Cloud Model Armor | DIY Open Source (LlamaGuard/NeMo) | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Operational Overhead** | **100% Fully Managed API** | Must provision & scale dedicated GPUs | *"No GPU clusters to manage, maintain, or pay for when idle. Instant scale-to-zero."* |
| **Latency Overhead** | **< 20ms** | 200–400ms (self-hosted LLM) | *"Model Armor evaluates prompts in sub-20ms without doubling your user-facing latency."* |
| **Enterprise Audit** | Direct SCCe & Cloud Audit Logs | Custom logging pipeline required | *"Out-of-the-box compliance and security posture reporting into Security Command Center."* |
| **Total Cost** | Pay-per-inspection (fractions of a cent)| ~$500+/mo for idle GPU instances | *"Saves thousands of dollars per year compared to running dedicated guardrail models."* |

---

### Battlecard 2: Protecting Third-Party Models (Claude 3.7 & Llama 3.3)
| Feature | Claude / Llama on Vertex AI + Model Armor | Direct Third-Party API Endpoints | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Unified Security** | Protected by Model Armor & DLP | Relies on vendor's internal filters | *"Wrap Anthropic Claude or Meta Llama in Google's enterprise guardrails inside your VPC."* |
| **PII Redaction** | Cloud DLP masks data before model ingestion | Raw PII leaves your perimeter | *"Prevent customer SSNs and payment cards from ever leaving your cloud environment."* |
| **Tool Calling Safety**| **Agent Gateway** validates all tool calls | No native proxy validation | *"Prevent autonomous agents from executing destructive database commands."* |

---

### Battlecard 3: Agent Gateway vs Unrestricted Tool Calling
| Feature | Google Cloud Agent Gateway | Unrestricted Function Calling | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Parameter Sanitization**| Validates SQL/JSON before execution | Executes raw parameters directly | *"Blocks SQL injection attacks like DROP TABLE before they touch your database."* |
| **Privilege Enforcement**| Enforces least-privilege IAM tokens | Relies on application-level checks | *"Restricts autonomous agents from triggering unauthorized financial or admin actions."* |
| **Audit Trail** | Logs blocked tool calls to SCCe | No centralized security visibility | *"Every denied tool call is audited for enterprise compliance reviews."* |
