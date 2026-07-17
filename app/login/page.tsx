import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginClient } from "@/app/login/login-client";
import { isDemoSession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Demo login — Orin" },
  description: "Sign in to the Orin product traceability demo workspace.",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  if (isDemoSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect("/workspace");
  }
  return <LoginClient />;
}
