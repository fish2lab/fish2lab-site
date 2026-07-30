import type { Metadata } from "next";
import { Gelasio, Ubuntu_Mono } from "next/font/google";
import { ViewTransition } from "react";

import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import {
  HTML_LANG,
  OG_LOCALE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

import "./globals.css";

const gelasio = Gelasio({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gelasio",
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-ubuntu-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_AUTHOR.name, url: `${SITE_URL}/about` }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_NAME,
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Chypre271828",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={HTML_LANG}
      className={`${gelasio.variable} ${ubuntuMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar />
        {/* The NeoBar is fixed, so it takes no space in the flow; the page
            reserves its own clearance instead. The ViewTransition wraps the
            page, not the chrome: every route change crossfades the content
            while the bar and footer hold still. */}
        <main className="flex-1 pt-(--neobar-space)">
          <ViewTransition name="page">{children}</ViewTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
