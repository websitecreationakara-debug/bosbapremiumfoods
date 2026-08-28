import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ExternalLink } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCollections } from "@/hooks/use-products";
import { useI18n } from "@/lib/i18n";
import { TOP_NAV, NAV_COLUMN_LABELS, WAGYU_PROMO, SORA_SAKE_LINK } from "@/lib/nav";
import type { Collection } from "@/lib/types";
import { cn } from "@/lib/utils";

const triggerClass =
  "h-auto p-0 bg-transparent text-[13px] font-normal text-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground";

const linkClass = "hover:text-foreground transition-colors whitespace-nowrap";

export function MegaMenu({ hasOffers }: { hasOffers: boolean }) {
  const { data: collections = [] } = useCollections();
  const { t } = useI18n();

  const forGroup = (group: string) =>
    collections
      .filter((c) => c.nav_group === group && c.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  const columnsFor = (group: string) => {
    const items = forGroup(group);
    const columns = new Map<string, Collection[]>();
    for (const c of items) {
      const key = c.nav_column ?? "__flat";
      if (!columns.has(key)) columns.set(key, []);
      columns.get(key)!.push(c);
    }
    return columns;
  };

  return (
    <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-x-5 xl:gap-x-7 px-2 text-[13px] text-foreground/80">
      <NavigationMenu className="max-w-none flex-none justify-start">
        <NavigationMenuList className="gap-x-5 xl:gap-x-7 space-x-0">
          {TOP_NAV.map((item) => {
            if (item.type === "link") {
              if (item.to === "/offers" && !hasOffers) return null;
              return (
                <NavigationMenuItem key={item.labelKey}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.to}
                      className={cn(linkClass, item.accent && "font-medium text-brand hover:text-brand/80")}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            const columns = columnsFor(item.group);
            const flat = columns.get("__flat") ?? [];
            const structured = [...columns.entries()].filter(([key]) => key !== "__flat");
            const isEmpty = flat.length === 0 && structured.length === 0;
            if (isEmpty) return null;

            return (
              <NavigationMenuItem key={item.labelKey}>
                <NavigationMenuTrigger className={triggerClass}>{t(item.labelKey)}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 flex gap-8 min-w-[420px]">
                    {structured.map(([columnKey, items]) => (
                      <div key={columnKey} className="min-w-[180px]">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                          {NAV_COLUMN_LABELS[columnKey] ?? columnKey}
                        </p>
                        <ul className="space-y-2.5">
                          {items.map((c) => (
                            <li key={c.id}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/collections/$slug"
                                  params={{ slug: c.slug }}
                                  className="block text-sm hover:text-brand transition-colors"
                                >
                                  <span className="block">{c.title}</span>
                                  {c.sub_label && (
                                    <span className="block text-xs text-muted-foreground">
                                      {c.sub_label}
                                    </span>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {flat.length > 0 && (
                      <div className="min-w-[200px]">
                        <ul className="space-y-2.5">
                          {flat.map((c) => (
                            <li key={c.id}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/collections/$slug"
                                  params={{ slug: c.slug }}
                                  className="block text-sm hover:text-brand transition-colors"
                                >
                                  <span className="block font-medium">{c.title}</span>
                                  {c.description && (
                                    <span className="block text-xs text-muted-foreground">
                                      {c.description}
                                    </span>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          {item.group === SORA_SAKE_LINK.navGroup && (
                            <li>
                              <NavigationMenuLink asChild>
                                <a
                                  href={SORA_SAKE_LINK.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-1.5 text-sm hover:text-brand transition-colors"
                                >
                                  <ArrowLeftRight className="size-3.5 shrink-0 mt-0.5 text-brand" />
                                  <span>
                                    <span className="block font-medium">{SORA_SAKE_LINK.label}</span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {SORA_SAKE_LINK.sublabel}
                                      <ExternalLink className="size-3" />
                                    </span>
                                  </span>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {item.group === WAGYU_PROMO.navGroup && (
                      <NavigationMenuLink asChild>
                        <Link
                          to={WAGYU_PROMO.ctaLink}
                          className="block w-56 rounded-xl overflow-hidden border shrink-0 group"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={WAGYU_PROMO.imageUrl}
                              alt=""
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold">{WAGYU_PROMO.title}</p>
                            <p className="text-xs text-muted-foreground">{WAGYU_PROMO.subtitle}</p>
                            <p className="text-xs font-medium text-brand mt-1.5">
                              {WAGYU_PROMO.ctaLabel} →
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
