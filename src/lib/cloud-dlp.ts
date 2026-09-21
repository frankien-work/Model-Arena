import { getGcpAccessToken, getGcpProjectId } from './gcp-auth';

export interface DlpFinding {
  infoType: string;
  likelihood: string;
  mitigation: string;
}

export interface DlpDeidentifyResult {
  sanitizedText: string;
  findings: DlpFinding[];
  isLiveApi: boolean;
  latencyMs: number;
  apiDetails?: {
    endpoint: string;
    httpStatus?: number | string;
    error?: string;
  };
}

const COMMON_INFOTYPES = [
  { name: 'CREDIT_CARD_NUMBER' },
  { name: 'US_SOCIAL_SECURITY_NUMBER' },
  { name: 'EMAIL_ADDRESS' },
  { name: 'PHONE_NUMBER' },
];

export async function deidentifyWithCloudDlp(text: string): Promise<DlpDeidentifyResult> {
  const startTime = Date.now();
  const token = await getGcpAccessToken();
  const projectId = await getGcpProjectId();

  let liveError: string | null = null;
  let liveHttpStatus: number | null = null;

  // Try live Google Cloud DLP API if credentials exist
  if (token && projectId) {
    const endpoints = [
      `https://dlp.googleapis.com/v2/projects/${projectId}/locations/global/content:deidentify`,
      `https://dlp.googleapis.com/v2/projects/${projectId}/content:deidentify`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: { value: text },
            deidentifyConfig: {
              infoTypeTransformations: {
                transformations: [
                  {
                    infoTypes: COMMON_INFOTYPES,
                    primitiveTransformation: {
                      replaceWithInfoTypeConfig: {},
                    },
                  },
                ],
              },
            },
            inspectConfig: {
              infoTypes: COMMON_INFOTYPES,
              minLikelihood: 'POSSIBLE',
            },
          }),
        });

        liveHttpStatus = response.status;

        if (response.ok) {
          const data = await response.json();
          const transformedText = data.item?.value || text;
          const findings: DlpFinding[] = [];

          const summaries = data.overview?.transformationSummaries || [];
          for (const summary of summaries) {
            if (summary.infoType?.name && summary.count > 0) {
              findings.push({
                infoType: summary.infoType.name,
                likelihood: 'CONFIRMED',
                mitigation: `Cloud DLP tokenized ${summary.count} instance(s) with [${summary.infoType.name}]`,
              });
            }
          }

          return {
            sanitizedText: transformedText,
            findings,
            isLiveApi: true,
            latencyMs: Date.now() - startTime,
            apiDetails: {
              endpoint,
              httpStatus: response.status,
            },
          };
        } else {
          const body = await response.text();
          liveError = `HTTP ${response.status}: ${body}`;
        }
      } catch (err: any) {
        liveError = err?.message || String(err);
      }
    }
  } else {
    liveError = 'No ADC Access Token available';
  }

  // Fallback pattern-based DLP engine
  const findings: DlpFinding[] = [];
  let sanitized = text;

  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ccRegex = /\b(?:4[0-9]{3}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4})\b/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  if (ssnRegex.test(text)) {
    findings.push({
      infoType: 'US_SOCIAL_SECURITY_NUMBER',
      likelihood: 'VERY_LIKELY',
      mitigation: 'Tokenized SSN with [US_SOCIAL_SECURITY_NUMBER]',
    });
    sanitized = sanitized.replace(ssnRegex, '[US_SOCIAL_SECURITY_NUMBER]');
  }

  if (ccRegex.test(text)) {
    findings.push({
      infoType: 'CREDIT_CARD_NUMBER',
      likelihood: 'VERY_LIKELY',
      mitigation: 'Tokenized Card Number with [CREDIT_CARD_NUMBER]',
    });
    sanitized = sanitized.replace(ccRegex, '[CREDIT_CARD_NUMBER]');
  }

  if (emailRegex.test(text)) {
    findings.push({
      infoType: 'EMAIL_ADDRESS',
      likelihood: 'LIKELY',
      mitigation: 'Tokenized Email with [EMAIL_ADDRESS]',
    });
    sanitized = sanitized.replace(emailRegex, '[EMAIL_ADDRESS]');
  }

  return {
    sanitizedText: sanitized,
    findings,
    isLiveApi: false,
    latencyMs: Date.now() - startTime,
    apiDetails: {
      endpoint: `https://dlp.googleapis.com/v2/projects/${projectId}/content:deidentify`,
      httpStatus: liveHttpStatus || 'FALLBACK_LOCAL',
      error: liveError || 'Used pattern inspection',
    },
  };
}
