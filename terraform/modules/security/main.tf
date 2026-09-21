terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
}

variable "project_id" { type = string }

resource "google_service_account" "mode_arena_sa" {
  account_id   = "mode-arena-sa"
  display_name = "Mode Arena Application Service Account"
  project      = var.project_id
}

locals {
  roles = [
    "roles/aiplatform.user",
    "roles/cloudsql.client",
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/storage.objectViewer",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/secretmanager.secretAccessor"
  ]
}

resource "google_project_iam_member" "sa_roles" {
  for_each = toset(locals.roles)
  project  = var.project_id
  role     = each.key
  member   = "serviceAccount:${google_service_account.mode_arena_sa.email}"
}

output "service_account_email" {
  value = google_service_account.mode_arena_sa.email
}
