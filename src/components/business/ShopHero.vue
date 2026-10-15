<template>
  <div class="hero">
    <div class="hero__banner" :style="{ background: bannerGradient }">
      <button type="button" class="hero__back" aria-label="返回" @click="$emit('back')">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>

    <div class="hero__card">
      <div class="hero__logo" :style="{ background: bannerGradient }">
        <span>{{ shop.image }}</span>
      </div>
      <div class="hero__main">
        <h2 class="hero__name ellipsis">
          <span v-if="shop.isBrand" class="hero__brand">品牌</span>{{ shop.name }}
        </h2>
        <div class="hero__meta">
          <star-rating :rating="shop.rating" size="xs" />
          <span class="hero__rating">{{ shop.rating.toFixed(1) }}</span>
          <span>月售 {{ formatSales(shop.recentOrderNum) }}</span>
          <span>{{ shop.deliveryMode.text }}</span>
        </div>
        <div class="hero__meta hero__meta--sub">
          <span>{{ shop.leadTime }} 分钟送达</span>
          <span class="dot">·</span>
          <span>距离 {{ formatDistance(shop.distance) }}</span>
          <span class="dot">·</span>
          <span>起送 ¥{{ shop.minOrderAmount }}</span>
        </div>
      </div>
    </div>

    <button type="button" class="hero__promo" @click="$emit('toggle-activities', true)">
      <span class="hero__promo-text ellipsis">公告：{{ shop.announcement }}</span>
      <span v-if="shop.activities && shop.activities.length" class="hero__promo-count">
        {{ shop.activities.length }} 个活动 ▾
      </span>
    </button>

    <transition name="pop">
      <div v-if="showActivities" class="hero__overlay">
        <div class="hero__overlay-mask" @click="$emit('toggle-activities', false)" />
        <div class="hero__overlay-panel">
          <h3 class="hero__overlay-title">优惠与公告</h3>
          <div class="hero__overlay-body">
            <h4>活动</h4>
            <div v-for="(a, i) in shop.activities" :key="i" class="act">
              <em class="act__icon">{{ a.icon }}</em>
              <span>{{ a.tips }}</span>
            </div>
            <h4>公告</h4>
            <p class="hero__announce">{{ shop.announcement }}</p>
          </div>
          <button type="button" class="hero__overlay-close" @click="$emit('toggle-activities', false)">
            知道了
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import StarRating from '../base/StarRating.vue'
import { formatDistance, formatSales } from '../../utils/format'

export default {
  name: 'ShopHero',
  components: { StarRating },
  props: {
    shop: { type: Object, required: true },
    showActivities: Boolean
  },
  computed: {
    bannerGradient() {
      return `linear-gradient(135deg, ${this.shop.logoColor}, ${this.shop.bannerColor})`
    }
  },
  methods: { formatDistance, formatSales }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.hero {
  position: relative;
  background: $bg-card;
  flex-shrink: 0;
}
.hero__banner {
  position: relative;
  @include wh(100%, 180);
}
.hero__back {
  position: absolute;
  top: $space-lg;
  left: $content-pad;
  @include wh(36, 36);
  @include flex-center;
  color: #fff;
  background: rgba(0, 0, 0, 0.32);
  border-radius: 50%;
  z-index: 2;
  backdrop-filter: blur(4px);
  transition: background-color $transition-fast, transform $transition-fast;
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.06);
  }
}
.hero__card {
  display: flex;
  gap: $space-lg;
  padding: 0 $content-pad;
  margin-top: -44px;
  position: relative;
  z-index: 1;
}
.hero__logo {
  @include wh(120, 120);
  @include flex-center;
  border-radius: $radius-lg;
  border: 3px solid #fff;
  box-shadow: $shadow-card;
  flex-shrink: 0;
  span {
    @include sc(56, #fff);
  }
}
.hero__main {
  flex: 1;
  min-width: 0;
  padding-top: 48px;
}
.hero__name {
  @include sc(22, $text-title);
  font-weight: 700;
}
.hero__brand {
  display: inline-block;
  margin-right: $space-sm;
  padding: 1px 6px;
  @include sc(11, #fff);
  background: linear-gradient(135deg, $color-accent, #f59e0b);
  border-radius: $radius-sm;
  vertical-align: 3px;
}
.hero__meta {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin-top: $space-sm;
  @include sc(13, $text-secondary);
  &--sub {
    margin-top: $space-xs;
  }
  .dot {
    color: $border-strong;
  }
}
.hero__rating {
  color: $color-accent;
  font-weight: 700;
}

.hero__promo {
  @include flex-between;
  width: 100%;
  margin-top: $space-md;
  padding: 10px $content-pad;
  @include sc(13, $text-secondary);
  background: $color-primary-soft;
  gap: $space-md;
  transition: background-color $transition-fast;
  &:hover {
    background: $color-primary-100;
  }
}
.hero__promo-text {
  flex: 1;
  text-align: left;
  @include ellipsis(1);
}
.hero__promo-count {
  color: $color-primary;
  font-weight: 600;
  white-space: nowrap;
}

.hero__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  @include flex-center;
  padding: $space-xl;
}
.hero__overlay-mask {
  position: absolute;
  inset: 0;
  background: $bg-mask;
  backdrop-filter: blur(2px);
}
.hero__overlay-panel {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: $bg-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-pop;
  padding: $content-pad;
}
.hero__overlay-title {
  @include sc(18, $text-title);
  text-align: center;
  margin-bottom: $space-md;
}
.hero__overlay-body {
  max-height: 50vh;
  overflow-y: auto;
  h4 {
    @include sc(14, $text-title);
    margin: $space-md 0 $space-sm;
  }
}
.act {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm 0;
  @include sc(14, $text-body);
  &__icon {
    font-style: normal;
    @include wh(22, 22);
    @include flex-center;
    @include sc(12, #fff);
    background: $color-primary;
    border-radius: $radius-sm;
    flex-shrink: 0;
  }
}
.hero__announce {
  @include sc(14, $text-body);
  line-height: 1.6;
}
.hero__overlay-close {
  width: 100%;
  margin-top: $space-md;
  padding: 11px;
  @include sc(15, #fff);
  font-weight: 600;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: $radius-md;
  box-shadow: 0 2px 8px rgba(255, 83, 57, 0.28);
  &:hover {
    filter: brightness(1.05);
  }
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.2s ease;
  .hero__overlay-panel {
    transition: transform 0.24s ease;
  }
}
.pop-enter,
.pop-leave-to {
  opacity: 0;
  .hero__overlay-panel {
    transform: scale(0.92);
  }
}
</style>
