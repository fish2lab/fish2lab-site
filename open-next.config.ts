import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Content changes only through a new build. Keep every prerendered response in
 * the deployment's immutable static assets: no remote cache needs provisioning,
 * and cache interception can answer without booting the Next server.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
