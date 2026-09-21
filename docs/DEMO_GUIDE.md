# Model Arena: SE & AM Security Demo Guide 🎤

This guide provides presentation scripts for **Sales Engineers (SEs)** and **Account Managers (AMs)** conducting live demonstrations on **Google Cloud AI Security Solutions** with startup founders, CTOs, and technical leads.

---

## ⏱ The 5-Minute AI Security Pitch Script

**Best for:** Account Managers and SEs in discovery meetings.  
**Goal:** Prove that Google Cloud offers the most comprehensive, lowest-latency AI defense perimeter (Model Armor, Cloud DLP, Agent Gateway, SCCe) across any model.

### Minute 1: The AI Security Dilemma
1. Open Model Arena at `http://localhost:3000`.
2. **Say:**  
   > *"Every fast-moving startup deploying GenAI into production faces the same three risks: How do you prevent attackers from extracting your proprietary system prompts? How do you keep customer credit cards and SSNs out of model context? And how do you ensure an autonomous agent doesn't accidentally execute a destructive SQL command on your database?"*

### Minute 2: Show the Unarmored Model (Security OFF)
1. Select **Llama 3.3 70B** or **Gemini 2.0 Flash**.
2. Click the preset: **"🚨 System Prompt & IP Extraction"**.
3. Point to the **Left Pane (VULNERABLE - Guardrails OFF)**.
4. **Say:**  
   > *"Look at what happens without Google Cloud guardrails. The raw model falls for the prompt override and prints out confidential system instructions, database URLs, and API keys. The attack succeeded completely."*

### Minute 3: Show Model Armor & Cloud DLP (Security ON)
1. Point to the **Right Pane (PROTECTED - Google Cloud Defense ON)**.
2. Highlight:
   - **Action: BLOCK** (<20ms latency overhead).
   - **Risk Score: 98% Confidence**.
   - The attack was stopped before ever reaching model context.
3. Switch attack preset to **"💳 Customer PII & Payment Card Leakage"**.
4. Show Cloud DLP in action:
   - Left pane echoes raw credit cards and SSNs.
   - Right pane automatically masks them to `[REDACTED_SSN]` and `[REDACTED_CREDIT_CARD]`.
5. **Say:**  
   > *"Notice the latency overhead—only 18 milliseconds! With Google Cloud Model Armor and Cloud DLP, you don't have to spin up expensive GPU clusters running LlamaGuard. You get fully managed protection that scales to zero."*

### Minute 4: Show Agent Gateway Tool Defense
1. Navigate to the **"Agent Gateway"** tab in the top navigation bar.
2. Select **"💾 Database Query Tool"** with the preset SQL injection:
   `"SELECT * FROM orders ...; DROP TABLE transactions; --"`
3. Click **"Dispatch Tool Call"**.
4. Show Agent Gateway actively denying the execution in 12ms before it touches Cloud SQL.
5. **Say:**  
   > *"If you're building autonomous agents with tool calling, Agent Gateway validates JSON arguments against your OpenAPI schemas and blocks destructive SQL commands automatically."*

### Minute 5: Close with SecOps & Compliance
1. Navigate to the **"SCCe & Telemetry"** tab.
2. Show the real-time event queue of blocked incidents.
3. **Say:**  
   > *"Every blocked injection and sanitized card number streams directly into Google Cloud Security Command Center Enterprise (SCCe). You get SOC2 and HIPAA audit compliance on day one without writing custom logging infrastructure."*

---

## ❓ Customer Objections & How to Win

### Objection: *"Can't we just write our own regex or use open-source LlamaGuard?"*
> **Winning Answer:** *"You can, but LlamaGuard requires running dedicated GPU instances 24/7, costing you $500+ every month and adding 200–400ms of latency. Google Cloud Model Armor is 100% serverless, costs fractions of a cent per request, inspects in sub-20ms, and integrates directly with Security Command Center."*

### Objection: *"We use Claude Sonnet 5, not Gemini. Does this help us?"*
> **Winning Answer:** *"Yes! That's one of Google Cloud's biggest strengths. By hosting Claude Sonnet 5 on Vertex AI, you can wrap Claude in Google's Model Armor and Cloud DLP, giving you an enterprise security perimeter that isn't possible with direct API keys."*
