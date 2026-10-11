import type { Metadata } from "next";
import { Suspense } from "react";

import BuyPage from "@/components/sukima/pages/BuyPage";

export const metadata: Metadata = {
  title: "购买指引 / Purchase Guide",
  description: "隙间月影制品购买指引与付款方式。",
  alternates: { canonical: "/buy" },
};

/**
 * 订单票据是从查询串读出来的，而查询串只在浏览器上有。Suspense 边界让这一块
 * 在浏览器里渲染：静态 HTML 里没有订单（和服务端输出一致），水合后补上。
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <BuyPage />
    </Suspense>
  );
}
