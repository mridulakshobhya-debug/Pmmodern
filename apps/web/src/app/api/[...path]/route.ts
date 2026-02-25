import type { NextRequest } from "next/server";
import { handleLocalApiRequest } from "@/server/local-api/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function route(request: NextRequest, context: { params: { path?: string[] } }) {
  const path = Array.isArray(context.params.path) ? context.params.path : [];
  return handleLocalApiRequest(request, path);
}

export const GET = route;
export const POST = route;
export const PUT = route;
export const PATCH = route;
export const DELETE = route;
export const OPTIONS = route;
