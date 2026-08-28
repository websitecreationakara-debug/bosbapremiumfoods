import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavItems, useNavSections, useNavLinks, useCollections } from "@/hooks/use-products";
import {
  createNavItem,
  updateNavItem,
  deleteNavItem,
  reorderNavItems,
  createNavSection,
  updateNavSection,
  deleteNavSection,
  reorderNavSections,
  createNavLink,
  updateNavLink,
  deleteNavLink,
  reorderNavLinks,
} from "@/data/nav";
import { listMedia, uploadMedia } from "@/data/media";
import { compressImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { NavMenuItem, NavMenuSection, NavMenuLink, Media } from "@/lib/types";

export const Route = createFileRoute("/admin/main-navigator")({ component: MainNavigator });

function MainNavigator() {
  const { data: navItems = [] } = useNavItems();
  const { data: navSections = [] } = useNavSections();
  const { data: navLinks = [] } = useNavLinks();
  const { data: collections = [] } = useCollections();
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["nav_items"] });
    qc.invalidateQueries({ queryKey: ["nav_sections"] });
    qc.invalidateQueries({ queryKey: ["nav_links"] });
  };

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setSet(next);
  };

  // ---------- drag reorder ----------
  const [dragItemId, setDragItemId] = useState<string | null>(null);
  const [overItemId, setOverItemId] = useState<string | null>(null);
  const reorderItemsFn = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const ids = navItems.map((i) => i.id);
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    await reorderNavItems({ data: { ids } });
    invalidate();
  };

  const [dragSectionId, setDragSectionId] = useState<string | null>(null);
  const [overSectionId, setOverSectionId] = useState<string | null>(null);
  const reorderSectionsFn = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const from = navSections.find((s) => s.id === fromId);
    const to = navSections.find((s) => s.id === toId);
    if (!from || !to || from.nav_item_id !== to.nav_item_id) return;
    const ids = navSections
      .filter((s) => s.nav_item_id === from.nav_item_id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => s.id);
    const fi = ids.indexOf(fromId);
    const ti = ids.indexOf(toId);
    ids.splice(ti, 0, ids.splice(fi, 1)[0]);
    await reorderNavSections({ data: { ids } });
    invalidate();
  };

  const [dragLinkId, setDragLinkId] = useState<string | null>(null);
  const [overLinkId, setOverLinkId] = useState<string | null>(null);
  const reorderLinksFn = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const from = navLinks.find((l) => l.id === fromId);
    const to = navLinks.find((l) => l.id === toId);
    if (!from || !to || from.nav_section_id !== to.nav_section_id) return;
    const ids = navLinks
      .filter((l) => l.nav_section_id === from.nav_section_id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((l) => l.id);
    const fi = ids.indexOf(fromId);
    const ti = ids.indexOf(toId);
    ids.splice(ti, 0, ids.splice(fi, 1)[0]);
    await reorderNavLinks({ data: { ids } });
    invalidate();
  };

  // ---------- nav item dialog ----------
  const [itemDialog, setItemDialog] = useState<{ editing: NavMenuItem | null } | null>(null);
  const [itemForm, setItemForm] = useState({
    label: "",
    type: "mega",
    direct_url: "",
    accent: false,
    active: true,
  });
  const openNewItem = () => {
    setItemForm({ label: "", type: "mega", direct_url: "", accent: false, active: true });
    setItemDialog({ editing: null });
  };
  const openEditItem = (i: NavMenuItem) => {
    setItemForm({
      label: i.label,
      type: i.type,
      direct_url: i.direct_url ?? "",
      accent: i.accent,
      active: i.active,
    });
    setItemDialog({ editing: i });
  };
  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      label: itemForm.label,
      type: itemForm.type,
      direct_url: itemForm.type === "link" ? itemForm.direct_url || null : null,
      accent: itemForm.accent,
      active: itemForm.active,
    };
    try {
      if (itemDialog?.editing) await updateNavItem({ data: { id: itemDialog.editing.id, ...data } });
      else await createNavItem({ data: { ...data, sort_order: navItems.length } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    toast.success(itemDialog?.editing ? "Updated" : "Added");
    invalidate();
    setItemDialog(null);
  };
  const removeItem = async (id: string) => {
    try {
      await deleteNavItem({ data: { id } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    invalidate();
  };

  // ---------- section dialog ----------
  const [sectionDialog, setSectionDialog] = useState<{ navItemId: string; editing: NavMenuSection | null } | null>(
    null,
  );
  const [sectionForm, setSectionForm] = useState({
    title: "",
    image_url: "",
    cta_label: "",
    cta_link: "",
    active: true,
  });
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia() as Promise<Media[]>,
  });
  const sectionFileRef = useRef<HTMLInputElement>(null);
  const [sectionUploading, setSectionUploading] = useState(false);
  const [sectionPicker, setSectionPicker] = useState(false);

  const openNewSection = (navItemId: string) => {
    setSectionForm({ title: "", image_url: "", cta_label: "", cta_link: "", active: true });
    setSectionDialog({ navItemId, editing: null });
  };
  const openEditSection = (s: NavMenuSection) => {
    setSectionForm({
      title: s.title ?? "",
      image_url: s.image_url ?? "",
      cta_label: s.cta_label ?? "",
      cta_link: s.cta_link ?? "",
      active: s.active,
    });
    setSectionDialog({ navItemId: s.nav_item_id, editing: s });
  };
  const onSectionUpload = async (file: File | undefined) => {
    if (!file) return;
    setSectionUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", await compressImage(file));
      const { url } = await uploadMedia({ data: fd });
      setSectionForm((f) => ({ ...f, image_url: url }));
      qc.invalidateQueries({ queryKey: ["media"] });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSectionUploading(false);
      if (sectionFileRef.current) sectionFileRef.current.value = "";
    }
  };
  const saveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionDialog) return;
    const data = {
      title: sectionForm.title || null,
      image_url: sectionForm.image_url || null,
      cta_label: sectionForm.cta_label || null,
      cta_link: sectionForm.cta_link || null,
      active: sectionForm.active,
    };
    try {
      if (sectionDialog.editing) {
        await updateNavSection({ data: { id: sectionDialog.editing.id, ...data } });
      } else {
        const count = navSections.filter((s) => s.nav_item_id === sectionDialog.navItemId).length;
        await createNavSection({
          data: { nav_item_id: sectionDialog.navItemId, ...data, sort_order: count },
        });
      }
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    toast.success(sectionDialog.editing ? "Updated" : "Added");
    invalidate();
    setSectionDialog(null);
    setSectionPicker(false);
  };
  const removeSection = async (id: string) => {
    try {
      await deleteNavSection({ data: { id } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    invalidate();
  };

  // ---------- link dialog ----------
  const [linkDialog, setLinkDialog] = useState<{ navSectionId: string; editing: NavMenuLink | null } | null>(null);
  const [linkForm, setLinkForm] = useState({
    label: "",
    sub_label: "",
    mode: "collection" as "collection" | "custom",
    collection_id: "",
    custom_url: "",
    active: true,
  });
  const openNewLink = (navSectionId: string) => {
    setLinkForm({
      label: "",
      sub_label: "",
      mode: "collection",
      collection_id: "",
      custom_url: "",
      active: true,
    });
    setLinkDialog({ navSectionId, editing: null });
  };
  const openEditLink = (l: NavMenuLink) => {
    setLinkForm({
      label: l.label,
      sub_label: l.sub_label ?? "",
      mode: l.collection_id ? "collection" : "custom",
      collection_id: l.collection_id ?? "",
      custom_url: l.custom_url ?? "",
      active: l.active,
    });
    setLinkDialog({ navSectionId: l.nav_section_id, editing: l });
  };
  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkDialog) return;
    const data = {
      label: linkForm.label,
      sub_label: linkForm.sub_label || null,
      collection_id: linkForm.mode === "collection" ? linkForm.collection_id || null : null,
      custom_url: linkForm.mode === "custom" ? linkForm.custom_url || null : null,
      active: linkForm.active,
    };
    try {
      if (linkDialog.editing) {
        await updateNavLink({ data: { id: linkDialog.editing.id, ...data } });
      } else {
        const count = navLinks.filter((l) => l.nav_section_id === linkDialog.navSectionId).length;
        await createNavLink({
          data: { nav_section_id: linkDialog.navSectionId, ...data, sort_order: count },
        });
      }
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    toast.success(linkDialog.editing ? "Updated" : "Added");
    invalidate();
    setLinkDialog(null);
  };
  const removeLink = async (id: string) => {
    try {
      await deleteNavLink({ data: { id } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    invalidate();
  };

  const sortedItems = [...navItems].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl">Main Navigator</h1>
        <Button onClick={openNewItem}>
          <Plus className="size-4 mr-1.5" /> Add menu button
        </Button>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">
        Build the header menu — drag to reorder buttons, expand a dropdown button to manage its
        sections (up to 4-5), and expand a section to manage its links. Changes go live immediately.
      </p>

      <div className="bg-card border rounded-2xl divide-y">
        {sortedItems.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No menu buttons yet — add one to get started.
          </p>
        )}
        {sortedItems.map((item) => {
          const sections = navSections
            .filter((s) => s.nav_item_id === item.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          const expanded = expandedItems.has(item.id);
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragItemId(item.id)}
              onDragOver={(e) => {
                if (!dragItemId) return;
                e.preventDefault();
                setOverItemId(item.id);
              }}
              onDrop={() => {
                if (dragItemId) reorderItemsFn(dragItemId, item.id);
                setDragItemId(null);
                setOverItemId(null);
              }}
              onDragEnd={() => {
                setDragItemId(null);
                setOverItemId(null);
              }}
              className={cn(
                dragItemId === item.id && "opacity-40",
                overItemId === item.id && dragItemId !== item.id && "border-t-2 border-t-brand",
              )}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <GripVertical className="size-4 text-muted-foreground/60 cursor-grab shrink-0" />
                {item.type === "mega" ? (
                  <button
                    type="button"
                    onClick={() => toggle(expandedItems, setExpandedItems, item.id)}
                    className="p-0.5 shrink-0 text-muted-foreground"
                  >
                    {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  </button>
                ) : (
                  <span className="size-5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate flex items-center gap-2">
                    {item.label}
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      {item.type === "mega" ? "dropdown" : "link"}
                    </span>
                    {item.accent && (
                      <span className="text-xs rounded-full bg-brand/15 text-brand px-2 py-0.5">accent</span>
                    )}
                    {!item.active && (
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        inactive
                      </span>
                    )}
                  </p>
                  {item.type === "link" && (
                    <p className="text-xs text-muted-foreground truncate">{item.direct_url}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEditItem(item)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {item.type === "mega" && expanded && (
                <div className="pl-11 pr-4 pb-3 space-y-2">
                  {sections.map((section) => {
                    const links = navLinks
                      .filter((l) => l.nav_section_id === section.id)
                      .sort((a, b) => a.sort_order - b.sort_order);
                    const sectionExpanded = expandedSections.has(section.id);
                    return (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={() => setDragSectionId(section.id)}
                        onDragOver={(e) => {
                          if (!dragSectionId) return;
                          e.preventDefault();
                          setOverSectionId(section.id);
                        }}
                        onDrop={() => {
                          if (dragSectionId) reorderSectionsFn(dragSectionId, section.id);
                          setDragSectionId(null);
                          setOverSectionId(null);
                        }}
                        onDragEnd={() => {
                          setDragSectionId(null);
                          setOverSectionId(null);
                        }}
                        className={cn(
                          "rounded-lg border bg-muted/40",
                          dragSectionId === section.id && "opacity-40",
                          overSectionId === section.id &&
                            dragSectionId !== section.id &&
                            "border-t-2 border-t-brand",
                        )}
                      >
                        <div className="flex items-center gap-2 px-3 py-2">
                          <GripVertical className="size-3.5 text-muted-foreground/60 cursor-grab shrink-0" />
                          <button
                            type="button"
                            onClick={() => toggle(expandedSections, setExpandedSections, section.id)}
                            className="p-0.5 shrink-0 text-muted-foreground"
                          >
                            {sectionExpanded ? (
                              <ChevronDown className="size-3.5" />
                            ) : (
                              <ChevronRight className="size-3.5" />
                            )}
                          </button>
                          {section.image_url && (
                            <div className="size-7 rounded border bg-background overflow-hidden shrink-0">
                              <img src={section.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="flex-1 min-w-0 text-sm font-medium truncate">
                            {section.title ?? (section.image_url ? "Promo image" : "Flat list")}
                          </span>
                          {!section.active && (
                            <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                              inactive
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => openEditSection(section)}
                            aria-label="Edit section"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </div>

                        {sectionExpanded && (
                          <div className="pl-9 pr-3 pb-2 space-y-1">
                            {links.map((l) => (
                              <div
                                key={l.id}
                                draggable
                                onDragStart={() => setDragLinkId(l.id)}
                                onDragOver={(e) => {
                                  if (!dragLinkId) return;
                                  e.preventDefault();
                                  setOverLinkId(l.id);
                                }}
                                onDrop={() => {
                                  if (dragLinkId) reorderLinksFn(dragLinkId, l.id);
                                  setDragLinkId(null);
                                  setOverLinkId(null);
                                }}
                                onDragEnd={() => {
                                  setDragLinkId(null);
                                  setOverLinkId(null);
                                }}
                                className={cn(
                                  "flex items-center gap-2 rounded-md bg-background px-2 py-1.5",
                                  dragLinkId === l.id && "opacity-40",
                                  overLinkId === l.id && dragLinkId !== l.id && "border-t-2 border-t-brand",
                                )}
                              >
                                <GripVertical className="size-3.5 text-muted-foreground/60 cursor-grab shrink-0" />
                                <span className="flex-1 min-w-0 text-sm truncate">
                                  {l.label}
                                  {!l.collection_id && !l.custom_url && (
                                    <span className="text-destructive text-xs ml-1.5">(no target set)</span>
                                  )}
                                  {!l.active && (
                                    <span className="text-xs text-muted-foreground ml-1.5">(inactive)</span>
                                  )}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-6"
                                  onClick={() => openEditLink(l)}
                                  aria-label="Edit link"
                                >
                                  <Pencil className="size-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-6"
                                  onClick={() => removeLink(l.id)}
                                >
                                  <Trash2 className="size-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={() => openNewLink(section.id)}
                            >
                              <Plus className="size-3.5 mr-1" /> Add link
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {sections.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openNewSection(item.id)}
                    >
                      <Plus className="size-3.5 mr-1" /> Add section
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nav item dialog */}
      <Dialog open={!!itemDialog} onOpenChange={(o) => !o && setItemDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{itemDialog?.editing ? "Edit menu button" : "New menu button"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveItem} className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                required
                value={itemForm.label}
                onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                placeholder="e.g. Wagyu & Meats"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={itemForm.type} onValueChange={(v) => setItemForm({ ...itemForm, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mega">Dropdown (sections & links)</SelectItem>
                  <SelectItem value="link">Plain link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {itemForm.type === "link" && (
              <div>
                <Label>URL</Label>
                <Input
                  value={itemForm.direct_url}
                  onChange={(e) => setItemForm({ ...itemForm, direct_url: e.target.value })}
                  placeholder="/shop or /offers"
                />
              </div>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={itemForm.accent}
                onCheckedChange={(v) => setItemForm({ ...itemForm, accent: v === true })}
              />
              <span className="text-sm">Highlight styling (accent color, e.g. for Promotions)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={itemForm.active}
                onCheckedChange={(v) => setItemForm({ ...itemForm, active: v === true })}
              />
              <span className="text-sm">Active (shown in the header menu)</span>
            </label>
            <Button type="submit" className="w-full">
              {itemDialog?.editing ? "Save changes" : "Add button"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section dialog */}
      <Dialog
        open={!!sectionDialog}
        onOpenChange={(o) => {
          if (!o) {
            setSectionDialog(null);
            setSectionPicker(false);
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sectionDialog?.editing ? "Edit section" : "New section"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveSection} className="space-y-4">
            <div>
              <Label>Column title</Label>
              <Input
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                placeholder="Leave blank for a flat list with no heading"
              />
            </div>

            <div className="flex items-start gap-3">
              <div className="size-16 rounded-lg border bg-muted overflow-hidden shrink-0 relative">
                {sectionForm.image_url ? (
                  <>
                    <img src={sectionForm.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setSectionForm({ ...sectionForm, image_url: "" })}
                      className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <X className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Optional. A section with an image and no links renders as a visual promo card
                  instead of a link list.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={sectionUploading}
                    onClick={() => sectionFileRef.current?.click()}
                  >
                    {sectionUploading ? (
                      <Loader2 className="size-4 mr-1.5 animate-spin" />
                    ) : (
                      <Upload className="size-4 mr-1.5" />
                    )}
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSectionPicker((v) => !v)}
                  >
                    <ImageIcon className="size-4 mr-1.5" /> Media library
                  </Button>
                </div>
                <Input
                  value={sectionForm.image_url}
                  onChange={(e) => setSectionForm({ ...sectionForm, image_url: e.target.value })}
                  placeholder="or paste a URL https://..."
                />
              </div>
            </div>
            <input
              ref={sectionFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onSectionUpload(e.target.files?.[0])}
            />
            {sectionPicker && (
              <div className="border rounded-lg p-2 max-h-44 overflow-y-auto">
                {mediaItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">
                    No media yet — upload an image first.
                  </p>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {mediaItems.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSectionForm((f) => ({ ...f, image_url: m.url }));
                          setSectionPicker(false);
                        }}
                        className="aspect-square rounded-md overflow-hidden border hover:ring-2 ring-brand"
                      >
                        <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>Promo caption (shown under the image)</Label>
              <Input
                value={sectionForm.cta_label}
                onChange={(e) => setSectionForm({ ...sectionForm, cta_label: e.target.value })}
                placeholder="e.g. New to Wagyu? Start with Japanese A4"
              />
            </div>
            <div>
              <Label>Promo link</Label>
              <Input
                value={sectionForm.cta_link}
                onChange={(e) => setSectionForm({ ...sectionForm, cta_link: e.target.value })}
                placeholder="/collections/japanese-a4-wagyu"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={sectionForm.active}
                onCheckedChange={(v) => setSectionForm({ ...sectionForm, active: v === true })}
              />
              <span className="text-sm">Active</span>
            </label>
            <Button type="submit" className="w-full">
              {sectionDialog?.editing ? "Save changes" : "Add section"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Link dialog */}
      <Dialog open={!!linkDialog} onOpenChange={(o) => !o && setLinkDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{linkDialog?.editing ? "Edit link" : "New link"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveLink} className="space-y-4">
            <div>
              <Label>Link target</Label>
              <Select
                value={linkForm.mode}
                onValueChange={(v) => setLinkForm({ ...linkForm, mode: v as "collection" | "custom" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collection">Existing collection</SelectItem>
                  <SelectItem value="custom">Custom URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {linkForm.mode === "collection" ? (
              <div>
                <Label>Collection</Label>
                <Select
                  value={linkForm.collection_id || "none"}
                  onValueChange={(v) => {
                    const c = collections.find((c) => c.id === v);
                    setLinkForm((f) => ({
                      ...f,
                      collection_id: v === "none" ? "" : v,
                      label: f.label || c?.title || f.label,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose a collection</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>URL</Label>
                <Input
                  value={linkForm.custom_url}
                  onChange={(e) => setLinkForm({ ...linkForm, custom_url: e.target.value })}
                  placeholder="https://sorasake.wine or /offers"
                />
              </div>
            )}
            <div>
              <Label>Label</Label>
              <Input
                required
                value={linkForm.label}
                onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                placeholder="Text shown in the menu"
              />
            </div>
            <div>
              <Label>Sub-label</Label>
              <Input
                value={linkForm.sub_label}
                onChange={(e) => setLinkForm({ ...linkForm, sub_label: e.target.value })}
                placeholder="Optional small text under the label"
              />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={linkForm.active}
                onCheckedChange={(v) => setLinkForm({ ...linkForm, active: v === true })}
              />
              <span className="text-sm">Active</span>
            </label>
            <Button type="submit" className="w-full">
              {linkDialog?.editing ? "Save changes" : "Add link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
