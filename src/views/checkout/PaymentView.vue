<template>
  <page-scaffold title="支付方式">
    <div class="pay">
      <button
        v-for="m in methods"
        :key="m.key"
        type="button"
        class="pay__row"
        :class="{ 'is-on': current === m.key }"
        @click="choose(m.key)"
      >
        <span class="pay__icon">{{ m.icon }}</span>
        <span class="pay__name">{{ m.name }}</span>
        <span class="pay__radio" :class="{ 'is-on': current === m.key }" />
      </button>
      <p class="pay__tip">演示环境，不会产生真实扣款。</p>
    </div>
  </page-scaffold>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'PaymentView',
  components: { PageScaffold },
  setup() {
    const current = ref(store.state.checkout.paymentMethod)
    const methods = [
      { key: 'wechat', name: '微信支付', icon: '💚' },
      { key: 'alipay', name: '支付宝', icon: '💙' }
    ]

    function choose(key) {
      current.value = key
      store.dispatch('checkout/setPayment', key)
      router.back()
    }

    return { current, methods, choose }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.pay {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
  padding: $space-lg $content-pad $space-2xl;
}
.pay__row {
  @include flex-between;
  width: 100%;
  gap: $space-md;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  cursor: pointer;
  transition: border-color $transition-fast, box-shadow $transition-fast,
    background $transition-fast;
  &:hover {
    border-color: rgba(255, 83, 57, 0.35);
    box-shadow: $shadow-card-hover;
  }
  &.is-on {
    background: $color-primary-soft;
    border-color: $color-primary;
  }
}
.pay__icon {
  @include sc(24, $text-title);
}
.pay__name {
  flex: 1;
  text-align: left;
  @include sc(16, $text-title);
  font-weight: 600;
}
.pay__radio {
  @include wh(20, 20);
  flex-shrink: 0;
  border: 2px solid $border-strong;
  border-radius: 50%;
  transition: border-color $transition-fast, background $transition-fast;
  &.is-on {
    border-color: $color-primary;
    background: $color-primary;
    box-shadow: inset 0 0 0 rem(4) #fff;
  }
}
.pay__tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: $space-md;
  @include sc(13, $text-secondary);
}
</style>
