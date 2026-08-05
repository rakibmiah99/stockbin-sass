export type RevenuePoint = { month: string; revenue: number; orders: number }

export const revenueData: RevenuePoint[] = [
  { month: 'Jan', revenue: 42000, orders: 320 },
  { month: 'Feb', revenue: 38000, orders: 290 },
  { month: 'Mar', revenue: 55000, orders: 410 },
  { month: 'Apr', revenue: 47000, orders: 360 },
  { month: 'May', revenue: 63000, orders: 490 },
  { month: 'Jun', revenue: 58000, orders: 440 },
  { month: 'Jul', revenue: 72000, orders: 560 },
  { month: 'Aug', revenue: 68000, orders: 520 },
]

export type Order = {
  id: string
  customer: string
  product: string
  amount: number
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Pending'
  date: string
}

export const recentOrders: Order[] = [
  { id: '#ORD-8821', customer: 'Amara Osei', product: 'Sony WH-1000XM5', amount: 349.99, status: 'Delivered', date: 'Aug 3, 2026' },
  { id: '#ORD-8820', customer: 'Lena Fischer', product: 'Nike Air Max 270', amount: 149.99, status: 'Processing', date: 'Aug 3, 2026' },
  { id: '#ORD-8819', customer: 'Ravi Menon', product: 'iPad Pro 12.9"', amount: 1099.00, status: 'Shipped', date: 'Aug 2, 2026' },
  { id: '#ORD-8818', customer: 'Sofia Alvarez', product: 'Dyson V15 Vacuum', amount: 749.99, status: 'Delivered', date: 'Aug 2, 2026' },
  { id: '#ORD-8817', customer: "James O'Brien", product: "Levi's 501 Jeans", amount: 89.99, status: 'Pending', date: 'Aug 1, 2026' },
]
