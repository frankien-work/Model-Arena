import { getGcpAccessToken, getGcpProjectId, getGcpRegion } from './gcp-auth';

export interface SecurityFinding {
  category: 'Prompt Injection' | 'Jailbreak (DAN)' | 'PII Leakage' | 'Command Injection' | 'Toxic Content' | 'Indirect RAG';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number; // 0.0 to 1.0
  description: string;
  matchedPattern?: string;
}

export interface ModelArmorInspectionResult {
  action: 'ALLOW' | 'BLOCK' | 'SANITIZE';
  riskScore: number; // 0 to 100
  latencyMs: number;
  findings: SecurityFinding[];
  sanitizedText?: string;
  scceEventId?: string;
  isLiveApi: boolean;
  apiDetails?: {
    endpoint: string;
    httpStatus?: number | string;
    templateUsed?: string;
    filterMatchState?: string;
    error?: string;
    rawResponse?: any;
  };
}

async function ensureTemplateExists(
  token: string,
  projectId: string,
  region: string,
  templateId: string
): Promise<boolean> {
  try {
    const checkUrl = `https://modelarmor.googleapis.com/v1/projects/${projectId}/locations/${region}/templates/${templateId}`;
    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (checkRes.ok) return true;

    // Auto-create if not found
    if (checkRes.status === 404) {
      const createUrl = `https://modelarmor.googleapis.com/v1/projects/${projectId}/locations/${region}/templates?templateId=${templateId}`;
      const createRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterConfig: {
            promptInjectionFilter: { enforcement: 'ENFORCE' },
            jailbreakFilter: { enforcement: 'ENFORCE' },
            piiFilter: { enforcement: 'ENFORCE' },
            maliciousUrisFilter: { enforcement: 'ENFORCE' },
          },
        }),
      });
      return createRes.ok;
    }
  } catch (e) {
    console.warn('Could not auto-verify/create Model Armor template:', e);
  }
  return false;
}

export async function inspectWithModelArmor(
  text: string,
  enabled: boolean
): Promise<ModelArmorInspectionResult> {
  const startTime = Date.now();

  if (!enabled) {
    return {
      action: 'ALLOW',
      riskScore: 0,
      latencyMs: 1,
      findings: [],
      isLiveApi: false,
    };
  }

  const token = await getGcpAccessToken();
  const projectId = await getGcpProjectId();
  const region = getGcpRegion();
  const templateId = process.env.MODEL_ARMOR_TEMPLATE_ID || 'model-arena-guardrail';

  let liveApiError: string | null = null;
  let liveHttpStatus: number | null = null;

  // 1. Attempt Live Google Cloud Model Armor API call
  if (token && projectId) {
    try {
      // Auto-ensure template exists
      await ensureTemplateExists(token, projectId, region, templateId);

      const endpoint = `https://modelarmor.googleapis.com/v1/projects/${projectId}/locations/${region}/templates/${templateId}:sanitizeUserPrompt`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPromptData: {
            text,
          },
        }),
      });

      liveHttpStatus = response.status;

      if (response.ok) {
        const data = await response.json();
        const sanitizationResult = data.sanitizationResult || {};
        const filterMatch = sanitizationResult.filterMatchState;
        const latencyMs = Date.now() - startTime;
        const findings: SecurityFinding[] = [];

        // Parse Model Armor API filter results
        const filters = sanitizationResult.filterResults || {};

        if (filters.promptInjectionFilterResult?.matchState === 'MATCH_FOUND') {
          findings.push({
            category: 'Prompt Injection',
            severity: 'CRITICAL',
            confidence: 0.98,
            description: 'Google Cloud Model Armor flagged adversarial prompt injection / system instruction override.',
            matchedPattern: 'modelarmor.googleapis.com (Prompt Injection Filter)',
          });
        }

        if (filters.jailbreakFilterResult?.matchState === 'MATCH_FOUND') {
          findings.push({
            category: 'Jailbreak (DAN)',
            severity: 'CRITICAL',
            confidence: 0.97,
            description: 'Google Cloud Model Armor flagged adversarial persona / jailbreak evasion.',
            matchedPattern: 'modelarmor.googleapis.com (Jailbreak Defense)',
          });
        }

        if (filters.piiFilterResult?.matchState === 'MATCH_FOUND') {
          findings.push({
            category: 'PII Leakage',
            severity: 'HIGH',
            confidence: 0.95,
            description: 'Google Cloud Model Armor detected sensitive identifiers in payload.',
            matchedPattern: 'modelarmor.googleapis.com (DLP Filter)',
          });
        }

        const scceEventId = `SCCE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

        if (filterMatch === 'MATCH_FOUND' || findings.length > 0) {
          return {
            action: 'BLOCK',
            riskScore: 97,
            latencyMs,
            findings,
            scceEventId,
            isLiveApi: true,
            apiDetails: {
              endpoint,
              httpStatus: response.status,
              templateUsed: templateId,
              filterMatchState: filterMatch || 'MATCH_FOUND',
              rawResponse: data,
            },
          };
        }

        return {
          action: 'ALLOW',
          riskScore: 3,
          latencyMs,
          findings: [],
          isLiveApi: true,
          apiDetails: {
            endpoint,
            httpStatus: response.status,
            templateUsed: templateId,
            filterMatchState: 'NO_MATCH_FOUND',
            rawResponse: data,
          },
        };
      } else {
        const errBody = await response.text();
        liveApiError = `HTTP ${response.status}: ${errBody}`;
        console.warn(`Live Model Armor returned error: ${liveApiError}`);
      }
    } catch (err: any) {
      liveApiError = err?.message || String(err);
      console.warn('Live Model Armor API network error:', liveApiError);
    }
  } else {
    liveApiError = 'No GCP Access Token available in current environment';
  }

  // Pure live transparency: Return the actual error from Google Cloud without simulating
  const latencyMs = Date.now() - startTime;
  return {
    action: 'ALLOW',
    riskScore: 0,
    latencyMs,
    findings: [],
    isLiveApi: false,
    apiDetails: {
      endpoint: `https://modelarmor.googleapis.com/v1/projects/${projectId}/locations/${region}/templates/${templateId}:sanitizeUserPrompt`,
      httpStatus: liveHttpStatus || 'ERROR',
      templateUsed: templateId,
      error: liveApiError || 'Failed to connect to live Model Armor endpoint',
    },
  };
}
