import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PassportView } from "@/app/passport/[id]/passport-view";
import { productRepository } from "@/lib/data/product-repository";

/**
 * Absolute origin for this request, used to build the scannable passport URL.
 * A QR code has to carry an absolute address, and the site runs on Vercel,
 * Cloudflare, and localhost — so derive it from the request rather than
 * hardcoding a domain. `SITE_URL` wins when a canonical domain is configured.
 */
async function requestOrigin() {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await productRepository.get(id);
  return {
    title: product ? `${product.name} — Digital Product Passport` : "Product passport",
    description: product ? `Evidence-backed product passport for ${product.name}.` : "Orin digital product passport.",
  };
}

export default async function PassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productRepository.get(id);
  if (!product) notFound();
  const origin = await requestOrigin();
  return <PassportView product={product} passportUrl={`${origin}/passport/${product.id}`} />;
}
