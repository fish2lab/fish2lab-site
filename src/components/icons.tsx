/**
 * Contact glyphs.
 *
 * All three are solid, single-path, `currentColor` marks on a 24×24 box, so
 * they sit on one optical baseline in an icon row and inherit whatever colour
 * the link around them is using. Inline rather than a sprite or a package —
 * three paths do not justify either.
 */

type IconProps = { className?: string };

function Svg({
  children,
  className = "",
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2 6.4A2.4 2.4 0 0 1 4.4 4h15.2A2.4 2.4 0 0 1 22 6.4v.28l-9.51 5.33a1 1 0 0 1-.98 0L2 6.68zm0 2.58V17.6A2.4 2.4 0 0 0 4.4 20h15.2a2.4 2.4 0 0 0 2.4-2.4V8.98l-8.53 4.78a2.2 2.2 0 0 1-2.14 0z" />
    </Svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58l-.02-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.08-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" />
    </Svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </Svg>
  );
}
