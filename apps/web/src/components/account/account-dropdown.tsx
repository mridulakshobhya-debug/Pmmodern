"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="relative">
      <button
        className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
        onClick={() => setOpen((value) => !value)}
      >
        <CircleUserRound className="h-4 w-4" />
        {user ? user.name.split(" ")[0] : "Account"}
      </button>
      {open && (
        <div className="glass absolute right-0 top-full z-50 mt-2 w-48 rounded-xl p-2">
          {user ? (
            <>
              <Link href="/account/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-emeraldGlow-100/70 dark:hover:bg-ink-700">
                Profile
              </Link>
              <Link href="/account/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-emeraldGlow-100/70 dark:hover:bg-ink-700">
                Order History
              </Link>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/account/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-emeraldGlow-100/70 dark:hover:bg-ink-700">
                Login
              </Link>
              <Link href="/account/register" className="block rounded-lg px-3 py-2 text-sm hover:bg-emeraldGlow-100/70 dark:hover:bg-ink-700">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
