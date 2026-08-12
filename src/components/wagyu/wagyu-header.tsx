import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const NAV_LINKS = [
  { label: "Story", href: "#chapter-beginning" },
  { label: "Origin", href: "#origin" },
  { label: "Animal", href: "#chapter-animal" },
  { label: "Process", href: "#process" },
  { label: "Journey", href: "#journey" },
  { label: "Why Wagyu", href: "#why-wagyu" },
  { label: "Trust", href: "#trust" },
  { label: "A4 vs A5", href: "#comparison" },
  { label: "Cooking", href: "#cooking" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export function WagyuHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            transition: "opacity 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <img
            src="/logo.png"
            alt="BOSBA Premium Foods"
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "contain" }}
          />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem",
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
        </Link>

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

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
            className="btn-gold hidden sm:inline-block"
            style={{ textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Choose Your Wagyu
          </Link>
        </div>
      </div>
    </header>
  );
}
