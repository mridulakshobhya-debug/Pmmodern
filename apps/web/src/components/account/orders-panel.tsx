"use client";

import { useEffect, useState } from "react";
import type { Order } from "@pmmodern/shared-types";
import { fetchOrders } from "@/lib/api-client/orders";
import { useAuthStore } from "@/store/auth-store";

export function OrdersPanel() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    void fetchOrders(user.id, token)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [token, user]);

  if (!user || !token) {
    return <p className="text-sm text-[var(--muted)]">Login required to view orders.</p>;
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Loading order history...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  if (!orders.length) {
    return <p className="text-sm text-[var(--muted)]">No orders found.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article key={order.id} className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Order #{order.id}</h3>
            <span className="rounded-full bg-emeraldGlow-100 px-2 py-0.5 text-xs font-semibold text-emeraldGlow-700 dark:bg-emeraldGlow-700/30 dark:text-emeraldGlow-200">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">{new Date(order.createdAt).toLocaleString()}</p>
          <p className="mt-1 text-sm font-semibold">AED {order.total.toFixed(2)}</p>
          <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.title} x {item.quantity}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
