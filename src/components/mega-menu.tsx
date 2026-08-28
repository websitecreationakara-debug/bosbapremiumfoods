import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  useCollections,
  useNavItems,
  useNavLinks,
  useNavSections,
  useProductCollections,
  useProducts,
} from "@/hooks/use-products";
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
  const { data: products = [] } = useProducts();
  const { data: productCollections = [] } = useProductCollections();

  const sectionsFor = (navItemId: string) =>
    navSections
      .filter((s) => s.nav_item_id === navItemId && s.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  const linksFor = (navSectionId: string) =>
    navLinks
      .filter((l) => l.nav_section_id === navSectionId && l.active)
      .sort((a, b) => a.sort_order - b.sort_order);

  // A card's photo: the collection's own curated image if an admin set one,
  // otherwise the photo of any real member product — every collection has
  // products with real photos, so this always resolves to something instead
  // of an empty tile.
  const cardImage = (l: NavMenuLink) => {
    if (!l.collection_id) return null;
    const collection = collections.find((c) => c.id === l.collection_id);
    if (collection?.image_url) return collection.image_url;
    const memberId = productCollections.find((pc) => pc.collection_id === l.collection_id)?.product_id;
    return products.find((p) => p.id === memberId)?.image_url ?? null;
  };

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
                  <MegaDropdown
                    item={item}
                    sections={sections}
                    linksFor={linksFor}
                    cardImage={cardImage}
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

// A left "rail" of section names (switch on hover/click, Sora Sake-style)
// paired with a right-hand grid of photo cards for whichever section is
// active. Sections with no links but an image (the old "promo card" slot)
// are appended to every rail's grid instead of living in the rail itself —
// there's nothing to switch to there, just something to always show.
function MegaDropdown({
  item,
  sections,
  linksFor,
  cardImage,
  collections,
}: {
  item: NavMenuItem;
  sections: NavMenuSection[];
  linksFor: (id: string) => NavMenuLink[];
  cardImage: (l: NavMenuLink) => string | null;
  collections: Collection[];
}) {
  const railSections = sections.filter((s) => linksFor(s.id).length > 0);
  const promoSections = sections.filter((s) => linksFor(s.id).length === 0 && s.image_url);
  const [activeId, setActiveId] = useState(railSections[0]?.id);
  const active = railSections.find((s) => s.id === activeId) ?? railSections[0];
  const links = active ? linksFor(active.id) : [];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[14rem_1fr] gap-10 px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col">
        {railSections.length > 1 ? (
          <ul>
            {railSections.map((s) => (
              <li key={s.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  onClick={() => setActiveId(s.id)}
                  aria-pressed={active?.id === s.id}
                  className={cn(
                    "group flex w-full items-center justify-between gap-3 py-3 text-left transition-colors",
                    active?.id === s.id
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="font-display text-[15px]">{s.title}</span>
                  <ArrowRight
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-300 ease-out",
                      active?.id === s.id
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-display text-lg mb-4">{item.label}</p>
        )}

        <Link
          to={item.direct_url ?? "/shop"}
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Shop all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div key={active?.id ?? "promo-only"} className="grid gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {links.map((l) => {
          const slug = collections.find((c) => c.id === l.collection_id)?.slug;
          const isExternal = !slug && !!l.custom_url?.startsWith("http");
          const subLabel = l.sub_label ?? collections.find((c) => c.id === l.collection_id)?.sub_label;
          const img = cardImage(l);
          const inner = (
            <>
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  // Custom-URL links (e.g. the Sora Sake cross-link) have no
                  // collection to pull a photo from — a branded placeholder
                  // reads as intentional, an empty gray box reads as broken.
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand/10 to-brand/5">
                    <ArrowRight className="size-8 text-brand/40 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </div>
              <span className="mt-3 block text-sm font-medium transition-colors group-hover:text-brand">
                {l.label}
              </span>
              {subLabel && (
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  {subLabel}
                  {isExternal && <ExternalLink className="size-3" />}
                </span>
              )}
            </>
          );
          return (
            <NavigationMenuLink asChild key={l.id}>
              {slug ? (
                <Link to="/collections/$slug" params={{ slug }} className="group flex flex-col">
                  {inner}
                </Link>
              ) : isExternal ? (
                <a
                  href={l.custom_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col"
                >
                  {inner}
                </a>
              ) : (
                <Link to={l.custom_url ?? "/shop"} className="group flex flex-col">
                  {inner}
                </Link>
              )}
            </NavigationMenuLink>
          );
        })}

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
