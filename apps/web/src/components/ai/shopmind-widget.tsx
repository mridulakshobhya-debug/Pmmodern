"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import type { ShopMindResponse } from "@pmmodern/shared-types";
import { chatWithShopMind } from "@/lib/api-client/ai";
import { useCartStore } from "@/store/cart-store";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  payload?: ShopMindResponse;
}

export function ShopMindWidget() {
  const addItem = useCartStore((state) => state.addItem);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hi, I am ShopMind AI. Ask me for comparisons, smart grocery picks, or cart recommendations."
    }
  ]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: text }]);
    setLoading(true);

    try {
      const response = await chatWithShopMind({ message: text });
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.replyText,
          payload: response
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error ? error.message : "AI service is temporarily unavailable."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-emeraldGlow-500 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-emeraldGlow-700"
      >
        {open ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        ShopMind AI
      </button>

      {open && (
        <section className="glass fixed bottom-24 right-6 z-40 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-emeraldGlow-100/70">
          <header className="border-b border-[var(--border)] px-4 py-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="h-4 w-4" />
              ShopMind AI Assistant
            </h3>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-xl p-3 text-sm ${
                  message.role === "assistant"
                    ? "bg-emeraldGlow-50 text-ink-900 dark:bg-ink-700 dark:text-emeraldGlow-50"
                    : "ml-10 bg-softGold-200 text-ink-900"
                }`}
              >
                <p>{message.content}</p>
                {message.payload?.suggestedProducts.length ? (
                  <div className="mt-2 space-y-1">
                    {message.payload.suggestedProducts.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        className="block rounded-md border border-emeraldGlow-200/60 px-2 py-1 text-xs hover:bg-emeraldGlow-100/60 dark:border-emeraldGlow-600 dark:hover:bg-ink-800"
                      >
                        {item.title} - AED {item.price.toFixed(2)}
                      </Link>
                    ))}
                  </div>
                ) : null}
                {message.payload?.comparisonTable.length ? (
                  <div className="mt-2 overflow-x-auto rounded-md border border-emeraldGlow-200/60 p-2 text-xs dark:border-emeraldGlow-700/60">
                    {message.payload.comparisonTable.map((row) => (
                      <div key={row.productId} className="mb-1">
                        <p className="font-semibold">{row.productTitle}</p>
                        <p className="text-[11px] text-[var(--muted)]">
                          Price: {String(row.values.price)} | Rating: {String(row.values.rating)} | Stock: {String(row.values.inStock)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {Object.keys(message.payload?.suggestedFilters ?? {}).length > 0 ? (
                  <p className="mt-2 text-[11px] text-[var(--muted)]">
                    Suggested filters:{" "}
                    {Object.entries(message.payload?.suggestedFilters ?? {})
                      .map(([key, value]) => `${key}=${String(value)}`)
                      .join(", ")}
                  </p>
                ) : null}
                {message.payload?.cartActions.length ? (
                  <button
                    className="mt-2 rounded-md bg-emeraldGlow-500 px-2 py-1 text-xs font-semibold text-white"
                    onClick={() => {
                      message.payload?.cartActions.forEach((action) => {
                        if (action.action === "add") {
                          void addItem(action.productId, action.quantity ?? 1);
                        }
                      });
                    }}
                  >
                    Apply Suggested Cart
                  </button>
                ) : null}
              </article>
            ))}
          </div>

          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask for smart suggestions..."
                className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={() => void send()}
                disabled={loading}
                className="rounded-xl bg-emeraldGlow-500 p-2 text-white disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
