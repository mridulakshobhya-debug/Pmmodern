import { createHash, createHmac, timingSafeEqual } from "crypto";
import type {
  CartItem,
  CartResponse,
  CategoryNode,
  Order,
  Product,
  ProductListResponse,
  SearchResponse,
  ShopMindIntent,
  ShopMindResponse,
  User
} from "@pmmodern/shared-types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { REQUIRED_CATEGORIES } from "@/lib/constants/categories";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface LocalApiState {
  users: UserRecord[];
  carts: Map<string, CartItem[]>;
  orders: Order[];
}

const defaultSeller = {
  id: "seller-main",
  name: "Prime Store",
  slug: "prime-store",
  rating: 4.8,
  totalReviews: 2814
};

const IMAGE_SET = {
  ricePack: "/images/Rice.jpg",
  riceBowl: "/images/Rice.jpg",
  pulsesMoong: "/images/Pulses.jpg",
  pulsesUrad: "/images/lentils.jpg",
  pulsesUradSplit: "/images/Pulses.jpg",
  spiceParuppu: "/images/Spices.jpg",
  spiceIdly: "/images/Spices.jpg",
  spiceKulambu: "/images/Spices.jpg",
  spiceCoriander: "/images/Spices.jpg",
  spiceCurry: "/images/Spices.jpg",
  spiceDryChilli: "/images/Spices.jpg",
  oilSunflower: "/images/cooking oil.jpg",
  oilGroundnut: "/images/cooking oil.jpg",
  oilSesame: "/images/cooking oil.jpg",
  coffeeSaudi: "/images/Beverages.jpg",
  teaBlack: "/images/Beverages.jpg",
  teaMint: "/images/Beverages.jpg"
} as const;

const SUBCATEGORY_IMAGES: Record<string, string[]> = {
  basmati: [IMAGE_SET.ricePack, IMAGE_SET.riceBowl, IMAGE_SET.ricePack],
  "sona-masoori": ["/images/sona masoori2.jpg", "/images/sona masoori2.jpg", "/images/sona masoori2.jpg"],
  "brown-rice": ["/images/organic brown rice.jpg", "/images/organic brown rice.jpg", "/images/organic brown rice.jpg"],
  jasmine: [IMAGE_SET.ricePack, IMAGE_SET.riceBowl, IMAGE_SET.ricePack],
  pulses: [IMAGE_SET.pulsesMoong, IMAGE_SET.pulsesUrad, IMAGE_SET.pulsesUradSplit],
  lentils: [IMAGE_SET.pulsesUrad, IMAGE_SET.pulsesUradSplit, IMAGE_SET.pulsesMoong],
  flour: ["/images/whole wheat atta.jpg", "/images/whole wheat atta.jpg", "/images/whole wheat atta.jpg"],
  spices: [IMAGE_SET.spiceIdly, IMAGE_SET.spiceKulambu, IMAGE_SET.spiceDryChilli],
  "cooking-oil": [IMAGE_SET.oilSunflower, IMAGE_SET.oilGroundnut, IMAGE_SET.oilSesame],
  "coffee-tea": [IMAGE_SET.coffeeSaudi, IMAGE_SET.teaBlack, IMAGE_SET.teaMint]
};

const categories: CategoryNode[] = REQUIRED_CATEGORIES;

