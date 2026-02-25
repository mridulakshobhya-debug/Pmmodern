import type { AuthResponse, User } from "@pmmodern/shared-types";
import { apiFetch } from "./http";

export async function register(payload: { name: string; email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/users/register", {
    method: "POST",
    body: payload
  });
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/users/login", {
    method: "POST",
    body: payload
  });
}

export async function fetchMe(token: string) {
  return apiFetch<User>("/api/users/me", { token });
}
