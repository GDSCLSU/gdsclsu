import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getAdminAuth, getAdminDb, serverEnv } from "$lib/server/firebase";
import { syncGdgEvents } from "$lib/server/gdgEvents";

export const GET: RequestHandler = async ({ request }) => {
  const db = await getAdminDb(request);
  if (!db) {
    return json(
      { ok: false, error: "Server auth is not configured." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const secret = serverEnv("CRON_SECRET") ?? "";

  let authorized = Boolean(secret) && token === secret;

  if (!authorized && token) {
    const auth = getAdminAuth(request);
    if (auth) {
      try {
        const decoded = await auth.verifyIdToken(token);
        const user = await db.collection("users").doc(decoded.uid).get();
        authorized =
          user.exists && user.data()?.permissions === "officer";
      } catch {
        authorized = false;
      }
    }
  }

  if (!authorized) {
    return json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const summary = await syncGdgEvents(db);
    return json({ ok: true, ...summary });
  } catch (error) {
    console.error("GDG sync failed:", error);
    return json(
      { ok: false, error: "Could not sync GDG events." },
      { status: 502 },
    );
  }
};
