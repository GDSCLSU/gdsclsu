import { mkdirSync, writeFileSync } from "node:fs";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import type { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { Auth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";
import { env as dynamicPrivateEnv } from "$env/dynamic/private";
import { gcpConfig } from "./gcp.config";

export function serverEnv(name: string): string | undefined {
  return dynamicPrivateEnv[name] ?? process.env[name];
}

const WIF_DIR = "/tmp/gdsc-wif";
const WIF_TOKEN_PATH = `${WIF_DIR}/subject-token`;
const WIF_CONFIG_PATH = `${WIF_DIR}/credentials.json`;

let wifConfigWritten = false;

function tokenFromRequest(request?: Request): string | undefined {
  if (request) {
    const header = request.headers.get("x-vercel-oidc-token");
    if (header) return header;
  }
  return serverEnv("VERCEL_OIDC_TOKEN") || undefined;
}

function writeWifConfig(): boolean {
  if (wifConfigWritten) return true;
  const {
    projectNumber,
    workloadIdentityPoolId,
    workloadIdentityProviderId,
    serviceAccountEmail,
  } = gcpConfig;
  if (!projectNumber || !serviceAccountEmail) return false;
  try {
    mkdirSync(WIF_DIR, { recursive: true });
    writeFileSync(
      WIF_CONFIG_PATH,
      JSON.stringify({
        type: "external_account",
        audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${workloadIdentityPoolId}/providers/${workloadIdentityProviderId}`,
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        token_url: "https://sts.googleapis.com/v1/token",
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
        credential_source: { file: WIF_TOKEN_PATH },
      }),
      "utf8",
    );
    process.env.GOOGLE_APPLICATION_CREDENTIALS = WIF_CONFIG_PATH;
    wifConfigWritten = true;
    return true;
  } catch {
    return false;
  }
}

function writeToken(token: string): void {
  try {
    writeFileSync(WIF_TOKEN_PATH, token, "utf8");
  } catch {
    // Non-fatal: a stale token file is only a problem on token refresh.
  }
}

function adminApp(token?: string): App | null {
  const existing = getApps()[0];
  if (existing) {
    if (token) writeToken(token);
    return existing;
  }

  const projectId = gcpConfig.projectId;
  const clientEmail = serverEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = serverEnv("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");
  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  if (token && writeWifConfig()) {
    writeToken(token);
    return initializeApp({
      credential: applicationDefault(),
      projectId: gcpConfig.projectId,
    });
  }

  return null;
}

export async function getAdminDb(request?: Request): Promise<Firestore | null> {
  const app = adminApp(tokenFromRequest(request));
  return app ? getFirestore(app) : null;
}

export function getAdminAuth(request?: Request): Auth | null {
  const app = adminApp(tokenFromRequest(request));
  return app ? getAuth(app) : null;
}
