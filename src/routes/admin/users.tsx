import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ban, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: UsersAdmin });

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  createdAt: string | Date;
};

function UsersAdmin() {
  const qc = useQueryClient();
  const { user: me } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await authClient.admin.listUsers({
        query: { limit: 200, sortBy: "createdAt", sortDirection: "desc" },
      });
      if (res.error) throw new Error(res.error.message ?? "Failed to load users");
      return (res.data?.users ?? []) as AdminUser[];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const changeRole = async (userId: string, role: string) => {
    const res = await authClient.admin.setRole({ userId, role: role as "user" | "admin" });
    if (res.error) return toast.error(res.error.message ?? "Failed to change role");
    toast.success("Role updated");
    refresh();
  };

  const toggleBan = async (u: AdminUser) => {
    const res = u.banned
      ? await authClient.admin.unbanUser({ userId: u.id })
      : await authClient.admin.banUser({ userId: u.id });
    if (res.error) return toast.error(res.error.message ?? "Failed to update");
    toast.success(u.banned ? "User unbanned" : "User banned");
    refresh();
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    const res = await authClient.admin.removeUser({ userId: u.id });
    if (res.error) return toast.error(res.error.message ?? "Failed to delete");
    toast.success("User deleted");
    refresh();
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl">Users</h1>
        <p className="text-muted-foreground mt-1">{users.length} total</p>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3">User</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Joined</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === me?.id;
              return (
                <tr key={u.id} className="border-t">
                  <td className="px-6 py-3">
                    <div className="font-medium">{u.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-6 py-3">
                    <Select
                      value={u.role ?? "user"}
                      onValueChange={(v) => changeRole(u.id, v)}
                      disabled={isSelf}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={
                        u.banned
                          ? "px-2 py-0.5 rounded text-xs font-bold uppercase bg-destructive/10 text-destructive"
                          : "px-2 py-0.5 rounded text-xs font-bold uppercase bg-muted"
                      }
                    >
                      {u.banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={u.banned ? "Unban" : "Ban"}
                        onClick={() => toggleBan(u)}
                        disabled={isSelf}
                      >
                        {u.banned ? (
                          <Check className="size-4 text-brand" />
                        ) : (
                          <Ban className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => remove(u)}
                        disabled={isSelf}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
