<template>
  <span class="stars" :class="`stars--${size}`" role="img" :aria-label="`评分 ${rating} 分`">
    <span class="stars__bg">★★★★★</span>
    <span class="stars__fg" :style="{ width: percent + '%' }">★★★★★</span>
    <span v-if="showValue" class="stars__value">{{ formatted }}</span>
  </span>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: { type: Number, default: 0 },
    size: { type: String, default: 'sm' }, // xs | sm | md
    showValue: Boolean
  },
  computed: {
    percent() {
      const r = Math.max(0, Math.min(5, this.rating || 0))
      return (r / 5) * 100
    },
    formatted() {
      return (this.rating || 0).toFixed(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.stars {
  position: relative;
  display: inline-flex;
  align-items: center;
  letter-spacing: 1px;
  &--xs {
    @include sc(20, $text-secondary);
  }
  &--sm {
    @include sc(24, $text-secondary);
  }
  &--md {
    @include sc(30, $text-secondary);
  }
}

.stars__bg {
  color: $border-strong;
}
.stars__fg {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  color: $color-accent;
}
.stars__value {
  margin-left: $space-xs;
  color: $color-accent;
  font-weight: 600;
}
</style>
