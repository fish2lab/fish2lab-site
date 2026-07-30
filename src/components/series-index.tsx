import Link from "next/link";

import { type Entry } from "@/lib/content";
import { COLLECTION_SITES } from "@/lib/routes";
import { SERIES_FRAMES } from "@/lib/series-frames.generated";

/**
 * Series index — image on one side, text on the other, alternating sides
 * down the page. This is the diary's layout: it uses the horizontal space a
 * portfolio actually has, instead of stacking a narrow column that needs a
 * tall screen to show three entries.
 *
 * Type is deliberately small here. On a portfolio page the frames carry the
 * page; the words label them.
 */
export function SeriesIndex({ entries }: { entries: Entry[] }) {
  return (
    <div className="flex flex-col gap-20 lg:gap-28">
      {entries.map((entry, index) => (
        <SeriesRow key={entry.slug} entry={entry} flipped={index % 2 === 1} />
      ))}
    </div>
  );
}

function SeriesRow({ entry, flipped }: { entry: Entry; flipped: boolean }) {
  const frame = SERIES_FRAMES[entry.slug]?.[0];
  const count = SERIES_FRAMES[entry.slug]?.length ?? 0;
  const href = `${COLLECTION_SITES[entry.collection].basePath}/${entry.slug}`;

  return (
    <article className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {frame ? (
        <Link
          href={href}
          className={`block ${flipped ? "lg:order-2" : "lg:order-1"}`}
        >
          <div className="framed aspect-4/3">
            <img
              src={frame.src}
              srcSet={frame.srcSet}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={frame.width}
              height={frame.height}
              alt={`${entry.title} — ${entry.titleZh ?? ""}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
      ) : null}

      <div
        className={`flex flex-col gap-4 ${flipped ? "lg:order-1" : "lg:order-2"}`}
      >
        <p className="label-sm flex flex-wrap items-center gap-3">
          <span>{entry.year ?? entry.date.slice(0, 4)}</span>
          <span className="meta-dash" />
          <span>{count} works</span>
          {entry.status ? (
            <>
              <span className="meta-dash" />
              <span className="text-accent">{entry.status}</span>
            </>
          ) : null}
        </p>

        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-[1.75rem] leading-tight md:text-[2rem]">
            <Link
              href={href}
              className="transition-colors duration-300 group-hover:text-accent"
            >
              {entry.title}
            </Link>
          </h2>
          {entry.titleZh ? (
            <p className="font-serif text-lg text-muted">{entry.titleZh}</p>
          ) : null}
        </div>

        {entry.subtitle ? <p className="kicker">{entry.subtitle}</p> : null}

        {entry.summary ? (
          <p className="text-sm leading-relaxed text-ink-soft">
            {entry.summary}
          </p>
        ) : null}

        <Link
          href={href}
          className="label-sm flex items-center gap-2 self-start pt-1 transition-colors duration-300 hover:text-ink"
        >
          View series / 查看系列 <span className="cta-arrow">→</span>
        </Link>
      </div>
    </article>
  );
}