const products: Product[] = [
  {
    id: "prd-basmati-5kg",
    slug: "royal-basmati-rice-5kg",
    title: "Royal Basmati Rice 5kg",
    description: "Long-grain premium basmati rice with aromatic finish.",
    category: "Groceries",
    subcategory: "Basmati",
    price: 42.5,
    discountPercent: 12,
    currency: "AED",
    rating: 4.8,
    reviewCount: 534,
    inStock: true,
    stockQty: 240,
    popularity: 98,
    images: SUBCATEGORY_IMAGES.basmati,
    seller: defaultSeller,
    tags: ["rice", "aromatic", "groceries"]
  },
  {
    id: "prd-sona-5kg",
    slug: "sona-masoori-rice-5kg",
    title: "Sona Masoori Rice 5kg",
    description: "Light and soft rice for daily cooking with low starch.",
    category: "Groceries",
    subcategory: "Sona Masoori",
    price: 34,
    discountPercent: 8,
    currency: "AED",
    rating: 4.6,
    reviewCount: 321,
    inStock: true,
    stockQty: 180,
    popularity: 94,
    images: SUBCATEGORY_IMAGES["sona-masoori"],
    seller: defaultSeller,
    tags: ["rice", "daily-use"]
  },
  {
    id: "prd-brown-rice-2kg",
    slug: "brown-rice-organic-2kg",
    title: "Organic Brown Rice 2kg",
    description: "Fiber-rich whole grain brown rice for healthy meals.",
    category: "Groceries",
    subcategory: "Brown Rice",
    price: 29.9,
    discountPercent: 10,
    currency: "AED",
    rating: 4.7,
    reviewCount: 214,
    inStock: true,
    stockQty: 142,
    popularity: 86,
    images: SUBCATEGORY_IMAGES["brown-rice"],
    seller: defaultSeller,
    tags: ["rice", "healthy"]
  },
  {
    id: "prd-jasmine-5kg",
    slug: "thai-jasmine-rice-5kg",
    title: "Thai Jasmine Rice 5kg",
    description: "Fragrant jasmine rice for premium Asian recipes.",
    category: "Groceries",
    subcategory: "Jasmine",
    price: 39.5,
    discountPercent: 6,
    currency: "AED",
    rating: 4.5,
    reviewCount: 199,
    inStock: true,
    stockQty: 103,
    popularity: 83,
    images: SUBCATEGORY_IMAGES.jasmine,
    seller: defaultSeller,
    tags: ["rice", "jasmine"]
  },
  {
    id: "prd-toor-dal-1kg",
    slug: "toor-dal-premium-1kg",
    title: "Toor Dal Premium 1kg",
    description: "High-grade toor dal with rich flavor and quick cooking.",
    category: "Groceries",
    subcategory: "Pulses",
    price: 12.75,
    discountPercent: 5,
    currency: "AED",
    rating: 4.4,
    reviewCount: 411,
    inStock: true,
    stockQty: 330,
    popularity: 81,
    images: SUBCATEGORY_IMAGES.pulses,
    seller: defaultSeller,
    tags: ["pulses", "protein"]
  },
  {
    id: "prd-masoor-dal-1kg",
    slug: "masoor-dal-1kg",
    title: "Masoor Dal 1kg",
    description: "Nutritious red lentils ideal for soups and curries.",
    category: "Groceries",
    subcategory: "Lentils",
    price: 10.99,
    discountPercent: 9,
    currency: "AED",
    rating: 4.5,
    reviewCount: 276,
    inStock: true,
    stockQty: 260,
    popularity: 79,
    images: SUBCATEGORY_IMAGES.lentils,
    seller: defaultSeller,
    tags: ["lentils", "protein"]
  },
  {
    id: "prd-atta-10kg",
    slug: "whole-wheat-atta-10kg",
    title: "Whole Wheat Atta 10kg",
    description: "Stone-ground wheat flour for soft chapati and roti.",
    category: "Groceries",
    subcategory: "Flour",
    price: 38,
    discountPercent: 7,
    currency: "AED",
    rating: 4.6,
    reviewCount: 664,
    inStock: true,
    stockQty: 120,
    popularity: 88,
    images: SUBCATEGORY_IMAGES.flour,
    seller: defaultSeller,
    tags: ["flour", "daily-use"]
  },
  {
    id: "prd-spice-combo",
    slug: "south-indian-spice-combo",
    title: "South Indian Spice Combo Pack",
    description: "Curated spice essentials for authentic home cooking.",
    category: "Groceries",
    subcategory: "Spices",
    price: 24.99,
    discountPercent: 15,
    currency: "AED",
    rating: 4.7,
    reviewCount: 438,
    inStock: true,
    stockQty: 72,
    popularity: 90,
    images: SUBCATEGORY_IMAGES.spices,
    seller: defaultSeller,
    tags: ["spices", "combo", "offer"]
  },
  {
    id: "prd-sunflower-oil-5l",
    slug: "sunflower-cooking-oil-5l",
    title: "Sunflower Cooking Oil 5L",
    description: "Light and healthy cooking oil for everyday frying.",
    category: "Groceries",
    subcategory: "Cooking Oil",
    price: 31.5,
    discountPercent: 11,
    currency: "AED",
    rating: 4.3,
    reviewCount: 302,
    inStock: true,
    stockQty: 95,
    popularity: 84,
    images: SUBCATEGORY_IMAGES["cooking-oil"],
    seller: defaultSeller,
    tags: ["cooking-oil", "groceries"]
  },
  {
    id: "prd-filter-coffee",
    slug: "classic-filter-coffee-500g",
    title: "Classic Filter Coffee 500g",
    description: "Bold roasted coffee blend with chicory.",
    category: "Groceries",
    subcategory: "Coffee & Tea",
    price: 18.25,
    discountPercent: 5,
    currency: "AED",
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stockQty: 130,
    popularity: 77,
    images: SUBCATEGORY_IMAGES["coffee-tea"],
    seller: defaultSeller,
    tags: ["coffee", "beverages"]
  }
];

