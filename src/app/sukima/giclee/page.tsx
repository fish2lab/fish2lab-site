import type { Metadata } from "next";

import GicleePage from "@/components/sukima/pages/GicleePage";

export const metadata: Metadata = {
  title: "艺术微喷工艺介绍",
  description: "不止是周边，这是通往幻想乡的“真迹”。",
  alternates: { canonical: "/giclee" },
};

export default function Page() {
  return <GicleePage />;
}
