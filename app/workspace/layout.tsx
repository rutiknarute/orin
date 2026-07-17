import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getDemoUser, isDemoSession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Workspace", template: "%s — Orin" },
  description: "Orin product traceability and evidence workspace.",
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  if (!isDemoSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect("/login");
  }
  return <WorkspaceShell user={getDemoUser()}>{children}</WorkspaceShell>;
}
