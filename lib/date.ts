export function formatDateInTimezone(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

export function getMonthStart(dateStr: string) {
  return `${dateStr.slice(0, 7)}-01`
}
