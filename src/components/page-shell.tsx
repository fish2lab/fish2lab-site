/**
 * Shared masthead for the index pages: red mono kicker, serif title, Chinese
 * title beneath — the diary's PageShell, on the site's wide measure.
 */
export function PageShell({
  kicker,
  title,
  titleZh,
  /**
   * Index pages that are all type — research, writing — read better on a
   * narrower measure than the picture-led ones, which need the full width.
   */
  measure = "cover",
  children,
}: {
  kicker: string;
  title: string;
  titleZh?: string;
  measure?: "cover" | "index";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto px-6 lg:px-10 ${
        measure === "index"
          ? "max-w-(--measure-index)"
          : "max-w-(--measure-cover)"
      }`}
    >
      <header className="reveal border-b border-rule pt-12 pb-10">
        <p className="kicker mb-4">{kicker}</p>
        <h1 className="font-serif text-4xl leading-none tracking-wide md:text-5xl">
          {title}
        </h1>
        {titleZh ? (
          <p className="mt-3 font-serif text-lg text-muted">{titleZh}</p>
        ) : null}
      </header>

      <div className="reveal reveal-1 py-14 lg:py-20">{children}</div>
    </div>
  );
}
