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

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "google_storage_bucket" "datasets" {
  name                        = "model-arena-datasets-${var.project_id}-${random_id.bucket_suffix.hex}"
  location                    = var.region
  project                     = var.project_id
  uniform_bucket_level_access = true
  force_destroy               = true

  lifecycle_rule {
    condition {
      age = 30 # Auto-delete old exports after 30 days
    }
    action {
      type = "Delete"
    }
  }
}

output "bucket_name" {
  value = google_storage_bucket.datasets.name
}
