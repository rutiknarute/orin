import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
