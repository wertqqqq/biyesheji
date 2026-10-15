<template>
  <div class="safe">
    <header class="safe__bar">
      <button type="button" class="safe__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>资质与安全</span>
    </header>

    <div v-if="loading" class="safe__state"><loading-block text="加载中…" /></div>
    <error-block v-else-if="error" :text="error" @retry="load" />

    <div v-else-if="shop" class="safe__body">
      <div class="safe__badge">
        <span class="safe__badge-icon">🛡</span>
        <div>
          <p class="safe__badge-title">平台认证商家</p>
          <p class="safe__badge-sub">资质齐全 · 放心点餐</p>
        </div>
      </div>
      <article class="safe__markdown" v-html="html" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import Showdown from 'showdown'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'

export default {
  name: 'ShopSafeView',
  components: { LoadingBlock, ErrorBlock },
  setup() {
    const id = router.currentRoute.params.id
    const shop = ref(null)
    const html = ref('')
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const s = await shopApi.detail(
          id,
          store.getters['location/latitude'],
          store.getters['location/longitude']
        )
        shop.value = s
        const converter = new Showdown.Converter()
        html.value = converter.makeHtml((s.safe && s.safe.markdown) || '暂无安全须知')
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    function back() {
      router.back()
    }

    return { shop, html, loading, error, load, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.safe {
  min-height: 100%;
  background: $bg-page;
}
.safe__bar {
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
  background: $bg-card;
  border-bottom: 1px solid $border-color;
}
.safe__back {
  @include wh(34, 34);
  @include flex-center;
  color: $text-body;
  border-radius: $radius-md;
  flex-shrink: 0;
  transition: background $transition-fast, color $transition-fast;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.safe__state {
  padding-top: rem(80);
}
.safe__body {
  max-width: 960px;
  margin: 0 auto;
  padding: $space-lg $content-pad $space-2xl;
}
.safe__badge {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $card-pad;
  background: linear-gradient(135deg, $color-primary-100, #fff);
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  margin-bottom: $space-lg;
  &-icon {
    @include wh(48, 48);
    @include flex-center;
    @include sc(24, #fff);
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    border-radius: 50%;
    flex-shrink: 0;
  }
  &-title {
    @include sc(16, $text-title);
    font-weight: 700;
  }
  &-sub {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
}
.safe__markdown {
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  @include sc(14, $text-body);
  line-height: 1.7;
  ::v-deep {
    h2 {
      @include sc(17, $text-title);
      font-weight: 700;
      margin: $space-lg 0 $space-sm;
    }
    ul {
      padding-left: $space-lg;
      list-style: disc;
    }
    li {
      margin: $space-xs 0;
    }
  }
}
</style>
