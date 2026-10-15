<template>
  <div class="cartbar">
    <transition name="cartpop">
      <div v-if="listOpen && items.length" class="cartbar__pop">
        <div class="cartbar__pop-head">
          <span>购物车</span>
          <button type="button" class="cartbar__clear" @click="$emit('clear')">清空</button>
        </div>
        <div class="cartbar__pop-body">
          <div v-for="it in items" :key="it.id" class="cartbar__item">
            <span class="cartbar__item-name ellipsis">{{ it.name }}</span>
            <span class="cartbar__item-price">¥{{ (it.price * it.quantity).toFixed(2) }}</span>
            <quantity-stepper :value="it.quantity" @inc="$emit('inc', it)" @dec="$emit('dec', it)" />
          </div>
        </div>
      </div>
    </transition>

    <div class="cartbar__bar">
      <div class="cartbar__left" role="button" tabindex="0" @click="$emit('toggle-list')">
        <div class="cartbar__icon" :class="{ 'is-active': count > 0 }">
          <span aria-hidden="true">🛒</span>
          <span v-if="count > 0" class="cartbar__badge">{{ count }}</span>
        </div>
        <div class="cartbar__total">
          <p class="cartbar__price" :class="{ 'cartbar__price--empty': count === 0 }">
            {{ count > 0 ? `¥${total.toFixed(2)}` : '购物车是空的' }}
          </p>
          <p class="cartbar__fee">另需配送费 ¥{{ deliveryFee.toFixed(2) }}</p>
        </div>
      </div>
      <button
        type="button"
        class="cartbar__checkout"
        :class="{ 'is-ready': canCheckout }"
        :disabled="!canCheckout"
        @click="$emit('checkout')"
      >
        {{ canCheckout ? '去结算' : `差 ¥${Math.max(0, min - total).toFixed(2)} 起送` }}
      </button>
    </div>
  </div>
</template>

<script>
import QuantityStepper from '../base/QuantityStepper.vue'

export default {
  name: 'CartBar',
  components: { QuantityStepper },
  props: {
    count: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    items: { type: Array, default: () => [] },
    listOpen: Boolean
  },
  computed: {
    canCheckout() {
      return this.count > 0 && this.total >= this.min
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.cartbar {
  position: relative;
  z-index: 15;
  flex-shrink: 0;
}

.cartbar__pop {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  background: $bg-card;
  border-radius: $radius-lg $radius-lg 0 0;
  box-shadow: 0 -8px 28px rgba(16, 24, 40, 0.14);
  max-height: 420px;
  display: flex;
  flex-direction: column;
  border: 1px solid $border-color;
  border-bottom: none;
}
.cartbar__pop-head {
  @include flex-between;
  padding: $space-md $space-xl;
  @include sc(14, $text-title);
  font-weight: 600;
  background: $bg-hover;
  border-radius: $radius-lg $radius-lg 0 0;
}
.cartbar__clear {
  @include sc(13, $text-secondary);
  padding: 4px 10px;
  border-radius: $radius-sm;
  &:hover {
    background: $bg-active;
    color: $color-danger;
  }
}
.cartbar__pop-body {
  overflow-y: auto;
  padding: 0 $space-xl;
}
.cartbar__item {
  @include flex-between;
  gap: $space-md;
  padding: $space-md 0;
  border-bottom: 1px solid $border-color;
  &:last-child {
    border-bottom: none;
  }
}
.cartbar__item-name {
  flex: 1;
  @include sc(14, $text-body);
}
.cartbar__item-price {
  @include sc(15, $color-primary);
  font-weight: 700;
  margin-right: $space-md;
}

.cartbar__bar {
  @include flex-between;
  @include wh(100%, 64);
  padding: 0 $space-xl 0 0;
  background: #21252d;
}
.cartbar__left {
  display: flex;
  align-items: center;
  gap: $space-md;
  height: 100%;
  padding-left: $content-pad;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.cartbar__icon {
  position: relative;
  @include wh(48, 48);
  @include flex-center;
  @include sc(22, #fff);
  background: #3a3f47;
  border-radius: 50%;
  margin-top: -18px;
  border: 5px solid #21252d;
  transition: transform $transition-fast;
  .cartbar__left:hover & {
    transform: scale(1.05);
  }
  &.is-active {
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    box-shadow: 0 4px 14px rgba(255, 83, 57, 0.4);
  }
}
.cartbar__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  @include wh(20, 20);
  @include flex-center;
  @include sc(12, #fff);
  background: $color-danger;
  border-radius: 50%;
  padding: 0 4px;
  font-weight: 700;
}
.cartbar__total {
  min-width: 0;
}
.cartbar__price {
  @include sc(20, #fff);
  font-weight: 700;
  &--empty {
    @include sc(14, rgba(255, 255, 255, 0.6));
    font-weight: 400;
  }
}
.cartbar__fee {
  @include sc(12, rgba(255, 255, 255, 0.5));
  margin-top: 2px;
}
.cartbar__checkout {
  @include wh(160, 44);
  @include flex-center;
  @include sc(15, #fff);
  font-weight: 700;
  background: #4a5058;
  border-radius: $radius-pill;
  transition: filter $transition-fast, box-shadow $transition-fast;
  &.is-ready {
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    box-shadow: 0 4px 14px rgba(255, 83, 57, 0.4);
    &:hover {
      filter: brightness(1.06);
    }
  }
  &:disabled {
    cursor: not-allowed;
  }
}

.cartpop-enter-active,
.cartpop-leave-active {
  transition: all 0.22s ease;
}
.cartpop-enter,
.cartpop-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
