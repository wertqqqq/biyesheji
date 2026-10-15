<template>
  <div class="shoplist">
    <filter-bar
      :options="options"
      :active-sort="activeSort"
      :active-filters="activeFilters"
      @sort="onSort"
      @apply="onApply"
    />

    <div ref="scrollEl" class="shoplist__scroll">
      <div v-if="initialLoading" class="shoplist__state">
        <loading-block text="正在寻找附近商家…" />
      </div>

      <error-block
        v-else-if="error && !list.length"
        :text="error"
        @retry="refresh"
      />

      <empty-block
        v-else-if="!list.length"
        icon="🏪"
        text="附近暂无符合条件的商家"
        subtext="换个城市，或调整筛选条件试试"
      />

      <template v-else>
        <div class="shoplist__list">
          <shop-card v-for="s in list" :key="s.id" :shop="s" @click="goDetail" />
        </div>
        <div class="shoplist__more">
          <loading-block v-if="loading" inline text="加载更多…" />
          <div v-else-if="error" class="shoplist__retry">
            <span>{{ error }}</span>
            <button type="button" @click="loadMore">重试</button>
          </div>
          <p v-else-if="finished" class="shoplist__end">— 已经到底啦 —</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import { useInfiniteList } from '@/composables/useInfiniteList'
import FilterBar from '@/components/business/FilterBar.vue'
import ShopCard from '@/components/business/ShopCard.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'ShopListView',
  components: { FilterBar, ShopCard, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const scrollEl = ref(null)
    const activeSort = ref('')
    const activeFilters = ref({ categoryId: '', supportIds: [], deliveryMode: '' })
    const options = ref({ categories: [], deliveryModes: [], activityAttrs: [] })

    // 来自首页分类的预选
    const presetCategory = router.currentRoute.query.category
    if (presetCategory) activeFilters.value.categoryId = String(presetCategory)

    const latitude = computed(() => store.getters['location/latitude'])
    const longitude = computed(() => store.getters['location/longitude'])
    const cityName = computed(() => store.getters['location/cityName'] || '选择城市')

    const list = useInfiniteList(
      ({ offset, limit }) =>
        shopApi.list({
          latitude: latitude.value,
          longitude: longitude.value,
          offset,
          limit,
          order_by: activeSort.value,
          category_id: activeFilters.value.categoryId,
          support_ids: activeFilters.value.supportIds,
          delivery_mode: activeFilters.value.deliveryMode
        }),
      { pageSize: 15 }
    )

    onMounted(() => {
      Promise.all([
        shopApi.categories(),
        shopApi.deliveryModes(),
        shopApi.activityAttributes()
      ]).then(([c, d, a]) => {
        options.value = { categories: c || [], deliveryModes: d || [], activityAttrs: a || [] }
      })
      if (scrollEl.value) scrollEl.value.addEventListener('scroll', onScroll)
    })

    onUnmounted(() => {
      if (scrollEl.value) scrollEl.value.removeEventListener('scroll', onScroll)
    })

    function onScroll() {
      const el = scrollEl.value
      if (!el) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
        list.loadMore()
      }
    }

    function onSort(key) {
      activeSort.value = key
      list.refresh()
    }
    function onApply(filters) {
      activeFilters.value = filters
      list.refresh()
    }
    function goDetail(shop) {
      router.push(`/shops/${shop.id}`)
    }
    function goCity() {
      router.push('/city')
    }
    function goSearch() {
      router.push('/search')
    }

    return {
      scrollEl,
      cityName,
      options,
      activeSort,
      activeFilters,
      ...list,
      onScroll,
      onSort,
      onApply,
      goDetail,
      goCity,
      goSearch
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.shoplist {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-page;
}

.shoplist__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: $space-lg $content-pad $space-2xl;
}
// 桌面端多栏网格：随窗口宽度自适应 2~4 列
.shoplist__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.shoplist__state {
  padding-top: rem(80);
}
.shoplist__more {
  padding: $space-xl 0;
  text-align: center;
}
.shoplist__end {
  @include sc(13, $text-placeholder);
}
.shoplist__retry {
  @include flex-center;
  gap: $space-md;
  @include sc(13, $text-secondary);
  button {
    @include sc(13, $color-primary);
    font-weight: 600;
    padding: 4px 12px;
    border-radius: $radius-sm;
    &:hover {
      background: $color-primary-soft;
    }
  }
}
</style>
