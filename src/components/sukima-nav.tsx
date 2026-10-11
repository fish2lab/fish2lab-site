"use client";

import { usePathname } from "next/navigation";

import { InkButton } from "./sukima/woodcut";

import styles from "./sukima-nav.module.css";

const LINKS = [
  { href: "/sukima", label: "画廊" },
  { href: "/sukima/giclee", label: "工艺" },
  { href: "/sukima/buy", label: "购买" },
  { href: "/sukima/about", label: "关于" },
] as const;

/**
 * 制品区自己的木刻导航。主站的 NavBar 和页脚在这一区被 woodcut.css 末尾那几条规则
 * 关掉了，所以这里留一条回主站的链接。
 *
 * 链接一律写 apex 路径：在 sukima.fish2lab.com 上点它们走客户端导航，地址栏会从子域
 * 换到 fish2lab.com 的路径，两边都是站内地址。
 */
export function SukimaNav() {
  const pathname = usePathname();

  /** 子域上 usePathname 可能给 /giclee，apex 上给 /sukima/giclee。 */
  const isActive = (href: string) =>
    pathname === href || pathname === href.replace("/sukima", "");

  return (
    <header className={styles.bar}>
      <a className={styles.back} href="https://fish2lab.com">
        fish<sup>2</sup>lab
      </a>
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
