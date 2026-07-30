import { GitHubIcon, MailIcon, XIcon } from "@/components/icons";
import { contacts } from "@/lib/site";

const GLYPHS = {
  mail: MailIcon,
  github: GitHubIcon,
  x: XIcon,
} as const;

/**
 * The contact row — mail, GitHub, X — as glyphs only.
 *
 * Nothing here is labelled on screen, so each link carries its destination in
 * `aria-label` and a native `title`: screen readers get the address, and a
 * hover tells a sighted reader which account they are about to open before
 * they commit to the click.
 */
export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {contacts.map(({ id, label, href }) => {
        const Glyph = GLYPHS[id];
        const external = !href.startsWith("mailto:");

        return (
          <li key={id}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(external
                ? { target: "_blank", rel: "me noopener noreferrer" }
                : {})}
              className="card-row flex size-8 items-center justify-center text-muted transition-colors hover:text-ink"
            >
              <Glyph className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
