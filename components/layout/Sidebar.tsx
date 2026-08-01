"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Boxes, ShoppingCart, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-sm border-b border-divider px-lg">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
          S
        </span>
        <span className="text-h5 font-semibold text-foreground">Stockbin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-xs p-md">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-sm rounded-md px-base py-sm text-body font-medium transition-colors duration-[var(--motion-duration-fast)]",
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
