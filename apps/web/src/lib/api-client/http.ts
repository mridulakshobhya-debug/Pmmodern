type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function normalizeBase(base: string) {
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function getApiBaseCandidates() {
  if (typeof window !== "undefined") {
    // Browser always uses same-origin /api routes.
    return [""];
  }

  const candidates = new Set<string>();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (siteUrl) candidates.add(normalizeBase(siteUrl));
  candidates.add("http://127.0.0.1:3000");
  candidates.add("http://localhost:3000");

  // Optional external API override for custom deployments.
  if (process.env.API_BASE_URL) {
    candidates.add(normalizeBase(process.env.API_BASE_URL));
  }
  return Array.from(candidates);
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function isDynamicServerUsageError(error: unknown) {
  return error instanceof Error && error.message.includes("Dynamic server usage:");
}

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: { revalidate?: number; tags?: string[] };
  } = {}
): Promise<T> {
  const { method = "GET", body, token, headers, cache = "no-store", next } = options;
  const baseCandidates = getApiBaseCandidates();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const attempts: Array<{ base: string; error: unknown }> = [];

  for (const [index, base] of baseCandidates.entries()) {
    try {
      const response = await fetch(`${base}${normalizedPath}`, {
        method,
        cache,
        next,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errorJson = (await response.json().catch(() => null)) as { message?: string } | null;
        const errorMessage = errorJson?.message ?? `Request failed with ${response.status}`;
        if (index < baseCandidates.length - 1 && (response.status === 404 || response.status >= 500)) {
          attempts.push({ base, error: new Error(errorMessage) });
          continue;
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (isDynamicServerUsageError(error)) {
        throw error;
      }
      attempts.push({ base, error });
      if (index < baseCandidates.length - 1) {
        await wait(160 * (index + 1));
        continue;
      }
    }
  }

  const last = attempts[attempts.length - 1]?.error;
  if (isDynamicServerUsageError(last)) {
    throw last;
  }
  if (last instanceof Error) {
    throw new Error(`API fetch failed after ${attempts.length} attempts: ${last.message}`);
  }
  throw new Error("API fetch failed");
}
