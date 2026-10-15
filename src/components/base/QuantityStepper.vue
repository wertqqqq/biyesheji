<template>
  <div class="stepper">
    <button
      v-if="value > 0"
      type="button"
      class="stepper__btn stepper__btn--dec"
      aria-label="减少数量"
      @click.stop="$emit('dec')"
    >
      <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M5 11h14v2H5z" fill="currentColor"/></svg>
    </button>
    <span v-if="value > 0" class="stepper__val">{{ value }}</span>
    <button
      type="button"
      class="stepper__btn stepper__btn--inc"
      :class="{ 'stepper__btn--solo': value === 0 }"
      aria-label="增加数量"
      @click.stop="$emit('inc')"
    >
      <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor"/></svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuantityStepper',
  props: {
    value: { type: Number, default: 0 }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.stepper {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  &__val {
    min-width: rem(28);
    text-align: center;
    @include sc(15, $text-title);
    font-weight: 600;
  }
}

.stepper__btn {
  @include wh(30, 30);
  @include flex-center;
  border-radius: 50%;
  transition: transform $transition-fast, box-shadow $transition-fast,
    background-color $transition-fast;
  &--inc {
    background: $color-primary;
    color: #fff;
    box-shadow: 0 2px 6px rgba(255, 83, 57, 0.3);
    &:hover {
      background: $color-primary-600;
      transform: scale(1.1);
    }
  }
  &--solo {
    @include wh(32, 32);
  }
  &--dec {
    background: transparent;
    color: $color-primary;
    border: 1px solid $color-primary;
    &:hover {
      background: $color-primary-100;
    }
  }
}
</style>
