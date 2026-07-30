import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import {
  friends,
  LINK_EXCHANGE,
  SITE_AUTHOR,
  SITE_URL,
} from "@/lib/site";

const canonical = `${SITE_URL}/friends`;
const description = "友情链接 — 读得下去的人，和他们的站点。";
export const metadata: Metadata = {
  title: "Friends",
  description,
  alternates: { canonical },
  openGraph: { url: canonical, title: "Friends", description },
};

export default function FriendsPage() {
  return (
    <PageShell kicker="Friends / 友情链接" title="Friends" titleZh="友情链接">
      <div className="flex flex-col gap-14">
        {friends.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map(({ name, href, linkText, note, avatar }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-link surface-card group flex h-full items-start gap-4 bg-surface p-5"
                >
                  {avatar.type === "image" ? (
                    <img
                      src={avatar.src}
                      alt=""
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      className="size-12 shrink-0 object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center border border-rule bg-paper font-serif text-xl"
                    >
                      {avatar.content}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="card-title block font-serif text-lg leading-snug">
                      {name}
                    </span>
                    <span className="label-caps mt-1 block truncate">
                      {linkText}
                    </span>
                    {note ? (
                      <span className="mt-2 block text-sm text-ink-soft">
                        {note}
                      </span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-y border-rule py-10 text-center font-serif text-xl text-muted text-balance">
            名单还空着 —— 下面是我这边的信息，想换的话写信给我。
            <span className="label-caps mt-3 block">
              Nothing here yet. Details below if you would like to swap.
            </span>
          </p>
        )}

        {/* What to copy if you want to link back */}
        <section className="surface-card flex flex-col gap-6 bg-surface p-7 sm:p-9">
          <p className="kicker">Exchange / 交换信息</p>

          <h2 className="font-serif text-2xl">本站信息</h2>

          <dl className="flex flex-col border-t border-rule">
            <Row term="Name" desc={LINK_EXCHANGE.name} />
            <Row term="URL" desc={LINK_EXCHANGE.url} href={LINK_EXCHANGE.url} />
            <Row term="Avatar" desc={LINK_EXCHANGE.avatar} />
            <Row term="Description" desc={LINK_EXCHANGE.description} />
          </dl>

          <p className="text-ink-soft">
            先在你的站上放好链接，然后把上面同样的四项发到{" "}
            <a href={`mailto:${SITE_AUTHOR.email}`} className="link">
              {SITE_AUTHOR.email}
            </a>
            ，我加上后回信。
          </p>
        </section>
      </div>
    </PageShell>
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
    <div className="flex flex-col gap-1 border-b border-rule py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-8">
      <dt className="label-caps sm:w-32 sm:shrink-0">{term}</dt>
      <dd className="min-w-0 text-sm break-words text-ink-soft">
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
