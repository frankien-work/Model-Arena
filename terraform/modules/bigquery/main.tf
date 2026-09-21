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

resource "google_bigquery_dataset" "telemetry" {
  dataset_id                  = "mode_arena_telemetry"
  friendly_name               = "Mode Arena Telemetry"
  description                 = "Live latency, token, and cost telemetry for Mode Arena"
  location                    = var.region
  project                     = var.project_id
  delete_contents_on_destroy  = true
}

resource "google_bigquery_table" "benchmark_runs" {
  dataset_id = google_bigquery_dataset.telemetry.dataset_id
  table_id   = "benchmark_runs"
  project    = var.project_id

  time_partitioning {
    type = "DAY"
  }

  clustering = ["model_id", "status"]

  schema = jsonencode([
    { name = "run_id", type = "STRING", mode = "REQUIRED" },
    { name = "timestamp", type = "TIMESTAMP", mode = "REQUIRED" },
    { name = "model_id", type = "STRING", mode = "REQUIRED" },
    { name = "prompt_text", type = "STRING", mode = "NULLABLE" },
    { name = "ttft_ms", type = "FLOAT", mode = "NULLABLE" },
    { name = "total_duration_ms", type = "FLOAT", mode = "NULLABLE" },
    { name = "tokens_per_sec", type = "FLOAT", mode = "NULLABLE" },
    { name = "input_tokens", type = "INTEGER", mode = "NULLABLE" },
    { name = "output_tokens", type = "INTEGER", mode = "NULLABLE" },
    { name = "cost_usd", type = "FLOAT", mode = "NULLABLE" },
    { name = "model_armor_status", type = "STRING", mode = "NULLABLE" },
    { name = "model_armor_risk_score", type = "FLOAT", mode = "NULLABLE" },
    { name = "status", type = "STRING", mode = "REQUIRED" }
  ])

  deletion_protection = false
}

output "dataset_id" {
  value = google_bigquery_dataset.telemetry.dataset_id
}

output "table_id" {
  value = google_bigquery_table.benchmark_runs.table_id
}
