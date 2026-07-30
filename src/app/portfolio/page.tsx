import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { SeriesIndex } from "@/components/series-index";
import { indexMetadataFor } from "@/lib/collection-route";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = indexMetadataFor("photography", {
  title: "Portfolio",
  description: "摄影系列与长期项目，按时间倒序。",
});

export default function PortfolioIndex() {
  return (
    <PageShell kicker="Portfolio / 作品集" title="Series" titleZh="完整系列">
      <SeriesIndex entries={getEntries("photography")} />
    </PageShell>
  );
}
