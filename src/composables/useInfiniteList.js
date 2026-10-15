import { ref } from 'vue'

/**
 * 无限滚动列表：offset 累加、hasMore、刷新 / 加载更多。
 * @param {(query:{offset:number,limit:number,...any})=>Promise<{list:Array,hasMore:boolean}>} fetcher
 * @param {{pageSize?:number, extraParams?:Object}} options
 */
export function useInfiniteList(fetcher, options = {}) {
  const { pageSize = 20, extraParams = {} } = options
  const list = ref([])
  const loading = ref(false)
  const initialLoading = ref(true)
  const error = ref('')
  const finished = ref(false)
  const offset = ref(0)

  async function load(isReset) {
    if (loading.value) return
    if (!isReset && finished.value) return
    loading.value = true
    error.value = ''
    try {
      const currentOffset = isReset ? 0 : offset.value
      const res = await fetcher({ offset: currentOffset, limit: pageSize, ...extraParams })
      const items = (res && res.list) || []
      list.value = isReset ? items : list.value.concat(items)
      offset.value = currentOffset + items.length
      finished.value = !(res && res.hasMore)
    } catch (e) {
      error.value = (e && e.message) || '加载失败，请稍后重试'
    } finally {
      loading.value = false
      initialLoading.value = false
    }
  }

  function refresh() {
    return load(true)
  }
  function loadMore() {
    return load(false)
  }

  return { list, loading, initialLoading, error, finished, refresh, loadMore }
}
