<template>
  <div class="home">
    <!-- 桌面端主视觉：全宽渐变横幅 -->
    <section class="home__hero">
      <div class="home__hero-inner">
        <div class="home__hero-text">
          <h1 class="home__title">发现附近的好味道</h1>
          <p class="home__subtitle">品类齐全 · 极速配送 · 品质保障</p>
        </div>
        <button type="button" class="home__search" @click="goSearch">
          <icon-img name="sousuo" size="md" /> 搜索商家或美食
        </button>
      </div>
    </section>

    <!-- 想吃什么：分类网格 -->
    <section class="home__section">
      <div class="home__section-head">
        <h2 class="home__h2">想吃什么</h2>
        <button type="button" class="home__more-link" @click="goFood">查看全部分类 ›</button>
      </div>
      <div v-if="loading" class="home__cats home__cats--loading">
        <span v-for="n in 8" :key="n" class="home__skel" />
      </div>
      <div v-else class="home__cats">
        <button
          v-for="c in categories"
          :key="c.id"
          type="button"
          class="home__cat"
          @click="goCategory(c)"
        >
          <span class="home__cat-icon">{{ c.icon }}</span>
          <span class="home__cat-name">{{ c.name }}</span>
        </button>
      </div>
    </section>

    <div class="home__cta">
      <app-button block size="lg" @click="goShops">看看附近有什么</app-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import { useRequest } from '@/composables/useRequest'
import AppButton from '@/components/base/AppButton.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'HomeView',
  components: { AppButton, IconImg },
  setup() {
    const cityName = computed(() => store.getters['location/cityName'] || '定位中')
    const avatar = computed(() => store.getters['user/avatar'])
    const { data: categories, loading } = useRequest(() => shopApi.categories(), {
      initialData: []
    })

    function goCity() {
      router.push('/city')
    }
    function goSearch() {
      router.push('/search')
    }
    function goAccount() {
      router.push('/account')
    }
    function goShops() {
      router.push('/shops')
    }
    function goFood() {
      router.push('/food')
    }
    function goCategory(c) {
      router.push({ path: '/shops', query: { category: c.id } })
    }

    return { cityName, avatar, categories, loading, goCity, goSearch, goAccount, goShops, goFood, goCategory }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home {
  min-height: 100%;
  background: $bg-page;
  padding-bottom: $space-2xl;
}

// ===== 主视觉横幅 =====
.home__hero {
  background:
    radial-gradient(1200px 400px at 85% -40%, rgba(255, 176, 39, 0.35), transparent 60%),
    linear-gradient(115deg, #ff6a45 0%, $color-primary 45%, $color-primary-600 100%);
  color: #fff;
  padding: 56px $content-pad;
}
.home__hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2xl;
  max-width: 1200px;
}
.home__hero-text {
  min-width: 0;
}
.home__title {
  @include sc(34, #fff);
  font-weight: 800;
  letter-spacing: 1px;
}
.home__subtitle {
  margin-top: $space-md;
  @include sc(16, rgba(255, 255, 255, 0.88));
}
.home__search {
  display: flex;
  align-items: center;
  gap: $space-sm;
  width: 380px;
  max-width: 100%;
  height: 52px;
  padding: 0 $space-xl;
  @include sc(15, $text-secondary);
  background: #fff;
  border-radius: $radius-pill;
  box-shadow: 0 8px 24px rgba(180, 40, 20, 0.25);
  transition: transform $transition-fast, box-shadow $transition-fast;
  flex-shrink: 0;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(180, 40, 20, 0.32);
  }
}

// ===== 分类网格 =====
.home__section {
  margin: $space-xl $content-pad 0;
}
.home__section-head {
  @include flex-between;
  margin-bottom: $space-lg;
}
.home__h2 {
  @include sc(20, $text-title);
  font-weight: 700;
}
.home__more-link {
  @include sc(14, $text-secondary);
  padding: 6px 12px;
  border-radius: $radius-md;
  &:hover {
    color: $color-primary;
    background: $color-primary-soft;
  }
}
.home__cats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $space-md;
}
.home__cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  padding: $space-xl $space-md;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  @include hover-lift;
  &-icon {
    @include wh(52, 52);
    @include flex-center;
    @include sc(28, $text-title);
    background: $bg-hover;
    border-radius: 50%;
    transition: transform $transition-fast;
  }
  &:hover &-icon {
    transform: scale(1.12);
  }
  &-name {
    @include sc(14, $text-body);
    font-weight: 500;
  }
}
.home__cats--loading {
  min-height: 120px;
}
.home__skel {
  height: 108px;
  border-radius: $radius-lg;
  background: linear-gradient(90deg, $border-color, $bg-card, $border-color);
  background-size: 200% 100%;
  animation: skel 1.2s ease infinite;
}
@keyframes skel {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.home__cta {
  margin: $space-xl $content-pad 0;
}

@media (max-width: 720px) {
  .home__hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .home__search {
    width: 100%;
  }
}
</style>
