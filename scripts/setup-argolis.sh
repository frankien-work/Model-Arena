#!/usr/bin/env bash
# ==============================================================================
# Model Arena - Argolis Sandbox Setup & API Enablement Script
# Usage:
#   ./scripts/setup-argolis.sh [PROJECT_ID] [REGION]
# ==============================================================================

set -euo pipefail

PROJECT_ID="${1:-${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}}"
REGION="${2:-${GCP_REGION:-us-central1}}"
SA_NAME="model-arena-sa"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "❌ Error: Project ID required."
  echo "Usage: ./scripts/setup-argolis.sh <PROJECT_ID> [REGION]"
  exit 1
fi

echo "============================================================"
echo "⚡️ Model Arena: Setting up Argolis GCP Environment"
echo "Project ID: ${PROJECT_ID}"
echo "Region:     ${REGION}"
echo "============================================================"

# 1. Enable Required GCP APIs
echo "📦 Step 1/4: Enabling required Google Cloud APIs..."
APIS=(
  run.googleapis.com
  aiplatform.googleapis.com
  sqladmin.googleapis.com
  bigquery.googleapis.com
  storage.googleapis.com
  cloudbuild.googleapis.com
  artifactregistry.googleapis.com
  secretmanager.googleapis.com
  logging.googleapis.com
  monitoring.googleapis.com
)

for api in "${APIS[@]}"; do
  echo "  - Enabling ${api}..."
  gcloud services enable "${api}" --project="${PROJECT_ID}" --quiet || true
done
echo "✅ All APIs enabled."

# 2. Create Service Account
echo "🔐 Step 2/4: Creating least-privilege Service Account '${SA_NAME}'..."
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud iam service-accounts create "${SA_NAME}" \
    --project="${PROJECT_ID}" \
    --display-name="Model Arena Cloud Run Service Account" \
    --quiet
  echo "✅ Service account created: ${SA_EMAIL}"
else
  echo "ℹ️ Service account already exists: ${SA_EMAIL}"
fi

# 3. Grant IAM Roles
echo "🛡 Step 3/4: Granting required IAM roles..."
ROLES=(
  roles/aiplatform.user
  roles/cloudsql.client
  roles/bigquery.dataEditor
  roles/bigquery.jobUser
  roles/storage.objectViewer
  roles/secretmanager.secretAccessor
  roles/logging.logWriter
  roles/monitoring.metricWriter
)

for role in "${ROLES[@]}"; do
  echo "  - Granting ${role}..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="${role}" \
    --quiet &>/dev/null || true
done
echo "✅ IAM roles granted."

# 4. Create BigQuery Telemetry Dataset
echo "📊 Step 4/4: Initializing BigQuery dataset 'model_arena_telemetry'..."
if ! bq show --project_id="${PROJECT_ID}" model_arena_telemetry &>/dev/null; then
  bq --location="${REGION}" mk \
    --dataset \
    --description="Model Arena live latency, token, and cost telemetry" \
    "${PROJECT_ID}:model_arena_telemetry" || true
  echo "✅ Dataset 'model_arena_telemetry' created."
else
  echo "ℹ️ Dataset 'model_arena_telemetry' already exists."
fi

echo "============================================================"
echo "🎉 Model Arena Argolis setup complete!"
echo "Next step: Run './scripts/deploy.sh' to build & deploy to Cloud Run."
echo "============================================================"
