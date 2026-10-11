import { sukimaHost } from "@/lib/routes";
import { robotsTextFor } from "@/lib/seo";

export const dynamic = "force-static";

/** 子域自己的 robots.txt：sitemap 指向子域的 /sitemap.xml，与页面同 host。 */
export function GET() {
  return new Response(robotsTextFor(sukimaHost()), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
