<template>
  <div class="order-detail">
    <header class="order-detail__bar">
      <button type="button" class="order-detail__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>订单详情</span>
    </header>

    <div v-if="loading" class="order-detail__state"><loading-block text="订单加载中…" /></div>
    <error-block v-else-if="error" :text="error" @retry="load" />

    <template v-else-if="order">
      <section class="od__status">
        <div>
          <p class="od__status-text">订单{{ order.status }}</p>
          <p class="od__status-sub">感谢您的信任，期待再次光临</p>
        </div>
      </section>

      <div class="od__layout">
        <section class="od__card">
          <h3 class="od__shop">{{ order.shopImage }} {{ order.shopName }}</h3>
          <div v-for="(f, i) in order.foods" :key="i" class="od__item">
            <span class="od__item-name ellipsis">{{ f.name }}</span>
            <span class="od__item-qty">x{{ f.quantity }}</span>
            <span class="od__item-price">¥{{ (f.price * f.quantity).toFixed(2) }}</span>
          </div>
          <div class="od__fee"><span>配送费</span><span>—</span></div>
          <div class="od__total"><span>实付</span><b>¥{{ order.total.toFixed(2) }}</b></div>
        </section>

        <section class="od__card od__meta">
          <h3 class="od__meta-title">订单信息</h3>
          <div class="od__meta-row"><span>订单号</span><span>{{ order.id }}</span></div>
          <div class="od__meta-row"><span>下单时间</span><span>{{ order.timeAgo }}</span></div>
          <div class="od__meta-row"><span>收货地址</span><span class="od__meta-addr">{{ order.address || '—' }}</span></div>
          <div v-if="order.remark" class="od__meta-row"><span>订单备注</span><span>{{ order.remark }}</span></div>
          <div class="od__meta-row"><span>支付方式</span><span>在线支付</span></div>
        </section>
      </div>

      <div class="od__actions">
        <app-button type="ghost" @click="goHome">再来一单</app-button>
        <app-button type="primary" @click="goService">联系客服</app-button>
      </div>
    </template>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { orderApi } from '@/api/modules/order'
import AppButton from '@/components/base/AppButton.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'

export default {
  name: 'OrderDetailView',
  components: { AppButton, LoadingBlock, ErrorBlock },
  setup() {
    const id = router.currentRoute.params.id
    const order = ref(null)
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        order.value = await orderApi.detail(store.getters['user/userId'], id)
      } catch (e) {
        error.value = e.message || '订单加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    function back() {
      if (window.history.length > 1) router.back()
      else router.replace('/orders')
    }
    function goHome() {
      router.replace('/shops')
    }
    function goService() {
      router.push('/service')
    }

    return { order, loading, error, load, back, goHome, goService }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.order-detail {
  min-height: 100%;
  background: $bg-page;
  padding-bottom: $space-2xl;
}
.order-detail__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: $space-md;
  @include wh(100%, $page-head-h);
  padding: 0 $content-pad;
  @include sc(17, $text-title);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-color;
}
.order-detail__back {
  @include wh(34, 34);
  @include flex-center;
  color: $text-body;
  border-radius: $radius-md;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.order-detail__state {
  padding-top: rem(120);
}

.od__status {
  margin: $space-lg $content-pad 0;
  padding: $space-xl $space-2xl;
  border-radius: $radius-xl;
  background:
    radial-gradient(500px 160px at 90% 0%, rgba(255, 176, 39, 0.3), transparent 60%),
    linear-gradient(115deg, #ff6a45, $color-primary 55%, $color-primary-600);
  color: #fff;
  box-shadow: 0 10px 28px rgba(255, 83, 57, 0.24);
  &-text {
    @include sc(22, #fff);
    font-weight: 800;
  }
  &-sub {
    margin-top: $space-xs;
    @include sc(13, rgba(255, 255, 255, 0.85));
  }
}
.od__layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: $space-lg;
  margin: $space-lg $content-pad 0;
  align-items: start;
  max-width: 1280px;
}
.od__card {
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}
.od__shop {
  @include sc(16, $text-title);
  font-weight: 700;
  margin-bottom: $space-md;
  padding-bottom: $space-md;
  border-bottom: 1px solid $border-color;
}
.od__item {
  display: flex;
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
.od__fee {
  @include flex-between;
  padding: $space-sm 0;
  @include sc(13, $text-secondary);
  border-top: 1px dashed $border-color;
}
.od__total {
  @include flex-between;
  padding-top: $space-md;
  @include sc(15, $text-body);
  b {
    @include sc(24, $color-primary);
    font-weight: 800;
  }
}
.od__meta-title {
  @include sc(16, $text-title);
  font-weight: 700;
  margin-bottom: $space-md;
}
.od__meta-row {
  display: flex;
  gap: $space-md;
  padding: $space-sm 0;
  @include sc(14, $text-body);
  border-bottom: 1px solid $border-color;
  &:last-child {
    border-bottom: none;
  }
  span:first-child {
    color: $text-secondary;
    white-space: nowrap;
  }
  span:last-child {
    flex: 1;
    text-align: right;
    word-break: break-all;
  }
}
.od__meta-addr {
  text-align: right;
}

.od__actions {
  display: flex;
  gap: $space-md;
  padding: $space-lg $content-pad 0;
  max-width: 1280px;
}

@media (max-width: 960px) {
  .od__layout {
    grid-template-columns: 1fr;
  }
}
</style>
