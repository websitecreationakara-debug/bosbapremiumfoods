import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Sun,
  Moon,
  MapPin,
  Phone,
  LogOut,
  LayoutDashboard,
  Menu,
  Globe,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useI18n, LOCALES } from "@/lib/i18n";
import { useCategories, useStoreSettings } from "@/hooks/use-products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useStoreSettings();
  const shipThreshold = Number(settings?.free_shipping_threshold ?? 50);
  const [menuOpen, setMenuOpen] = useState(false);

  // Site-wide light/dark toggle. The announcement bar inverts the page theme:
  // dark site → golden bar, light site → black bar.
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <>
      {/* Announcement banner — light/dark toggle restyles this bar only */}
      <div
        className={`hidden md:block text-xs transition-colors ${
          theme === "dark" ? "bg-[#F5ED7C] text-black" : "bg-black text-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-9 grid grid-cols-3 items-center">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <MapPin className="size-3.5" /> {t("bar.storeLocator")}
            </span>
            <span className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <Phone className="size-3.5" /> +855 99 361 350
            </span>
          </div>
          <div className="text-center font-medium">
            {t("bar.delivery", { threshold: shipThreshold })}
          </div>
          <div className="flex items-center justify-end gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1.5 outline-none hover:opacity-70 transition-opacity">
                <Globe className="size-3.5" />
                {LOCALES.find((l) => l.code === locale)?.label}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LOCALES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className="justify-between gap-6"
                  >
                    {l.label}
                    {locale === l.code && <Check className="size-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={toggle}
              aria-label="Toggle light or dark mode"
              className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {theme === "dark" ? t("theme.light") : t("theme.dark")}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 md:h-20 flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden grid size-10 shrink-0 place-items-center rounded-full hover:bg-muted transition-colors -ml-1"
            aria-label={t("nav.browse")}
          >
            <Menu className="size-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="BOSBA Premium Foods"
              className="size-11 md:size-20 rounded-xl object-contain"
            />
            <span className="font-display text-2xl font-bold tracking-tight text-brand hidden lg:inline">
              BOSBA Premium Foods
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hidden md:inline-flex text-foreground">
                <Menu className="size-4" /> {t("nav.allCategories")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>{t("nav.browse")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/shop">{t("nav.allProducts")}</Link>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to="/shop" search={{ category: c.slug }}>
                    {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("nav.searchPlaceholder")}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-muted border border-transparent text-sm text-foreground outline-none focus:bg-background focus:border-border transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value;
                  window.location.href = `/shop?q=${encodeURIComponent(v)}`;
                }
              }}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="text-foreground">
              <Link to="/wishlist" aria-label={t("nav.wishlist")}>
                <Heart className="size-5 fill-none" />
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="truncate max-w-[200px]">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <LayoutDashboard className="size-4 mr-2" /> {t("nav.adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="size-4 mr-2" /> {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild className="text-foreground">
                <Link to="/auth">
                  <User className="size-4 mr-2" /> {t("nav.signIn")}
                </Link>
              </Button>
            )}
          </nav>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative size-11 rounded-full bg-secondary hover:bg-accent transition-colors grid place-items-center"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold grid place-items-center ring-2 ring-background">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile navigation — replaces the desktop category dropdown + icon nav */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[86%] max-w-sm flex flex-col p-0">
          <SheetHeader className="px-5 py-4 border-b text-left">
            <SheetTitle className="font-display text-lg text-brand">BOSBA Premium Foods</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <nav className="space-y-1">
              <p className="px-2 pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("nav.browse")}
              </p>
              <SheetClose asChild>
                <Link
                  to="/shop"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {t("nav.allProducts")}
                </Link>
              </SheetClose>
              {categories.map((c) => (
                <SheetClose asChild key={c.id}>
                  <Link
                    to="/shop"
                    search={{ category: c.slug }}
                    className="block rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                  >
                    {c.name}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <nav className="space-y-1 border-t pt-4">
              <SheetClose asChild>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <Heart className="size-4" /> {t("nav.wishlist")}
                </Link>
              </SheetClose>
              {user ? (
                <>
                  {isAdmin && (
                    <SheetClose asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                      >
                        <LayoutDashboard className="size-4" /> {t("nav.adminDashboard")}
                      </Link>
                    </SheetClose>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <LogOut className="size-4" /> {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <SheetClose asChild>
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <User className="size-4" /> {t("nav.signIn")}
                  </Link>
                </SheetClose>
              )}
            </nav>

            <div className="space-y-1 border-t pt-4">
              <p className="px-2 pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {LOCALES.find((l) => l.code === locale)?.label}
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      locale === l.code
                        ? "border-brand bg-brand/10 text-brand font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {locale === l.code && <Check className="size-3.5" />}
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                onClick={toggle}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {theme === "dark" ? t("theme.light") : t("theme.dark")}
              </button>
            </div>
          </div>

          <div className="border-t px-5 py-4 space-y-2 text-sm text-muted-foreground">
            <a href="tel:+85599361350" className="flex items-center gap-2 hover:text-foreground">
              <Phone className="size-4" /> +855 99 361 350
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {t("bar.delivery", { threshold: shipThreshold })}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
