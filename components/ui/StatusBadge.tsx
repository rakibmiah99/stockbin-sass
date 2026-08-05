const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Pending: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${STATUS_STYLES[status] ?? ''}`}>
      {status}
    </span>
  )
}
