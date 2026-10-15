<template>
  <div class="checkout">
    <header class="checkout__head">
      <div>
        <h2 class="checkout__title">确认订单</h2>
        <p class="checkout__sub">核对收货信息与商品，提交后立即为您配送</p>
      </div>
      <button type="button" class="checkout__back-link" @click="back">‹ 返回商家</button>
    </header>

    <div v-if="!cart" class="checkout__empty">
      <empty-block icon="🛒" text="购物车是空的" subtext="去挑几样好吃的吧">
        <app-button type="primary" size="sm" @click="$router.replace('/shops')">去点餐</app-button>
      </empty-block>
    </div>

    <template v-else>
      <div class="checkout__layout">
        <!-- 左列：地址 / 商品 / 选项 -->
        <div class="checkout__main">
          <button type="button" class="checkout__address" @click="goChooseAddress">
            <template v-if="selectedAddress">
              <div class="checkout__address-main">
                <p class="checkout__address-name">
                  {{ selectedAddress.name }}
                  <span v-if="selectedAddress.tag" class="tag">{{ selectedAddress.tag }}</span>
                  {{ selectedAddress.phone }}
                </p>
                <p class="checkout__address-detail ellipsis-2">
                  {{ selectedAddress.address }} {{ selectedAddress.detail }}
                </p>
              </div>
            </template>
            <div v-else class="checkout__address-main checkout__address-main--empty">请选择收货地址</div>
            <span class="checkout__address-arrow" aria-hidden="true">›</span>
          </button>

          <section class="checkout__card">
            <h3 class="checkout__shop">{{ cart.shopName }}</h3>
            <div v-for="it in items" :key="it.id" class="checkout__item">
              <span class="checkout__item-name ellipsis">{{ it.name }}</span>
              <span class="checkout__item-qty">x{{ it.quantity }}</span>
              <span class="checkout__item-price">¥{{ (it.price * it.quantity).toFixed(2) }}</span>
            </div>
            <div class="checkout__fee">
              <span>餐盒费</span><span>¥{{ packingFee.toFixed(2) }}</span>
            </div>
            <div class="checkout__fee">
              <span>配送费</span><span>¥{{ cart.deliveryFee.toFixed(2) }}</span>
            </div>
          </section>

          <section class="checkout__card checkout__options">
            <button type="button" class="row" @click="$router.push('/checkout/remark')">
              <span>订单备注</span>
              <span class="row__val ellipsis">{{ remark || '选填' }} ›</span>
            </button>
            <button type="button" class="row" @click="$router.push('/checkout/invoice')">
              <span>开发票</span>
              <span class="row__val">{{ invoice ? invoiceTitle : '不需要' }} ›</span>
            </button>
            <button type="button" class="row" @click="$router.push('/checkout/payment')">
              <span>支付方式</span>
              <span class="row__val">{{ paymentLabel }} ›</span>
            </button>
          </section>
        </div>

        <!-- 右列：粘性结算摘要 -->
        <aside class="checkout__summary">
          <h3 class="checkout__summary-title">订单摘要</h3>
          <div class="checkout__summary-row">
            <span>商品合计</span><span>¥{{ goodsTotal.toFixed(2) }}</span>
          </div>
          <div class="checkout__summary-row">
            <span>餐盒费</span><span>¥{{ packingFee.toFixed(2) }}</span>
          </div>
          <div class="checkout__summary-row">
            <span>配送费</span><span>¥{{ cart.deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="checkout__summary-row checkout__summary-row--total">
            <span>合计</span><b>¥{{ total.toFixed(2) }}</b>
          </div>
          <app-button type="primary" size="lg" block :loading="submitting" @click="submit">提交订单</app-button>
          <p class="checkout__summary-note">支付方式：{{ paymentLabel }}</p>
        </aside>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { orderApi } from '@/api/modules/order'
import { accountApi } from '@/api/modules/account'
import AppButton from '@/components/base/AppButton.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'CheckoutView',
  components: { AppButton, EmptyBlock },
  setup() {
    const shopId = router.currentRoute.query.shop
    const submitting = ref(false)
    const addresses = ref([])

    const cart = computed(() => store.getters['cart/cartOf'](shopId))
    const items = computed(() => store.getters['cart/entitiesOf'](shopId))
    const remark = computed(() => store.state.checkout.remark)
    const invoice = computed(() => store.state.checkout.invoice)
    const invoiceTitle = computed(() => store.state.checkout.invoiceTitle)
    const paymentMethod = computed(() => store.state.checkout.paymentMethod)

    const goodsTotal = computed(() =>
      +items.value.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2)
    )
    const packingFee = computed(() => +(items.value.length * 1.5).toFixed(2))
    const total = computed(() => {
      if (!cart.value) return 0
      return +(goodsTotal.value + packingFee.value + cart.value.deliveryFee).toFixed(2)
    })

    const paymentLabel = computed(() =>
      paymentMethod.value === 'alipay' ? '支付宝' : '微信支付'
    )

    const selectedAddress = computed(() => {
      const id = store.state.checkout.addressId
      return addresses.value.find((a) => a.id === id) || addresses.value[0] || store.state.location.address
    })

    onMounted(async () => {
      if (!cart.value) {
        router.replace('/shops')
        return
      }
      const geohash = store.getters['location/geohash']
      try {
        await orderApi.checkout({
          geohash,
          entities: items.value,
          restaurant_id: shopId
        })
      } catch (e) {
        // 起送价不足等：提示但允许继续浏览
        if (e && e.message) {
          // 静默：购物车条已拦截起送价
        }
      }
      if (store.getters['user/isLoggedIn']) {
        try {
          const list = await accountApi.addresses(store.getters['user/userId'])
          addresses.value = list || []
          if (!store.state.checkout.addressId && addresses.value[0]) {
            store.dispatch('checkout/selectAddress', addresses.value[0].id)
          }
        } catch {
          /* 忽略 */
        }
      }
    })

    function goChooseAddress() {
      router.push('/checkout/address')
    }
    function back() {
      router.back()
    }

    async function submit() {
      if (!selectedAddress.value || !selectedAddress.value.id) {
        return
      }
      const addressId = selectedAddress.value.id
      if (!store.getters['user/isLoggedIn']) {
        router.push('/login')
        return
      }
      submitting.value = true
      try {
        const order = await orderApi.placeOrder(store.getters['user/userId'], {
          entities: items.value,
          address_id: addressId,
          description: remark.value,
          restaurant_id: shopId,
          geohash: store.getters['location/geohash'],
          sig: store.state.checkout.sig
        })
        store.dispatch('cart/clearCart', shopId)
        store.dispatch('checkout/reset')
        router.replace(`/orders/${order.id}`)
      } catch (err) {
        if (err && err.message && err.message.includes('验证码')) {
          router.push('/checkout/verify')
        }
      } finally {
        submitting.value = false
      }
    }

    return {
      cart,
      items,
      remark,
      invoice,
      invoiceTitle,
      paymentMethod,
      paymentLabel,
      goodsTotal,
      packingFee,
      total,
      addresses,
      selectedAddress,
      submitting,
      goChooseAddress,
      back,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.checkout {
  min-height: 100%;
  background: $bg-page;
  padding: $space-lg $content-pad $space-2xl;
  max-width: 1280px;
}
.checkout__head {
  @include flex-between;
  margin-bottom: $space-lg;
}
.checkout__title {
  @include sc(22, $text-title);
  font-weight: 700;
}
.checkout__sub {
  margin-top: $space-xs;
  @include sc(13, $text-secondary);
}
.checkout__back-link {
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
.checkout__empty {
  padding-top: rem(80);
}

.checkout__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: $space-lg;
  align-items: start;
}
.checkout__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.checkout__address {
  @include flex-between;
  width: 100%;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  gap: $space-md;
  text-align: left;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:hover {
    border-color: rgba(255, 83, 57, 0.4);
    box-shadow: $shadow-card-hover;
  }
  &-main {
    flex: 1;
    min-width: 0;
    &--empty {
      @include sc(15, $text-placeholder);
      padding: $space-md 0;
    }
  }
  &-name {
    @include sc(16, $text-title);
    font-weight: 600;
    .tag {
      display: inline-block;
      margin: 0 $space-sm;
      padding: 1px 6px;
      @include sc(11, #fff);
      background: $color-primary;
      border-radius: $radius-sm;
    }
  }
  &-detail {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
  &-arrow {
    @include sc(22, $text-placeholder);
  }
}

.checkout__card {
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}
.checkout__shop {
  @include sc(16, $text-title);
  font-weight: 700;
  margin-bottom: $space-md;
  padding-bottom: $space-md;
  border-bottom: 1px solid $border-color;
}
.checkout__item {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-sm 0;
  @include sc(14, $text-body);
  &-name {
    flex: 1;
  }
  &-qty {
    color: $text-secondary;
  }
  &-price {
    min-width: 80px;
    text-align: right;
    font-weight: 600;
  }
}
.checkout__fee {
  @include flex-between;
  padding: $space-xs 0;
  @include sc(13, $text-secondary);
}

.checkout__options {
  padding: 0;
  overflow: hidden;
}
.row {
  @include flex-between;
  width: 100%;
  padding: $space-md $card-pad;
  @include sc(14, $text-body);
  border-bottom: 1px solid $border-color;
  transition: background-color $transition-fast;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: $bg-hover;
  }
  &__val {
    color: $text-secondary;
    max-width: 60%;
  }
}

// 右列：粘性摘要卡
.checkout__summary {
  position: sticky;
  top: $space-lg;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: $space-md;
}
.checkout__summary-title {
  @include sc(16, $text-title);
  font-weight: 700;
}
.checkout__summary-row {
  @include flex-between;
  @include sc(14, $text-body);
  &--total {
    padding-top: $space-md;
    border-top: 1px dashed $border-color;
    b {
      @include sc(24, $color-primary);
      font-weight: 800;
    }
  }
}
.checkout__summary-note {
  text-align: center;
  @include sc(12, $text-placeholder);
}

@media (max-width: 960px) {
  .checkout__layout {
    grid-template-columns: 1fr;
  }
  .checkout__summary {
    position: static;
  }
}
</style>
