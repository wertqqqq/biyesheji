<template>
  <div class="food">
    <div class="food__body">
      <aside class="food__nav">
        <p class="food__nav-title">美食分类</p>
        <div v-if="loadingCats" class="food__nav-loading"><loading-block inline /></div>
        <button
          v-for="c in categories"
          :key="c.id"
          type="button"
          class="food__nav-item"
          :class="{ 'is-active': activeId === c.id }"
          @click="selectCategory(c)"
        >
          <span class="food__nav-icon">{{ c.icon }}</span>
          <span class="food__nav-name">{{ c.name }}</span>
        </button>
      </aside>

      <div ref="scrollEl" class="food__list">
        <div class="food__list-head">
          <h3 class="food__list-title">{{ activeName }}</h3>
          <p class="food__list-sub">按分类发现附近好味道</p>
        </div>
        <div v-if="initialLoading" class="food__state"><loading-block /></div>
        <error-block v-else-if="error && !list.length" :text="error" @retry="refresh" />
        <empty-block v-else-if="!list.length" icon="plate-utensils" text="该分类下暂无商家" />
        <template v-else>
          <div class="food__grid">
            <shop-card v-for="s in list" :key="s.id" :shop="s" @click="goDetail" />
          </div>
          <div class="food__more">
            <loading-block v-if="loading" inline />
            <p v-else-if="finished" class="food__end">— 已经到底啦 —</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import { useInfiniteList } from '@/composables/useInfiniteList'
import ShopCard from '@/components/business/ShopCard.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'FoodView',
  components: { ShopCard, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const scrollEl = ref(null)
    const categories = ref([])
    const loadingCats = ref(true)
    const activeId = ref('')

    const latitude = computed(() => store.getters['location/latitude'])
    const longitude = computed(() => store.getters['location/longitude'])
    const activeName = computed(() => {
      const c = categories.value.find((x) => String(x.id) === String(activeId.value))
      return c ? c.name : '全部'
    })

    const list = useInfiniteList(
      ({ offset, limit }) =>
        shopApi.list({
          latitude: latitude.value,
          longitude: longitude.value,
          offset,
          limit,
          category_id: activeId.value
        }),
      { pageSize: 12 }
    )

    onMounted(async () => {
      try {
        categories.value = (await shopApi.categories()) || []
        if (categories.value.length) {
          activeId.value = String(categories.value[0].id)
          list.refresh()
        }
      } catch {
        /* handled by list error */
      } finally {
        loadingCats.value = false
      }
      if (scrollEl.value) scrollEl.value.addEventListener('scroll', onScroll)
    })
    onUnmounted(() => {
      if (scrollEl.value) scrollEl.value.removeEventListener('scroll', onScroll)
    })

    function selectCategory(c) {
      if (activeId.value === String(c.id)) return
      activeId.value = String(c.id)
      list.refresh()
    }
    function onScroll() {
      const el = scrollEl.value
      if (!el) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) list.loadMore()
    }
    function goDetail(shop) {
      router.push(`/shops/${shop.id}`)
    }
    function back() {
      if (window.history.length > 1) router.back()
      else router.replace('/home')
    }

    return {
      scrollEl,
      categories,
      loadingCats,
      activeId,
      activeName,
      ...list,
      selectCategory,
      goDetail,
      back
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.food {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-page;
}
.food__body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.food__nav {
  width: 180px;
  height: 100%;
  overflow-y: auto;
  background: $bg-card;
  border-right: 1px solid $border-color;
  flex-shrink: 0;
  padding: $space-lg $space-sm;
  &-title {
    padding: 0 $space-md $space-sm;
    @include sc(12, $text-placeholder);
    letter-spacing: 1px;
  }
  &-loading {
    padding: $space-md;
  }
  &-item {
    display: flex;
    align-items: center;
    gap: $space-sm;
    width: 100%;
    padding: 10px $space-md;
    border-radius: $radius-md;
    @include sc(14, $text-body);
    text-align: left;
    transition: background-color $transition-fast, color $transition-fast;
    &:hover {
      background: $bg-hover;
      color: $text-title;
    }
    &.is-active {
      background: $color-primary-soft;
      color: $color-primary;
      font-weight: 700;
    }
  }
  &-icon {
    @include sc(16, currentColor);
  }
}
.food__list {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: $space-lg $content-pad $space-2xl;
}
.food__list-head {
  @include flex-between;
  align-items: flex-end;
  margin-bottom: $space-lg;
}
.food__list-title {
  @include sc(20, $text-title);
  font-weight: 700;
}
.food__list-sub {
  @include sc(13, $text-placeholder);
}
.food__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.food__state {
  padding-top: rem(40);
}
.food__more {
  padding: $space-lg 0;
  text-align: center;
}
.food__end {
  @include sc(13, $text-placeholder);
}
</style>
