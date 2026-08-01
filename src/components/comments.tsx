"use client";

import Giscus from "@giscus/react";
import { usePathname } from "next/navigation";

import { GISCUS } from "@/lib/site";

/**
 * Official `@giscus/react` mounts a `<giscus-widget>` web component in place.
 * A raw `<script src="giscus.app/client.js">` in the RSC tree is unsafe here:
 * Next.js 16 hoists it into `<head>`, so `document.currentScript` no longer
 * sits beside the Comments container and the iframe never appears in the body.
 *
 * `term` is the entry's canonical URL so apex (`/blog/slug`) and subdomain
 * (`blog…/slug`) share one Discussion thread. `key={pathname}` forces a clean
 * remount on App Router soft navigations between entries.
 */
export function Comments({ term }: { term: string }) {
  const pathname = usePathname();
  const config = GISCUS;
  if (!config) return null;

  return (
    <section className="border-t border-rule pt-8">
      <h2 className="label-caps">Comments</h2>
      <div className="mt-6">
        <Giscus
          key={pathname}
          id="comments"
          repo={config.repo}
          repoId={config.repoId}
          category={config.category}
          categoryId={config.categoryId}
          mapping="specific"
          term={term}
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </section>
  );
}
