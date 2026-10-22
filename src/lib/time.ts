const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' })

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export function timeAgo(date: Date) {
  const diff = date.getTime() - Date.now()
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return 'just now'
}

export function formatDateTime(date: Date) {
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
