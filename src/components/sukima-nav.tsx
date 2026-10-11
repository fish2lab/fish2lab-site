"use client";

import { usePathname } from "next/navigation";

import { useIsSukimaHost } from "@/lib/sukima-host";

import { InkButton } from "./sukima/woodcut";

import styles from "./sukima-nav.module.css";

const LINKS = [
  { href: "/sukima", label: "画廊" },
  { href: "/sukima/giclee", label: "工艺" },
  { href: "/sukima/buy", label: "购买" },
  { href: "/sukima/about", label: "关于" },
] as const;

/**
 * 制品区自己的木刻导航。主站的 NavBar 在这一区被 woodcut.css 关掉了，所以左上角同时给出
 * 两条回家的路：隙间月影的标回制品区首页，后面的「·fish2lab」回主站。后者只在这个子域上
 * 出现——在 fish2lab.com/sukima 上再看一遍「fish2lab」是多余的。
 *
 * 主机名只有浏览器知道，所以这一段在水合之后才补上（事先渲染的是空位，不会出现
 * 服务端与客户端不一致的 DOM）。
 */
export function SukimaNav() {
  const pathname = usePathname();
  const onSukimaHost = useIsSukimaHost();

  /**
   * 浏览器地址栏说了算：apex 上是 /sukima/…，子域上是 /（首页）或 /buy 这样的短路径
   * —— 重写只发生在服务端，客户端拿到的仍是地址栏里的那条。
   */
  const isActive = (href: string) =>
    pathname === href ||
    pathname === href.replace("/sukima", "") ||
    (href === "/sukima" && pathname === "/");

  return (
    <header className={styles.bar}>
      <span className={styles.brand}>
        <a
          className={styles.mark}
          href={onSukimaHost ? "/" : "/sukima"}
          aria-label="隙间月影 Sukima Moonlight 首页"
        >
          <img src="/images/sukima/favicon.svg" alt="" width={30} height={30} />
        </a>
        {onSukimaHost ? (
          <a className={styles.back} href="https://fish2lab.com">
            ·fish<sup>2</sup>lab
          </a>
        ) : null}
      </span>
      <nav className={styles.links} aria-label="制品区">
        {LINKS.map((link, i) => (
          <InkButton
            key={link.href}
            href={link.href}
            size="sm"
            variant={isActive(link.href) ? "solid" : "outline"}
            seed={11 + i}
          >
            {link.label}
          </InkButton>
        ))}
      </nav>
    </header>
  );
}
