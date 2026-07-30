import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { ShelfRows } from "@/components/shelf-rows";
import { indexMetadataFor } from "@/lib/collection-route";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = indexMetadataFor("research", {
  title: "Research",
  description: "研究进度与笔记，按时间倒序。",
});

export default function ResearchIndex() {
  return (
    <PageShell
      kicker="Work in progress / 进行中"
      title="Research"
      titleZh="研究进度"
      measure="index"
    >
      <ShelfRows entries={getEntries("research")} collection="research" />
    </PageShell>
  );
}
