/** 金额：分 -> 元字符串 */
export function fenToYuan(fen) {
  return ((fen || 0) / 100).toFixed(2)
}

/** 金额（元）展示 */
export function money(yuan) {
  return `¥${Number(yuan || 0).toFixed(2)}`
}

/** 距离格式化 */
export function formatDistance(m) {
  if (!m && m !== 0) return ''
  if (m >= 1000) return `${(m / 1000).toFixed(1)}km`
  return `${m}m`
}

/** 月售格式化 */
export function formatSales(n) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  return `${n}`
}

export function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`
}
