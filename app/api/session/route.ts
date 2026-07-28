import { NextRequest, NextResponse } from "next/server";
import { isDemoSession, SESSION_COOKIE } from "@/lib/auth";
import { getCatalog } from "@/lib/data/catalog";

export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isDemoSession(session)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const { user } = await getCatalog();
  return NextResponse.json({ user });
}
