import { StatsSkeleton, ListsSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-xl">
      <StatsSkeleton />
      <ListsSkeleton />
    </div>
  );
}
