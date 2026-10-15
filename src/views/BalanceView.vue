<template>
  <page-scaffold title="我的余额">
    <div class="balance">
      <section class="balance__hero">
        <p class="balance__num">¥{{ amount }}</p>
        <p class="balance__label">账户余额</p>
      </section>

      <div class="balance__rows">
        <button type="button" class="row" @click="$router.push('/balance/detail')">
          <span>余额说明</span><span aria-hidden="true">›</span>
        </button>
        <button type="button" class="row" @click="recharge">
          <span>余额充值</span><span class="row__val">充值送优惠 ›</span>
        </button>
      </div>

      <h3 class="balance__subtitle">收支明细</h3>
      <div v-if="loading" class="state"><loading-block /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <empty-block v-else-if="!detail.length" icon="zhanghuyue" text="暂无收支记录" />
      <div v-else class="balance__list">
        <div v-for="b in detail" :key="b.id" class="bitem">
          <div class="bitem__main">
            <p class="bitem__desc">{{ b.desc }}</p>
            <p class="bitem__time">{{ b.timeAgo }}</p>
          </div>
          <span class="bitem__amount" :class="b.amount < 0 ? 'is-minus' : 'is-plus'">
            {{ b.amount < 0 ? '' : '+' }}¥{{ b.amount.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import store from '@/stores'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'BalanceView',
  components: { PageScaffold, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const amount = ref('0.00')
    const detail = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.balance(store.getters['user/userId'])
        amount.value = (data && data.amount != null ? data.amount : 0).toFixed(2)
        detail.value = (data && data.detail) || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    function recharge() {
      window.alert('充值功能演示：实际将跳转支付')
    }

    return { amount, detail, loading, error, load, recharge }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.balance {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
}
.balance__hero {
  padding: $space-xl;
  text-align: center;
  background: linear-gradient(135deg, #5ac8fa, #3b82f6);
  border-radius: $radius-lg;
  &-num {
    @include sc(30, #fff);
    font-weight: 800;
    line-height: 1;
  }
  &-label {
    margin-top: $space-sm;
    @include sc(13, rgba(255, 255, 255, 0.92));
  }
}
.balance__rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
  margin: $space-lg 0;
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
  &__val {
    @include sc(13, $text-secondary);
  }
}
.balance__subtitle {
  @include sc(16, $text-title);
  margin-bottom: $space-md;
}
.state {
  padding: $space-2xl 0;
}
.balance__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.bitem {
  @include flex-between;
  gap: $space-md;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__main {
    min-width: 0;
  }
  &__desc {
    @include sc(14, $text-body);
  }
  &__time {
    margin-top: $space-xs;
    @include sc(12, $text-placeholder);
  }
  &__amount {
    @include sc(16, $text-title);
    font-weight: 700;
    flex-shrink: 0;
    &.is-plus {
      color: $color-success;
    }
    &.is-minus {
      color: $color-danger;
    }
  }
}
</style>
