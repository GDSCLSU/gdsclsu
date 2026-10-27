import { env as dynamicPrivateEnv } from "$env/dynamic/private";
import { env as dynamicPublicEnv } from "$env/dynamic/public";

function value(name: string, fallback: string): string {
  return dynamicPrivateEnv[name] ?? process.env[name] ?? fallback;
}

export const gcpConfig = {
  get projectId() {
    return value(
      "FIREBASE_PROJECT_ID",
      dynamicPublicEnv.PUBLIC_PROJECT_ID || "gdsc-lsu-website-db",
    );
  },
  get projectNumber() {
    return value("FIREBASE_PROJECT_NUMBER", "385852041539");
  },
  get workloadIdentityPoolId() {
    return value("FIREBASE_WIF_POOL_ID", "vercel");
  },
  get workloadIdentityProviderId() {
    return value("FIREBASE_WIF_PROVIDER_ID", "vercel");
  },
  get serviceAccountEmail() {
    return value(
      "FIREBASE_SERVICE_ACCOUNT_EMAIL",
      "firebase-adminsdk-fbsvc@gdsc-lsu-website-db.iam.gserviceaccount.com",
    );
  },
};
