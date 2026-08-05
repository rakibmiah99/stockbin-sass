export function formatMoney(value: string | number, symbol: string) {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
