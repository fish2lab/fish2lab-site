import { collectionHost } from "@/lib/routes";
import { robotsTextFor } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return new Response(robotsTextFor(collectionHost("photography")), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
