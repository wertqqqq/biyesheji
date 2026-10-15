<template>
  <div class="detail">
    <div v-if="loading" class="detail__loading">
      <loading-block text="店铺加载中…" />
    </div>
    <error-block v-else-if="error" :text="error" @retry="reload" />

    <template v-else-if="shop">
      <shop-hero
        :shop="shop"
        :show-activities="showActivities"
        @back="back"
        @toggle-activities="(v) => (showActivities = v)"
      />

      <nav class="detail__tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          class="detail__tab"
          :class="{ 'is-active': activeTab === t.key }"
          @click="activeTab = t.key"
        >
          {{ t.label }}
        </button>
      </nav>

      <div class="detail__content">
        <menu-panel
          v-if="activeTab === 'menu' && menu.length"
          :menu="menu"
          :count-of="countOf"
          @add="onAdd"
          @dec="onDec"
          @food-click="goFood"
        />
        <empty-block
          v-else-if="activeTab === 'menu' && !menu.length"
          icon="📜"
          text="该店暂未上架商品"
        />

        <div v-else-if="activeTab === 'rating'" class="detail__scroll">
          <rating-panel :shop-id="shop.id" />
        </div>

        <div v-else-if="activeTab === 'info'" class="detail__scroll">
          <div class="info">
            <h3 class="info__title">{{ shop.name }}</h3>
            <div class="info__rows">
              <div class="info__row"><span class="info__label"><icon-img name="dingwei" size="sm" /> 地址</span><span class="info__val">{{ shop.address }}</span></div>
              <div class="info__row"><span class="info__label">⏰ 营业时间</span><span class="info__val">09:00 - 22:00</span></div>
              <div class="info__row"><span class="info__label">📞 电话</span><span class="info__val">{{ shop.phone }}</span></div>
            </div>
            <button type="button" class="info__safe" @click="goSafe">
              🛡 查看资质与安全须知
              <span aria-hidden="true">›</span>
            </button>
            <div class="info__announce">
              <h4>商家公告</h4>
              <p>{{ shop.announcement }}</p>
            </div>
          </div>
        </div>
      </div>

      <cart-bar
        :count="count"
        :total="total"
        :min="shop.minOrderAmount"
        :delivery-fee="shop.deliveryFee"
        :items="cartItems"
        :list-open="cartListOpen"
        @toggle-list="toggleList"
        @clear="clearCart"
        @inc="onCartInc"
        @dec="onCartDec"
        @checkout="goCheckout"
      />
    </template>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import { useRequest } from '@/composables/useRequest'
