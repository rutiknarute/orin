import type { Metadata } from "next";
import { HomeClient } from "@/app/home-client";

export const metadata: Metadata = {
  title: { absolute: "Orin — Every supplier answer. One trusted product record." },
  description:
    "Orin connects supply-chain evidence, turns documents into structured product data, and reveals what is ready and what still needs an answer.",
};

export default function HomePage() {
  return <HomeClient />;
}
