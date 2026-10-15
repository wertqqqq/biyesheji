<template>
  <page-scaffold title="我的优惠">
    <div class="benefit">
      <section class="benefit__hero">
        <p class="benefit__hero-num">{{ hongbaoCount }}</p>
        <p class="benefit__hero-label">个可用红包</p>
        <button type="button" class="benefit__hero-btn" @click="$router.push('/benefit/exchange')">兑换红包</button>
      </section>

      <div class="benefit__rows">
        <button type="button" class="row" @click="$router.push('/benefit/coupon')">
          <span><icon-img name="youhuiquan" size="md" /> 代金券说明</span><span aria-hidden="true">›</span>
        </button>
        <button type="button" class="row" @click="$router.push('/benefit/hb-description')">
          <span>🧧 红包说明</span><span aria-hidden="true">›</span>
        </button>
        <button type="button" class="row" @click="$router.push('/benefit/history')">
          <span>🕘 历史红包</span><span aria-hidden="true">›</span>
        </button>
        <button type="button" class="row" @click="$router.push('/benefit/commend')">
          <span>🎁 推荐有奖</span><span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import store from '@/stores'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'BenefitView',
  components: { PageScaffold, IconImg },
  setup() {
    const hongbaoCount = ref(0)
    onMounted(async () => {
      try {
        const list = await contentApi.hongbaos(store.getters['user/userId'])
        hongbaoCount.value = (list || []).length
      } catch {
        hongbaoCount.value = 0
      }
    })
    return { hongbaoCount }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.benefit {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
}
.benefit__hero {
  padding: $space-2xl $card-pad;
  background: linear-gradient(135deg, #ff8a6b, #e6422e);
  border-radius: $radius-lg;
  color: #fff;
  &-num {
    @include sc(30, #fff);
    font-weight: 800;
    line-height: 1;
  }
  &-label {
    margin: $space-sm 0 $space-lg;
    @include sc(13, rgba(255, 255, 255, 0.9));
  }
  &-btn {
    padding: $space-sm $space-xl;
    @include sc(13, #e6422e);
    font-weight: 700;
    background: #fff;
    border-radius: $radius-pill;
    transition: box-shadow $transition-fast;
    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    }
  }
}
.benefit__rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
  margin-top: $space-lg;
}
.row {
  @include flex-between;
  gap: $space-md;
  width: 100%;
  padding: $space-lg;
  @include sc(14, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  transition: border-color $transition-fast, box-shadow $transition-fast,
    background-color $transition-fast;
  &:hover {
    background: $color-primary-soft;
    border-color: rgba(255, 83, 57, 0.35);
    box-shadow: $shadow-card-hover;
  }
}
</style>
