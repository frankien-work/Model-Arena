terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. IAM & Service Account
module "security" {
  source     = "./modules/security"
  project_id = var.project_id
}

# 2. Cloud Storage (Datasets & Prompts)
module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  region     = var.region
}

# 3. BigQuery Telemetry Dataset
module "bigquery" {
  source     = "./modules/bigquery"
  project_id = var.project_id
  region     = var.region
}

# 4. Cloud SQL PostgreSQL (pgvector)
module "cloud_sql" {
  source     = "./modules/cloud_sql"
  project_id = var.project_id
  region     = var.region
  tier       = var.cloud_sql_tier
}

# 5. Cloud Run Application Service
module "cloud_run" {
  source                = "./modules/cloud_run"
  project_id            = var.project_id
  region                = var.region
  service_account_email = module.security.service_account_email
}

# 6. GCP Billing Budget Guardrail (<$600 ceiling)
module "budget" {
  source                 = "./modules/budget"
  project_id             = var.project_id
  billing_account_id     = var.billing_account_id
  monthly_budget_ceiling = var.monthly_budget_ceiling
}
