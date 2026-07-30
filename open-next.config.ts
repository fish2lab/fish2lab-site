import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

/**
 * The collection indexes read `content/` at build time. Keep their prerendered
 * output in KV so the Worker never has to repeat that filesystem read.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
