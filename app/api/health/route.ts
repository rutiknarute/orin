import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/data/catalog";

export async function GET() {
  const { source, products } = await getCatalog();
  return NextResponse.json({
    status: "ok",
    service: "orin-web",
    // "supabase" when the database answered, "snapshot" when the bundled
    // fallback is being served instead.
    catalog: { source, products: products.length },
  });
}
