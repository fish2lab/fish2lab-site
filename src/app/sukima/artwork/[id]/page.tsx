import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArtworkDetail from "@/components/sukima/artwork/ArtworkDetail";
import { artworkOffers, type ArtworkOffer } from "@/lib/sukima/offers";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(artworkOffers).map((id) => ({ id }));
}

async function offerFor(id: string): Promise<ArtworkOffer | undefined> {
  return artworkOffers[id as ArtworkOffer["id"]];
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
    title: offer.seo.title,
    description: offer.seo.description,
    alternates: { canonical: `/artwork/${offer.id}` },
    openGraph: {
      title: offer.seo.title,
      description: offer.seo.description,
      images: offer.image ? [offer.image.src] : undefined,
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
