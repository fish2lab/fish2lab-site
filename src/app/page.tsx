import type { Metadata } from "next";
import Link from "next/link";

import { CollectionCard, LinkRow } from "@/components/card";
import { ContactLinks } from "@/components/contact-links";
import { getEntries } from "@/lib/content";
import { collectionHost } from "@/lib/routes";
import {
  ABOUT,
  contacts,
  elsewhere,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SITE_VISION,
} from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` opts out of the layout's "%s — fish2lab" template: the front
  // page's tab should read as the wordmark and nothing else.
  title: { absolute: "fish²lab" },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: ["zh-CN", "en"],
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_AUTHOR.name,
      alternateName: SITE_AUTHOR.nameZh,
      url: `${SITE_URL}/about`,
      email: `mailto:${SITE_AUTHOR.email}`,
      sameAs: [
        ...contacts
          .map(({ href }) => href)
          .filter((href) => href.startsWith("https://")),
        ...elsewhere.map(({ href }) => href),
      ],
    },
  ],
};

/**
 * One unrolling front page in three beats: the mark and the line the site is
 * built around, the three collections, then who is behind them and where else
 * to find him. No photograph carries the page any more — the work is one
 * click away and gets to be a surprise.
 */
export default function HomePage() {
  const photography = getEntries("photography");
  const research = getEntries("research");
  const blog = getEntries("blog");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="mx-auto flex min-h-[calc(100svh-var(--neobar-space))] max-w-(--measure-cover) flex-col px-6 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center">
          <span className="hero-mark reveal w-40 sm:w-48 md:w-56">
            <img
              src="/images/mark/whale-fish_320.webp"
              srcSet="/images/mark/whale-fish_320.webp 320w, /images/mark/whale-fish_640.webp 640w"
              sizes="(min-width: 768px) 14rem, (min-width: 640px) 12rem, 10rem"
              width={534}
              height={534}
              alt="A whale spouting a fish — the fish²lab mark"
              fetchPriority="high"
              decoding="async"
            />
          </span>

          <div className="reveal reveal-1 flex max-w-3xl flex-col items-center gap-5">
            <p className="kicker">
              fish²lab · Portfolio · Research · Blog
            </p>
            <h1 className="font-serif text-3xl leading-[1.15] text-balance sm:text-4xl md:text-5xl">
              {SITE_VISION}
            </h1>
          </div>

          <p className="reveal reveal-2 label-caps">
            by {SITE_AUTHOR.nameZh} in Beijing
          </p>
        </div>

        <p aria-hidden="true" className="flex flex-col items-center gap-4 pb-8">
          <span className="font-mono text-xs tracking-[0.24em] uppercase text-ink-soft">
            Dive / 向下
          </span>
          <span className="cue-line" />
        </p>
      </section>

      {/* ── The three collections, each on its own subdomain ────────────── */}
      <section className="bg-surface">
        <div className="mx-auto flex min-h-[58svh] max-w-(--measure-cover) flex-col justify-center px-6 py-16 sm:py-20 lg:px-10">
          <div className="scroll-reveal grid items-stretch gap-5 md:grid-cols-3 lg:gap-6">
            <CollectionCard
              href="/portfolio"
              index="01"
              title="Online Portfolio"
              titleZh="摄影 · 作品集"
              host={collectionHost("photography")}
              logo="portfolio"
              count={`${photography.length} series`}
              latest={photography[0]?.title}
            />

            <CollectionCard
              href="/research"
              index="02"
              title="Research"
              titleZh="研究 · 进度"
              host={collectionHost("research")}
              logo="research"
              count={`${research.length} notes`}
              latest={research[0]?.title}
            />

            <CollectionCard
              href="/blog"
              index="03"
              title="Blog"
              titleZh="文章 · 写作"
              host={collectionHost("blog")}
              logo="blog"
              count={`${blog.length} posts`}
              latest={blog[0]?.title}
            />
          </div>
        </div>
      </section>

      {/* ── Who, and where else ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-(--measure-cover) px-6 py-20 sm:py-24 lg:px-10">
        <div className="scroll-reveal grid items-stretch gap-5 md:grid-cols-2 lg:gap-6">
          {/* Left: about me — a whole-card link, so it lifts like the three
              collection cards above it. */}
          <Link
            href="/about"
            className="card-link surface-card group flex flex-col gap-7 bg-surface p-7 sm:p-9"
          >
            <p className="kicker">About / 关于我</p>

            <div className="flex items-start gap-5 sm:gap-6">
              <img
                src="/images/portrait/avatar.webp"
                width={639}
                height={639}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-square w-22 shrink-0 object-cover sm:w-26"
              />
              <div className="min-w-0">
                <h2 className="card-title font-serif text-2xl leading-tight sm:text-3xl">
                  {SITE_AUTHOR.name}
                </h2>
                <p className="mt-1 font-serif text-lg text-muted">
                  {SITE_AUTHOR.nameZh}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  {ABOUT.role}
                  <span className="mt-0.5 block text-muted">
                    {ABOUT.roleZh}
                  </span>
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-ink-soft">
              北京交通大学博士生，研究 LLM security、agentic systems 与 Cognitive
              Science；同时实践 human-in-the-loop 协作、学习数学，并持续摄影。
            </p>

            <dl className="mt-auto flex flex-col border-t border-rule">
              <Fact term="Affiliation" desc={ABOUT.affiliation} />
              <Fact term="Field" desc={ABOUT.field} />
              <Fact term="Interests" desc={ABOUT.interests.join(" · ")} />
            </dl>

            <p className="label-caps flex items-baseline justify-between gap-3">
              <span>Read the full page</span>
              <span aria-hidden="true" className="cta-arrow shrink-0">
                →
              </span>
            </p>
          </Link>

          {/* Right: everywhere else, my own sites and other people's, at the
              same weight. */}
          <section className="surface-card flex flex-col gap-7 bg-surface p-7 sm:p-9">
            <p className="kicker">Elsewhere / 别处</p>

            <div>
              <h2 className="font-serif text-2xl leading-tight sm:text-3xl">
                Other places I keep
              </h2>
            </div>

            <div className="mt-auto flex flex-col">
              {elsewhere.map(({ label, href, note }) => (
                <LinkRow
                  key={href}
                  href={href}
                  label={label}
                  note={note}
                  external
                />
              ))}

              <span className="my-2 block h-px w-full bg-rule" />

              <LinkRow
                href="/friends"
                label="Friends · 友情链接"
                note="心贤的鱼缸"
              />

              <ContactLinks className="mt-4 -ml-2" />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

/** One term/description pair in the about card's fact list. */
function Fact({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-2.5 last:border-b-0">
      <dt className="label-caps">{term}</dt>
      <dd className="text-sm text-ink-soft">{desc}</dd>
    </div>
  );
}
