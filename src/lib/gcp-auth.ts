import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getGcpAccessToken(): Promise<string | null> {
  try {
    // Return cached token if still valid (valid for 55 mins)
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      return cachedToken.token;
    }

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token || null;

    if (token) {
      cachedToken = {
        token,
        expiresAt: Date.now() + 50 * 60 * 1000, // 50 mins
      };
    }
    return token;
  } catch (err: any) {
    // Graceful fallback when ADC is not configured locally
    return null;
  }
}

export async function getGcpProjectId(): Promise<string> {
  if (process.env.GCP_PROJECT_ID) return process.env.GCP_PROJECT_ID;
  try {
    return await auth.getProjectId();
  } catch {
    return 'entropy-bug-1';
  }
}

export function getGcpRegion(): string {
  return process.env.GCP_REGION || 'us-central1';
}
