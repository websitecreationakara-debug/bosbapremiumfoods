import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { nav_items, nav_sections, nav_links } from "@/db/schema";
import { requireManager } from "./_auth";

export const listNavItems = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(nav_items).orderBy(asc(nav_items.sort_order));
});

export const listNavSections = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(nav_sections).orderBy(asc(nav_sections.sort_order));
});

export const listNavLinks = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(nav_links).orderBy(asc(nav_links.sort_order));
});

export const createNavItem = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      label: string;
      type: string;
      direct_url?: string | null;
      accent?: boolean;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().insert(nav_items).values(data);
    return { ok: true };
  });

export const updateNavItem = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      label?: string;
      type?: string;
      direct_url?: string | null;
      accent?: boolean;
      active?: boolean;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(nav_items).set(set).where(eq(nav_items.id, id));
    return { ok: true };
  });

export const deleteNavItem = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(nav_items).where(eq(nav_items.id, data.id));
    return { ok: true };
  });

export const reorderNavItems = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await Promise.all(
      data.ids.map((id, i) => db.update(nav_items).set({ sort_order: i }).where(eq(nav_items.id, id))),
    );
    return { ok: true };
  });

export const createNavSection = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      nav_item_id: string;
      title?: string | null;
      image_url?: string | null;
      cta_label?: string | null;
      cta_link?: string | null;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().insert(nav_sections).values(data);
    return { ok: true };
  });

export const updateNavSection = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      title?: string | null;
      image_url?: string | null;
      cta_label?: string | null;
      cta_link?: string | null;
      active?: boolean;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(nav_sections).set(set).where(eq(nav_sections.id, id));
    return { ok: true };
  });

export const deleteNavSection = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(nav_sections).where(eq(nav_sections.id, data.id));
    return { ok: true };
  });

export const reorderNavSections = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await Promise.all(
      data.ids.map((id, i) =>
        db.update(nav_sections).set({ sort_order: i }).where(eq(nav_sections.id, id)),
      ),
    );
    return { ok: true };
  });

export const createNavLink = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      nav_section_id: string;
      label: string;
      sub_label?: string | null;
      collection_id?: string | null;
      custom_url?: string | null;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().insert(nav_links).values(data);
    return { ok: true };
  });

export const updateNavLink = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      label?: string;
      sub_label?: string | null;
      collection_id?: string | null;
      custom_url?: string | null;
      active?: boolean;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(nav_links).set(set).where(eq(nav_links.id, id));
    return { ok: true };
  });

export const deleteNavLink = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(nav_links).where(eq(nav_links.id, data.id));
    return { ok: true };
  });

export const reorderNavLinks = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await Promise.all(
      data.ids.map((id, i) => db.update(nav_links).set({ sort_order: i }).where(eq(nav_links.id, id))),
    );
    return { ok: true };
  });
