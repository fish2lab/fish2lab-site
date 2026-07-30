import type { Metadata } from "next";

import { ContactLinks } from "@/components/contact-links";
import { ABOUT, elsewhere, SITE_AUTHOR, SITE_URL } from "@/lib/site";

const canonical = `${SITE_URL}/about`;
const description = `${SITE_AUTHOR.name} · ${SITE_AUTHOR.nameZh} — ${ABOUT.role}`;
export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical },
  openGraph: { url: canonical, title: "About", description },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-(--measure-cover) px-6 py-12 lg:px-10">
      <header className="reveal border-b border-rule pb-10">
        <p className="kicker mb-4">About / 关于</p>
        <h1 className="font-serif text-4xl leading-none tracking-wide md:text-5xl">
          {SITE_AUTHOR.name}
        </h1>
        <p className="mt-3 font-serif text-lg text-muted">
          {SITE_AUTHOR.nameZh}
        </p>
      </header>

      <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        {/* Portrait and the hard facts */}
        <aside className="reveal flex flex-col gap-6">
          <figure className="group m-0">
            <div className="framed aspect-3/4">
              <img
                src="/images/portrait/silas.webp"
                srcSet="/images/portrait/silas_800.webp 800w, /images/portrait/silas_1600.webp 1200w"
                sizes="(min-width: 1024px) 30vw, 100vw"
                width={1200}
                height={1600}
                alt={`${SITE_AUTHOR.name} · ${SITE_AUTHOR.nameZh}`}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption className="label-caps mt-3 flex items-baseline justify-between gap-4">
              <span>Fig 1.</span>
              <span>The Creator</span>
            </figcaption>
          </figure>

          <dl className="flex flex-col gap-4 border-t border-rule pt-6">
            <Row term="Role" desc={ABOUT.role} />
            <Row term="Affiliation" desc={ABOUT.affiliation} />
            <Row term="Field" desc={ABOUT.field} />
            <Row term="Based in" desc={ABOUT.location} />
            <Row
              term="Email"
              desc={SITE_AUTHOR.email}
              href={`mailto:${SITE_AUTHOR.email}`}
            />
          </dl>
        </aside>

        {/* Everything else, in horizontal rows rather than a stacked column */}
        <div className="reveal reveal-1 flex flex-col gap-12">
          <Block title="Research" titleZh="研究方向">
            <ul className="flex flex-col gap-2.5">
              {ABOUT.research.map((line) => (
                <li key={line} className="text-ink-soft">
                  {line}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Recently" titleZh="最近在做">
            <ul className="flex flex-col gap-2.5">
              {ABOUT.recently.map((line) => (
                <li key={line} className="text-ink-soft">
                  {line}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Interests" titleZh="兴趣">
            <ul className="flex flex-col gap-2.5">
              {ABOUT.interests.map((interest) => (
                <li key={interest} className="text-ink-soft">
                  {interest}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Gear" titleZh="器材">
            <dl className="flex flex-col">
              {ABOUT.gear.map(({ name, detail }) => (
                <div
                  key={name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3 last:border-b-0"
                >
                  <dt className="font-serif">{name}</dt>
                  <dd className="label-caps">{detail}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <div className="mt-auto">
            <Block title="Elsewhere" titleZh="别处">
              <ul className="flex flex-col gap-2.5">
                {elsewhere.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link text-ink-soft"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <ContactLinks className="mt-4 -ml-2" />
            </Block>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  term,
  desc,
  href,
}: {
  term: string;
  desc: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="label-caps">{term}</dt>
      <dd className="text-ink-soft">
        {href ? (
          <a href={href} className="link">
            {desc}
          </a>
        ) : (
          desc
        )}
      </dd>
    </div>
  );
}

/** Title on the left third, content on the right — the journal-row shape. */
function Block({
  title,
  titleZh,
  children,
}: {
  title: string;
  titleZh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:gap-10">
      <div className="sm:w-1/4 sm:shrink-0">
        <h2 className="font-serif text-lg">{title}</h2>
        <p className="label-caps mt-1">{titleZh}</p>
      </div>
      <div className="sm:flex-1">{children}</div>
    </section>
  );
}
