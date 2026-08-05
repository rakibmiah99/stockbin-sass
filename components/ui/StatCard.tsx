export function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub: string; icon: string; accent: string
}) {
  return (
    <div className="bg-card text-card-foreground rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <span className={`text-xl ${accent} w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: 'color-mix(in srgb, currentColor 12%, transparent)' }}>
          {icon}
        </span>
      </div>
      <div className="text-2xl font-700 mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}
