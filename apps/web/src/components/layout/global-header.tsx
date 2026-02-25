"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { CategoriesMegaMenu } from "@/components/mega-menu/categories-mega-menu";
import { GlobalSearch } from "@/components/search/global-search";
import { AccountDropdown } from "@/components/account/account-dropdown";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { ThemeToggle } from "./theme-toggle";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function GlobalHeader() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openDrawer = useCartStore((state) => state.openDrawer);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="container-shell flex flex-wrap items-center gap-3 py-3">
        <Link href="/" className="mr-2 flex items-center gap-2 text-lg font-extrabold tracking-tight text-emeraldGlow-700 dark:text-emeraldGlow-300">
          <div className="h-10 w-10 flex-shrink-0">
            <ImageWithFallback
              src="/logo.svg"
              alt="PM Modern Logo"
              className="h-full w-full"
              width={40}
              height={40}
            />
          </div>
          <span className="hidden sm:inline">PMMODERN</span>
        </Link>
        <CategoriesMegaMenu />
        <div className="min-w-[220px] flex-1">
          <GlobalSearch />
        </div>
        <Link href="/wishlist" className="glass relative rounded-xl p-2">
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-softGold-500 px-1.5 text-[10px] font-bold text-ink-900">
              {wishlistCount}
            </span>
          )}
        </Link>
        <button className="glass relative rounded-xl p-2" onClick={openDrawer}>
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-emeraldGlow-500 px-1.5 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
        <ThemeToggle />
        <AccountDropdown />
        <button className="glass rounded-xl p-2 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
