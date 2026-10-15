<template>
  <article class="shop-card" @click="$emit('click', shop)">
    <div
      class="shop-card__logo"
      :style="{ background: `linear-gradient(135deg, ${shop.logoColor}, ${shop.bannerColor})` }"
    >
      <span class="shop-card__emoji">{{ shop.image }}</span>
    </div>
    <div class="shop-card__body">
      <div class="shop-card__head">
        <h3 class="shop-card__name ellipsis">
          <span v-if="shop.isBrand" class="shop-card__brand">品牌</span>
          {{ shop.name }}
        </h3>
      </div>
      <div class="shop-card__meta">
        <star-rating :rating="shop.rating" size="xs" />
        <span class="shop-card__rating">{{ shop.rating.toFixed(1) }}</span>
        <span class="shop-card__sales">月售 {{ formatSales(shop.recentOrderNum) }}</span>
      </div>
      <div class="shop-card__meta shop-card__meta--sub">
        <span>{{ shop.deliveryMode.text }}</span>
        <span class="dot">·</span>
        <span>{{ shop.leadTime }} 分钟</span>
        <span class="dot">·</span>
        <span>{{ formatDistance(shop.distance) }}</span>
      </div>
      <div class="shop-card__meta shop-card__meta--sub">
        <span>起送 ¥{{ shop.minOrderAmount }}</span>
        <span class="dot">·</span>
        <span>配送 ¥{{ shop.deliveryFee }}</span>
      </div>
      <div v-if="shop.activities && shop.activities.length" class="shop-card__promos">
        <span v-for="(a, i) in shop.activities.slice(0, 2)" :key="i" class="promo">
          <em class="promo__icon">{{ a.icon }}</em>{{ a.tips }}
        </span>
      </div>
    </div>
  </article>
</template>

<script>
import StarRating from '../base/StarRating.vue'
import { formatDistance, formatSales } from '../../utils/format'

export default {
  name: 'ShopCard',
  components: { StarRating },
  props: {
    shop: { type: Object, required: true }
  },
  methods: {
    formatDistance,
    formatSales
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.shop-card {
  display: flex;
  gap: $space-lg;
  padding: $card-pad;
  background: $bg-card;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
  cursor: pointer;
  @include hover-lift;
  &:hover {
    border-color: rgba(255, 83, 57, 0.35);
  }
  &__logo {
    @include wh(96, 96);
    @include flex-center;
    border-radius: $radius-lg;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  }
  &__emoji {
    @include sc(44, #fff);
  }
  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-sm;
  }
  &__name {
    @include sc(17, $text-title);
    font-weight: 600;
  }
  &__brand {
    display: inline-block;
    margin-right: $space-sm;
    padding: 1px 6px;
    @include sc(11, #fff);
    background: linear-gradient(135deg, $color-accent, #f59e0b);
    border-radius: $radius-sm;
    vertical-align: 2px;
  }
  &__meta {
    display: flex;
    align-items: center;
    gap: $space-sm;
    @include sc(13, $text-secondary);
    &--sub {
      @include sc(13, $text-secondary);
    }
  }
  &__rating {
    color: $color-accent;
    font-weight: 700;
  }
  &__sales {
    color: $text-secondary;
  }
  .dot {
    color: $border-strong;
  }
  &__promos {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-top: $space-xs;
  }
}

.promo {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: 2px 8px;
  @include sc(12, $color-primary-600);
  background: $color-primary-soft;
  border: 1px solid rgba(255, 83, 57, 0.18);
  border-radius: $radius-sm;
  max-width: 100%;
  @include ellipsis(1);
  &__icon {
    font-style: normal;
    @include wh(16, 16);
    @include flex-center;
    @include sc(10, #fff);
    background: $color-primary;
    border-radius: 4px;
    flex-shrink: 0;
  }
}
</style>
