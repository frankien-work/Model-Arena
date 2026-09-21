variable "project_id" {
  description = "The Google Cloud project ID (e.g. Argolis sandbox)"
  type        = string
}

variable "region" {
  description = "Google Cloud region for compute and data resources"
  type        = string
  default     = "us-central1"
}

variable "billing_account_id" {
  description = "The Google Cloud Billing Account ID (for programmatic budget alerts)"
  type        = string
  default     = ""
}

variable "monthly_budget_ceiling" {
  description = "Monthly budget ceiling in USD"
  type        = number
  default     = 600
}

variable "cloud_sql_tier" {
  description = "Cloud SQL machine tier (db-f1-micro or db-g1-small)"
  type        = string
  default     = "db-f1-micro"
}
