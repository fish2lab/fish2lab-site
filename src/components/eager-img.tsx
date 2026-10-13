"use client";

/**
 * A plain `<img>` for pictures that load eagerly — the LCP image of a page,
 * the first frames of a series.
 *
 * It is a client component only so that it is *not* a host element in the
 * RSC payload. React turns every eager `<img>` it meets in a server
 * component into an image preload hint inside that payload, and Next ships
 * the payload ahead of time whenever a `<Link>` to the page scrolls into
 * view. The hint then fires in whatever page did the prefetching: every
 * series cover on /portfolio, the About portrait on every page with a nav,
 * each one followed a few seconds later by Chrome's "preloaded but not used"
 * warning. Rendered from here, the image is still preloaded in its own
 * page's HTML (the SSR pass does that), and nowhere else.
 */
export function EagerImg(props: React.ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}
