"use client";

import { create } from "zustand";
import type { User } from "@pmmodern/shared-types";
import { fetchMe, login as loginApi, register as registerApi } from "@/lib/api-client/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "pmmodern_access_token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: false,

  login: async (payload) => {
    set({ loading: true });
    try {
      const data = await loginApi(payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
      }
      set({ user: data.user, accessToken: data.accessToken });
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const data = await registerApi(payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
      }
      set({ user: data.user, accessToken: data.accessToken });
    } finally {
      set({ loading: false });
    }
  },

  hydrate: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    set({ loading: true });
    try {
      const user = await fetchMe(token);
      set({ user, accessToken: token });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, accessToken: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ user: null, accessToken: null });
  }
}));
