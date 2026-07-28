import { NextRequest, NextResponse } from "next/server";
import { DEMO_CREDENTIALS, SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth";
import { getCatalog } from "@/lib/data/catalog";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  if (
    body?.email?.trim().toLowerCase() !== DEMO_CREDENTIALS.email ||
    body?.password !== DEMO_CREDENTIALS.password
  ) {
    return NextResponse.json(
      {
        error: "Those details do not match the demo account. Use the credentials shown below the form.",
      },
      { status: 401 },
    );
  }

  const { user } = await getCatalog();
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
