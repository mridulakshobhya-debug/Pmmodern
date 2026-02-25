"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/common/button";

export function CartDrawer() {
  const open = useCartStore((state) => state.open);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const grandTotal = useCartStore((state) => state.grandTotal);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const loading = useCartStore((state) => state.loading);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[var(--border)] bg-[var(--bg)] p-4 shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </h2>
          <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-ink-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto pb-40">
          {items.length === 0 ? (
            <div className="glass rounded-xl p-4 text-sm text-[var(--muted)]">Your cart is empty.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass rounded-xl p-3">
                <div className="mb-3 flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-[var(--muted)]">AED {item.unitPrice.toFixed(2)}</p>
                      </div>
                      <button onClick={() => void removeItem(item.id)} className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg border p-1"
                        onClick={() => void updateItem(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        className="rounded-lg border p-1"
                        onClick={() => void updateItem(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="mb-1 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>AED {subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-3 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>AED {grandTotal.toFixed(2)}</span>
          </div>
          <Link href="/account/login">
            <Button className="w-full" disabled={items.length === 0 || loading}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
