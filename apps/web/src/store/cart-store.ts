"use client";

import { create } from "zustand";
import type { CartItem } from "@pmmodern/shared-types";
import {
  addToCart as apiAddToCart,
  fetchCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem
} from "@/lib/api-client/cart";
import { useAuthStore } from "./auth-store";

interface CartState {
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  error: string | null;
  open: boolean;
  loading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  hydrateCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

function getAuthToken() {
  return useAuthStore.getState().accessToken ?? undefined;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  totalDiscount: 0,
  grandTotal: 0,
  error: null,
  open: false,
  loading: false,

  openDrawer: () => set({ open: true }),
  closeDrawer: () => set({ open: false }),

  hydrateCart: async () => {
    set({ loading: true });
    try {
      const data = await fetchCart(getAuthToken());
      set({
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        grandTotal: data.grandTotal,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to load cart"
      });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ loading: true });
    try {
      const data = await apiAddToCart({ productId, quantity }, getAuthToken());
      set({
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        grandTotal: data.grandTotal,
        open: true,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to add item to cart"
      });
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ loading: true });
    try {
      const data = await apiUpdateCartItem(itemId, { quantity }, getAuthToken());
      set({
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        grandTotal: data.grandTotal,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to update cart item"
      });
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true });
    try {
      const data = await apiRemoveCartItem(itemId, getAuthToken());
      set({
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        grandTotal: data.grandTotal,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to remove cart item"
      });
    } finally {
      set({ loading: false });
    }
  }
}));
