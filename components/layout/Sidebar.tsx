"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Boxes, ShoppingCart, BarChart3, Users, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/api/auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/dashboard/settings", label: "Shop Settings", icon: Settings },
];

export function Sidebar({ role }: { role?: UserRole }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin");

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-sm border-b border-divider px-lg">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
          S
        </span>
        <span className="text-h5 font-semibold text-foreground">Stockbin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-xs p-md">
        {items.map((item) => {
          const active =
            item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
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
