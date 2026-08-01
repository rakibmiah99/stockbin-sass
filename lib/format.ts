export function formatMoney(value: string | number, currencySymbol = ""): string {
  const amount = typeof value === "string" ? Number(value) : value;
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currencySymbol ? `${currencySymbol}${formatted}` : formatted;
}

export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
