import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "./providers";
import { GlobalHeader } from "@/components/layout/global-header";
import { GlobalFooter } from "@/components/layout/global-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PageTransition } from "@/components/animations/page-transition";

const ShopMindWidget = dynamic(
  () => import("@/components/ai/shopmind-widget").then((mod) => mod.ShopMindWidget),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "PMModern | Premium Groceries & Lifestyle Marketplace",
  description:
    "Premium e-commerce experience with groceries, fashion, electronics, home essentials, and school supplies."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <GlobalHeader />
          <PageTransition>
            <main className="container-shell py-6">{children}</main>
          </PageTransition>
          <GlobalFooter />
          <CartDrawer />
          <ShopMindWidget />
        </AppProviders>
      </body>
    </html>
  );
}
