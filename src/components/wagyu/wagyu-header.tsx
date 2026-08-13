import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useWagyuI18n, WAGYU_LOCALES } from "./wagyu-i18n";
import logo from "../../image/BOSBA2-Logo.png";

const NAV_LINKS = [
  { label: "Story", href: "#chapter-beginning" },
  { label: "Origin", href: "#origin" },
  { label: "Process", href: "#process" },
  { label: "Journey", href: "#journey" },
  { label: "Why Wagyu", href: "#why-wagyu" },
  { label: "Trust", href: "#trust" },
  { label: "A4 vs A5", href: "#comparison" },
  { label: "Cooking", href: "#cooking" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

function LanguageSwitch() {
  const { locale, setLocale } = useWagyuI18n();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: 999,
        border: "1px solid rgba(var(--wagyu-text-rgb),0.2)",
        padding: 2,
        flexShrink: 0,
      }}
    >
      {WAGYU_LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          style={{
            padding: "0.35rem 0.7rem",
            borderRadius: 999,
            border: "none",
            fontFamily: l.code === "km" ? "'Battambang', sans-serif" : "'Jost', sans-serif",
            fontSize: l.code === "km" ? "0.75rem" : "0.68rem",
            fontWeight: l.code === "km" ? 700 : 500,
            letterSpacing: l.code === "km" ? "normal" : "0.04em",
            cursor: "pointer",
            transition: "all 0.25s ease",
            background: locale === l.code ? "var(--wagyu-gold)" : "transparent",
            color: locale === l.code ? "var(--wagyu-bg)" : "rgba(var(--wagyu-text-rgb),0.75)",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function WagyuHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
          background: scrolled
            ? "rgba(var(--wagyu-bg-rgb),0.92)"
            : "linear-gradient(to bottom, rgba(var(--wagyu-bg-rgb),0.7), transparent)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 4vw, 3rem)",
            height: scrolled ? 68 : 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "height 0.3s cubic-bezier(0.23,1,0.32,1)",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
                transition: "opacity 0.25s ease",
                minWidth: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <img
                src="/logo.png"
                alt="BOSBA Premium Foods"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
            </Link>
          </div>

          <nav
            className="hidden lg:flex"
            style={{
              alignItems: "center",
              gap: "clamp(0.85rem, 1.4vw, 1.35rem)",
              minWidth: 0,
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="wagyu-nav-link"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(var(--wagyu-text-rgb),0.75)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--wagyu-gold)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(var(--wagyu-text-rgb),0.75)")
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex" style={{ alignItems: "center", gap: "1rem" }}>
            <LanguageSwitch />

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid rgba(var(--wagyu-text-rgb),0.2)",
                background: "transparent",
                color: "rgba(var(--wagyu-text-rgb),0.8)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--wagyu-gold)";
                e.currentTarget.style.color = "var(--wagyu-gold)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(var(--wagyu-text-rgb),0.2)";
                e.currentTarget.style.color = "rgba(var(--wagyu-text-rgb),0.8)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link
              to="/shop"
              className="btn-gold"
              style={{
                textDecoration: "none",
                whiteSpace: "nowrap",
                padding: "0.875rem 2.5rem",
                fontSize: "0.75rem",
              }}
            >
              Choose Your Wagyu
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex lg:hidden items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(var(--wagyu-text-rgb),0.2)",
              background: "transparent",
              color: "rgba(var(--wagyu-text-rgb),0.85)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Menu size={17} />
          </button>
        </div>
      </header>

      {/* Mobile / tablet sidebar */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-[82%] max-w-sm flex flex-col border-0 p-0"
          style={{ backgroundColor: "var(--wagyu-bg)", color: "var(--wagyu-text)" }}
        >
          <SheetHeader
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid rgba(var(--wagyu-gold-rgb),0.15)",
              textAlign: "left",
            }}
          >
            <SheetTitle asChild>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <img
                  src="/logo.png"
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "contain" }}
                />
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      color: "var(--wagyu-text)",
                    }}
                  >
                    BOSBA
                  </span>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.55rem",
                      fontWeight: 400,
                      letterSpacing: "0.25em",
                      color: "rgba(var(--wagyu-text-rgb),0.55)",
                    }}
                  >
                    PREMIUM FOODS
                  </span>
                </span>
              </span>
            </SheetTitle>
          </SheetHeader>

          <nav
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.15rem",
            }}
          >
            {NAV_LINKS.map((link) => (
              <SheetClose asChild key={link.label}>
                <a
                  href={link.href}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.85rem",
                    letterSpacing: "0.04em",
                    color: "rgba(var(--wagyu-text-rgb),0.85)",
                    textDecoration: "none",
                    padding: "0.7rem 0.75rem",
                    borderRadius: 8,
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--wagyu-gold-rgb),0.08)";
                    e.currentTarget.style.color = "var(--wagyu-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(var(--wagyu-text-rgb),0.85)";
                  }}
                >
                  {link.label}
                </a>
              </SheetClose>
            ))}
          </nav>

          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid rgba(var(--wagyu-gold-rgb),0.15)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <LanguageSwitch />

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid rgba(var(--wagyu-text-rgb),0.2)",
                background: "transparent",
                color: "rgba(var(--wagyu-text-rgb),0.8)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <SheetClose asChild>
              <Link
                to="/shop"
                className="btn-gold"
                style={{
                  flex: 1,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Choose Your Wagyu
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
