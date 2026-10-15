<template>
  <page-scaffold title="我的积分">
    <div class="points">
      <section class="points__hero">
        <p class="points__num">{{ total }}</p>
        <p class="points__label">当前积分</p>
      </section>

      <div class="points__rows">
        <button type="button" class="row" @click="$router.push('/points/detail')">
          <span>积分说明</span><span aria-hidden="true">›</span>
        </button>
      </div>

      <h3 class="points__subtitle">积分明细</h3>
      <div v-if="loading" class="state"><loading-block /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <empty-block v-else-if="!history.length" icon="jifen" text="暂无积分记录" />
      <div v-else class="points__list">
        <div v-for="p in history" :key="p.id" class="pitem">
          <div class="pitem__main">
            <p class="pitem__desc">{{ p.desc }}</p>
            <p class="pitem__time">{{ p.timeAgo }}</p>
          </div>
          <span class="pitem__amount" :class="p.type === '获得' ? 'is-plus' : 'is-minus'">
            {{ p.type === '获得' ? '+' : '-' }}{{ p.amount }}
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
  name: 'PointsView',
  components: { PageScaffold, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const total = ref(0)
    const history = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.points(store.getters['user/userId'])
        total.value = (data && data.total) || 0
        history.value = (data && data.history) || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { total, history, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.points {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
}
.points__hero {
  padding: $space-xl;
  text-align: center;
  background: linear-gradient(135deg, #ffd66b, #ffb027);
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
.points__rows {
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
}
.points__subtitle {
  @include sc(16, $text-title);
  margin-bottom: $space-md;
}
.state {
  padding: $space-2xl 0;
}
.points__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.pitem {
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
