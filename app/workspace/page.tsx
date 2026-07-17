import type { Metadata } from "next";
import { DashboardClient } from "@/components/workspace/dashboard-client";

export const metadata: Metadata = { title: "Overview" };

export default function WorkspacePage() {
  return <DashboardClient />;
}
