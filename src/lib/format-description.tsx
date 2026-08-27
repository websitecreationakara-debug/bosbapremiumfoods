// Product descriptions are stored as plain text with lightweight markdown:
// blank lines become paragraph breaks (via the `whitespace-pre-line` class on
// the container) and **text** renders bold. Returns inline nodes only, so the
// caller's line-clamp / overflow-measurement logic keeps working.
export function renderFormattedDescription(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") && chunk.length >= 4 ? (
      <strong key={i}>{chunk.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  );
}

// On top of the plain-text/**bold** convention above, a description can opt
// into three extra product-page sections using the same text field (no schema
// change, no separate admin UI):
//   > Tagline text          — one or more lines starting with "> ". The first
//                              becomes the hero banner tagline, any further
//                              ones render as small badge pills under it.
//   - Offer callout          — lines starting with "- " (outside a ## section)
//                              become callout rows near the buy box, e.g.
//                              "- 🚚 Free delivery over $50".
//   ## Tab Title             — starts a named section; everything until the
//                              next "## " (or end of text) is that tab's body,
//                              shown as an accordion on the product page.
// Everything else (before the first "## ") is the normal intro paragraph,
// rendered exactly as before. A description with none of these markers parses
// to { tagline: null, offers: [], tabs: [], intro: <original text> } — fully
// backward compatible with existing product descriptions.
export type ProductContent = {
  tagline: string | null;
  badges: string[];
  offers: string[];
  intro: string;
  tabs: { title: string; body: string }[];
};

export function parseProductContent(text: string): ProductContent {
  const lines = text.split("\n");
  const banner: string[] = [];
  const offers: string[] = [];
  const introLines: string[] = [];
  const tabs: { title: string; body: string }[] = [];
  let currentTab: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      if (currentTab) tabs.push({ title: currentTab.title, body: currentTab.body.join("\n").trim() });
      currentTab = { title: heading[1].trim(), body: [] };
      continue;
    }
    if (currentTab) {
      currentTab.body.push(line);
      continue;
    }
    if (line.startsWith("> ")) {
      banner.push(line.slice(2).trim());
      continue;
    }
    if (line.trimStart().startsWith("- ")) {
      offers.push(line.trim().slice(2).trim());
      continue;
    }
    introLines.push(line);
  }
  if (currentTab) tabs.push({ title: currentTab.title, body: currentTab.body.join("\n").trim() });

  return {
    tagline: banner[0] ?? null,
    badges: banner.slice(1),
    offers,
    intro: introLines.join("\n").trim(),
    tabs,
  };
}

// Admin-side counterpart to parseProductContent's tab parsing: splits a raw
// description into the free-text part (tagline/offer lines + intro — still
// edited as plain text) and a structured tab list, so the admin UI can offer
// a proper "Add tab" / Header+Content builder instead of hand-typed "## ".
export function splitDescriptionTabs(text: string): {
  core: string;
  tabs: { title: string; body: string }[];
} {
  const lines = text.split("\n");
  const coreLines: string[] = [];
  const tabs: { title: string; body: string }[] = [];
  let current: { title: string; body: string[] } | null = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      if (current) tabs.push({ title: current.title, body: current.body.join("\n").trim() });
      current = { title: heading[1].trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
    else coreLines.push(line);
  }
  if (current) tabs.push({ title: current.title, body: current.body.join("\n").trim() });
  return { core: coreLines.join("\n").trim(), tabs };
}

// Recombines the free-text core and the tab builder's rows back into the
// single description string the database stores. Tabs with a blank header
// are dropped rather than saved as an untitled "## " section.
export function composeDescription(core: string, tabs: { title: string; body: string }[]): string {
  const parts = [core.trim()];
  for (const t of tabs) {
    const title = t.title.trim();
    if (!title) continue;
    parts.push(`## ${title}\n${t.body.trim()}`);
  }
  return parts.filter(Boolean).join("\n\n");
}

// Renders a tab body: consecutive "- " lines become a bullet list, other
// lines become paragraphs. Reuses renderFormattedDescription for **bold**.
export function renderTabBody(body: string) {
  const lines = body.split("\n");
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const isBullet = line.trimStart().startsWith("- ");
    const text = isBullet ? line.trim().slice(2).trim() : line;
    const last = blocks[blocks.length - 1];
    const kind = isBullet ? "ul" : "p";
    if (last && last.type === kind) last.lines.push(text);
    else blocks.push({ type: kind, lines: [text] });
  }
  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i} className="list-disc pl-5 space-y-1">
        {b.lines.map((l, j) => (
          <li key={j}>{renderFormattedDescription(l)}</li>
        ))}
      </ul>
    ) : (
      <p key={i}>{renderFormattedDescription(b.lines.join(" "))}</p>
    ),
  );
}
