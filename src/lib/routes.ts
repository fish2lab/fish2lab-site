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
