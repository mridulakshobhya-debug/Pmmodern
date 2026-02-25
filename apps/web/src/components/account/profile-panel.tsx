"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export function ProfilePanel() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="glass rounded-2xl p-6">
        <p className="text-sm text-[var(--muted)]">You are not logged in.</p>
        <Link href="/account/login" className="mt-2 inline-block text-sm font-semibold text-emeraldGlow-700 dark:text-emeraldGlow-300">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <section className="glass rounded-2xl p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="text-[var(--muted)]">Name:</span> {user.name}
        </p>
        <p>
          <span className="text-[var(--muted)]">Email:</span> {user.email}
        </p>
      </div>
      <Link href="/account/orders" className="mt-4 inline-block rounded-xl bg-emeraldGlow-500 px-4 py-2 text-sm font-semibold text-white">
        View Orders
      </Link>
    </section>
  );
}
