<template>
  <div class="orders">
    <header class="orders__head">
      <div>
        <h2 class="orders__title">我的订单</h2>
        <p class="orders__sub">查看历史订单与当前进度</p>
      </div>
      <button type="button" class="orders__go" @click="$router.push('/shops')">去点餐 ›</button>
    </header>

    <div v-if="!isLoggedIn" class="orders__guest">
      <empty-block icon="🔐" text="登录后查看订单" subtext="快去登录看看你都吃了啥">
        <app-button type="primary" size="sm" @click="$router.push('/login')">去登录</app-button>
      </empty-block>
    </div>

    <div v-else ref="scrollEl" class="orders__scroll">
      <div v-if="initialLoading" class="orders__state"><loading-block text="订单加载中…" /></div>
      <error-block v-else-if="error && !list.length" :text="error" @retry="refresh" />
      <empty-block
        v-else-if="!list.length"
        icon="dingdan"
        text="还没有订单"
        subtext="下一单就现在"
      >
        <app-button type="primary" size="sm" @click="$router.replace('/shops')">去点餐</app-button>
      </empty-block>

      <template v-else>
        <div class="orders__grid">
          <article v-for="o in list" :key="o.id" class="order" @click="goDetail(o)">
            <div class="order__head">
              <span class="order__shop ellipsis">{{ o.shopImage }} {{ o.shopName }}</span>
              <span class="order__status">{{ o.status }}</span>
            </div>
            <p class="order__foods ellipsis-2">{{ foodsText(o) }}</p>
            <div class="order__foot">
              <span class="order__time">{{ o.timeAgo }}</span>
              <span class="order__total">实付 ¥{{ o.total.toFixed(2) }}</span>
            </div>
          </article>
        </div>
        <div class="orders__more">
          <loading-block v-if="loading" inline text="加载更多…" />
          <p v-else-if="finished" class="orders__end">— 没有更多订单了 —</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { orderApi } from '@/api/modules/order'
import { useInfiniteList } from '@/composables/useInfiniteList'
import AppButton from '@/components/base/AppButton.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'OrderListView',
  components: { AppButton, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const scrollEl = ref(null)
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const userId = computed(() => store.getters['user/userId'])

    const list = useInfiniteList(({ offset, limit }) =>
      orderApi.list(userId.value, offset, limit)
    )

    onMounted(() => {
      if (isLoggedIn.value) list.refresh()
      if (scrollEl.value) scrollEl.value.addEventListener('scroll', onScroll)
    })
    onUnmounted(() => {
      if (scrollEl.value) scrollEl.value.removeEventListener('scroll', onScroll)
    })

    function onScroll() {
      const el = scrollEl.value
      if (!el) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) list.loadMore()
    }
    function foodsText(o) {
      return (o.foods || []).map((f) => `${f.name} x${f.quantity}`).join('、')
    }
    function goDetail(o) {
      router.push(`/orders/${o.id}`)
    }
    function back() {
      if (window.history.length > 1) router.back()
      else router.replace('/home')
    }

    return { scrollEl, isLoggedIn, ...list, onScroll, foodsText, goDetail, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.orders {
  min-height: 100%;
  background: $bg-page;
  padding: $space-lg $content-pad $space-2xl;
  max-width: 1280px;
}
.orders__head {
  @include flex-between;
  margin-bottom: $space-lg;
}
.orders__title {
  @include sc(22, $text-title);
  font-weight: 700;
}
.orders__sub {
  margin-top: $space-xs;
  @include sc(13, $text-secondary);
}
.orders__go {
  padding: 8px 16px;
  @include sc(13, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-pill;
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}
.orders__guest {
  padding-top: rem(80);
}
.orders__scroll {
  min-height: 0;
}
.orders__state {
  padding-top: rem(60);
}

.orders__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: $space-lg;
  align-items: start;
}

.order {
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  cursor: pointer;
  @include hover-lift;
  &__head {
    @include flex-between;
    gap: $space-md;
    padding-bottom: $space-md;
    border-bottom: 1px solid $border-color;
  }
  &__shop {
    @include sc(16, $text-title);
    font-weight: 600;
  }
  &__status {
    @include sc(13, $color-primary);
    font-weight: 600;
    white-space: nowrap;
    padding: 3px 10px;
    background: $color-primary-soft;
    border-radius: $radius-pill;
  }
  &__foods {
    margin: $space-md 0;
    @include sc(14, $text-secondary);
    line-height: 1.6;
    min-height: 44px;
  }
  &__foot {
    @include flex-between;
    @include sc(13, $text-placeholder);
  }
  &__total {
    @include sc(17, $text-title);
    font-weight: 700;
  }
}

.orders__more {
  padding: $space-lg 0;
  text-align: center;
}
.orders__end {
  @include sc(13, $text-placeholder);
}
</style>
