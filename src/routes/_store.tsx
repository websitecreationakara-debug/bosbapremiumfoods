import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/_store")({
  component: StoreLayout,
});

// The /wagyu story page renders its own transparent overlay header
// (WagyuHeader) instead of the standard e-commerce SiteHeader.
function StoreLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWagyuPage = pathname === "/wagyu";

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      {!isWagyuPage && <SiteHeader />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isWagyuPage && <SiteFooter />}
    </div>
  );
}
