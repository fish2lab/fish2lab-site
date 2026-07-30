import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { ShelfRows } from "@/components/shelf-rows";
import { indexMetadataFor } from "@/lib/collection-route";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = indexMetadataFor("blog", {
  title: "Blog",
  description: "文章与随笔，按时间倒序。",
});

export default function BlogIndex() {
  return (
    <PageShell
      kicker="Notes & essays / 随笔"
      title="Blog"
      titleZh="文章"
      measure="index"
    >
      <ShelfRows entries={getEntries("blog")} collection="blog" />
    </PageShell>
  );
}
