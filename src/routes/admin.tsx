import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { usePendingOrderCount } from "@/hooks/use-products";
import { playChime } from "@/lib/chime";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Settings,
  Image,
  GalleryHorizontalEnd,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/banners", label: "Hero Banner", icon: GalleryHorizontalEnd },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user, isAdmin, isSales, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const { data: pendingCount = 0 } = usePendingOrderCount(!loading && !!user && isStaff);
  const prevCount = useRef<number | null>(null);

  // Sales can only ever be on the Orders page.
  const salesBlocked = isSales && !isAdmin && !path.startsWith("/admin/orders");
  const visibleNav = isAdmin ? nav : nav.filter((n) => n.to === "/admin/orders");

  useEffect(() => {
    if (!loading && (!user || !isStaff)) navigate({ to: "/" });
  }, [loading, user, isStaff, navigate]);

  useEffect(() => {
    if (salesBlocked) navigate({ to: "/admin/orders" });
  }, [salesBlocked, navigate]);

  useEffect(() => {
    // Alert only on an actual increase, never on first load.
    if (prevCount.current !== null && pendingCount > prevCount.current) {
      playChime();
      toast.success(`🛎️ New order! ${pendingCount} pending.`, { duration: 6000 });
    }
    prevCount.current = pendingCount;
  }, [pendingCount]);

  if (loading || !user || !isStaff) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-sidebar">
      <aside className="w-64 border-r border-sidebar-border p-6 flex flex-col gap-8 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="BOSBA Premium Foods" className="size-9 rounded-lg object-contain" />
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            BOSBA Premium Foods
          </span>
        </Link>
        <nav className="flex-1 space-y-1">
          {visibleNav.map((n) => {
            const active = "exact" in n && n.exact ? path === n.to : path.startsWith(n.to);
            const badge = n.to === "/admin/orders" ? pendingCount : 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
                )}
              >
                <n.icon className="size-4" />
                <span className="flex-1">{n.label}</span>
                {badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to storefront
        </Link>
      </aside>
      <main className="flex-1 bg-background p-8 overflow-x-auto">
        {salesBlocked ? (
          <div className="text-muted-foreground">Redirecting…</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
