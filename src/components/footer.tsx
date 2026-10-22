import Link from "next/link";

import { ContactLinks } from "@/components/contact-links";
import { SukimaMark } from "@/components/sukima-mark";
import { elsewhere, footerLinks, SITE_AUTHOR } from "@/lib/site";

/**
 * No cards down here — a hard rule, text links, and a colophon.
 *
 * The gutters (px-6, lg:px-10) are the page containers' gutters: on a
 * cover-measure page the footer's text edges must land exactly on the
 * content's, or the two columns read as a 32px misregistration.
 */
export function Footer() {
  return (
    <footer className="wc-keep-font mt-auto bg-surface">
      <div className="mx-auto flex max-w-(--measure-cover) flex-col gap-10 px-6 py-12 sm:flex-row lg:px-10 sm:justify-between">
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

          {/* One site left: keep the two-row footprint the list had when
              Studio Phantasm was still here, so the column doesn't collapse. */}
          <ul className="flex flex-col gap-2 sm:min-h-[3.9rem] sm:self-start sm:justify-center">
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

      <div className="mx-auto flex max-w-(--measure-cover) items-center gap-3 border-t border-rule px-6 py-6 lg:px-10">
        {/* 制品区才出现的一枚标记：隙间月影的标，在左下角，主站页脚不变 */}
        <SukimaMark />
        <p className="label-caps">© {new Date().getFullYear()} fish²lab</p>
      </div>
    </footer>
  );
}
