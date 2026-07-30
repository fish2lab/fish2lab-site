import { notFound } from "next/navigation";

import { Article } from "@/components/article";
import { metadataFor, staticParamsFor } from "@/lib/collection-route";
import { getEntry } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticParamsFor("research");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return metadataFor("research", slug);
}

export default async function ResearchEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry("research", slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto w-full max-w-(--measure-read) px-6 py-12 lg:px-10">
      <Article entry={entry} />
    </div>
  );
}
