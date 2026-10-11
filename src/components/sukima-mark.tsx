"use client";

import { usePathname } from "next/navigation";

import { useIsSukimaHost } from "@/lib/sukima-host";

/**
 * 页脚左下角那一枚：制品区的标，回制品区首页。只在制品区（路径以 /sukima 开头）渲染，
 * 所以主站页脚一点都不变。
 *
 * apex 的 /sukima 路径在预渲染时就知道，不闪；子域上地址栏是 /，所以再加一条主机名判断。
 */
export function SukimaMark() {
  const pathname = usePathname();
  const onSukimaHost = useIsSukimaHost();

  // apex 上是 /sukima/…；子域上地址栏是 /、/buy 这种短路径，靠主机名认。
  if (!pathname.startsWith("/sukima") && !onSukimaHost) return null;

  return (
    <a
      href={onSukimaHost ? "/" : "/sukima"}
      aria-label="隙间月影 Sukima Moonlight 首页"
      className="block shrink-0"
    >
      <img
        src="/images/sukima/favicon.svg"
        alt=""
        width={22}
        height={22}
        className="block size-[22px]"
      />
    </a>
  );
}
