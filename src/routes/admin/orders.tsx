import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listOrders, updateOrderStatus } from "@/data/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: OrdersAdmin });

function OrdersAdmin() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["orders-admin"],
    queryFn: () => listOrders(),
    refetchInterval: 30000,
  });

  const setStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ data: { id, status } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
    qc.invalidateQueries({ queryKey: ["orders-admin"] });
    qc.invalidateQueries({ queryKey: ["orders-pending-count"] });
  };

  return (
    <div className="max-w-7xl space-y-6">
      <h1 className="font-display font-bold text-3xl">Orders</h1>
      <div className="bg-card border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3">Order</th>
              <th className="text-left px-6 py-3">Customer</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Items</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-6 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td className="px-6 py-3">
                  <div className="font-medium">{o.customer_name ?? "—"}</div>
                  {o.customer_email && (
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  )}
                  {o.customer_phone && (
                    <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                  )}
                  {(o.address || o.city || o.postal_code) && (
                    <div className="text-xs text-muted-foreground">
                      {[o.address, o.city, o.postal_code].filter(Boolean).join(", ")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  {Array.isArray(o.items) && o.items.length > 0 ? (
                    <ul className="space-y-0.5">
                      {o.items.map((it, i) => (
                        <li key={it.id ?? i}>
                          <span className="font-medium">{it.title}</span>
                          <span className="text-muted-foreground"> × {it.qty}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-3 font-bold">${Number(o.total).toFixed(2)}</td>
                <td className="px-6 py-3">
                  <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
