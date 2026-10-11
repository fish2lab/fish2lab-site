import type { Metadata } from "next";

import GalleryPage from "@/components/sukima/pages/GalleryPage";

export const metadata: Metadata = {
  // 与 layout 同段，模板不套到自己这一层，所以标题写全
  title: { absolute: "作品集 — 隙间月影" },
  description: "探索东方 Project 角色与世界名画相遇的艺术微喷作品集。",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <GalleryPage />;
}
