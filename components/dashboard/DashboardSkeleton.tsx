export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-surface-secondary" />
      ))}
    </div>
  );
}

export function ListsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg border border-border bg-surface-secondary" />
      ))}
    </div>
  );
}
