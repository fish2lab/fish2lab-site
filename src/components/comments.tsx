import { GISCUS } from "@/lib/site";

/**
 * Giscus owns lazy loading through `data-loading="lazy"`. Keeping the official
 * script in the server-rendered tree avoids a client hydration dependency and
 * lets the script append its iframe beside itself exactly as documented.
 */
export function Comments() {
  const config = GISCUS;
  if (!config) return null;

  return (
    <section className="border-t border-rule pt-8">
      <h2 className="label-caps">Comments</h2>
      <div className="mt-6">
        <script
          src="https://giscus.app/client.js"
          data-repo={config.repo}
          data-repo-id={config.repoId}
          data-category={config.category}
          data-category-id={config.categoryId}
          data-mapping="pathname"
          data-strict="1"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="top"
          data-theme="light"
          data-lang="zh-CN"
          data-loading="lazy"
          crossOrigin="anonymous"
          async
        />
      </div>
    </section>
  );
}
