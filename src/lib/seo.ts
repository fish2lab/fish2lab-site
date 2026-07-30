import type { MetadataRoute } from "next";

import { type Collection, getEntries } from "@/lib/content";
import { canonicalUrl, collectionHost } from "@/lib/routes";
import { SERIES_FRAMES } from "@/lib/series-frames.generated";

export function robotsFor(host: string): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${host}/sitemap.xml`,
  };
}

export function robotsTextFor(host: string): string {
  return `User-Agent: *
Allow: /

Sitemap: https://${host}/sitemap.xml
`;
}

/**
 * One collection sitemap per canonical host. Image URLs use the same host as
 * the page URLs; the Worker serves the shared asset tree on every hostname.
 */
export function collectionSitemap(
  collection: Collection,
): MetadataRoute.Sitemap {
  const host = collectionHost(collection);
  const entries = getEntries(collection);

  return [
    {
      url: canonicalUrl(collection),
      lastModified: entries[0]?.date,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...entries.map((entry) => ({
      url: canonicalUrl(collection, entry.slug),
      lastModified: entry.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images:
        collection === "photography"
          ? (SERIES_FRAMES[entry.slug] ?? []).map(
              ({ src }) => `https://${host}${src}`,
            )
          : undefined,
    })),
  ];
}
