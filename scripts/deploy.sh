#!/usr/bin/env bash
# ==============================================================================
# Model Arena - Automated Cloud Run Deployment Script
# Usage:
#   ./scripts/deploy.sh [--project-id PROJECT_ID] [--region REGION]
# ==============================================================================

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="model-arena"

# Parse optional arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ -z "${PROJECT_ID}" ]]; then
  echo "❌ Error: Project ID required. Pass --project-id or set GCP_PROJECT_ID."
  exit 1
fi

echo "============================================================"
echo "⚡️ Deploying Model Arena to Google Cloud Run"
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE_NAME}"
echo "============================================================"

# Navigate to project root
cd "$(dirname "$0")/.."

SA_EMAIL="model-arena-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🚀 Building container and deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --source="." \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --platform="managed" \
  --service-account="${SA_EMAIL}" \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=5 \
  --cpu=1 \
  --memory=1Gi \
  --concurrency=80 \
  --timeout=300 \
  --set-env-vars="GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION},NODE_ENV=production" \
  --quiet

echo "============================================================"
URL=$(gcloud run services describe "${SERVICE_NAME}" --project="${PROJECT_ID}" --region="${REGION}" --format="value(status.url)")
echo "🎉 Model Arena is live on Cloud Run!"
echo "🌐 URL: ${URL}"
echo "============================================================"