const globalState = globalThis as typeof globalThis & {
  __PMMODERN_LOCAL_API_STATE__?: LocalApiState;
};

function hashPassword(password: string) {
  return createHash("sha256").update(`pmmodern:${password}`).digest("hex");
}

function createInitialState(): LocalApiState {
  return {
    users: [
      {
        id: "usr-1",
        name: "Demo User",
        email: "demo@pmmodern.com",
        passwordHash: hashPassword("Password123!"),
        createdAt: new Date().toISOString()
      }
    ],
    carts: new Map<string, CartItem[]>(),
    orders: [
      {
        id: "ord-1001",
        userId: "usr-1",
        status: "delivered",
        total: 132.8,
        createdAt: "2026-02-10T09:00:00.000Z",
        items: [
          {
            id: "line-1",
            productId: "prd-basmati-5kg",
            title: "Royal Basmati Rice 5kg",
            quantity: 2,
            unitPrice: 37.4
          },
          {
            id: "line-2",
            productId: "prd-spice-combo",
            title: "South Indian Spice Combo Pack",
            quantity: 1,
            unitPrice: 21.24
          }
        ]
      }
    ]
  };
}

const state = globalState.__PMMODERN_LOCAL_API_STATE__ ?? createInitialState();
globalState.__PMMODERN_LOCAL_API_STATE__ = state;

function toPublicUser(user: UserRecord): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function parseBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

const jwtSecret = process.env.JWT_SECRET ?? "pmmodern-local-jwt-secret";
const jwtExpirySeconds = 60 * 60 * 24 * 7;

