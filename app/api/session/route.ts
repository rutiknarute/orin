import { NextRequest, NextResponse } from "next/server";
import { getDemoUser, isDemoSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isDemoSession(session)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: getDemoUser() });
}
