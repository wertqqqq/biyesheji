import { ref } from 'vue'

/**
 * 统一请求状态：loading / error / data。
 * @param {(...args:any)=>Promise<any>} fetcher
 * @param {{immediate?:boolean, initialData?:any}} options
 */
export function useRequest(fetcher, options = {}) {
  const { immediate = true, initialData = null } = options
  const data = ref(initialData)
  const loading = ref(false)
  const error = ref('')

  async function run(...args) {
    loading.value = true
    error.value = ''
    try {
      data.value = await fetcher(...args)
    } catch (e) {
      error.value = (e && e.message) || '加载失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  if (immediate) run()

  return { data, loading, error, run }
}
