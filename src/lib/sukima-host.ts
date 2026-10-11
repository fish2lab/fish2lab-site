"use client";

import { useSyncExternalStore } from "react";

/*
 * 主机名只有浏览器知道，而服务端和客户端首帧必须给出一致的 DOM。
 * useSyncExternalStore 正是为这种情况准备的：水合时用服务端的空快照，水合之后
 * 立刻读一次真实值并重渲染，因此既不闪也不会有 hydration mismatch。
 */

const SERVER_HOST = "";

const subscribe = () => () => {};

const snapshot = () => window.location.hostname;

const serverSnapshot = () => SERVER_HOST;

/** 当前 hostname；服务端渲染和首帧是空串。 */
export function useHostname(): string {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

/** 制品区的 canonical 子域（本地开发时是 sukima.localhost）。 */
export function useIsSukimaHost(): boolean {
  const host = useHostname();
  return host === "sukima.localhost" || host.startsWith("sukima.");
}
