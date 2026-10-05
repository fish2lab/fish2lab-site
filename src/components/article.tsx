import Link from "next/link";

import { Comments } from "@/components/comments";
import { Mdx } from "@/components/mdx";
import { ReadingRail } from "@/components/reading-rail";
import { type Entry, formatDate } from "@/lib/content";
import { curlQuotes, readingMinutes, tableOfContents } from "@/lib/reading";
import { canonicalUrl } from "@/lib/routes";
import { SITE_AUTHOR, SITE_URL } from "@/lib/site";
import { tagHref } from "@/lib/tags";
import { SERIES_FRAMES } from "@/lib/series-frames.generated";

/** Widest preview step the gallery's srcset offers; see build-series-manifest. */
const PREVIEW_MAX = 2560;

const BACK = {
  photography: { href: "/portfolio", label: "All series / 全部系列" },
  research: { href: "/research", label: "All research / 全部研究" },
  blog: { href: "/blog", label: "All blog posts / 全部文章" },
} as const;

/**
 * One column, one width. Masthead, body text and frames all sit on the same
 * left and right edges, so nothing steps in or out down the page. Writing
 * (blog, research) adds a reading rail in the left margin from xl up — see
 * .article-grid in globals.css; photography keeps the bare column.
 */
export function Article({ entry }: { entry: Entry }) {
  const frames = SERIES_FRAMES[entry.slug] ?? [];
  const back = BACK[entry.collection];
  const canonical = canonicalUrl(entry.collection, entry.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": entry.collection === "blog" ? "BlogPosting" : "CreativeWork",
    mainEntityOfPage: canonical,
    name: entry.title,
    headline: entry.title,
    description: entry.summary,
    datePublished: entry.date,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: `${SITE_URL}/about`,
    },
    image: entry.cover ? new URL(entry.cover, SITE_URL).href : undefined,
    keywords: entry.tags,
  };

  const isWriting = entry.collection !== "photography";
  const toc = isWriting ? tableOfContents(entry.body) : [];

  const meta = [
    { label: "Published / 发布", value: entry.year ?? formatDate(entry.date) },
    {
      label: "Reading / 阅读",
      value: isWriting ? `${readingMinutes(entry.body)} 分钟` : undefined,
    },
    { label: "Status / 状态", value: entry.status },
    { label: "Venue / 发表", value: entry.venue },
    { label: "Location / 地点", value: entry.location },
    {
      label: "Works / 作品",
      value: frames.length ? `${frames.length} works` : undefined,
    },
  ].filter((item) => item.value);

  return (
    <article className={isWriting ? "article-grid" : "flex flex-col"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="reveal flex flex-col gap-5 border-b border-rule pb-10">
        <Link
          href={back.href}
          className="label-caps group flex items-center gap-2 self-start transition-colors hover:text-ink"
        >
          <span className="cta-arrow inline-block rotate-180">→</span>
          {back.label}
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl leading-tight tracking-wide md:text-4xl">
            {entry.title}
          </h1>
          {entry.titleZh ? (
            <p className="font-serif text-xl text-muted">{entry.titleZh}</p>
          ) : null}
        </div>

        {entry.subtitle ? <p className="kicker">{entry.subtitle}</p> : null}

        {isWriting && entry.summary ? (
          <p className="standfirst">{curlQuotes(entry.summary)}</p>
        ) : null}

        <dl className="meta-grid">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="label-caps">{item.label}</dt>
              <dd>
                <span aria-hidden="true">└</span>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {isWriting ? (
        <div className="article-rail-slot">
          <ReadingRail title={entry.title} toc={toc} />
        </div>
      ) : null}

      <div id="article-body" className="reveal reveal-1 prose py-12">
        <Mdx source={entry.body} />
      </div>

      {frames.length > 0 ? (
        <div className="reveal reveal-2 flex flex-col gap-8 sm:gap-12">
          {frames.map((frame, index) => (
            <figure key={frame.src} className="m-0 flex flex-col gap-2">
              <div className="framed">
                <img
                  src={frame.src}
                  srcSet={frame.srcSet}
                  sizes="(min-width: 1024px) 62rem, 100vw"
                  width={frame.width}
                  height={frame.height}
                  alt={`${entry.title} — ${index + 1}`}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              {/* The gallery shows previews; frames kept at full size (the
                  GFX100s's 100 MP) link out to that WebP for pixel-peeping. */}
              {frame.width > PREVIEW_MAX ? (
                <figcaption className="label-caps self-end">
                  <a
                    href={frame.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-ink"
                  >
                    {Math.round((frame.width * frame.height) / 1e6)} MP 全尺寸 ↗
                  </a>
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      <div className="mt-14 flex flex-col gap-10">
        {entry.tags.length > 0 ? (
          <p className="label-caps flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-rule pt-6">
            {entry.tags.map((tag, index) => (
              <span key={tag} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                <Link
                  href={tagHref(tag)}
                  className="transition-colors duration-300 hover:text-ink"
                >
                  {tag}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <Comments term={canonical} />
      </div>
    </article>
  );
}
