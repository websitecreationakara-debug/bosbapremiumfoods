import { useId } from "react";

export type BottleVariant = "onyx" | "gold" | "indigo" | "forest";

const PALETTES: Record<
  BottleVariant,
  { body: [string, string]; cap: string; label: string; rule: string; glass: string }
> = {
  onyx: {
    body: ["#211d18", "#0b0a08"],
    cap: "#c8a34c",
    label: "#f4ecd8",
    rule: "#c8a34c",
    glass: "#3a352c",
  },
  gold: {
    body: ["#e8cd8d", "#c39a44"],
    cap: "#211d18",
    label: "#241f16",
    rule: "#241f16",
    glass: "#f6e9c4",
  },
  indigo: {
    body: ["#4c4478", "#2a2547"],
    cap: "#c8a34c",
    label: "#f4ecd8",
    rule: "#c8a34c",
    glass: "#6c63a0",
  },
  forest: {
    body: ["#33513c", "#1b2c20"],
    cap: "#c8a34c",
    label: "#f4ecd8",
    rule: "#c8a34c",
    glass: "#4d715a",
  },
};

/** A stylised sake bottle rendered in pure SVG so every product shares one silhouette. */
export function BottleGraphic({
  variant,
  className = "",
}: {
  variant: BottleVariant;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const p = PALETTES[variant];
  const bodyId = `sk-body-${uid}`;
  const sheenId = `sk-sheen-${uid}`;
  const shadowId = `sk-shadow-${uid}`;

  return (
    <svg viewBox="0 0 220 560" className={className} role="img" aria-label={`${variant} bottle`}>
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={p.body[0]} />
          <stop offset="45%" stopColor={p.body[1]} />
          <stop offset="100%" stopColor={p.body[0]} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="18%" stopColor="white" stopOpacity="0.35" />
          <stop offset="30%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" stopOpacity="0.35" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="110" cy="538" rx="70" ry="16" fill={`url(#${shadowId})`} />

      {/* cap */}
      <rect x="86" y="6" width="48" height="30" rx="6" fill={p.cap} />
      <rect x="86" y="28" width="48" height="6" fill="black" opacity="0.15" />

      {/* neck */}
      <rect x="96" y="34" width="28" height="86" fill={`url(#${bodyId})`} />

      {/* shoulder to body */}
      <path
        d="M96 118 C96 150 44 150 44 200 L44 480 C44 512 68 528 110 528 C152 528 176 512 176 480 L176 200 C176 150 124 150 124 118 Z"
        fill={`url(#${bodyId})`}
      />

      {/* glass sheen */}
      <path
        d="M96 118 C96 150 44 150 44 200 L44 480 C44 505 58 520 84 526 L84 118 Z"
        fill={`url(#${sheenId})`}
      />

      {/* label band */}
      <rect x="44" y="300" width="132" height="118" fill={p.label} opacity="0.94" />
      <rect x="44" y="300" width="132" height="2.5" fill={p.rule} />
      <rect x="44" y="415.5" width="132" height="2.5" fill={p.rule} />

      {/* mark */}
      <text
        x="110"
        y="368"
        textAnchor="middle"
        fontSize="30"
        fontFamily="'DM Sans', sans-serif"
        fill={p.rule}
        opacity="0.9"
      >
        酒
      </text>
      <rect x="94" y="382" width="32" height="1.5" fill={p.rule} opacity="0.7" />
    </svg>
  );
}
