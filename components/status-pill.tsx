"use client";

import {
  CheckCircle,
  Clock,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import type { EvidenceStatus, ProductStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Status = EvidenceStatus | ProductStatus;

const config: Record<Status, { tone: string; icon: typeof CheckCircle }> = {
  Verified: { tone: "success", icon: CheckCircle },
  "Passport ready": { tone: "success", icon: CheckCircle },
  "In review": { tone: "info", icon: Clock },
  "Needs evidence": { tone: "warning", icon: WarningCircle },
  Missing: { tone: "warning", icon: WarningCircle },
  "At risk": { tone: "danger", icon: XCircle },
  Expired: { tone: "danger", icon: XCircle },
};

export function StatusPill({ status, compact = false }: { status: Status; compact?: boolean }) {
  const { tone, icon: Icon } = config[status];
  return (
    <span className={cn("status-pill", `status-pill--${tone}`, compact && "status-pill--compact")}>
      <Icon size={compact ? 13 : 15} weight="fill" aria-hidden="true" />
      {status}
    </span>
  );
}
