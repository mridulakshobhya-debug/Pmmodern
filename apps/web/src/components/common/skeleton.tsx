import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-emeraldGlow-100/60 dark:bg-ink-700/60", className)} />;
}
