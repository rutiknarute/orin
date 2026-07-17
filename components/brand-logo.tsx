import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "light" | "reverse";
  kind?: "wordmark" | "mark";
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "light",
  kind = "wordmark",
  className,
  priority = false,
}: BrandLogoProps) {
  const source =
    kind === "mark"
      ? "/logo_orin_icon-mark_20260428_full-color.png"
      : "/logo_orin_horizontal-wordmark_20260428_full-color.png";

  return (
    <span
      className={cn(
        "brand-logo",
        `brand-logo--${variant}`,
        `brand-logo--${kind}`,
        className,
      )}
      role="img"
      aria-label={kind === "mark" ? "Orin" : "Orin — From origin to compliance"}
    >
      <span className="brand-logo__crop" aria-hidden="true">
        <Image
          className="brand-logo__source"
          src={source}
          alt=""
          width={1254}
          height={1254}
          priority={priority}
          sizes={kind === "mark" ? "64px" : "180px"}
          unoptimized
        />
      </span>
    </span>
  );
}