function signJwt(userId: string) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + jwtExpirySeconds
    })
  );
  const signature = createHmac("sha256", jwtSecret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function verifyJwt(token: string): { userId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expected = createHmac("sha256", jwtSecret).update(`${header}.${payload}`).digest("base64url");
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(parseBase64Url(payload)) as { userId: string; exp?: number };
    if (!parsed.userId) return null;
    if (typeof parsed.exp === "number" && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}

function getAuthUser(request: NextRequest): UserRecord | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  return state.users.find((user) => user.id === payload.userId) ?? null;
}

function normalizedPrice(product: Product): number {
  return product.price * (1 - product.discountPercent / 100);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listProducts(filters: {
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: "in_stock" | "all";
  sort?: "popularity" | "price_asc" | "price_desc" | "best_rated";
}) {
  const { q, category, priceMin, priceMax, rating, availability = "all", sort = "popularity" } = filters;
  let result = [...products];

  if (q) {
    const keyword = q.toLowerCase();
    result = result.filter((product) => {
      const haystack = [
        product.title,
        product.description,
        product.category,
        product.subcategory,
        ...product.tags
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }

  if (category) {
    const normalized = category.toLowerCase();
    result = result.filter(
      (product) =>
        product.category.toLowerCase() === normalized ||
        product.subcategory.toLowerCase() === normalized ||
        slugify(product.category) === normalized ||
        slugify(product.subcategory) === normalized
    );
  }

  if (typeof priceMin === "number" && Number.isFinite(priceMin)) {
    result = result.filter((product) => normalizedPrice(product) >= priceMin);
  }
  if (typeof priceMax === "number" && Number.isFinite(priceMax)) {
    result = result.filter((product) => normalizedPrice(product) <= priceMax);
  }
  if (typeof rating === "number" && Number.isFinite(rating)) {
    result = result.filter((product) => product.rating >= rating);
  }
  if (availability === "in_stock") {
    result = result.filter((product) => product.inStock);
  }

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => normalizedPrice(a) - normalizedPrice(b));
      break;
    case "price_desc":
      result.sort((a, b) => normalizedPrice(b) - normalizedPrice(a));
      break;
    case "best_rated":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
    default:
      result.sort((a, b) => b.popularity - a.popularity);
      break;
  }

  return result;
}

function paginate(items: Product[], pageRaw: string | null, limitRaw: string | null): ProductListResponse {
  const parsedPage = Math.max(Number(pageRaw ?? 1), 1);
  const parsedLimit = Math.min(Math.max(Number(limitRaw ?? 12), 1), 50);
  const page = Number.isFinite(parsedPage) ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) ? parsedLimit : 12;
  const start = (page - 1) * limit;
  const sliced = items.slice(start, start + limit);
  return {
    items: sliced,
    page,
    limit,
    total: items.length,
    totalPages: Math.ceil(items.length / limit)
  };
}

function relatedProducts(product: Product, limit = 6) {
  return products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

function calculateCart(items: CartItem[]): CartResponse {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.unitPrice * item.discountPercent * item.quantity) / 100,
    0
  );
  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    grandTotal: Number((subtotal - totalDiscount).toFixed(2))
  };
}

function getCartKey(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (authUser) return `user:${authUser.id}`;
  const guestToken = request.headers.get("x-cart-token");
  if (guestToken) return `guest:${guestToken}`;
  return "guest:default";
}

function getCart(cartKey: string): CartResponse {
  return calculateCart(state.carts.get(cartKey) ?? []);
}

function addCartItem(cartKey: string, productId: string, quantity: number): CartResponse {
  const product = products.find((item) => item.id === productId || item.slug === productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const current = state.carts.get(cartKey) ?? [];
  const existing = current.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    current.push({
      id: `cart-item-${Date.now()}`,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0] ?? "",
      unitPrice: product.price,
      discountPercent: product.discountPercent,
      quantity
    });
  }
  state.carts.set(cartKey, current);
  return calculateCart(current);
}

function updateCartItem(cartKey: string, itemId: string, quantity: number): CartResponse {
  const current = state.carts.get(cartKey) ?? [];
  const target = current.find((item) => item.id === itemId);
  if (!target) {
    throw new Error("Cart item not found");
  }
  target.quantity = quantity;
  const next = current.filter((item) => item.quantity > 0);
  state.carts.set(cartKey, next);
  return calculateCart(next);
}

function deleteCartItem(cartKey: string, itemId: string): CartResponse {
  const current = state.carts.get(cartKey) ?? [];
  const next = current.filter((item) => item.id !== itemId);
  state.carts.set(cartKey, next);
  return calculateCart(next);
}

function detectIntent(message: string): ShopMindIntent {
  const normalized = message.toLowerCase();
  if (normalized.includes("compare")) return "compare_products";
  if (normalized.includes("filter")) return "suggest_filters";
  if (normalized.includes("add") && normalized.includes("cart")) return "build_cart";
  if (normalized.includes("recommend") || normalized.includes("suggest")) return "recommend_products";
  return "answer_question";
}

function reasonForProduct(intent: ShopMindIntent, tags: string[]) {
  switch (intent) {
    case "compare_products":
      return "Strong balance of price, ratings, and availability.";
    case "build_cart":
      return "Fits your request and complements other grocery essentials.";
    case "suggest_filters":
      return "Matches your requested attributes and current filter intent.";
    case "recommend_products":
      return `Popular among shoppers looking for ${tags[0] ?? "similar products"}.`;
    case "answer_question":
    default:
      return "Relevant match based on product description and customer ratings.";
  }
}

