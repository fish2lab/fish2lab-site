import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getAllTags } from "@/lib/tags";

export default function sitemap(): MetadataRoute.Sitemap {
  const tags = getAllTags();
  const latestContentDate = tags
    .flatMap(({ entries }) => entries.map(({ date }) => date))
    .sort((a, b) => b.localeCompare(a))[0];

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latestContentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/friends`, changeFrequency: "monthly", priority: 0.4 },
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tags/${encodeURIComponent(tag.slug)}`,
      lastModified: tag.entries[0]?.date,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
