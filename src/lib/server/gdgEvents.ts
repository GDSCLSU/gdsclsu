import type { Firestore } from "firebase-admin/firestore";

const CHAPTER_ID = "3099";
const CHAPTER_TIME_ZONE = "America/Chicago";
const PAGE_LIMIT = 10;
const DESCRIPTION_LIMIT = 1200;
const ENTITY_MAP: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

export type GdgEvent = {
  id: number;
  title?: string | null;
  description?: string | null;
  description_short?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  event_timezone?: string | null;
  static_url?: string | null;
  is_hidden?: boolean;
};

export type MappedGdgEvent = {
  sourceId: string;
  title: string;
  date: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
  description: string;
  rsvpLink: string | null;
};

export type SyncSummary = {
  fetched: number;
  eligible: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

type FeedPage = {
  results?: GdgEvent[];
  links?: { next?: string | null };
};

function decodeEntities(text: string): string {
  return text.replace(
    /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g,
    (match, code: string) => {
      if (code.startsWith("#x") || code.startsWith("#X")) {
        const value = Number.parseInt(code.slice(2), 16);
        return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
          ? String.fromCodePoint(value)
          : match;
      }
      if (code.startsWith("#")) {
        const value = Number.parseInt(code.slice(1), 10);
        return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
          ? String.fromCodePoint(value)
          : match;
      }
      return ENTITY_MAP[code.toLowerCase()] ?? match;
    },
  );
}

function plainText(value: string | null | undefined): string {
  if (!value) return "";
  const stripped = value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n?/g, "\n");
  return decodeEntities(stripped)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, DESCRIPTION_LIMIT)
    .trim();
}

function timeZoneFor(event: GdgEvent): string {
  const candidate = event.event_timezone?.trim();
  if (!candidate) return CHAPTER_TIME_ZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate });
    return candidate;
  } catch {
    return CHAPTER_TIME_ZONE;
  }
}

function dateInZone(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function timeInZone(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("hour")}:${value("minute")}`;
}

export function mapGdgEvent(event: GdgEvent): MappedGdgEvent | null {
  if (event.is_hidden) return null;

  const title = decodeEntities((event.title ?? "").replace(/<[^>]+>/g, "")).trim();
  if (!title || !event.start_date || !event.end_date) return null;

  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const timeZone = timeZoneFor(event);
  const date = dateInZone(event.start_date, timeZone);
  const endDate = dateInZone(event.end_date, timeZone);
  const url = event.static_url?.trim();

  return {
    sourceId: String(event.id),
    title: title.slice(0, 200),
    date,
    endDate: endDate > date ? endDate : null,
    startTime: timeInZone(event.start_date, timeZone),
    endTime: timeInZone(event.end_date, timeZone),
    description:
      plainText(event.description) || plainText(event.description_short),
    rsvpLink: url && /^https?:\/\//i.test(url) ? url : null,
  };
}

export function isUpcoming(event: MappedGdgEvent, now = new Date()): boolean {
  const today = dateInZone(now.toISOString(), CHAPTER_TIME_ZONE);
  return (event.endDate ?? event.date) >= today;
}

async function fetchFeedPage(url: string): Promise<FeedPage> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`GDG feed responded with ${response.status}`);
  }
  return (await response.json()) as FeedPage;
}

export async function fetchGdgEvents(): Promise<GdgEvent[]> {
  const events = new Map<number, GdgEvent>();
  let url: string | null = `https://gdg.community.dev/api/event_slim/for_chapter/${CHAPTER_ID}/?page=1&page_size=20`;
  let pages = 0;

  while (url && pages < PAGE_LIMIT) {
    const page = await fetchFeedPage(url);
    for (const event of page.results ?? []) {
      if (typeof event.id === "number") events.set(event.id, event);
    }
    url = page.links?.next?.trim() || null;
    pages += 1;
  }

  return [...events.values()];
}

function generatePin(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export async function syncGdgEvents(
  db: Firestore,
  now = new Date(),
): Promise<SyncSummary> {
  const feed = await fetchGdgEvents();
  const summary: SyncSummary = {
    fetched: feed.length,
    eligible: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  };
  const mapped = new Map<string, MappedGdgEvent>();

  for (const item of feed) {
    const event = mapGdgEvent(item);
    if (event) mapped.set(event.sourceId, event);
  }

  for (const event of mapped.values()) {
    if (!isUpcoming(event, now)) {
      summary.skipped += 1;
      continue;
    }

    summary.eligible += 1;
    const id = `gdg-${event.sourceId}`;
    const doc = db.collection("events").doc(id);
    const details: Record<string, unknown> = {
      title: event.title,
      date: event.date,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      source: "gdg",
      sourceId: event.sourceId,
    };

    if (event.description) details.description = event.description;
    if (event.rsvpLink) details.rsvpLink = event.rsvpLink;

    try {
      const snapshot = await doc.get();

      if (snapshot.exists) {
        await doc.set(details, { merge: true });
        summary.updated += 1;
      } else {
        await doc.set({
          ...details,
          color: "blue",
          featured: false,
          type: "event",
          allDay: false,
          points: 10,
        });
        summary.created += 1;
      }

      const pinRef = db.collection("eventPins").doc(id);
      const pinSnapshot = await pinRef.get();

      if (!pinSnapshot.exists) {
        await pinRef.set({ pin: generatePin() });
      }
    } catch (error) {
      summary.failed += 1;
      console.error(`GDG sync failed for event ${event.sourceId}:`, error);
    }
  }

  console.log("GDG sync summary:", summary);
  return summary;
}
