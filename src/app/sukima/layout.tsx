import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";

import { SukimaNav } from "@/components/sukima-nav";
import SukimaScope from "@/components/sukima/woodcut/SukimaScope";
import { sukimaCanonicalUrl } from "@/lib/routes";

import "./woodcut.css";

/**
 * 制品区（隙间月影）。canonical 在 sukima.fish2lab.com 上，apex 的 /sukima/...
 * 同时可用——站内链接一律写 apex 路径，任何 host 下都对。
 *
 * 整区靠 html[data-sukima] 圈起来：woodcut.css 的每条规则都在那个标记下面，
 * 纸色、发丝线、无衬线字都只在这个子域/这段路径里生效。
 */
export const metadata: Metadata = {
  metadataBase: new URL(sukimaCanonicalUrl()),
  title: {
    default: "隙间月影 Sukima Moonlight",
    template: "%s — 隙间月影",
  },
  description: "东方 Project × 世界名画的艺术微喷制品。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "隙间月影 Sukima Moonlight",
  },
};

/** 制品区的无衬线和等宽（拉丁字母；中文走系统黑体，见 woodcut.css 的 --wc-font-sans） */
const sans = Inter({ subsets: ["latin"], display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const FONT_VARS = `html[data-sukima]{--font-sukima-sans:${sans.style.fontFamily};--font-sukima-mono:${mono.style.fontFamily}}`;

/** 首帧就得有 data-sukima，等到 effect 里再挂会闪一下主站的底色。 */
const SCOPE_FLAG =
  "(function(){try{document.documentElement.setAttribute('data-sukima','')}catch(e){}})();";

export default function SukimaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCOPE_FLAG }} />
      <style dangerouslySetInnerHTML={{ __html: FONT_VARS }} />
      <SukimaScope />
      <SukimaNav />
      {children}
    </>
  );
}
