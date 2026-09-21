# Model Arena Cost Optimization & Budget Guide 💵

This document details how **Model Arena** maintains strict financial discipline, guaranteeing that monthly Google Cloud spend stays safely below the **$600/month budget ceiling** (with realistic monthly spend running between **$75 and $190/month**).

---

## 1. Budget Breakdown & Monthly Sizing

```
Monthly Budget Ceiling: $600.00
Target Typical Spend:  $75.00 – $190.00
Idle Spend (Off-Hours): ~$8.00 – $15.00
```

| Component | Sizing & Configuration | Idle Monthly Cost | Active Pitch Monthly Cost | Cost Reduction Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Cloud Run** | `min_instances = 0`, `max_instances = 5`, 1 vCPU, 1 GB RAM | $0.00 | $5.00 – $15.00 | **Scale-to-Zero:** CPU only allocated during active request processing. Zero billing when idle. |
| **Cloud SQL** | PostgreSQL 15, `db-f1-micro` or `db-g1-small` | $8.00 (paused) | $20.00 – $35.00 (24/7) | **Pause Script:** Stopping instance during non-demo hours cuts database compute charges by ~65%. |
| **Vertex AI** | Pay-per-token inference (Gemini, Claude, Llama) | $0.00 | $50.00 – $120.00 | **Token Limiter:** In-app cap prevents runaway loops or high-token benchmark floods. |
| **Model Armor** | Pay-per-inspection calls | $0.00 | $5.00 – $15.00 | **Selective Inspection:** Runs only during active benchmarks and red-team tests. |
| **BigQuery** | On-Demand queries | $0.00 | < $1.00 | **Free Tier:** First 1 TB of query processing and 10 GB of active storage per month are $0.00. |
| **Cloud Storage** | Standard tier, < 10 GB | $0.00 | < $0.50 | **Lifecycle Rule:** Auto-deletes temp export artifacts older than 14 days. |
| **Cloud Monitoring** | Ingestion & basic dashboards | $0.00 | $0.00 – $2.00 | **Log Sampling:** Limits debug log verbosity in production. |
| **Total** | — | **~$8.00 – $15.00** | **~$80.00 – $188.50** | **Safety Margin: > $410.00 under ceiling** |

---

## 2. Guardrail 1: Cloud Run Scale-to-Zero

Cloud Run automatically spins down container instances when no requests are being processed:
- `min-instances: 0`: No background container keeps running when an SE is not demoing.
- `max-instances: 5`: Caps maximum horizontal autoscaling, preventing accidental billing spikes if an endpoint is subjected to unexpected traffic.
- `concurrency: 80`: Multiple concurrent client requests are multiplexed into a single container instance, maximizing resource efficiency.

---

## 3. Guardrail 2: Cloud SQL Pause & Resume Automation

Cloud SQL instances accrue compute charges 24/7 unless paused. For an SE sandbox, you only need the database during demo hours.

Model Arena includes an automated control script [`scripts/toggle-cloud-sql.sh`](../scripts/toggle-cloud-sql.sh):

```bash
# Pause Cloud SQL when finished with demos
./scripts/toggle-cloud-sql.sh pause

# Resume Cloud SQL before customer calls
./scripts/toggle-cloud-sql.sh resume

# Check current status
./scripts/toggle-cloud-sql.sh status
```

### What happens when paused:
- Compute and RAM billing halts immediately.
- Only persistent disk storage (~$1.70/month for 10 GB SSD) is billed.
- Resuming takes ~90 seconds.

---

## 4. Guardrail 3: In-App Demo Token Limiter

To prevent accidental runaway loops or multi-megabyte prompt pastes during customer demos, the application code enforces strict request boundaries:
- **Maximum Input Tokens:** 16,384 tokens per single benchmark run.
- **Maximum Output Tokens:** 2,048 tokens per response.
- **Demo Rate Limiter:** Maximum 30 requests per minute per session.
- **Daily Spend Ticker:** The application calculates estimated token spend in real-time and displays an in-app banner if daily estimated spend exceeds $15.00.

---

## 5. Guardrail 4: Programmatic GCP Billing Budget Alerts

The Terraform infrastructure module [`terraform/modules/budget/`](../terraform/modules/budget/) automatically provisions a Google Cloud Billing Budget linked to your billing account:

```hcl
resource "google_billing_budget" "model_arena_budget" {
  billing_account = var.billing_account_id
  display_name    = "Model Arena Sandbox Monthly Budget"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "600"
    }
  }

  threshold_rules {
    threshold_percent = 0.50 # Alert at $300 (50%)
  }
  threshold_rules {
    threshold_percent = 0.80 # Alert at $480 (80%)
  }
  threshold_rules {
    threshold_percent = 1.00 # Alert at $600 (100%)
  }
}
```

Email alerts are dispatched automatically to project owners when spend crosses 50%, 80%, or 100% of the $600 budget.
