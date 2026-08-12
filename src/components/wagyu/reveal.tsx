import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  as?: "div" | "span";
  style?: React.CSSProperties;
  className?: string;
};

// Lightweight stand-in for the AOS scroll-reveal library used by the source
// design — avoids pulling in an external <script src="unpkg.com/aos"> on a
// storefront page.
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  as = "div",
  style,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  const directionClass =
    direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      className={`reveal ${directionClass} ${visible ? "visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
