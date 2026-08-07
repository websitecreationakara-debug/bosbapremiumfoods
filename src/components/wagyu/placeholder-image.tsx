import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Warm placeholder block standing in for a real photo — swap the parent
// usage for a real <img>/<PlaceholderImage replace> once assets are ready.
export function PlaceholderImage({
  label,
  className,
  tone = "warm",
}: {
  label: string;
  className?: string;
  tone?: "warm" | "deep";
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 overflow-hidden border border-dashed text-center",
        tone === "warm"
          ? "border-[#a8402f]/25 bg-gradient-to-br from-[#efe6d6] to-[#e2d5bd] text-[#7a5f45]"
          : "border-white/20 bg-gradient-to-br from-[#2a2a24] to-[#151512] text-white/50",
        className,
      )}
    >
      <ImageIcon className="size-6 opacity-50" strokeWidth={1.5} />
      <span className="max-w-[16rem] px-4 text-[11px] font-medium uppercase tracking-[0.14em] opacity-70">
        {label}
      </span>
    </div>
  );
}
