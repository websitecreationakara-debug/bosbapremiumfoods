import type { CSSProperties } from "react";

/** Purely decorative SVG/CSS motifs shared across the Saraki landing page. */

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

export function MapleLeaf({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} style={style} fill="currentColor">
      <path d="M32 2c1.8 5.4 3.3 9 6.6 12.8 1-3 1.4-5.7 1.2-9.4 3.8 3.1 5.6 6 7.2 10.4 2-1.8 3.2-3.7 4.4-6.8 1.8 5.6 1.6 9.9-.4 15 3.4-.4 6-1.6 9-4-.4 6-2.8 9.8-7.6 13 2.8 1.4 5.6 1.8 9.6 1.4-3.4 4.6-7 6.8-12.4 7.8 2 2.6 4.4 4.2 8 5.6-5.4 2.4-9.8 2.4-15-.2-.2 3.4.6 6 2.6 9.4-5.6-1.2-9-3.4-12.2-7.6-1.6 3-2.2 5.8-2 9.6-4-3.2-6-6.4-7-11-2.6 2.4-4 4.8-5.2 8.4-2.4-5.2-2.6-9.6-.6-14.6-3.6.8-6.2 2.4-9 5.2-.2-6 1.6-10 5.8-14-3.6-.6-6.4 0-10 1.8 2-5.6 5-8.8 10-11.2-2.8-2-5.6-2.8-9.6-2.8 3.8-4.2 7.6-6 13-6.2-1.6-3-3.6-5-7-7 5.8-1.6 10.2-1 15 2-.4-3.4-1.6-6-4-9 5.6.8 9.4 3 12.8 7.4.8-3.2.8-6 0-9.6 4.4 2.4 7 5.4 8.8 10.2z" />
      <path d="M32 20v38" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.55" />
    </svg>
  );
}

export function FujiSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 360" aria-hidden className={className} preserveAspectRatio="none">
      <path
        d="M0 360 L360 90 C395 60 445 60 478 92 L560 172 L610 108 C640 70 692 68 724 104 L900 300 L1000 190 C1028 158 1074 156 1104 186 L1200 300 L1200 360 Z"
        fill="currentColor"
      />
      <path d="M478 92 C455 108 430 140 415 168 L545 168 L500 118 Z" fill="white" opacity="0.5" />
      <path d="M724 104 C706 118 688 142 678 162 L772 162 L738 122 Z" fill="white" opacity="0.35" />
    </svg>
  );
}

export function FujiMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M8 78 L38 22 C42 15 48 15 52 22 L82 78 Z" />
      <path d="M42 36 L38 46 L48 46 L44 36" opacity="0.6" />
    </svg>
  );
}

export function SunDisc({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className} style={style}>
      <circle cx="100" cy="100" r="88" fill="currentColor" />
    </svg>
  );
}

export function CeramicCup({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M28 40h44l-5 34a10 10 0 0 1-10 8H43a10 10 0 0 1-10-8L28 40Z" />
      <ellipse cx="50" cy="40" rx="22" ry="6" />
      <path d="M40 22c2-6 8-10 10-14 2 4 8 8 10 14" strokeLinecap="round" />
    </svg>
  );
}

export function RiceStalk({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M50 138V30" strokeLinecap="round" />
      {[24, 40, 56, 72, 88].map((y) => (
        <g key={y}>
          <ellipse cx="42" cy={y} rx="7" ry="4" transform={`rotate(-30 42 ${y})`} />
          <ellipse cx="58" cy={y + 8} rx="7" ry="4" transform={`rotate(30 58 ${y + 8})`} />
        </g>
      ))}
      <path d="M50 30c0-12 6-20 14-24" strokeLinecap="round" />
    </svg>
  );
}
