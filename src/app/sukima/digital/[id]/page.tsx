import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArtworkDetail from "@/components/sukima/artwork/ArtworkDetail";
import { digitalOffers, type DigitalOffer } from "@/lib/sukima/offers";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(digitalOffers).map((id) => ({ id }));
}

async function offerFor(id: string): Promise<DigitalOffer | undefined> {
  return digitalOffers[id as DigitalOffer["id"]];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await offerFor(id);
  if (!offer) return {};

  return {
    title: offer.title,
    description: offer.seo.description,
    alternates: { canonical: `/digital/${offer.id}` },
    openGraph: {
      title: offer.title,
      description: offer.seo.description,
      images: offer.previews.length ? [offer.previews[0].image.src] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await offerFor(id);
  if (!offer) notFound();

  return <ArtworkDetail offer={offer} />;
}
