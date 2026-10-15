<template>
  <page-scaffold title="会员卡">
    <div class="vip">
      <div v-if="loading" class="vip__state"><loading-block text="加载中…" /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <template v-else>
        <section class="vip__card">
          <div class="vip__card-top">
            <span class="vip__card-brand">知味会员</span>
            <span class="vip__card-no">NO. 2026 **** 8888</span>
          </div>
          <p class="vip__card-slogan">开通会员，专享多重特权</p>
          <button type="button" class="vip__card-btn" @click="$router.push('/vipcard/buy')">立即开通</button>
        </section>

        <h3 class="vip__section-title">会员特权</h3>
        <div class="vip__perks">
          <div v-for="(p, i) in privileges" :key="i" class="perk">
            <span class="perk__icon">{{ p.icon }}</span>
            <p class="perk__name">{{ p.name }}</p>
            <p class="perk__desc">{{ p.desc }}</p>
          </div>
        </div>

        <div class="vip__rows">
          <button type="button" class="row" @click="$router.push('/vipcard/description')">
            <span>会员说明</span><span aria-hidden="true">›</span>
          </button>
          <button type="button" class="row" @click="$router.push('/vipcard/records')">
            <span>开票记录</span><span aria-hidden="true">›</span>
          </button>
        </div>
      </template>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'

export default {
  name: 'VipcardView',
  components: { PageScaffold, LoadingBlock, ErrorBlock },
  setup() {
    const privileges = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.vipDescription()
        privileges.value = (data && data.privileges) || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { privileges, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.vip {
  padding: 0 $content-pad $space-2xl;
}
.vip__state {
  padding-top: rem(80);
}
.vip__card {
  padding: $space-2xl $space-xl;
  background: linear-gradient(135deg, #3a3f47, #14171c);
  border-radius: $radius-lg;
  color: #fff;
  box-shadow: $shadow-card;
  &-top {
    @include flex-between;
  }
  &-brand {
    @include sc(20, #ffd66b);
    font-weight: 800;
    letter-spacing: 2px;
  }
  &-no {
    @include sc(13, rgba(255, 255, 255, 0.6));
  }
  &-slogan {
    margin: $space-md 0 $space-lg;
    @include sc(14, rgba(255, 255, 255, 0.85));
  }
  &-btn {
    padding: 10px $space-xl;
    @include sc(14, #3a3f47);
    font-weight: 700;
    background: linear-gradient(135deg, #ffd66b, #ffb027);
    border-radius: $radius-pill;
    transition: transform $transition-fast, box-shadow $transition-fast;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255, 210, 91, 0.35);
    }
  }
}
.vip__section-title {
  @include sc(17, $text-title);
  font-weight: 700;
  margin: $space-xl 0 $space-md;
}
.vip__perks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.perk {
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__icon {
    @include sc(28, $text-title);
  }
  &__name {
    margin-top: $space-sm;
    @include sc(16, $text-title);
    font-weight: 600;
  }
  &__desc {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
}
.vip__rows {
  margin-top: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.row {
  @include flex-between;
  width: 100%;
  padding: 15px $space-lg;
  @include sc(14, $text-body);
  border-bottom: 1px solid $border-color;
  transition: background $transition-fast, color $transition-fast;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: $color-primary-soft;
    color: $color-primary;
  }
}
</style>
