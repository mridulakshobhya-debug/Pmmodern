export const PRODUCT_IMAGE_POOL: string[] = [
  "/images/Rice.jpg",
  "/images/Rice.jpg",
  "/images/Pulses.jpg",
  "/images/Pulses.jpg",
  "/images/Pulses.jpg",
  "/images/Spices.jpg",
  "/images/Spices.jpg",
  "/images/Spices.jpg",
  "/images/Spices.jpg",
  "/images/Spices.jpg",
  "/images/Spices.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Beverages.jpg",
  "/images/Flour and grains.jpg",
  "/images/Flour and grains.jpg"
];

export function pickProductImages(startIndex: number, count = 3): string[] {
  return Array.from({ length: count }).map((_, offset) => {
    const index = (startIndex + offset) % PRODUCT_IMAGE_POOL.length;
    return PRODUCT_IMAGE_POOL[index];
  });
}
