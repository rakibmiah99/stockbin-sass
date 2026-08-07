export type NavChild = { href: string; label: string; badge?: string }

export type NavItem = {
  id: string
  href: string
  label: string
  icon: string
  badge?: string
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  {
    id: 'orders', href: '/orders', label: 'Orders', icon: '📦', badge: '12',
    children: [
      { href: '/orders', label: 'All Orders' },
      { href: '/orders', label: 'Pending', badge: '5' },
      { href: '/orders', label: 'Shipped', badge: '7' },
      { href: '/orders', label: 'Returns' },
    ],
  },
  {
    id: 'inventory', href: '/categories', label: 'Inventory', icon: '🛍',
    children: [
      { href: '/categories', label: 'Categories' },
      { href: '/products', label: 'Products' },
      { href: '/stocks', label: 'Stock' },
      { href: '/returns', label: 'Return' },
      { href: '/wastage', label: 'Wastage' },
    ],
  },
  {
    id: 'people', href: '/customers', label: 'People', icon: '👥',
    children: [
      { href: '/customers', label: 'Customers' },
      { href: '/users', label: 'Users' },
    ],
  },
  {
    id: 'finance', href: '/expenses', label: 'Finance', icon: '🧾',
    children: [
      { href: '/expenses', label: 'Expenses' },
      { href: '/expense-categories', label: 'Categories' },
    ],
  },
  {
    id: 'analytics', href: '/analytics', label: 'Analytics', icon: '📈',
    children: [
      { href: '/analytics', label: 'Overview' },
      { href: '/analytics', label: 'Sales report' },
      { href: '/analytics', label: 'Traffic' },
    ],
  },
  { id: 'settings', href: '/settings', label: 'Settings', icon: '⚙' },
]
