import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Mail, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const Route = createFileRoute("/_store/account")({ component: Account });

function Account() {
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Whether the account has a password (credential provider). Google-only
  // accounts don't, so they can't "change" a password — they set one via reset.
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    authClient
      .listAccounts()
      .then((res) => {
        if (active) setHasPassword((res.data ?? []).some((a) => a.providerId === "credential"));
      })
      .catch(() => {
        if (active) setHasPassword(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can’t be empty");
      return;
    }
    setSavingProfile(true);
    const { error } = await authClient.updateUser({ name: trimmed });
    setSavingProfile(false);
    if (error) toast.error(error.message ?? "Couldn’t update profile");
    else toast.success("Profile updated");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don’t match.");
      return;
    }
    setChangingPw(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });
    setChangingPw(false);
    if (error) {
      toast.error(error.message ?? "Couldn’t change password");
      return;
    }
    toast.success("Password updated");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12 space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="size-20 rounded-full bg-muted grid place-items-center mx-auto mb-6">
          <User className="size-8 text-muted-foreground" />
        </div>
        <h1 className="font-display font-semibold tracking-tight text-3xl">
          Sign in to manage your account
        </h1>
        <p className="text-muted-foreground mt-2">Update your profile and password from here.</p>
        <Link
          to="/auth"
          className="inline-flex mt-6 items-center gap-2 rounded-full bg-brand text-brand-foreground px-6 py-3 text-sm font-semibold hover:bg-secondary-accent transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12 space-y-6">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">Account</h1>

      {/* Profile */}
      <form onSubmit={saveProfile} className="bg-card border rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="size-5 text-muted-foreground" />
          <h2 className="font-display font-semibold text-lg">Profile</h2>
        </div>
        <div>
          <Label>Display name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Email can’t be changed here yet — contact us if you need to update it.
          </p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={savingProfile} className="rounded-full">
            {savingProfile ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      {/* Password */}
      <div className="bg-card border rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="size-5 text-muted-foreground" />
          <h2 className="font-display font-semibold text-lg">Password</h2>
        </div>

        {hasPassword === null ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : hasPassword ? (
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <Label>Current password</Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>New password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Confirm new password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
            <div className="flex justify-end">
              <Button type="submit" disabled={changingPw} className="rounded-full">
                {changingPw ? "Updating…" : "Change password"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm">
            <KeyRound className="size-5 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              You sign in with Google, so there’s no password to change. To add one, sign out and
              use{" "}
              <Link to="/auth" className="font-medium text-brand hover:underline">
                Forgot password
              </Link>{" "}
              to set a password for your email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
