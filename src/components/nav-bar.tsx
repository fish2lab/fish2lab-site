"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { navCentreLinks, navEdgeLink, navLinks } from "@/lib/site";

/**
 * The NeoBar — a liquid-glass pane fixed a little clear of the top and side
 * edges, riding above the page as it scrolls.
 *
 * The row is a three-column grid rather than a flex row with `justify-between`
 * so that the links land on the page's true centre line: the wordmark and the
 * mobile toggle sit in equal-width outer tracks and cannot pull the middle
 * one off-centre as their content changes.
 */
export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Route change closes the menu; otherwise it would stay open over the new
  // page. Adjusted during render rather than in an effect — the menu never
  // paints open on the new route, and no cascading render is triggered.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape, and any click outside the panel, dismisses it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="neobar-shell">
      <div ref={panelRef}>
        <nav
          aria-label="Primary"
          className="neobar grid h-(--neobar-height) grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-5"
        >
          {/* Not a `.link` — the wordmark should never carry the nav's
              current-page rule, which would read as a stray underline. */}
          <Link
            href="/"
            className="wordmark cursor-pointer justify-self-start text-lg transition-opacity duration-300 hover:opacity-65"
          >
            fish<sup>2</sup>lab
          </Link>

          {/* Desktop: the three sections as one segmented switch on the
              centre line — a single quiet control, not three links
              competing for the eye. */}
          <ul className="segmented hidden sm:flex">
            {navCentreLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="segment"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* About answers the wordmark across the bar. */}
          <Link
            href={navEdgeLink.href}
            aria-current={isActive(navEdgeLink.href) ? "page" : undefined}
            className={`link col-start-3 hidden justify-self-end text-sm sm:block ${
              isActive(navEdgeLink.href) ? "" : "link-muted"
            }`}
          >
            {navEdgeLink.label}
          </Link>

          {/* Mobile: a text toggle, still no button chrome. It shares the
              third track with About; exactly one of the two is ever shown. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="link link-muted col-start-3 cursor-pointer justify-self-end bg-transparent p-0 font-mono text-xs tracking-[0.14em] uppercase sm:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>

        {/* Dropdown: a second pane under the bar, not an extension of it.
            `neobar-solid`, not bare `neobar` — over scrolling content the
            glass is unreadable, so this pane is opaque. */}
        <div
          id="mobile-nav"
          hidden={!open}
          className="neobar neobar-solid mt-2 origin-top sm:hidden"
        >
          <ul className="flex flex-col px-4 py-1">
            {navLinks.map(({ label, labelZh, href }) => (
              <li
                key={href}
                className="border-b border-rule/50 last:border-b-0"
              >
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-baseline justify-between gap-4 py-3.5 ${
                    isActive(href) ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  <span className="font-serif text-lg">{labelZh}</span>
                  <span className="label-caps">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
