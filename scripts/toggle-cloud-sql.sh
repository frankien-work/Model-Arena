#!/usr/bin/env bash
# ==============================================================================
# Model Arena - Cloud SQL Cost Guardrail: Pause & Resume Script
# Usage:
#   ./scripts/toggle-cloud-sql.sh pause   # Stops the instance (stops compute billing)
#   ./scripts/toggle-cloud-sql.sh resume  # Starts the instance (readies for demo)
#   ./scripts/toggle-cloud-sql.sh status  # Displays current activation policy & state
# ==============================================================================

set -euo pipefail

INSTANCE_NAME="${CLOUD_SQL_INSTANCE:-model-arena-db}"
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "❌ Error: GCP_PROJECT_ID is not set and no default gcloud project found."
  echo "Please run: export GCP_PROJECT_ID='your-argolis-project-id'"
  exit 1
fi

ACTION="${1:-status}"

echo "============================================================"
echo "⚡️ Model Arena: Cloud SQL Cost Guardrail"
echo "Project:   ${PROJECT_ID}"
echo "Instance:  ${INSTANCE_NAME}"
echo "Action:    ${ACTION}"
echo "============================================================"

case "${ACTION}" in
  pause|stop)
    echo "⏸ Pausing Cloud SQL instance '${INSTANCE_NAME}' to halt compute charges..."
    gcloud sql instances patch "${INSTANCE_NAME}" \
      --project="${PROJECT_ID}" \
      --activation-policy=NEVER \
      --quiet
    echo "✅ Instance '${INSTANCE_NAME}' has been paused. Compute billing is now $0/hr!"
    echo "💡 Run './scripts/toggle-cloud-sql.sh resume' ~2 minutes before your next demo."
    ;;

  resume|start)
    echo "▶️ Resuming Cloud SQL instance '${INSTANCE_NAME}' for customer demo..."
    gcloud sql instances patch "${INSTANCE_NAME}" \
      --project="${PROJECT_ID}" \
      --activation-policy=ALWAYS \
      --quiet
    echo "✅ Instance '${INSTANCE_NAME}' is now resuming. It will be ready in ~60-90 seconds."
    ;;

  status)
    echo "🔍 Fetching instance status..."
    gcloud sql instances describe "${INSTANCE_NAME}" \
      --project="${PROJECT_ID}" \
      --format="table(name,state,settings.activationPolicy,settings.tier)"
    ;;

  *)
    echo "❌ Unknown action: ${ACTION}"
    echo "Usage: $0 {pause|resume|status}"
    exit 1
    ;;
esac
