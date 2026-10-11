import type { MetadataRoute } from "next";

import { sukimaCanonicalUrl } from "@/lib/routes";
import { artworkOffers, digitalOffers } from "@/lib/sukima/offers";

/**
 * 制品区的 sitemap，只列 sukima.fish2lab.com 上的地址。它由子域的
 * /sitemap.xml 重写过来；apex 的 sitemap 不列这些页面——一份 sitemap
 * 只能声明自己 host 上的 URL。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: sukimaCanonicalUrl("/"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sukimaCanonicalUrl("/giclee"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: sukimaCanonicalUrl("/buy"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...Object.keys(artworkOffers).map((id) => ({
      url: sukimaCanonicalUrl(`/artwork/${id}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...Object.keys(digitalOffers).map((id) => ({
      url: sukimaCanonicalUrl(`/digital/${id}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
