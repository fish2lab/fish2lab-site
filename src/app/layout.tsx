import type { Metadata } from "next";
import { Gelasio, Ubuntu_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import {
  HTML_LANG,
  OG_LOCALE,
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
            reserves its own clearance instead. */}
        <main className="flex-1 pt-(--neobar-space)">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
