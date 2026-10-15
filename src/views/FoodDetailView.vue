<template>
  <div class="food-detail">
    <header class="food-detail__bar">
      <button type="button" class="food-detail__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>菜品详情</span>
    </header>

    <div v-if="loading" class="food-detail__state"><loading-block text="加载中…" /></div>
    <error-block v-else-if="error" :text="error" @retry="load" />

    <template v-else-if="food">
      <div class="fd__layout">
        <section class="fd__hero">
          <div class="fd__thumb"><span>{{ food.image }}</span></div>
          <div class="fd__intro">
            <h2 class="fd__name">{{ food.name }}</h2>
            <p class="fd__desc">{{ food.description }}</p>
            <p class="fd__meta">月售 {{ food.monthSales }} · 好评率 {{ food.rating }}%</p>
            <p v-if="food.categoryName" class="fd__meta">分类：{{ food.categoryName }}</p>
            <div class="fd__buy">
              <div class="fd__price">
                <b>¥{{ food.price.toFixed(2) }}</b>
              </div>
              <app-button type="primary" size="lg" @click="addToCart">加入购物车</app-button>
              <span v-if="count > 0" class="fd__count">已选 {{ count }} 份</span>
            </div>
          </div>
        </section>

        <section class="fd__ratings">
          <h3>菜品评价</h3>
          <div class="fd__rating-summary">
            <star-rating :rating="(food.rating / 20) || 0" size="md" show-value />
            <span>满意度 {{ food.satisfyRate }}%</span>
          </div>
          <p class="fd__rating-note">好评率基于近期用户评价统计，仅供参考。</p>
        </section>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import { useRequest } from '@/composables/useRequest'
import StarRating from '@/components/base/StarRating.vue'
import AppButton from '@/components/base/AppButton.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'

export default {
  name: 'FoodDetailView',
  components: { StarRating, AppButton, LoadingBlock, ErrorBlock },
  setup() {
    const shopId = router.currentRoute.params.id
    const foodId = router.currentRoute.params.foodId

    const { data: food, loading, error, run: load } = useRequest(() =>
      shopApi.foodDetail(shopId, foodId)
    )
    const { data: shop } = useRequest(() =>
      shopApi.detail(
        shopId,
        store.getters['location/latitude'],
        store.getters['location/longitude']
      )
    )

    const count = computed(() => store.getters['cart/foodCount'](shopId, foodId))

    function addToCart() {
      if (!shop.value || !food.value) return
      store.dispatch('cart/addFood', { shop: shop.value, food: food.value })
    }
    function back() {
      router.back()
    }

    return { food, shop, loading, error, load, count, addToCart, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.food-detail {
  min-height: 100%;
  background: $bg-page;
}
.food-detail__bar {
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
.food-detail__back {
  @include wh(34, 34);
  @include flex-center;
  color: $text-body;
  border-radius: $radius-md;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.food-detail__state {
  padding-top: rem(120);
}

.fd__layout {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: $space-lg;
  padding: $content-pad;
  align-items: start;
}

.fd__hero {
  display: flex;
  gap: $space-xl;
  padding: $card-pad;
  background: $bg-card;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  border: 1px solid $border-color;
}
.fd__thumb {
  @include wh(220, 220);
  @include flex-center;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, #ffe9e3, #ffd0c2);
  flex-shrink: 0;
  span {
    @include sc(90, #fff);
  }
}
.fd__intro {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.fd__name {
  @include sc(24, $text-title);
  font-weight: 700;
}
.fd__desc {
  margin: $space-sm 0;
  @include sc(14, $text-secondary);
  line-height: 1.6;
}
.fd__meta {
  @include sc(13, $text-placeholder);
  margin-top: $space-xs;
}
.fd__buy {
  display: flex;
  align-items: center;
  gap: $space-lg;
  margin-top: auto;
  padding-top: $space-lg;
  border-top: 1px dashed $border-color;
}
.fd__price {
  b {
    @include sc(30, $color-primary);
    font-weight: 800;
  }
}
.fd__count {
  @include sc(13, $text-secondary);
}

.fd__ratings {
  padding: $card-pad;
  background: $bg-card;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  border: 1px solid $border-color;
  h3 {
    @include sc(17, $text-title);
    margin-bottom: $space-md;
  }
}
.fd__rating-summary {
  display: flex;
  align-items: center;
  gap: $space-md;
  @include sc(15, $text-body);
}
.fd__rating-note {
  margin-top: $space-md;
  @include sc(13, $text-placeholder);
}

@media (max-width: 900px) {
  .fd__layout {
    grid-template-columns: 1fr;
  }
  .fd__hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .fd__buy {
    justify-content: center;
  }
}
</style>
