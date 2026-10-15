<template>
  <page-scaffold title="历史红包">
    <div class="hb-history">
      <div v-if="loading" class="state"><loading-block text="加载中…" /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <empty-block v-else-if="!list.length" icon="🕘" text="暂无历史红包" />
      <article v-for="h in list" :key="h.id" class="hb hb--expired">
        <div class="hb__amount">
          <span class="hb__symbol">¥</span><b>{{ h.amount }}</b>
          <span class="hb__limit">{{ h.name }}</span>
        </div>
        <div class="hb__meta">
          <p class="hb__expire">有效期至 {{ h.expireAt }}</p>
          <p class="hb__status">已过期</p>
        </div>
      </article>
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
  name: 'HbHistoryView',
  components: { PageScaffold, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const list = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        list.value = (await contentApi.expiredHongbaos(store.getters['user/userId'])) || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { list, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.hb-history {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.state {
  padding: $space-2xl 0;
}
.hb {
  @include flex-between;
  gap: $space-md;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  opacity: 0.7;
  &__amount {
    display: flex;
    align-items: baseline;
    gap: $space-xs;
    b {
      @include sc(28, $text-title);
      font-weight: 800;
    }
  }
  &__symbol {
    @include sc(14, $text-title);
  }
  &__limit {
    margin-left: $space-sm;
    @include sc(13, $text-secondary);
  }
  &__meta {
    text-align: right;
  }
  &__expire {
    @include sc(13, $text-secondary);
  }
  &__status {
    margin-top: $space-xs;
    @include sc(12, $text-placeholder);
  }
}
</style>
