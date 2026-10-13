"use client";

import Giscus from "@giscus/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
 *
 * The widget is mounted only once the section comes within a screen of the
 * viewport, and then loads eagerly. Giscus's own `loading="lazy"` looked
 * equivalent but is not: Chrome fires `load` on a deferred iframe while it
 * still holds `about:blank`, the widget answers by posting its config to
 * that blank window, and every entry page logged a "target origin does not
 * match" error before anyone had scrolled anywhere near the comments.
 */
export function Comments({ term }: { term: string }) {
  const pathname = usePathname();
  const config = GISCUS;
  const anchor = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = anchor.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  if (!config) return null;

  return (
    <section className="border-t border-rule pt-8">
      <h2 className="label-caps">Comments</h2>
      <div ref={anchor} className="mt-6">
        {near ? (
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
            loading="eager"
          />
        ) : null}
      </div>
    </section>
  );
}
