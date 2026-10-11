import type { Collection } from "./content";

/**
 * Where each collection lives.
 *
 * Every collection answers on two addresses: its path on the apex host
 * (`fish2lab.com/portfolio/creating-blue-skies`) and a short form on its own
 * subdomain (`portfolio.fish2lab.com/creating-blue-skies`). One build serves
 * both — `next.config.ts` turns the subdomain's `/` and `/:slug` into the
 * apex paths with host-matched rewrites, so the pages themselves never have to
 * know which host they were requested on.
 *
 * That is deliberate: because the path form keeps working everywhere, every
 * in-app `<Link href="/portfolio/…">` stays correct on every host and
 * client-side navigation is never broken by the split. The subdomain form is
 * the canonical one — it is what `alternates.canonical` points at, so that is
 * the address search engines index and share sheets copy.
 *
 * This module is imported by `next.config.ts` as well as by pages, so it must
 * stay free of runtime imports (the `Collection` import is type-only).
 */

export const APEX_HOST = "fish2lab.com";

export const COLLECTION_SITES = {
  photography: { subdomain: "portfolio", basePath: "/portfolio" },
  research: { subdomain: "research", basePath: "/research" },
  blog: { subdomain: "blog", basePath: "/blog" },
} as const satisfies Record<
  Collection,
  { subdomain: string; basePath: string }
>;

/** Hostname a collection's short form answers on. */
export function collectionHost(collection: Collection): string {
  return `${COLLECTION_SITES[collection].subdomain}.${APEX_HOST}`;
}

/**
 * 制品区（隙间月影）。它不是一个内容集合——没有 MDX 条目，只有一组固定页面：
 * 画廊、四件作品、四份数字典藏、购买指引和工艺说明——所以它不进 `COLLECTION_SITES`，
 * 路由由 `next.config.ts` 里一组显式 rewrite 映射。
 *
 * canonical 在 `sukima.fish2lab.com` 上；apex 的 `/sukima/...` 一直可用，
 * 所以站内所有 `<Link href="/sukima/...">` 在任何 host 下都对。
 */
export const SUKIMA_SITE = { subdomain: "sukima", basePath: "/sukima" } as const;

export function sukimaHost(): string {
  return `${SUKIMA_SITE.subdomain}.${APEX_HOST}`;
}

/** The canonical, subdomain-form URL of a goods page ("" for the gallery). */
export function sukimaCanonicalUrl(path = ""): string {
  return `https://${sukimaHost()}${path}`;
}

/** Host pattern for the goods subdomain, same shape as `subdomainHostPattern`. */
export function sukimaHostPattern(): string {
  return `${SUKIMA_SITE.subdomain}\\.(?:${APEX_HOST.replace(/\./g, "\\.")}|localhost)`;
}

/**
 * The canonical, subdomain-form URL — the index when `slug` is omitted, an
 * entry when it is given.
 */
export function canonicalUrl(collection: Collection, slug?: string): string {
  return `https://${collectionHost(collection)}/${slug ?? ""}`;
}

/**
 * Host pattern for a collection's subdomain, as a `has: [{ type: "host" }]`
 * value. Next matches these as anchored regular expressions against the
 * portless hostname, so the dots are escaped and `*.localhost` is folded in to
 * make the split testable in `next dev` (visit `portfolio.localhost:3000`).
 */
export function subdomainHostPattern(collection: Collection): string {
  const { subdomain } = COLLECTION_SITES[collection];
  return `${subdomain}\\.(?:${APEX_HOST.replace(/\./g, "\\.")}|localhost)`;
}
