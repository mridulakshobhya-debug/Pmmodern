"use client";

import { useState, type FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      router.push("/account/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    }
  };

  return (
    <form onSubmit={submit} className="glass mx-auto max-w-md space-y-4 rounded-2xl p-6">
      <h1 className="text-xl font-bold">Register</h1>
      <input
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        placeholder="Full Name"
        required
        className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm"
      />
      <input
        type="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        placeholder="Email"
        required
        className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm"
      />
      <input
        type="password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        placeholder="Password"
        required
        className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
