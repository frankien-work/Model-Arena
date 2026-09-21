# Model Arena Features & Sales Battlecards ⚡️

This document catalogs every capability of **Model Arena**, complete with technical explanations, value propositions, and **Sales Engineering (SE) / Account Manager (AM) battlecards** tailored for startup pitches.

---

## 1. Feature Catalog

### 1.1 Multi-Model Streaming Arena
- **What it does:** Allows users to run prompts simultaneously across up to 4 models, streaming tokens side-by-side with sub-100ms latency.
- **Models Supported:**
  - **Google Gemini 2.0 Flash:** Ultra-fast, next-gen multimodal frontier model.
  - **Google Gemini 1.5 Pro:** High-reasoning model with 2M token context window.
  - **Anthropic Claude 3.5 Sonnet:** Top-tier coding and reasoning model available via Vertex AI Models-as-a-Service (MaaS).
  - **Meta Llama 3.3 70B:** Leading open-weights model hosted on Vertex Model Garden.
- **Metrics Tracked:**
  - `TTFT (Time to First Token)`: Measured in milliseconds from request dispatch.
  - `Throughput`: Generated tokens per second.
  - `Total Duration`: End-to-end execution time.
  - `Calculated Cost ($)`: Input + Output token pricing computed in real-time.

### 1.2 Interactive Model Armor Red-Team Lab
- **What it does:** Provides a dedicated red-teaming arena where users can test real-world attacks with **Google Cloud Model Armor** toggled `OFF` vs `ON`.
- **Pre-Built Attack Suites:**
  - **Direct Prompt Injection:** Overriding system instructions with adversarial commands.
  - **DAN / Jailbreak Personas:** Bypassing ethical and safety guardrails via roleplay scenarios.
  - **System Prompt & Secret Extraction:** Attempting to extract hidden API keys, instructions, or internal credentials.
  - **PII Exfiltration:** Testing whether sensitive customer data (SSNs, credit cards, emails) is detected and masked via Cloud DLP integration.
- **Visual Feedback:**
  - Risk score bar (0–100% confidence).
  - Categorized inspection flags (Prompt Injection, Jailbreak, Sensitive Data, Toxic Language).
  - Latency impact breakdown (showing Model Armor inspection adds < 25ms overhead).

### 1.3 Semantic Prompt Clustering & RAG (`pgvector`)
- **What it does:** Embeds prompt queries using Vertex AI Embeddings and stores them in Cloud SQL PostgreSQL using the `pgvector` extension.
- **Capabilities:**
  - Visual 2D semantic distance map of historical prompts.
  - Semantic similarity search (`<->` cosine distance operator).
  - Semantic caching demo: Shows startups how caching near-identical prompts can cut their LLM API spend by 30–50%.

### 1.4 BigQuery Telemetry & Cost Analytics
- **What it does:** Streams every benchmark invocation into a BigQuery dataset (`model_arena_telemetry`).
- **Capabilities:**
  - Real-time cost accumulation by model, user, and day.
  - Latency P50, P95, and P99 distribution calculations.
  - Model Armor block rates and security incident reporting.

### 1.5 Client Presentation Mode
- **What it does:** A one-click toggle in the navigation bar designed for customer-facing meetings.
- **Behavior:**
  - Hides developer debug panels, raw JSON payloads, and internal parameters.
  - Enlarges typography and optimizes charts for shared screens / projectors.
  - Displays high-level ROI and cost savings comparisons between Gemini and alternative models.

### 1.6 In-App Architecture & Docs Explorer
- **What it does:** Renders system architecture diagrams, cost breakdowns, and live Markdown docs directly inside the application UI.
- **Value for SEs:** Eliminates the need to switch between slides, GitHub, and the live demo during meetings.

---

## 2. Sales Engineering & Account Manager Battlecards

### Battlecard 1: Gemini 2.0 Flash vs GPT-4o / GPT-4o-mini
| Feature | Google Gemini 2.0 Flash | OpenAI GPT-4o-mini | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Pricing (per 1M input)** | **$0.10** | $0.15 | *"Gemini 2.0 Flash is 33% cheaper on input tokens while delivering frontier-tier reasoning."* |
| **Pricing (per 1M output)** | **$0.40** | $0.60 | *"Lower output cost dramatically reduces ongoing cost for agentic loops."* |
| **Context Window** | **1,000,000+ tokens** | 128,000 tokens | *"You can feed entire codebases or quarterly financial reports without chunking."* |
| **Multimodal Native** | Text, Audio, Video, Image | Text, Image | *"Gemini natively processes audio and video without separate transcription APIs."* |

---

### Battlecard 2: Claude 3.5 Sonnet on Vertex AI vs Claude on AWS Bedrock
| Feature | Claude 3.5 on Vertex AI | Claude on AWS Bedrock | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Unified IAM & VPC** | Native GCP IAM & VPC-SC | Requires AWS IAM setup | *"If your stack is on GCP, access Claude under the same billing, quotas, and VPC-SC perimeter."* |
| **Integrated Guardrails** | **Google Cloud Model Armor** | AWS Bedrock Guardrails | *"Protect Claude calls using Model Armor's enterprise-grade jailbreak and prompt injection defense."* |
| **Commitment Discounts**| Applies to Google Cloud CUDs | AWS Compute / Bedrock pools | *"Consolidate all cloud spend toward your Google Cloud committed use discount."* |

---

### Battlecard 3: Google Cloud Model Armor vs DIY Guardrails
| Feature | Google Cloud Model Armor | DIY Open Source (LlamaGuard/NeMo) | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Operational Overhead** | **100% Fully Managed API** | Host & scale dedicated GPUs | *"No GPU clusters to manage, maintain, or pay for when idle. Instant scale-to-zero."* |
| **Latency Overhead** | **< 30ms** | 150–400ms (self-hosted LLM) | *"Model Armor evaluates prompts in sub-30ms without doubling your user-facing latency."* |
| **Enterprise Audit** | Direct SCCe & Cloud Audit Logs | Custom logging pipeline | *"Out-of-the-box compliance and security posture reporting into Security Command Center."* |
| **Total Cost** | Pay-per-inspection (fraction of a cent)| ~$500+/mo for GPU instances | *"Saves thousands of dollars per year compared to running dedicated guardrail models."* |

---

### Battlecard 4: Cloud SQL + pgvector vs Dedicated Vector DBs (Pinecone / Qdrant)
| Feature | Cloud SQL with pgvector | Dedicated Vector DBs | Winning SE Talking Point |
| :--- | :--- | :--- | :--- |
| **Architectural Complexity**| **Single Database** (Relational + Vector) | 2 Databases (Syncing required) | *"No data synchronization lag or dual-write headaches between your user tables and vectors."* |
| **ACID Guarantees** | Full PostgreSQL ACID transactions | Eventual consistency | *"Update user permissions and embeddings in a single atomic transaction."* |
| **Cost** | Part of Cloud SQL instance ($10–$25/mo)| $70–$200+/mo baseline | *"Eliminates a costly third-party SaaS subscription from your monthly burn."* |
