import type { MetadataRoute } from "next";

import { collectionSitemap } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return collectionSitemap("research");
}
