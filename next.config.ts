import fs from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

import { COLLECTION_SITES, subdomainHostPattern } from "./src/lib/routes";

type Collection = keyof typeof COLLECTION_SITES;
const collections = Object.keys(COLLECTION_SITES) as Collection[];

/**
 * Top-level route segments, read off `src/app` at build time.
 *
 * The subdomain rewrite below has to leave these alone, and hand-listing them
 * would rot the first time a page is added — so the list is derived. Route
 * groups, private folders and dynamic segments are skipped: none of them
 * claim a literal first segment.
 */
function topLevelRoutes(): string[] {
  return fs
    .readdirSync(path.join(process.cwd(), "src/app"), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && !/^[_([]/.test(entry.name),
    )
    .map((entry) => entry.name);
}

/**
 * Source pattern for a collection's entry short-URL: any single path segment
 * that is not already a route of its own and has no file extension.
 *
 * `[^/.]+` is what keeps `/favicon.ico`, `/icon.png` and friends out — the
 * dot disqualifies them — and the lookahead covers the extensionless pages,
 * `/about` and `/friends` among them, so the whole site stays reachable from
 * every subdomain. `_next` is in there for the same reason.
 */
function entrySource(): string {
  const reserved = [...topLevelRoutes(), "_next"].join("|");
  return `/:slug((?!(?:${reserved})(?:/|$))[^/.]+)`;
}

const nextConfig: NextConfig = {
  // Page-to-page crossfades: React's <ViewTransition> in the root layout
  // animates on every route navigation once this is on. Browsers without
  // the View Transitions API just swap pages as before.
  experimental: { viewTransition: true },

  async rewrites() {
    const slugSource = entrySource();

    /**
     * All of this is `beforeFiles` on purpose.
     *
     * `afterFiles` would be the tidier home for the entry rule — it resolves
     * only once the filesystem has had its turn, which makes the exclusion
     * list above unnecessary. It also silently does nothing once deployed:
     * the Cloudflare worker honours `beforeFiles` and never reaches
     * `afterFiles`, so entry short-URLs 404 in production while working
     * perfectly under `next start`. Verified against `wrangler dev` — do not
     * move these back without re-checking there.
     */
    return {
      beforeFiles: collections.flatMap((collection) => {
        const has = [
          { type: "host" as const, value: subdomainHostPattern(collection) },
        ];
        const { basePath } = COLLECTION_SITES[collection];

        return [
          // The subdomain's front door: portfolio.fish2lab.com → /portfolio
          { source: "/", has, destination: basePath },
          // Each canonical host owns its own crawler policy and sitemap. A
          // sitemap may only claim URLs on its own host, so these cannot all
          // fall through to the apex metadata routes.
          {
            source: "/robots.txt",
            has,
            destination: `${basePath}/robots.txt`,
          },
          {
            source: "/sitemap.xml",
            has,
            destination: `${basePath}/sitemap.xml`,
          },
          // …and an entry: portfolio.fish2lab.com/creating-blue-skies
          { source: slugSource, has, destination: `${basePath}/:slug` },
        ];
      }),
    };
  },

  /**
   * The photography section used to live at /photography; the portfolio
   * rename moved it. Canonical URLs (the subdomain form) never changed, but
   * anything that shared the old apex path still lands.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.fish2lab\\.com" }],
        destination: "https://fish2lab.com/:path*",
        permanent: true,
      },
      { source: "/photography", destination: "/portfolio", permanent: true },
      {
        source: "/photography/:path+",
        destination: "/portfolio/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
