import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCollections, useNavItems, useNavLinks, useNavSections } from "@/hooks/use-products";
import type { Collection, NavMenuItem, NavMenuLink, NavMenuSection } from "@/lib/types";
import { cn } from "@/lib/utils";

const triggerClass =
  "h-auto p-0 bg-transparent text-[13px] font-normal text-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground";

const linkClass = "hover:text-foreground transition-colors whitespace-nowrap";

export function MegaMenu() {
  const { data: navItems = [] } = useNavItems();
  const { data: navSections = [] } = useNavSections();
  const { data: navLinks = [] } = useNavLinks();
  const { data: collections = [] } = useCollections();

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
                      className={cn(
                        linkClass,
                        item.accent && "font-medium text-brand hover:text-brand/80",
                      )}
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
                  <MegaDropdown
                    item={item}
                    sections={sections}
                    linksFor={linksFor}
                    collections={collections}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

// Text-column + spotlight-card mega-menu layout: every section is a cell on
// one 4-up grid (25% each). Sections with real links become plain-text link
// columns; a section with no links but an image becomes a visual "spotlight"
// card in the next grid cell, right after the link columns. A section with `title: null` (e.g. Shop by Occasion,
// Pantry & Sake — see the schema comment on nav_sections.title) renders as a
// flat single column headed by the menu item's own label instead of a
// per-section heading. A column-type section can also carry an optional
// "View All →" link at its top by setting `cta_link`/`cta_label` — reusing
// the same fields the spotlight card uses, rather than a separate schema.
function MegaDropdown({
  item,
  sections,
  linksFor,
  collections,
}: {
  item: NavMenuItem;
  sections: NavMenuSection[];
  linksFor: (id: string) => NavMenuLink[];
  collections: Collection[];
}) {
  const columns = sections.filter((s) => linksFor(s.id).length > 0);
  const promoSections = sections.filter((s) => linksFor(s.id).length === 0 && s.image_url);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
        {columns.map((s) => (
          <div key={s.id} className="flex flex-col">
            <p className="font-display text-[15px] font-semibold mb-4">{s.title ?? item.label}</p>
            <ul className="flex flex-col gap-3">
              {s.cta_link && (
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to={s.cta_link}
                      className="group flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand/80"
                    >
                      {s.cta_label ?? "View All"}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </NavigationMenuLink>
                </li>
              )}
              {linksFor(s.id).map((l) => (
                <MegaTextLink key={l.id} link={l} collections={collections} />
              ))}
            </ul>
          </div>
        ))}

        {promoSections.map((s) => (
          <NavigationMenuLink asChild key={s.id}>
            <Link to={s.cta_link ?? "/shop"} className="group flex flex-col">
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  src={s.image_url!}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {s.cta_label && (
                <span className="mt-3 block text-sm font-medium text-brand">{s.cta_label}</span>
              )}
            </Link>
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  );
}

function MegaTextLink({ link: l, collections }: { link: NavMenuLink; collections: Collection[] }) {
  const slug = collections.find((c) => c.id === l.collection_id)?.slug;
  const isExternal = !slug && !!l.custom_url?.startsWith("http");
  const inner = <span className="transition-colors group-hover:text-brand">{l.label}</span>;
  return (
    <li>
      <NavigationMenuLink asChild>
        {slug ? (
          <Link
            to="/collections/$slug"
            params={{ slug }}
            className="group flex items-center gap-1 text-sm"
          >
            {inner}
          </Link>
        ) : isExternal ? (
          <a
            href={l.custom_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 text-sm"
          >
            {inner}
            <ExternalLink className="size-3 text-muted-foreground" />
          </a>
        ) : (
          <Link to={l.custom_url ?? "/shop"} className="group flex items-center gap-1 text-sm">
            {inner}
          </Link>
        )}
      </NavigationMenuLink>
    </li>
  );
}
