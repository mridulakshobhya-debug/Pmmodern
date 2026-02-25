import { Skeleton } from "@/components/common/skeleton";

export default function ProductsLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Skeleton className="h-[560px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-72" />
        ))}
      </div>
    </div>
  );
}
