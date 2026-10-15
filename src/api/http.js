import { mockDispatch } from './mock/server'

/**
 * 统一 HTTP 客户端（fetch 实现）。
 * - dev 默认走 mock（见 .env VITE_USE_MOCK）
 * - 支持请求/响应拦截器、超时、统一响应体解包
 * - 统一响应体约定：{ code: 0, data, message }，code===0 视为成功
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE || ''
const DEFAULT_TIMEOUT = 12000

export class ApiError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const interceptors = { request: [], response: [] }

export function onRequest(fn) {
  interceptors.request.push(fn)
}
export function onResponse(fn) {
  interceptors.response.push(fn)
}

async function applyRequestInterceptors(config) {
  let cfg = config
  for (const fn of interceptors.request) {
    cfg = (await fn(cfg)) || cfg
  }
  return cfg
}

async function applyResponseInterceptors(payload) {
  let result = payload
  for (const fn of interceptors.response) {
    result = (await fn(result)) || result
  }
  return result
}

function buildQuery(params) {
  if (!params) return ''
  const sp = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    const val = params[key]
    if (val === undefined || val === null || val === '') return
    if (Array.isArray(val)) {
      val.forEach((v) => sp.append(`${key}[]`, v))
    } else {
      sp.append(key, val)
    }
  })
  const str = sp.toString()
  return str ? `?${str}` : ''
}

async function realRequest(config) {
  const url = `${API_BASE}${config.url}${buildQuery(config.params)}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeout || DEFAULT_TIMEOUT)

  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
  if (config.headers) Object.assign(headers, config.headers)

  try {
    const res = await fetch(url, {
      method: config.method,
      headers,
      credentials: 'include',
      signal: controller.signal,
      body: config.data ? JSON.stringify(config.data) : undefined
    })
    if (!res.ok) {
      throw new ApiError(`网络错误（${res.status}）`, res.status)
    }
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('请求超时，请稍后重试', -1)
    }
    throw err instanceof ApiError ? err : new ApiError(err.message || '网络异常', -2)
  } finally {
    clearTimeout(timer)
  }
}

function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    if (payload.code === 0) return payload.data
    throw new ApiError(payload.message || '请求失败', payload.code)
  }
  return payload
}

export async function request(config) {
  const finalConfig = await applyRequestInterceptors({
    method: 'GET',
    params: {},
    data: null,
    timeout: DEFAULT_TIMEOUT,
    ...config
  })

  let payload = USE_MOCK ? await mockDispatch(finalConfig) : await realRequest(finalConfig)
  payload = await applyResponseInterceptors(payload)
  return unwrap(payload)
}

export const http = {
  get: (url, params, cfg) => request({ ...cfg, method: 'GET', url, params }),
  post: (url, data, cfg) => request({ ...cfg, method: 'POST', url, data }),
  put: (url, data, cfg) => request({ ...cfg, method: 'PUT', url, data }),
  del: (url, params, cfg) => request({ ...cfg, method: 'DELETE', url, params })
}

export const usingMock = USE_MOCK

// 默认导出 http 客户端（与各模块 `import http from '../http'` 的约定保持一致）
export default http
