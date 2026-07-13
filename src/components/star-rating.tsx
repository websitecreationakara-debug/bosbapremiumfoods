import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// A row of 5 stars. Read-only by default; pass `onRate` to make it an input.
// `value` is the number of filled stars to show (rounded); when interactive, the
// hovered star count previews over `value`.
export function StarRating({
  value,
  onRate,
  size = 20,
  disabled,
  className,
}: {
  value: number;
  onRate?: (stars: number) => void;
  size?: number;
  disabled?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState(0);
  const interactive = !!onRate;
  const shown = hover || value;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={() => interactive && setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(shown);
        const star = (
          <Star
            size={size}
            className={cn(
              "transition-colors",
              filled ? "fill-warning text-warning" : "fill-transparent text-muted-foreground/40",
            )}
          />
        );
        return interactive ? (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onMouseEnter={() => setHover(n)}
            onClick={() => onRate(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
