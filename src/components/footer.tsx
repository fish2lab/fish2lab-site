import Link from "next/link";

import { ContactLinks } from "@/components/contact-links";
import { elsewhere, footerLinks, SITE_AUTHOR } from "@/lib/site";

/** No cards down here — a hard rule, text links, and a colophon. */
export function Footer() {
  return (
    <footer className="mt-auto bg-surface">
      <div className="mx-auto flex max-w-(--measure-cover) flex-col gap-10 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="wordmark text-2xl">
            fish<sup>2</sup>lab
          </p>
          <p className="font-serif text-muted">
            {SITE_AUTHOR.name} · {SITE_AUTHOR.nameZh}
          </p>
          <ContactLinks className="-ml-2" />
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-col gap-8 sm:flex-row sm:gap-16"
        >
          <ul className="flex flex-col gap-2">
            {footerLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="link link-muted text-sm">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-2">
            {elsewhere.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-muted text-sm"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-(--measure-cover) border-t border-rule px-6 py-6">
        <p className="label-caps">© {new Date().getFullYear()} fish²lab</p>
      </div>
    </footer>
  );
}
