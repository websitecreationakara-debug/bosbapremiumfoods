import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCollections, useNavItems, useNavLinks, useNavSections } from "@/hooks/use-products";
import { cn } from "@/lib/utils";

const triggerClass =
  "h-auto p-0 bg-transparent text-[13px] font-normal text-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground";

const linkClass = "hover:text-foreground transition-colors whitespace-nowrap";

export function MegaMenu() {
  const { data: navItems = [] } = useNavItems();
  const { data: navSections = [] } = useNavSections();
  const { data: navLinks = [] } = useNavLinks();
  const { data: collections = [] } = useCollections();

  const collectionSlug = (id: string | null) => collections.find((c) => c.id === id)?.slug;

  const sectionsFor = (navItemId: string) =>
    navSections
      .filter((s) => s.nav_item_id === navItemId && s.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  const linksFor = (navSectionId: string) =>
    navLinks
      .filter((l) => l.nav_section_id === navSectionId && l.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  const items = navItems.filter((i) => i.active).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-x-5 xl:gap-x-7 px-2 text-[13px] text-foreground/80">
      <NavigationMenu className="max-w-none flex-none justify-start">
        <NavigationMenuList className="gap-x-5 xl:gap-x-7 space-x-0">
          {items.map((item) => {
            if (item.type === "link") {
              return (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.direct_url ?? "/shop"}
                      className={cn(linkClass, item.accent && "font-medium text-brand hover:text-brand/80")}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            const sections = sectionsFor(item.id);
            if (sections.length === 0) return null;

            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger className={triggerClass}>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 flex gap-8 min-w-[420px]">
                    {sections.map((section) => {
                      const links = linksFor(section.id);

                      // No links + an image = a visual promo card, not a link column.
                      if (links.length === 0 && section.image_url) {
                        return (
                          <NavigationMenuLink asChild key={section.id}>
                            <Link
                              to={section.cta_link ?? "/shop"}
                              className="block w-56 rounded-xl overflow-hidden border shrink-0 group"
                            >
                              <div className="aspect-[4/3] overflow-hidden bg-muted">
                                <img
                                  src={section.image_url}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              {section.cta_label && (
                                <div className="p-3">
                                  <p className="text-xs font-medium text-brand">{section.cta_label} →</p>
                                </div>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        );
                      }

                      if (links.length === 0) return null;

                      return (
                        <div key={section.id} className="min-w-[180px]">
                          {section.title && (
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                              {section.title}
                            </p>
                          )}
                          <ul className="space-y-2.5">
                            {links.map((l) => {
                              const slug = collectionSlug(l.collection_id);
                              const isExternal = !slug && !!l.custom_url?.startsWith("http");
                              // A link can override the collection's sub_label; otherwise
                              // it inherits the collection's own (e.g. "Marbling Score 5–7").
                              const subLabel =
                                l.sub_label ?? collections.find((c) => c.id === l.collection_id)?.sub_label;
                              const content = (
                                <>
                                  <span className="block font-medium">{l.label}</span>
                                  {subLabel && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {subLabel}
                                      {isExternal && <ExternalLink className="size-3" />}
                                    </span>
                                  )}
                                </>
                              );
                              return (
                                <li key={l.id}>
                                  <NavigationMenuLink asChild>
                                    {slug ? (
                                      <Link
                                        to="/collections/$slug"
                                        params={{ slug }}
                                        className="block text-sm hover:text-brand transition-colors"
                                      >
                                        {content}
                                      </Link>
                                    ) : isExternal ? (
                                      <a
                                        href={l.custom_url ?? "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm hover:text-brand transition-colors"
                                      >
                                        {content}
                                      </a>
                                    ) : (
                                      <Link
                                        to={l.custom_url ?? "/shop"}
                                        className="block text-sm hover:text-brand transition-colors"
                                      >
                                        {content}
                                      </Link>
                                    )}
                                  </NavigationMenuLink>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
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
