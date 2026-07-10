import { createFileRoute } from "@tanstack/react-router";
import { useStoreSettings } from "@/hooks/use-products";
import { useEffect, useRef, useState } from "react";
import { updateSettings } from "@/data/settings";
import { uploadMedia } from "@/data/media";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const { data } = useStoreSettings();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    banner_text: "",
    global_discount_pct: "0",
    free_shipping_threshold: "50",
    khqr_image_url: "",
  });

  useEffect(() => {
    if (data)
      setForm({
        banner_text: data.banner_text ?? "",
        global_discount_pct: String(data.global_discount_pct ?? 0),
        free_shipping_threshold: String(data.free_shipping_threshold ?? 50),
        khqr_image_url: data.khqr_image_url ?? "",
      });
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      await updateSettings({
        data: {
          id: data.id,
          banner_text: form.banner_text,
          global_discount_pct: Number(form.global_discount_pct),
          free_shipping_threshold: Number(form.free_shipping_threshold),
          khqr_image_url: form.khqr_image_url || null,
        },
      });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save settings");
    }
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["store_settings"] });
  };

  // The bank's KHQR is a photo/scan — upload as-is, no compression that could
  // break QR readability.
  const onUploadQr = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadMedia({ data: fd });
      setForm((f) => ({ ...f, khqr_image_url: url }));
      qc.invalidateQueries({ queryKey: ["media"] });
      toast.success("QR image uploaded — remember to save settings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display font-bold text-3xl">Store Settings</h1>
      <form onSubmit={save} className="bg-card border rounded-2xl p-6 space-y-4">
        <div>
          <Label>Promotional Banner Text</Label>
          <Input
            value={form.banner_text}
            onChange={(e) => setForm({ ...form, banner_text: e.target.value })}
            placeholder="e.g. 🎉 Free delivery this weekend — use code SAVE20"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Shows as a dismissible bar at the top of the store. Leave blank to hide it. Editing the
            text shows it again to everyone.
          </p>
        </div>
        <div>
          <Label>Global Discount %</Label>
          <Input
            type="number"
            step="0.5"
            value={form.global_discount_pct}
            onChange={(e) => setForm({ ...form, global_discount_pct: e.target.value })}
          />
        </div>
        <div>
          <Label>Free Shipping Threshold ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.free_shipping_threshold}
            onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })}
          />
        </div>
        <div>
          <Label>KHQR Payment Code</Label>
          <div className="mt-1 flex items-start gap-4">
            {form.khqr_image_url ? (
              <img
                src={form.khqr_image_url}
                alt="KHQR code"
                className="size-28 rounded-lg border object-contain bg-white"
              />
            ) : (
              <div className="size-28 rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground text-center px-2">
                No QR uploaded
              </div>
            )}
            <div className="space-y-2">
              <Input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => onUploadQr(e.target.files?.[0])}
                className="max-w-xs"
              />
              {form.khqr_image_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, khqr_image_url: "" }))}
                >
                  Remove QR
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Your bank&rsquo;s static KHQR code, shown to customers who choose to pay online.
                Remove it to disable KHQR checkout screens.
              </p>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save settings
        </Button>
      </form>

      <div className="bg-card border rounded-2xl p-6">
        <h2 className="font-display font-bold mb-2">Make a user admin</h2>
        <p className="text-sm text-muted-foreground">
          Run this in the SQL editor:{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded">
            INSERT INTO user_roles (user_id, role) VALUES ('USER_ID', 'admin');
          </code>
        </p>
      </div>
    </div>
  );
}
