<template>
  <page-scaffold title="开票记录">
    <div class="records">
      <empty-block
        v-if="!records.length"
        icon="dingdan"
        text="暂无开票记录"
        subtext="会员消费后可申请开具电子发票"
      />
      <article v-for="r in records" :key="r.id" class="record">
        <div class="record__main">
          <p class="record__title">{{ r.title }}</p>
          <p class="record__time">{{ r.time }}</p>
        </div>
        <span class="record__amount">¥{{ r.amount.toFixed(2) }}</span>
      </article>
    </div>
  </page-scaffold>
</template>

<script>
import { ref } from 'vue'
import PageScaffold from '@/components/base/PageScaffold.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'VipRecordsView',
  components: { PageScaffold, EmptyBlock },
  setup() {
    // 演示环境无开票记录，预留数据结构
    const records = ref([])
    return { records }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.records {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
  padding: 0 $content-pad $space-2xl;
  // 空状态组件占满整行
  > *:not(.record) {
    grid-column: 1 / -1;
  }
}
.record {
  @include flex-between;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__title {
    @include sc(16, $text-title);
    font-weight: 600;
  }
  &__time {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
  &__amount {
    @include sc(16, $color-primary);
    font-weight: 700;
  }
}
</style>