import ShopHero from '@/components/business/ShopHero.vue'
import MenuPanel from '@/components/business/MenuPanel.vue'
import RatingPanel from '@/components/business/RatingPanel.vue'
import CartBar from '@/components/business/CartBar.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'ShopDetailView',
  components: { ShopHero, MenuPanel, RatingPanel, CartBar, LoadingBlock, ErrorBlock, EmptyBlock, IconImg },
  setup() {
    const id = router.currentRoute.params.id
    const latitude = store.getters['location/latitude']
    const longitude = store.getters['location/longitude']

    const activeTab = ref('menu')
    const showActivities = ref(false)
    const cartListOpen = ref(false)

    const { data: shop, loading, error, run: reload } = useRequest(() =>
      shopApi.detail(id, latitude, longitude)
    )
    const { data: menu } = useRequest(() => shopApi.menu(id), { initialData: [] })

    const count = computed(() => store.getters['cart/totalCount'](id))
    const total = computed(() => store.getters['cart/totalPrice'](id))
    const cartItems = computed(() => {
      const cart = store.getters['cart/cartOf'](id)
      return cart ? Object.values(cart.items) : []
    })

    function countOf(foodId) {
      return store.getters['cart/foodCount'](id, foodId)
    }

    function onAdd({ event, food }) {
      if (!shop.value) return
      store.dispatch('cart/addFood', { shop: shop.value, food })
      const origin = event && event.target
      flyToCart(origin)
    }
    function onDec(food) {
      store.dispatch('cart/decreaseFood', { shopId: id, foodId: food.id })
    }
    function onCartInc(item) {
      if (!shop.value) return
      store.dispatch('cart/addFood', { shop: shop.value, food: item })
    }
    function onCartDec(item) {
      store.dispatch('cart/decreaseFood', { shopId: id, foodId: item.id })
    }

    function flyToCart(originEl) {
      const targetEl = document.querySelector('.cartbar__checkout')
      if (!originEl || !targetEl || typeof originEl.animate !== 'function') return
      const o = originEl.getBoundingClientRect()
      const c = targetEl.getBoundingClientRect()
      const dot = document.createElement('div')
      dot.className = 'fly-dot'
      dot.style.left = `${o.left + o.width / 2}px`
      dot.style.top = `${o.top + o.height / 2}px`
      document.body.appendChild(dot)
      const dx = c.left + c.width / 2 - (o.left + o.width / 2)
      const dy = c.top + c.height / 2 - (o.top + o.height / 2)
      const anim = dot.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx * 0.5}px, ${dy - 90}px) scale(0.85)`, offset: 0.55, opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.3 }
        ],
        { duration: 520, easing: 'cubic-bezier(0.25,-0.2,0.7,1)' }
      )
      anim.onfinish = () => dot.remove()
      anim.oncancel = () => dot.remove()
    }

    function toggleList() {
      if (count.value > 0) cartListOpen.value = !cartListOpen.value
    }
    function clearCart() {
      store.dispatch('cart/clearCart', id)
      cartListOpen.value = false
    }
    function goCheckout() {
      cartListOpen.value = false
      router.push(`/checkout?shop=${id}`)
    }
    function goFood(food) {
      router.push(`/shops/${id}/food/${food.id}`)
    }
    function goSafe() {
      router.push(`/shops/${id}/safe`)
    }
    function back() {
      if (window.history.length > 1) router.back()
      else router.replace('/home')
    }

    const tabs = [
      { key: 'menu', label: '点餐' },
      { key: 'rating', label: '评价' },
      { key: 'info', label: '商家' }
    ]

    return {
      shop,
      menu,
      loading,
      error,
      reload,
      activeTab,
      tabs,
      showActivities,
      count,
      total,
      cartItems,
      cartListOpen,
      countOf,
      onAdd,
      onDec,
      onCartInc,
      onCartDec,
      toggleList,
      clearCart,
      goCheckout,
      goFood,
      goSafe,
      back
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-page;
}
.detail__loading {
  flex: 1;
  @include flex-center;
}

.detail__tabs {
  display: flex;
  gap: $space-xs;
  padding: $space-md $content-pad 0;
  background: $bg-card;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}
.detail__tab {
  position: relative;
  padding: 10px $space-lg;
  @include sc(14, $text-body);
  border-radius: $radius-md $radius-md 0 0;
  border-bottom: 2px solid transparent;
  transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;
  &:hover {
    color: $text-title;
    background: $bg-hover;
  }
  &.is-active {
    color: $color-primary;
    font-weight: 700;
    border-bottom-color: $color-primary;
  }
}

.detail__content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.detail__scroll {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: $space-lg $content-pad $space-2xl;
}

.info {
  max-width: 880px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
  &__title {
    grid-column: 1 / -1;
    @include sc(20, $text-title);
    font-weight: 700;
  }
  &__rows {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: $space-md $card-pad;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;
  }
  &__row {
    display: flex;
    gap: $space-md;
    padding: $space-md 0;
    @include sc(14, $text-body);
    border-bottom: 1px solid $border-color;
    &:last-child {
      border-bottom: none;
    }
  }
  &__label {
    color: $text-secondary;
    white-space: nowrap;
  }
  &__val {
    flex: 1;
    text-align: right;
  }
  &__safe {
    @include flex-between;
    width: 100%;
    margin-top: $space-lg;
    padding: $space-md $card-pad;
    @include sc(14, $color-primary);
    font-weight: 600;
    background: $color-primary-soft;
    border: 1px solid rgba(255, 83, 57, 0.18);
    border-radius: $radius-lg;
    grid-column: 1 / -1;
    &:hover {
      background: $color-primary-100;
    }
  }
  &__announce {
    padding: $card-pad;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;
    h4 {
      @include sc(15, $text-title);
      margin-bottom: $space-sm;
    }
    p {
      @include sc(14, $text-secondary);
      line-height: 1.7;
    }
  }
}
</style>

<style lang="scss">
/* 全局：加购飞入小球（脱离 scoped，挂到 body） */
.fly-dot {
  position: fixed;
  z-index: 999;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff5a3c, #ef4526);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
