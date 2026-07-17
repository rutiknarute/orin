import { NextRequest, NextResponse } from "next/server";
import { demoProductRepository } from "@/lib/data/product-repository";
import { isDemoSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isDemoSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sign in to view products." }, { status: 401 });
  }
  const data = await demoProductRepository.list();
  return NextResponse.json({ data });
}
