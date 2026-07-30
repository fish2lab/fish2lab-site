import type { MetadataRoute } from "next";

import { APEX_HOST } from "@/lib/routes";
import { robotsFor } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return robotsFor(APEX_HOST);
}
