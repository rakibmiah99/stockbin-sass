import type { ReactNode } from 'react'

export function AuthLayout({ children, title, sub }: { children: ReactNode; title: string; sub: string }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A7C6E 0%, #064E45 60%, #031E1B 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-800 text-lg">S</div>
            <span className="text-white font-700 text-xl">ShopDash</span>
          </div>
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-white/80 text-sm mb-8">
              ✦ Trusted by 12,000+ merchants
            </div>
            <h2 className="text-4xl font-800 text-white leading-tight mb-4">
              Everything you need to<br />run your shop, simply.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Track orders, manage inventory, and grow your revenue from one beautiful dashboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ v: '$2.4M', l: 'GMV this month' }, { v: '98.2%', l: 'Uptime SLA' }, { v: '4.8★', l: 'Merchant rating' }].map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-white font-700 text-xl mb-1">{s.v}</div>
                <div className="text-white/50 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-800">S</div>
            <span className="font-700 text-lg text-foreground">ShopDash</span>
          </div>
          <h1 className="text-2xl font-700 text-foreground mb-1">{title}</h1>
          <p className="text-muted-foreground text-sm mb-8">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
