import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { fetchProductDetails } from "@/lib/api-client/catalog";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const data = await fetchProductDetails(params.slug);
    return {
      title: `${data.product.title} | PMModern`,
      description: data.product.description
    };
  } catch {
    return {
      title: "Product | PMModern"
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const data = await fetchProductDetails(params.slug);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.product.title,
      description: data.product.description,
      image: data.product.images,
      offers: {
        "@type": "Offer",
        priceCurrency: data.product.currency,
        price: Number((data.product.price * (1 - data.product.discountPercent / 100)).toFixed(2)),
        availability: data.product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.product.rating,
        reviewCount: data.product.reviewCount
      }
    };

    return (
      <div className="space-y-4">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: data.product.title }
          ]}
        />
        <ProductDetailView product={data.product} relatedProducts={data.relatedProducts} />
      </div>
    );
  } catch {
    notFound();
  }
}
