/** 表单校验工具 */

export const isPhone = (v) => /^1\d{10}$/.test((v || '').trim())

export const isSmsCode = (v) => /^\d{4,6}$/.test((v || '').trim())

export const minLen = (v, n) => ((v || '').trim().length >= n)

export const required = (v) => !!(v && String(v).trim().length)

/** 返回错误文案，无错返回空串 */
export function validateField(rules, value) {
  if (!rules) return ''
  if (rules.required && !required(value)) return rules.message || '该项为必填'
  if (rules.phone && value && !isPhone(value)) return '请输入正确的手机号'
  if (rules.minLen && value && !minLen(value, rules.minLen)) {
    return `至少 ${rules.minLen} 个字符`
  }
  return ''
}
