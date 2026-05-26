import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Heart, Sun, Moon, MapPin, Phone, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useCategories } from "@/hooks/use-products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { data: categories = [] } = useCategories();

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-brand text-brand-foreground text-xs">
        <div className="mx-auto max-w-7xl px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> Store Locator</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" /> +855 99 361 350</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">Free delivery on orders over $50</span>
            <button onClick={toggle} className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
              {theme === "light" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="BOSBA Premium Foods" className="size-20 rounded-xl object-contain" />
            <span className="font-display text-2xl font-bold tracking-tight text-brand hidden sm:inline">BOSBA Premium Foods</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hidden md:inline-flex">
                <Menu className="size-4" /> All Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Browse</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/shop">All Products</Link></DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to="/shop" search={{ category: c.slug }}>{c.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search fresh produce, pantry, dairy..."
              className="w-full h-11 pl-10 pr-4 rounded-full bg-muted border-none text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value;
                  window.location.href = `/shop?q=${encodeURIComponent(v)}`;
                }
              }}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist" aria-label="Wishlist"><Heart className="size-5" /></Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><User className="size-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="truncate max-w-[200px]">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin"><LayoutDashboard className="size-4 mr-2" /> Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/auth"><User className="size-4 mr-2" /> Sign in</Link>
              </Button>
            )}
          </nav>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative size-11 rounded-full bg-secondary hover:bg-accent transition-colors grid place-items-center"
            aria-label="Cart"
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
    </>
  );
}
