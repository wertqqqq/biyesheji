import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'node:url'

/**
 * 数据来源由 .env 的 VITE_USE_MOCK 决定：
 * - true  -> 走本地 mock（src/api/mock）
 * - false -> 请求真实后端（Spring Boot，见 server/）
 *
 * VITE_API_BASE 说明：
 * - 留空：前端请求相对路径（/shops…），由下面的 server.proxy 转发到后端（同源，最稳）
 * - 填写完整地址（如 http://localhost:9090）：前端直连后端（走 CORS）
 */
const DEFAULT_API_TARGET = 'http://localhost:9090'

// 前端 endpoints.js 使用的接口根路径（后端路径本身不带 /api 前缀）
const API_PREFIXES = [
  '/api',
  '/cities',
  '/places',
  '/location',
  '/shops',
  '/auth',
  '/user',
  '/users',
  '/carts',
  '/payments',
  '/content',
  '/member'
]

export default defineConfig(({ mode }) => {
  // 注意：vite.config.js 里的 process.env 不会自动读取 .env，必须用 loadEnv
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_BASE || DEFAULT_API_TARGET

  const proxy = {}
  for (const prefix of API_PREFIXES) {
    proxy[prefix] = {
      target,
      changeOrigin: true,
      // /api 只是可选兼容前缀，转发时去掉；其余路径原样转发
      rewrite: (path) => (path.startsWith('/api') ? path.replace(/^\/api/, '') : path)
    }
  }

  return {
    plugins: [vue()],
    resolve: {
      extensions: ['.mjs', '.js', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
      }
    },
    server: {
      port: 8080,
      host: true,
      proxy
    }
  }
})
