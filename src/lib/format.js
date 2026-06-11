// Availability needs decimals to mean anything — 99.97 ≠ 100 — but a clean
// 100 shouldn't render as "100.00".
export function formatAvailability(pct) {
  if (pct == null || Number.isNaN(pct)) return null
  return pct >= 99.995 ? '100' : pct.toFixed(2)
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function roundOrNull(n) {
  return n == null || Number.isNaN(n) ? null : String(Math.round(n))
}
