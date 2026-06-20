import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@/lib/auth";

export type SessionUser = { id: string; email: string; name: string; role?: string | null };

export async function getSessionUser(): Promise<SessionUser | null> {
  const request = getRequest();
  const res = await getAuth().api.getSession({ headers: request.headers });
  return (res?.user as SessionUser | undefined) ?? null;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden: admin only");
  return user;
}

// Admin or sales — sales staff are scoped to order handling only.
export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin" && user.role !== "sales") throw new Error("Forbidden: staff only");
  return user;
}
