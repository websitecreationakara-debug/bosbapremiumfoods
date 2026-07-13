import { useState } from "react";
import { Package } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ItemImage({
  src,
  title,
  className,
}: {
  src: string | null | undefined;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <div
        className={cn(
          "size-11 rounded-lg border bg-background grid place-items-center shrink-0",
          className,
        )}
      >
        <Package className="size-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`View ${title}`}
        className={cn(
          "size-11 rounded-lg border bg-background overflow-hidden shrink-0 cursor-zoom-in transition-opacity hover:opacity-80",
          className,
        )}
      >
        <img src={src} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-sm p-4 gap-3">
          <DialogTitle className="pr-8 text-base">{title}</DialogTitle>
          <img src={src} alt={title} className="w-full max-h-[70vh] rounded-xl object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
}
