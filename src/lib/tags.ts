import { COLLECTIONS, type Collection, type Entry, getEntries } from "./content";

/**
 * Tags — the site's one cross-collection index.
 *
 * Entries declare free-form tags in frontmatter, in whatever language and
 * casing fit the piece. This module is the single place that turns those
 * into something linkable: every tag is normalised (trimmed, case-folded)
 * so "LLM" and "llm" land on the same page, the first-seen spelling
 * supplies the display label, and the normalised form doubles as the URL
 * slug. If two tags ever need merging by hand, they are renamed in the
 * frontmatter — there is deliberately no synonym table to keep alive.
 *
 * Everything happens at build time: the index is read off disk like the
 * entries themselves, and /tags/[tag] prerenders one page per tag.
 */

export type TagInfo = {
  /** Normalised form — the dedupe key and the URL slug. */
  slug: string;
  /** First-seen spelling, used wherever the tag is printed. */
  label: string;
  /** Newest first, across all collections. */
  entries: Entry[];
};

/** One tag → its slug. The only normalisation rule, kept in exactly one
 *  place so links, static params and lookups can never drift apart. */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase();
}

/** URL of a tag's page, from anywhere in the app. */
export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tagSlug(tag))}`;
}

function collectTags(): Map<string, TagInfo> {
  const bySlug = new Map<string, TagInfo>();

  for (const collection of COLLECTIONS) {
    for (const entry of getEntries(collection)) {
      const seenInEntry = new Set<string>();
      for (const raw of entry.tags) {
        const slug = tagSlug(raw);
        if (!slug || seenInEntry.has(slug)) continue;
        seenInEntry.add(slug);

        const info = bySlug.get(slug);
        if (info) info.entries.push(entry);
        else bySlug.set(slug, { slug, label: raw.trim(), entries: [entry] });
      }
    }
  }

  // Entries arrive collection by collection; re-sort so a tag's list reads
  // newest first no matter which sections the pieces live in.
  for (const info of bySlug.values()) {
    info.entries.sort((a, b) => b.date.localeCompare(a.date));
  }
  return bySlug;
}

/** Every tag, most-used first; ties break alphabetically by label. */
export function getAllTags(): TagInfo[] {
  return [...collectTags().values()].sort(
    (a, b) =>
      b.entries.length - a.entries.length || a.label.localeCompare(b.label),
  );
}

/** One tag by slug — the /tags/[tag] page's lookup. The param may arrive
 *  percent-encoded (build-time params are encoded; see the page's
 *  generateStaticParams) or already decoded (links built by tagHref are
 *  re-decoded by the router), so both forms are accepted. */
export function getTag(slug: string): TagInfo | undefined {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // Not actually encoded — use as-is.
  }
  return collectTags().get(tagSlug(decoded));
}

/**
 * The most-used tags touching at least one of the given collections — the
 * hero's flanking lists. A tag shared with another section still counts; it
 * is the section's entries that put it here.
 */
export function getTopTags(
  collections: readonly Collection[],
  limit: number,
): TagInfo[] {
  return getAllTags()
    .filter((info) =>
      info.entries.some((entry) => collections.includes(entry.collection)),
    )
    .slice(0, limit);
}
