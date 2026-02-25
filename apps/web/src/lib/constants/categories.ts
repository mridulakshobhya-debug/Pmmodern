import type { CategoryNode } from "@pmmodern/shared-types";

export const REQUIRED_CATEGORIES: CategoryNode[] = [
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
