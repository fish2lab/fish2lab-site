import { notFound } from "next/navigation";

import { Article } from "@/components/article";
import { metadataFor, staticParamsFor } from "@/lib/collection-route";
import { getEntry } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticParamsFor("blog");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return metadataFor("blog", slug);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry("blog", slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto w-full max-w-(--measure-read) px-6 py-12 lg:px-10">
      <Article entry={entry} />
    </div>
  );
}