function suggestFilters(message: string): Record<string, string | number | boolean> {
  const normalized = message.toLowerCase();
  if (normalized.includes("budget")) return { sort: "price_asc", priceMax: 40 };
  if (normalized.includes("premium")) return { sort: "best_rated", rating: 4.5 };
  if (normalized.includes("in stock")) return { availability: true };
  return { sort: "popularity" };
}

function buildReply(intent: ShopMindIntent, count: number) {
  switch (intent) {
    case "compare_products":
      return `I compared top options for you and found ${count} strong matches.`;
    case "build_cart":
      return `I prepared a starter cart with ${count} relevant items. Review before confirming.`;
    case "suggest_filters":
      return "These filters should narrow your results quickly.";
    case "recommend_products":
      return `Here are ${count} products aligned with your preferences.`;
    case "answer_question":
    default:
      return "I reviewed the catalog and found products that best match your question.";
  }
}

function chatWithAssistant(payload: { message: string; cartProductIds?: string[] }): ShopMindResponse {
  const intent = detectIntent(payload.message);
  const candidates = listProducts({
    q: payload.message,
    availability: "in_stock",
    sort: "popularity"
  }).slice(0, 4);

  const suggestedProducts = candidates.map((product) => ({
    id: product.id,
    title: product.title,
    price: Number((product.price * (1 - product.discountPercent / 100)).toFixed(2)),
    slug: product.slug,
    reason: reasonForProduct(intent, product.tags)
  }));

  const comparisonTable =
    intent === "compare_products"
      ? candidates.slice(0, 3).map((product) => ({
          productId: product.id,
          productTitle: product.title,
          values: {
            price: Number((product.price * (1 - product.discountPercent / 100)).toFixed(2)),
            rating: product.rating,
            inStock: product.inStock ? "Yes" : "No"
          }
        }))
      : [];

  const cartActions =
    intent === "build_cart"
      ? suggestedProducts.slice(0, 2).map((product) => ({
          action: "add" as const,
          productId: product.id,
          quantity: 1
        }))
      : [];

  return {
    intent,
    replyText: buildReply(intent, suggestedProducts.length),
    suggestedProducts,
    suggestedFilters: suggestFilters(payload.message),
    cartActions,
    comparisonTable
  };
}

