import type { Metadata } from "next";

import { type Collection, getEntries, getEntry } from "@/lib/content";
import { canonicalUrl } from "@/lib/routes";

/**
 * Every entry route prerenders its full set of slugs and refuses unknown ones,
 * which keeps `src/lib/content.ts` (and therefore `node:fs`) out of the
 * Cloudflare Worker's request path entirely.
 */
export function staticParamsFor(collection: Collection) {
  return getEntries(collection).map((entry) => ({ slug: entry.slug }));
}

export function metadataFor(
  collection: Collection,
  slug: string,
): Metadata {
  const entry = getEntry(collection, slug);
  if (!entry) return {};

  // Every entry answers on two addresses — `/portfolio/x` on the apex and
  // `/x` on the collection's subdomain. The short one is the canonical form,
  // so that is what gets indexed and shared.
  const canonical = canonicalUrl(collection, slug);

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: entry.title,
      description: entry.summary,
      publishedTime: entry.date,
      images: entry.cover ? [entry.cover] : undefined,
    },
  };
}

/** Index-page metadata, pointed at the collection's subdomain root. */
export function indexMetadataFor(
  collection: Collection,
  meta: { title: string; description: string },
): Metadata {
  const canonical = canonicalUrl(collection);

  return {
    ...meta,
    alternates: { canonical },
    openGraph: { url: canonical, ...meta },
  };
}
