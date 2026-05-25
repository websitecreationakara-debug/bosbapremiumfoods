import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_store/wishlist")({
  component: () => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <div className="size-20 rounded-full bg-muted grid place-items-center mx-auto mb-6">
        <Heart className="size-8 text-muted-foreground" />
      </div>
      <h1 className="font-display font-bold text-3xl">Your wishlist is empty</h1>
      <p className="text-muted-foreground mt-2">Save items you love for later.</p>
    </div>
  ),
});
