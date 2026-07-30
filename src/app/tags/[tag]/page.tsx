import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { type Collection, formatDate } from "@/lib/content";
import { COLLECTION_SITES } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { getAllTags, getTag } from "@/lib/tags";

// NOTE: no `dynamicParams = false` here. This Next version cannot serve
// prerendered dynamic paths that need percent-encoding (Chinese tags,
// spaces): the request matcher never hits the baked route, so an allowlist
// turns every one of them into a 404. Leaving dynamicParams open lets those
// paths render on demand (cached afterwards); ASCII tags still serve their
// prerendered copies as before.
export function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const info = getTag(tag);
  if (!info) return {};

  // Tag pages live on the apex host only — they cut across collections, so
  // no subdomain could own them.
  const canonical = `${SITE_URL}/tags/${encodeURIComponent(info.slug)}`;

  return {
    title: info.label,
    description: `与「${info.label}」相关的 ${info.entries.length} 篇内容。`,
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

const COLLECTION_LABEL: Record<Collection, string> = {
  photography: "Portfolio / 摄影系列",
  research: "Research / 研究",
  blog: "Blog / 文章",
};

/**
 * One tag, everything it touches — grouped by section so a tag that spans
 * photography and writing still reads as one topic rather than a pile of
 * links. Rows are plain: title, date, a line of summary, nothing else
 * competing with the tag itself.
 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const info = getTag(tag);
  if (!info) notFound();

  const groups = (Object.keys(COLLECTION_LABEL) as Collection[])
    .map((collection) => ({
      collection,
      entries: info.entries.filter((entry) => entry.collection === collection),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <PageShell
      kicker="Tag / 标签"
      title={info.label}
      titleZh={`${info.entries.length} 篇相关内容`}
      measure="index"
    >
      <div className="flex flex-col gap-14">
        {groups.map(({ collection, entries }) => (
          <section key={collection}>
            <p className="label-caps mb-5">{COLLECTION_LABEL[collection]}</p>
            <ul className="flex flex-col border-t border-rule">
              {entries.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`${COLLECTION_SITES[entry.collection].basePath}/${entry.slug}`}
                    className="group flex flex-col gap-2 border-b border-rule py-5"
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="font-serif text-xl leading-snug transition-colors duration-300 group-hover:text-accent">
                        {entry.title}
                      </span>
                      <span className="label-caps shrink-0">
                        {formatDate(entry.date)}
                      </span>
                    </span>
                    {entry.summary ? (
                      <span className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
                        {entry.summary}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
