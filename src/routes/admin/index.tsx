import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data: products = [] } = useProducts({ all: true });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const revenue = orders.reduce((a, o) => a + Number(o.total), 0);
  const active = orders.filter((o) => o.status !== "completed").length;

  const stats = [
    { label: "Total Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign, tint: "bg-brand/10 text-brand" },
    { label: "Active Orders", value: active, icon: ShoppingCart, tint: "bg-accent/30 text-accent-foreground" },
    { label: "Total Products", value: products.length, icon: Package, tint: "bg-warning/20 text-warning" },
    { label: "Total Orders", value: orders.length, icon: Users, tint: "bg-success/20 text-success" },
  ];

  // Simple bar chart from last 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().slice(0, 10);
    const total = orders.filter((o) => o.created_at.slice(0, 10) === dayStr).reduce((a, o) => a + Number(o.total), 0);
    return { day: d.toLocaleDateString("en", { weekday: "short" }), total };
  });
  const max = Math.max(...days.map((d) => d.total), 1);

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <h1 className="font-display font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Store performance at a glance.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-2xl p-5">
            <div className={`size-10 rounded-xl grid place-items-center ${s.tint} mb-4`}><s.icon className="size-5" /></div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{s.label}</p>
            <p className="font-display font-bold text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-card border rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg mb-6">Revenue · Last 7 days</h2>
        <div className="flex items-end gap-3 h-48">
          {days.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div className="w-full bg-brand/15 rounded-t-md relative overflow-hidden" style={{ height: `${(d.total / max) * 100}%`, minHeight: "4px" }}>
                  <div className="absolute inset-x-0 bottom-0 bg-brand" style={{ height: "100%" }} />
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-display font-bold">Recent Orders</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="text-left px-6 py-3">Order</th><th className="text-left px-6 py-3">Status</th><th className="text-right px-6 py-3">Total</th></tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-6 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 bg-muted rounded text-xs font-bold uppercase">{o.status}</span></td>
                <td className="px-6 py-3 text-right font-bold">${Number(o.total).toFixed(2)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
