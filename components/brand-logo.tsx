import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "light" | "reverse";
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "light",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn("brand-logo", `brand-logo--${variant}`, className)}
      role="img"
      aria-label="Orin — From origin to compliance"
    >
      <Image
        className="brand-logo__source"
        src="/orin-brand-board.png"
        alt=""
        width={1536}
        height={1024}
        priority={priority}
        sizes="180px"
        unoptimized
        aria-hidden="true"
      />
    </span>
  );
}
