import Link from "next/link";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { APP_BADGES } from "@/lib/constants/product-visuals";

export function GlobalFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] py-12">
      <div className="container-shell grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-10 w-10 flex-shrink-0">
              <ImageWithFallback
                src="/logo.svg"
                alt="PM Modern Logo"
                className="h-full w-full"
                width={40}
                height={40}
              />
            </div>
            <h3 className="text-lg font-bold text-emeraldGlow-700 dark:text-emeraldGlow-300">PMMODERN</h3>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Premium groceries delivered fresh across UAE.
          </p>
          <div className="mt-4 text-xs text-[var(--muted)]">
            <p className="font-semibold text-foreground">PM MODERN GENERAL TRADING FZ-LLC</p>
            <p className="mt-1">FOB50736</p>
            <p>Compass Building, Al Shohada Road</p>
            <p>Al Hamra Industrial Zone-FZ</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <Link href="/">About</Link>
            <br />
            <Link href="/">Careers</Link>
            <br />
            <Link href="/">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Support</h4>
          <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <Link href="/">Shipping</Link>
            <br />
            <Link href="/">Returns</Link>
            <br />
            <Link href="/">FAQ</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Newsletter</h4>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Get weekly offers and new arrivals.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <ImageWithFallback
              src={APP_BADGES.android}
              alt="Google Play"
              className="h-9 w-auto rounded-md"
              width={132}
              height={40}
            />
            <ImageWithFallback
              src={APP_BADGES.ios}
              alt="App Store"
              className="h-9 w-auto rounded-md"
              width={132}
              height={40}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
