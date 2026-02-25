import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index + 1 <= Math.round(rating);
        return (
          <Star
            key={index}
            className={`h-4 w-4 ${active ? "fill-softGold-500 text-softGold-500" : "text-zinc-300 dark:text-zinc-600"}`}
          />
        );
      })}
      <span className="ml-1 text-xs text-[var(--muted)]">{rating.toFixed(1)}</span>
    </div>
  );
}
