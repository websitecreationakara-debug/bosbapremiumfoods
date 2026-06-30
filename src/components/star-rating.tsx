import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

// Read-only star display supporting fractional fill (e.g. 4.3 → 4.3 stars).
export function Stars({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const cls = SIZE[size];
  return (
    <span className={cn("relative inline-flex", className)} aria-label={`${value} out of 5 stars`}>
      <span className="flex text-muted-foreground/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cls} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-warning"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn(cls, "shrink-0 fill-warning")} />
        ))}
      </span>
    </span>
  );
}

// Interactive 1–5 star picker for the review form.
export function StarInput({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: keyof typeof SIZE;
}) {
  const cls = SIZE[size];
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              cls,
              n <= value ? "fill-warning text-warning" : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}
