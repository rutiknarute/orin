import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Orin — Connected product evidence",
    template: "%s — Orin",
  },
  description:
    "Orin connects supply-chain evidence and turns supplier documents into a trusted product record.",
  icons: {
    icon: "/logo_orin_icon-mark_20260428_full-color.png",
    apple: "/logo_orin_icon-mark_20260428_full-color.png",
  },
  openGraph: {
    title: "Orin — Connected product evidence",
    description: "Every supplier answer. One trusted product record.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orin — Connected product evidence",
    description: "Every supplier answer. One trusted product record.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A172D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are self-hosted (see scripts/fetch-fonts.mjs). Only the
            primary Latin cut is preloaded; the extended cut is declared in
            app/fonts.css and fetched only if a page needs those glyphs. */}
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/playfair-display-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
