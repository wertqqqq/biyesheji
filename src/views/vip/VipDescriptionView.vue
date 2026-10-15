<template>
  <page-scaffold title="会员说明">
    <div class="vip-desc">
      <div v-if="loading" class="state"><loading-block text="加载中…" /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <template v-else>
        <h2 class="vip-desc__title">{{ title }}</h2>
        <div class="vip-desc__perks">
          <div v-for="(p, i) in privileges" :key="i" class="perk">
            <span class="perk__icon">{{ p.icon }}</span>
            <div>
              <p class="perk__name">{{ p.name }}</p>
              <p class="perk__desc">{{ p.desc }}</p>
            </div>
          </div>
        </div>
        <h3 class="vip-desc__subtitle">套餐价格</h3>
        <div class="vip-desc__plans">
          <div v-for="p in plans" :key="p.id" class="plan">
            <p class="plan__name">{{ p.name }}</p>
            <p class="plan__price">¥{{ p.price }}<s>¥{{ p.originPrice }}</s></p>
          </div>
        </div>
        <p class="vip-desc__note">会员为虚拟服务，开通后不支持转让；如遇问题请联系客服。</p>
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
  name: 'VipDescriptionView',
  components: { PageScaffold, LoadingBlock, ErrorBlock },
  setup() {
    const title = ref('会员特权说明')
    const privileges = ref([])
    const plans = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.vipDescription()
        title.value = data.title || '会员特权说明'
        privileges.value = data.privileges || []
        plans.value = data.plans || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { title, privileges, plans, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.vip-desc {
  padding: 0 $content-pad $space-2xl;
}
.state {
  padding-top: rem(80);
}
.vip-desc__title {
  @include sc(20, $text-title);
  font-weight: 800;
  margin-bottom: $space-lg;
}
.vip-desc__perks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.perk {
  display: flex;
  gap: $space-md;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__icon {
    @include sc(28, $text-title);
    flex-shrink: 0;
  }
  &__name {
    @include sc(16, $text-title);
    font-weight: 600;
  }
  &__desc {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
}
.vip-desc__subtitle {
  @include sc(17, $text-title);
  font-weight: 700;
  margin: $space-xl 0 $space-md;
}
.vip-desc__plans {
  display: flex;
  gap: $space-md;
}
.plan {
  flex: 1;
  padding: $space-lg;
  text-align: center;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__name {
    @include sc(14, $text-body);
  }
  &__price {
    margin-top: $space-sm;
    @include sc(22, $color-primary);
    font-weight: 800;
    s {
      margin-left: $space-xs;
      @include sc(12, $text-placeholder);
      font-weight: 400;
    }
  }
}
.vip-desc__note {
  margin-top: $space-lg;
  @include sc(12, $text-placeholder);
  text-align: center;
}
</style>
