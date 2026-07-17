import { NextRequest, NextResponse } from "next/server";
import { isDemoSession, SESSION_COOKIE } from "@/lib/auth";
import { demoDocumentAnalyzer } from "@/lib/ai/document-analyzer";

export async function POST(request: NextRequest) {
  if (!isDemoSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sign in to analyze a document." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { filename?: string }
    | null;
  const filename = body?.filename?.trim();

  if (!filename) {
    return NextResponse.json({ error: "Choose a document first." }, { status: 400 });
  }

  const result = await demoDocumentAnalyzer.analyze(filename);
  return NextResponse.json({ result });
}
