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
variable "tier" { type = string; default = "db-f1-micro" }

resource "google_sql_database_instance" "postgres" {
  name             = "model-arena-db"
  project          = var.project_id
  region           = var.region
  database_version = "POSTGRES_15"

  settings {
    tier = var.tier
    activation_policy = "ALWAYS"

    ip_configuration {
      ipv4_enabled = true
    }

    database_flags {
      name  = "cloudsql.enable_pgvector"
      value = "on"
    }

    backup_configuration {
      enabled = true
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "database" {
  name     = "model_arena"
  project  = var.project_id
  instance = google_sql_database_instance.postgres.name
}

output "instance_name" {
  value = google_sql_database_instance.postgres.name
}

output "connection_name" {
  value = google_sql_database_instance.postgres.connection_name
}
