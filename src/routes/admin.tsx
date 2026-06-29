import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  Megaphone,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const SIDEBAR_KEY = "bosba:admin-sidebar-collapsed";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/banners", label: "Hero Banner", icon: GalleryHorizontalEnd },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user, isAdmin, isSales, isMarketing, isStaff, canAccessAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const { data: pendingCount = 0 } = usePendingOrderCount(!loading && !!user && isStaff);
  const prevCount = useRef<number | null>(null);

  // Collapsed sidebar shows icons only. Persisted so it survives navigation/reload.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
  }, []);
  const toggleSidebar = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });

  // Sales can only ever be on the Orders page.
  const salesBlocked = isSales && !isAdmin && !path.startsWith("/admin/orders");
  // Marketing is scoped to the catalog/marketing sections.
  const marketingPaths = [
    "/admin/products",
    "/admin/marketing",
    "/admin/categories",
    "/admin/media",
  ];
  const marketingBlocked =
    isMarketing && !isAdmin && path !== "/admin" && !marketingPaths.some((p) => path.startsWith(p));
  const visibleNav = isAdmin
    ? nav
    : isMarketing
      ? nav.filter((n) => n.to === "/admin" || marketingPaths.includes(n.to))
      : nav.filter((n) => n.to === "/admin/orders");

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin)) navigate({ to: "/" });
  }, [loading, user, canAccessAdmin, navigate]);

  useEffect(() => {
    if (salesBlocked) navigate({ to: "/admin/orders" });
    else if (marketingBlocked) navigate({ to: "/admin" });
  }, [salesBlocked, marketingBlocked, navigate]);

  useEffect(() => {
    // Alert only on an actual increase, never on first load.
    if (prevCount.current !== null && pendingCount > prevCount.current) {
      playChime();
      toast.success(`🛎️ New order! ${pendingCount} pending.`, { duration: 6000 });
    }
    prevCount.current = pendingCount;
  }, [pendingCount]);

  if (loading || !user || !canAccessAdmin) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-sidebar">
      <aside
        className={cn(
          "border-r border-sidebar-border flex flex-col gap-8 shrink-0 transition-[width] duration-200",
          collapsed ? "w-20 p-3 items-center" : "w-64 p-6",
        )}
      >
        <Link
          to="/"
          title="BOSBA Premium Foods"
          className={cn("flex items-center gap-2 min-w-0", collapsed && "justify-center")}
        >
          <img
            src="/logo.png"
            alt="BOSBA Premium Foods"
            className="size-9 rounded-lg object-contain shrink-0"
          />
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground truncate">
              BOSBA Premium Foods
            </span>
          )}
        </Link>
        <nav className="flex-1 w-full space-y-1">
          {visibleNav.map((n) => {
            const active = "exact" in n && n.exact ? path === n.to : path.startsWith(n.to);
            const badge = n.to === "/admin/orders" ? pendingCount : 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                title={collapsed ? n.label : undefined}
                className={cn(
                  "relative flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
                )}
              >
                <n.icon className="size-4 shrink-0" />
                {!collapsed && <span className="flex-1">{n.label}</span>}
                {badge > 0 &&
                  (collapsed ? (
                    <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
                  ) : (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                      {badge}
                    </span>
                  ))}
              </Link>
            );
          })}
        </nav>
        <div className="w-full space-y-1">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center rounded-lg text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent",
              collapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2.5",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" />
            ) : (
              <PanelLeftClose className="size-4 shrink-0" />
            )}
            {!collapsed && "Collapse"}
          </button>
          <Link
            to="/"
            title={collapsed ? "Back to storefront" : undefined}
            className={cn(
              "flex items-center rounded-lg text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2.5",
            )}
          >
            <ArrowLeft className="size-3.5 shrink-0" />
            {!collapsed && "Back to storefront"}
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-background p-8 overflow-x-auto">
        {salesBlocked || marketingBlocked ? (
          <div className="text-muted-foreground">Redirecting…</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
