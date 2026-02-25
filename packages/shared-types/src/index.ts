export type CurrencyCode = "AED";

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
}

export interface SellerInfo {
  id: string;
  name: string;
  slug: string;
  rating: number;
  totalReviews: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  discountPercent: number;
  currency: CurrencyCode;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQty: number;
  popularity: number;
  images: string[];
  seller: SellerInfo;
  tags: string[];
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchSuggestion {
  type: "product" | "category";
  label: string;
  slug: string;
}

export interface SearchResponse {
  suggestions: SearchSuggestion[];
  products: Product[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  image: string;
  unitPrice: number;
  discountPercent: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface OrderLine {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  items: OrderLine[];
}

export type ShopMindIntent =
  | "compare_products"
  | "recommend_products"
  | "answer_question"
  | "suggest_filters"
  | "build_cart";

export interface ShopMindProductSuggestion {
  id: string;
  title: string;
  price: number;
  slug: string;
  reason: string;
}

export interface ShopMindResponse {
  intent: ShopMindIntent;
  replyText: string;
  suggestedProducts: ShopMindProductSuggestion[];
  suggestedFilters: Record<string, string | number | boolean>;
  cartActions: Array<{
    action: "add" | "remove" | "set_qty";
    productId: string;
    quantity?: number;
  }>;
  comparisonTable: Array<{
    productId: string;
    productTitle: string;
    values: Record<string, string | number>;
  }>;
}