function errorJson(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

async function parseBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export async function handleLocalApiRequest(request: NextRequest, path: string[]) {
  const [resource, resourceId, nested] = path;

  if (resource === "products" && request.method === "GET") {
    if (resourceId === "categories") {
      return NextResponse.json(categories);
    }

    if (resourceId) {
      const product = products.find((item) => item.id === resourceId || item.slug === resourceId);
      if (!product) return errorJson(404, "Product not found");
      return NextResponse.json({
        product,
        relatedProducts: relatedProducts(product),
        seller: product.seller
      });
    }

    const filtered = listProducts({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      category: request.nextUrl.searchParams.get("category") ?? undefined,
      priceMin: request.nextUrl.searchParams.get("priceMin")
        ? Number(request.nextUrl.searchParams.get("priceMin"))
        : undefined,
      priceMax: request.nextUrl.searchParams.get("priceMax")
        ? Number(request.nextUrl.searchParams.get("priceMax"))
        : undefined,
      rating: request.nextUrl.searchParams.get("rating")
        ? Number(request.nextUrl.searchParams.get("rating"))
        : undefined,
      availability:
        (request.nextUrl.searchParams.get("availability") as "in_stock" | "all" | null) ?? undefined,
      sort:
        (request.nextUrl.searchParams.get("sort") as
          | "popularity"
          | "price_asc"
          | "price_desc"
          | "best_rated"
          | null) ?? undefined
    });

    return NextResponse.json(
      paginate(
        filtered,
        request.nextUrl.searchParams.get("page"),
        request.nextUrl.searchParams.get("limit")
      )
    );
  }

  if (resource === "search" && request.method === "GET") {
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (!q) {
      return NextResponse.json({ suggestions: [], products: [] } satisfies SearchResponse);
    }
    const matches = listProducts({ q, sort: "popularity" });
    const suggestions = [
      ...matches.slice(0, 5).map((item) => ({
        type: "product" as const,
        label: item.title,
        slug: item.slug
      })),
      ...categories
        .flatMap((category) => [category, ...(category.children ?? [])])
        .filter((category) => category.name.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 3)
        .map((category) => ({
          type: "category" as const,
          label: category.name,
          slug: category.slug
        }))
    ];
    return NextResponse.json({
      suggestions,
      products: matches.slice(0, 20)
    } satisfies SearchResponse);
  }

  if (resource === "cart") {
    const cartKey = getCartKey(request);
    if (request.method === "GET" && !resourceId) {
      return NextResponse.json(getCart(cartKey));
    }
    if (request.method === "POST" && !resourceId) {
      const body = await parseBody<{ productId?: string; quantity?: number }>(request);
      if (!body?.productId || typeof body.quantity !== "number" || body.quantity <= 0) {
        return errorJson(400, "Invalid cart payload");
      }
      try {
        return NextResponse.json(addCartItem(cartKey, body.productId, body.quantity), { status: 201 });
      } catch (error) {
        return errorJson(404, error instanceof Error ? error.message : "Product not found");
      }
    }
    if (request.method === "PUT" && resourceId) {
      const body = await parseBody<{ quantity?: number }>(request);
      if (typeof body?.quantity !== "number" || body.quantity < 0) {
        return errorJson(400, "Invalid quantity");
      }
      try {
        return NextResponse.json(updateCartItem(cartKey, resourceId, body.quantity));
      } catch (error) {
        return errorJson(404, error instanceof Error ? error.message : "Cart item not found");
      }
    }
    if (request.method === "DELETE" && resourceId) {
      return NextResponse.json(deleteCartItem(cartKey, resourceId));
    }
  }

  if (resource === "users") {
    if (resourceId === "register" && request.method === "POST") {
      const body = await parseBody<{ name?: string; email?: string; password?: string }>(request);
      if (!body?.name || !body.email || !body.password) {
        return errorJson(400, "Invalid registration payload");
      }
      const normalizedEmail = body.email.toLowerCase().trim();
      const existing = state.users.find((user) => user.email === normalizedEmail);
      if (existing) {
        return errorJson(400, "Email already exists");
      }
      const created: UserRecord = {
        id: `usr-${Date.now()}`,
        name: body.name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(body.password),
        createdAt: new Date().toISOString()
      };
      state.users.push(created);
      return NextResponse.json(
        {
          user: toPublicUser(created),
          accessToken: signJwt(created.id)
        },
        { status: 201 }
      );
    }

    if (resourceId === "login" && request.method === "POST") {
      const body = await parseBody<{ email?: string; password?: string }>(request);
      if (!body?.email || !body.password) {
        return errorJson(400, "Invalid credentials");
      }
      const user = state.users.find((entry) => entry.email === body.email.toLowerCase().trim());
      if (!user || user.passwordHash !== hashPassword(body.password)) {
        return errorJson(400, "Invalid credentials");
      }
      return NextResponse.json({
        user: toPublicUser(user),
        accessToken: signJwt(user.id)
      });
    }

    if (resourceId === "me" && request.method === "GET") {
      const user = getAuthUser(request);
      if (!user) return errorJson(401, "Unauthorized");
      return NextResponse.json(toPublicUser(user));
    }
  }

  if (resource === "orders" && resourceId && request.method === "GET") {
    const user = getAuthUser(request);
    if (!user) return errorJson(401, "Unauthorized");
    if (user.id !== resourceId) return errorJson(403, "Forbidden");
    const userOrders = state.orders
      .filter((order) => order.userId === resourceId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return NextResponse.json(userOrders);
  }

  if (resource === "ai" && resourceId === "chat" && request.method === "POST" && !nested) {
    const body = await parseBody<{ message?: string; cartProductIds?: string[] }>(request);
    if (!body?.message || !body.message.trim()) {
      return errorJson(400, "Message is required");
    }
    return NextResponse.json(
      chatWithAssistant({
        message: body.message,
        cartProductIds: body.cartProductIds
      })
    );
  }

  return errorJson(404, "Not found");
}
