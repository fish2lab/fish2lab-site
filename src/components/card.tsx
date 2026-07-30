import Link from "next/link";

/**
 * The home page's collection card — one of three, sized to be read at a
 * glance rather than browsed.
 *
 * It shows the collection's own hostname in the footer on purpose: the three
 * sections each answer on a subdomain now, and printing the address is the
 * quietest way to teach that without a paragraph explaining it. The card
 * still links by path (`/portfolio`), which resolves on every host, so
 * client-side navigation survives the split.
 */
export function CollectionCard({
  href,
  index,
  title,
  titleZh,
  host,
  logo,
  count,
  latest,
}: {
  href: string;
  /** Contents-page number, "01" through "03". */
  index: string;
  title: string;
  titleZh: string;
  /** The collection's subdomain, printed as the card's address line. */
  host: string;
  /** Basename under /images/mark of the card's emoji-kitchen logo. */
  logo: "portfolio" | "research" | "blog";
  /** e.g. "6 series" — how much is actually in there. */
  count: string;
  /** Title of the newest entry, when the collection has one. */
  latest?: string;
}) {
  return (
    <Link
      href={href}
      className="card-link surface-card group flex flex-col gap-6 bg-paper p-7 sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="kicker">
          {index} / {titleZh}
        </span>
        <span className="label-caps shrink-0">{count}</span>
      </div>

      <div>
        {/* The logo says what the section is; the card carries no blurb. */}
        <img
          src={`/images/mark/${logo}_160.webp`}
          srcSet={`/images/mark/${logo}_160.webp 160w, /images/mark/${logo}_320.webp 320w`}
          sizes="5rem"
          width={534}
          height={534}
          alt=""
          loading="lazy"
          decoding="async"
          className="mb-5 block size-20 transition-transform duration-500 ease-out group-hover:-translate-y-1"
        />
        <h3 className="card-title font-serif text-2xl leading-tight">
          {title}
        </h3>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-rule pt-5">
        {latest ? (
          <p className="truncate text-sm text-muted">
            Latest — <span className="text-ink-soft">{latest}</span>
          </p>
        ) : null}
        <p className="label-caps flex items-baseline justify-between gap-3">
          <span className="truncate">{host}</span>
          <span aria-hidden="true" className="cta-arrow shrink-0">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}

/**
 * A row inside the Elsewhere panel. Internal and external destinations get
 * the same weight — a friends page listed beside my own sites is a peer of
 * them, not a heading above them — and differ only in the trailing glyph.
 */
export function LinkRow({
  href,
  label,
  note,
  external = false,
}: {
  href: string;
  label: string;
  note?: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="card-title block font-serif text-lg leading-snug">
          {label}
        </span>
        {note ? (
          <span className="mt-0.5 block text-sm text-muted">{note}</span>
        ) : null}
      </span>
      <span aria-hidden="true" className="cta-arrow label-caps shrink-0 pt-1.5">
        {external ? "↗" : "→"}
      </span>
    </>
  );

  const className =
    "card-link card-row group -mx-3 flex items-start gap-4 px-3 py-3.5";

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
