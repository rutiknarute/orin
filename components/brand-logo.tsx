import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "light" | "reverse";
  kind?: "wordmark" | "mark";
  className?: string;
  priority?: boolean;
}

const sources = {
  wordmark: {
    src: "/logo_orin_horizontal-wordmark_20260428_full-color.png",
    width: 468,
    height: 215,
  },
  mark: {
    src: "/logo_orin_icon-mark_20260428_full-color.png",
    width: 192,
    height: 196,
  },
} as const;

/**
 * The brand PNGs are pre-cropped and already sized for a 3x display, so they
 * are served directly. Routing them through next/image would add its client
 * runtime to every page for no benefit — the asset is 10 kB and never resized.
 */
export function BrandLogo({
  variant = "light",
  kind = "wordmark",
  className,
  priority = false,
}: BrandLogoProps) {
  const { src, width, height } = sources[kind];

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="brand-logo__source"
          src={src}
          alt=""
          width={width}
          height={height}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      </span>
    </span>
  );
}
