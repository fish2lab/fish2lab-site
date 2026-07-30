import Link from "next/link";

import { Comments } from "@/components/comments";
import { Mdx } from "@/components/mdx";
import { type Entry, formatDate } from "@/lib/content";
import { SERIES_FRAMES } from "@/lib/series-frames.generated";

const BACK = {
  photography: { href: "/portfolio", label: "All series / 全部系列" },
  research: { href: "/research", label: "All research / 全部研究" },
  blog: { href: "/blog", label: "All blog posts / 全部文章" },
} as const;

/**
 * One column, one width. Masthead, body text and frames all sit on the same
 * left and right edges, so nothing steps in or out down the page.
 */
export function Article({ entry }: { entry: Entry }) {
  const frames = SERIES_FRAMES[entry.slug] ?? [];
  const back = BACK[entry.collection];

  const meta = [
    entry.year ?? formatDate(entry.date),
    entry.status,
    entry.location,
    frames.length ? `${frames.length} works` : undefined,
    entry.venue,
  ].filter(Boolean);

  return (
    <article className="flex flex-col">
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

        <p className="label-caps flex flex-wrap items-center gap-3">
          {meta.map((item, index) => (
            <span key={item} className="flex items-center gap-3">
              {index > 0 ? <span className="meta-dash" /> : null}
              {item}
            </span>
          ))}
        </p>
      </header>

      <div className="reveal reveal-1 prose py-12">
        <Mdx source={entry.body} />
      </div>

      {frames.length > 0 ? (
        <div className="reveal reveal-2 flex flex-col gap-8 sm:gap-12">
          {frames.map((frame, index) => (
            <figure key={frame.src} className="framed m-0">
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
            </figure>
          ))}
        </div>
      ) : null}

      <div className="mt-14 flex flex-col gap-10">
        {entry.tags.length > 0 ? (
          <p className="label-caps border-t border-rule pt-6">
            {entry.tags.join(" · ")}
          </p>
        ) : null}

        <Comments />
      </div>
    </article>
  );
}
