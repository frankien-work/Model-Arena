output "project_id" {
  description = "Google Cloud Project ID"
  value       = var.project_id
}

output "region" {
  description = "Deployment Region"
  value       = var.region
}

output "cloud_run_url" {
  description = "Public URL of Mode Arena on Cloud Run"
  value       = module.cloud_run.service_url
}

output "cloud_sql_instance_name" {
  description = "Cloud SQL PostgreSQL Instance Name"
  value       = module.cloud_sql.instance_name
}

output "bigquery_dataset_id" {
  description = "BigQuery Telemetry Dataset ID"
  value       = module.bigquery.dataset_id
}

output "storage_bucket_name" {
  description = "Cloud Storage Bucket for Benchmark Datasets"
  value       = module.storage.bucket_name
}
