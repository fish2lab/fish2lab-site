"use client";

import { useEffect, useRef } from "react";

import { GISCUS } from "@/lib/site";

/**
 * Giscus (GitHub Discussions), same approach as sukima-ml: the script is
 * injected only once the section nears the viewport, so no third-party frame
 * is loaded for readers who never scroll that far.
 */
export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const config = GISCUS;
    if (!container || !config) return;

    const load = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";

      Object.entries({
        "data-repo": config.repo,
        "data-repo-id": config.repoId,
        "data-category": config.category,
        "data-category-id": config.categoryId,
        "data-mapping": "pathname",
        "data-strict": "1",
        "data-reactions-enabled": "1",
        "data-emit-metadata": "0",
        "data-input-position": "top",
        "data-theme": "light",
        "data-lang": "zh-CN",
      }).forEach(([key, value]) => script.setAttribute(key, value));

      container.appendChild(script);
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!GISCUS) return null;

  return (
    <section className="border-t border-rule pt-8">
      <h2 className="label-caps">Comments</h2>
      <div ref={containerRef} className="mt-6" />
    </section>
  );
}
