terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
}

variable "project_id" { type = string }
variable "region" { type = string }
variable "service_account_email" { type = string }

resource "google_cloud_run_v2_service" "mode_arena" {
  name     = "mode-arena"
  location = var.region
  project  = var.project_id

  template {
    service_account = var.service_account_email
    
    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    containers {
      image = "gcr.io/${var.project_id}/mode-arena:latest"
      
      resources {
        limits = {
          cpu    = "1000m"
          memory = "1Gi"
        }
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GCP_REGION"
        value = var.region
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.mode_arena.location
  project  = google_cloud_run_v2_service.mode_arena.project
  service  = google_cloud_run_v2_service.mode_arena.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_v2_service.mode_arena.uri
}
