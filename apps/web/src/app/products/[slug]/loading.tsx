import { Skeleton } from "@/components/common/skeleton";

export default function ProductLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-56" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
      </div>
    </div>
  );
}
