import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WishlistPageClient } from "@/components/wishlist/wishlist-page-client";

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <WishlistPageClient />
    </div>
  );
}
