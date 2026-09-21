terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
}

variable "project_id" { type = string }
variable "billing_account_id" { type = string }
variable "monthly_budget_ceiling" { type = number; default = 600 }

resource "google_billing_budget" "mode_arena_budget" {
  count           = var.billing_account_id != "" ? 1 : 0
  billing_account = var.billing_account_id
  display_name    = "Mode Arena Sandbox Monthly Spend Guardrail"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = tostring(var.monthly_budget_ceiling)
    }
  }

  threshold_rules {
    threshold_percent = 0.50 # Alert at $300
    spend_basis       = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 0.80 # Alert at $480
    spend_basis       = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 1.00 # Alert at $600
    spend_basis       = "CURRENT_SPEND"
  }
}
