import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

/**
 * Content is read from disk at build time only. Every route that touches this
 * module sets `generateStaticParams` + `dynamicParams = false`, so the
 * Cloudflare Worker serves prerendered HTML and never calls `fs`.
 */

export const COLLECTIONS = ["photography", "research", "blog"] as const;
export type Collection = (typeof COLLECTIONS)[number];

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type Entry = {
  collection: Collection;
  slug: string;
  title: string;
  /** Chinese title, shown alongside the Latin one on series pages. */
  titleZh?: string;
  /** Bilingual standfirst, e.g. "Pure sensation / 纯粹感官". */
  subtitle?: string;
  /** ISO `YYYY-MM-DD`, used for sorting. */
  date: string;
  /** Display year — may be a range like `2025–` for ongoing work. */
  year?: string;
  summary: string;
  body: string;
  draft: boolean;
  /**
   * Still worth linking to, but no longer how I'd write it or what I'd
   * recommend first. Shelves the entry under the legacy mark on the index.
   */
  legacy: boolean;
  /** Photography: cover image path under /public. */
  cover?: string;
  /** Photography: where it was shot. */
  location?: string;
  /** Research: current state of the project. */
  status?: string;
  /** Research: venue, collaborators, or link-out label. */
  venue?: string;
  tags: string[];
};

/**
 * YAML parses an unquoted `2026-04-09` into a `Date`, so frontmatter dates
 * arrive as either a string or a Date depending on whether the author quoted
 * them. Both are normalised to a plain `YYYY-MM-DD` string.
 */
function normaliseDate(value: unknown, source: string): string {
  const iso =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(
      `${source} has an unparseable "date" (${String(value)}); expected YYYY-MM-DD`,
    );
  }

  return iso;
}

function readCollection(collection: Collection): Entry[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      if (!data.title || !data.date) {
        throw new Error(
          `content/${collection}/${file} is missing a required "title" or "date" field`,
        );
      }

      return {
        collection,
        slug,
        title: String(data.title),
        titleZh: data.titleZh ? String(data.titleZh) : undefined,
        subtitle: data.subtitle ? String(data.subtitle) : undefined,
        date: normaliseDate(data.date, `content/${collection}/${file}`),
        year: data.year ? String(data.year) : undefined,
        summary: String(data.summary ?? ""),
        body: content,
        draft: Boolean(data.draft ?? false),
        legacy: Boolean(data.legacy ?? false),
        cover: data.cover ? String(data.cover) : undefined,
        location: data.location ? String(data.location) : undefined,
        status: data.status ? String(data.status) : undefined,
        venue: data.venue ? String(data.venue) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      } satisfies Entry;
    });
}

/** Newest first. Drafts are dropped outside of `next dev`. */
export function getEntries(collection: Collection): Entry[] {
  const showDrafts = process.env.NODE_ENV === "development";

  return readCollection(collection)
    .filter((entry) => showDrafts || !entry.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntry(
  collection: Collection,
  slug: string,
): Entry | undefined {
  return getEntries(collection).find((entry) => entry.slug === slug);
}

/** The single most recent entry, for the home page cards. */
export function getLatestEntry(collection: Collection): Entry | undefined {
  return getEntries(collection)[0];
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * The three shelves an index page sorts itself into: the newest piece, then
 * everything else still worth reading, then the archive.
 *
 * Each shelf is announced by a mark rather than a heading — see
 * `src/components/shelf-rows.tsx` — so the names here are never printed.
 */
export type Shelf = "latest" | "current" | "legacy";

export type ShelfGroup = {
  shelf: Shelf;
  entries: Entry[];
  /** Position of this shelf's first entry in the collection as a whole. */
  offset: number;
};

/**
 * Splits a newest-first list into its shelves, dropping any that came out
 * empty. A collection whose newest entry is marked legacy has no `latest`
 * shelf at all, which is the honest reading: nothing current has landed yet.
 */
export function groupByShelf(entries: Entry[]): ShelfGroup[] {
  const live = entries.filter((entry) => !entry.legacy);
  const legacy = entries.filter((entry) => entry.legacy);

  const groups: { shelf: Shelf; entries: Entry[] }[] = [
    { shelf: "latest", entries: live.slice(0, 1) },
    { shelf: "current", entries: live.slice(1) },
    { shelf: "legacy", entries: legacy },
  ];

  let offset = 0;
  return groups
    .filter((group) => group.entries.length > 0)
    .map((group) => {
      const withOffset = { ...group, offset };
      offset += group.entries.length;
      return withOffset;
    });
}

/** Groups entries by year for the timeline index pages. */
export function groupByYear(entries: Entry[]): [string, Entry[]][] {
  const buckets = new Map<string, Entry[]>();

  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    const bucket = buckets.get(year);
    if (bucket) bucket.push(entry);
    else buckets.set(year, [entry]);
  }

  return [...buckets.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
