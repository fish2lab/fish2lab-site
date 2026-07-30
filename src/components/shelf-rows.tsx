import Link from "next/link";

import {
  type Collection,
  type Entry,
  type Shelf,
  formatDate,
  groupByShelf,
} from "@/lib/content";

/**
 * Shelf marks. The image carries the character of each shelf; the bilingual
 * label beneath it makes the status explicit.
 */
const MARKS: Record<
  Shelf,
  Partial<Record<Collection, string>> & {
    default: string;
    labelZh: string;
    labelEn: string;
  }
> = {
  latest: {
    default: "shelf-latest",
    labelZh: "新鲜现捕",
    labelEn: "Newest",
  },
  current: {
    blog: "shelf-current-blog",
    research: "shelf-current-research",
    default: "shelf-current-blog",
    labelZh: "常看常新",
    labelEn: "Normal",
  },
  legacy: {
    default: "shelf-legacy",
    labelZh: "朝花夕拾",
    labelEn: "Legacy",
  },
};

/**
 * Research and blog index — entries in shelves, each announced by a mark
 * in the left margin.
 *
 * The mark is sticky: it rides down the margin for as long as its own shelf
 * is on screen, parks under the NeoBar, and is pushed out by the next shelf's
 * mark. So the top-left corner always answers "what am I looking at" without
 * a heading ever being written down.
 */
export function ShelfRows({
  entries,
  collection,
}: {
  entries: Entry[];
  collection: Collection;
}) {
  if (entries.length === 0) {
    return <p className="py-16 text-muted">Nothing published yet.</p>;
  }

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {groupByShelf(entries).map(({ shelf, entries: shelfEntries, offset }) => {
        const mark = MARKS[shelf];
        const file = mark[collection] ?? mark.default;

        return (
          <section
            key={shelf}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-7"
          >
            {/* Full-height track for the mark to travel down. */}
            <div>
              <div className="sticky top-[calc(var(--neobar-space)+1rem)] flex flex-col items-center gap-2">
                <img
                  src={`/images/mark/${file}_112.webp`}
                  srcSet={`/images/mark/${file}_112.webp 112w, /images/mark/${file}_224.webp 224w`}
                  sizes="(min-width: 640px) 3.5rem, 2.25rem"
                  width={534}
                  height={534}
                  alt={`${mark.labelZh} · ${mark.labelEn}`}
                  loading="lazy"
                  decoding="async"
                  className="size-9 sm:size-14"
                />
                <p className="label-caps hidden flex-col items-center leading-relaxed sm:flex">
                  <span>{mark.labelZh}</span>
                  <span>· {mark.labelEn}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {shelfEntries.map((entry, index) => (
                <EntryRow
                  key={entry.slug}
                  entry={entry}
                  index={offset + index}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function EntryRow({ entry, index }: { entry: Entry; index: number }) {
  const detail = [entry.status, entry.venue].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/${entry.collection}/${entry.slug}`}
      className="group relative block border border-rule p-5 transition-all duration-500 hover:border-ink/35 sm:p-6 lg:p-8"
    >
      <span className="label-caps absolute top-4 right-4 sm:top-5 sm:right-5 lg:top-7 lg:right-7">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
        {/* Even split: the narrower measure leaves a CJK title too little
            room to set on two lines at anything less. */}
        <div className="lg:w-1/2">
          <p className="kicker mb-3">{formatDate(entry.date)}</p>
          {/* Steps down on narrow screens: the mark's column plus the card's
              own padding leaves a CJK title very little to work with. */}
          <h2 className="pr-10 font-serif text-xl leading-tight transition-colors duration-300 group-hover:text-accent sm:text-2xl">
            {entry.title}
          </h2>
          {detail ? <p className="label-caps mt-3">{detail}</p> : null}
        </div>

        {/* pr clears the index number sitting in the corner above. */}
        <div className="lg:w-1/2 lg:border-l lg:border-rule lg:pr-10 lg:pl-8">
          {entry.summary ? (
            <p className="leading-relaxed text-ink-soft">{entry.summary}</p>
          ) : null}

          <p className="label-caps mt-5 flex items-center gap-3 transition-colors duration-300 group-hover:text-ink">
            Read <span className="cta-arrow">→</span>
          </p>
        </div>
      </div>

      {/* Red rule wipes across the foot on hover — the diary's tell. */}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
    </Link>
  );
}
