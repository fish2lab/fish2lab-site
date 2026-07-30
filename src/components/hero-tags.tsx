import Link from "next/link";

import { type TagInfo, getTopTags, tagHref } from "@/lib/tags";

/**
 * The hero's flanking tag scatter. The whale stays dead centre; research
 * tags drift down the left edge, portfolio and blog tags down the right,
 * each nudged off the baseline grid by a fixed rhythm so the two lists read
 * as scattered rather than stacked. Plain text links — no pills, no cards —
 * and desktop-only: below `lg` the hero stands alone.
 *
 * Currently unreferenced: with only a handful of entries per section, any
 * "top tags" pick reads arbitrary rather than curated, so the hero shows
 * the mark alone. Parked until the archive is big enough for the counts to
 * mean something — to bring it back, render `<HeroTags />` inside the
 * hero section of src/app/page.tsx (the section needs `relative`). The tag
 * system underneath (lib/tags.ts, /tags/[tag], article tag links) stays
 * live either way; delete this file only if that day never comes.
 */
const STAGGER = [0, 0.75, -0.5, 1.1, -0.85, 0.4, -0.25, 0.95, -0.6, 0.2];

export function HeroTags() {
  const research = getTopTags(["research"], 5);
  const creative = getTopTags(["photography", "blog"], 7);

  return (
    <>
      <TagColumn side="left" tags={research} />
      <TagColumn side="right" tags={creative} />
    </>
  );
}

function TagColumn({
  side,
  tags,
}: {
  side: "left" | "right";
  tags: TagInfo[];
}) {
  return (
    <ul
      className={`pointer-events-none absolute top-[46%] hidden -translate-y-1/2 flex-col gap-5 lg:flex ${
        side === "left"
          ? "left-6 items-start lg:left-10"
          : "right-6 items-end lg:right-10"
      }`}
    >
      {tags.map((info, index) => (
        <li
          key={info.slug}
          style={{
            transform: `translateY(${STAGGER[index % STAGGER.length]}rem)`,
          }}
        >
          <Link
            href={tagHref(info.label)}
            className="link link-muted pointer-events-auto font-mono text-xs tracking-[0.18em] uppercase"
          >
            {info.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
