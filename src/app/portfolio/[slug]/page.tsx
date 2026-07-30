import { notFound } from "next/navigation";

import { Article } from "@/components/article";
import { metadataFor, staticParamsFor } from "@/lib/collection-route";
import { getEntry } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticParamsFor("photography");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return metadataFor("photography", slug);
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry("photography", slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto w-full max-w-(--measure-plate) px-6 py-12 lg:px-10">
      <Article entry={entry} />
    </div>
  );
}
