import { hashSync } from "bcryptjs";
import type { CartItem, CategoryNode, Order, Product } from "@pmmodern/shared-types";
import type { UserEntity } from "../domain/entities/user.entity.js";

const defaultSeller = {
  id: "seller-premium",
  name: "Premium Store",
  slug: "premium-store",
  rating: 4.8,
  totalReviews: 2814
};

const CURATED_GROCERY_IMAGES = {
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

const SUBCATEGORY_IMAGE_SET: Record<string, string[]> = {
  basmati: [
    CURATED_GROCERY_IMAGES.ricePack,
    CURATED_GROCERY_IMAGES.riceBowl,
    CURATED_GROCERY_IMAGES.ricePack
  ],
  "sona-masoori": [
    "/images/sona masoori2.jpg",
    "/images/sona masoori2.jpg",
    "/images/sona masoori2.jpg"
  ],
  "brown-rice": [
    "/images/organic brown rice.jpg",
    "/images/organic brown rice.jpg",
    "/images/organic brown rice.jpg"
  ],
  jasmine: [
    CURATED_GROCERY_IMAGES.ricePack,
    CURATED_GROCERY_IMAGES.riceBowl,
    CURATED_GROCERY_IMAGES.ricePack
  ],
  pulses: [
    CURATED_GROCERY_IMAGES.pulsesMoong,
    CURATED_GROCERY_IMAGES.pulsesUrad,
    CURATED_GROCERY_IMAGES.pulsesUradSplit
  ],
  lentils: [
    CURATED_GROCERY_IMAGES.pulsesUrad,
    CURATED_GROCERY_IMAGES.pulsesUradSplit,
    CURATED_GROCERY_IMAGES.pulsesMoong
  ],
  flour: [
    "/images/whole wheat atta.jpg",
    "/images/whole wheat atta.jpg",
    "/images/whole wheat atta.jpg"
  ],
  spices: [
    CURATED_GROCERY_IMAGES.spiceIdly,
    CURATED_GROCERY_IMAGES.spiceKulambu,
    CURATED_GROCERY_IMAGES.spiceDryChilli
  ],
  "cooking-oil": [
    CURATED_GROCERY_IMAGES.oilSunflower,
    CURATED_GROCERY_IMAGES.oilGroundnut,
    CURATED_GROCERY_IMAGES.oilSesame
  ],
  "coffee-tea": [
    CURATED_GROCERY_IMAGES.coffeeSaudi,
    CURATED_GROCERY_IMAGES.teaBlack,
    CURATED_GROCERY_IMAGES.teaMint
  ]
};

export const categories: CategoryNode[] = [
  {
    id: "cat-groceries",
    name: "Groceries",
    slug: "groceries",
    children: [
      { id: "cat-rice", name: "Rice", slug: "rice" },
      { id: "cat-basmati", name: "Basmati", slug: "basmati" },
      { id: "cat-sona-masoori", name: "Sona Masoori", slug: "sona-masoori" },
      { id: "cat-brown-rice", name: "Brown Rice", slug: "brown-rice" },
      { id: "cat-jasmine", name: "Jasmine", slug: "jasmine" },
      { id: "cat-pulses", name: "Pulses", slug: "pulses" },
      { id: "cat-lentils", name: "Lentils", slug: "lentils" },
      { id: "cat-flour", name: "Flour", slug: "flour" },
      { id: "cat-spices", name: "Spices", slug: "spices" },
      { id: "cat-cooking-oil", name: "Cooking Oil", slug: "cooking-oil" },
      { id: "cat-coffee-tea", name: "Coffee & Tea", slug: "coffee-tea" }
    ]
  }
];

export const products: Product[] = [
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
    images: SUBCATEGORY_IMAGE_SET.basmati,
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
    price: 34.0,
    discountPercent: 8,
    currency: "AED",
    rating: 4.6,
    reviewCount: 321,
    inStock: true,
    stockQty: 180,
    popularity: 94,
    images: SUBCATEGORY_IMAGE_SET["sona-masoori"],
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
    images: SUBCATEGORY_IMAGE_SET["brown-rice"],
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
    images: SUBCATEGORY_IMAGE_SET.jasmine,
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
    images: SUBCATEGORY_IMAGE_SET.pulses,
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
    images: SUBCATEGORY_IMAGE_SET.lentils,
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
    images: SUBCATEGORY_IMAGE_SET.flour,
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
    images: SUBCATEGORY_IMAGE_SET.spices,
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
    images: SUBCATEGORY_IMAGE_SET["cooking-oil"],
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
    images: SUBCATEGORY_IMAGE_SET["coffee-tea"],
    seller: defaultSeller,
    tags: ["coffee", "beverages"]
  }
];

export const users: UserEntity[] = [
  {
    id: "usr-1",
    name: "Demo User",
    email: "demo@pmmodern.com",
    passwordHash: hashSync("Password123!", 10),
    createdAt: new Date().toISOString()
  }
];

export const wishlists = new Map<string, string[]>();

export const carts = new Map<string, CartItem[]>();

export const orders: Order[] = [
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
];
