<template>
  <page-scaffold title="服务中心">
    <div class="service">
      <div v-if="loading" class="service__state"><loading-block text="加载中…" /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />

      <template v-else>
        <section v-for="(cat, ci) in categories" :key="ci" class="service__cat">
          <h3 class="service__cat-title">{{ cat.name }}</h3>
          <button
            v-for="q in cat.questions"
            :key="q.id"
            type="button"
            class="service__q"
            @click="$router.push(`/service/question/${q.id}`)"
          >
            <span class="ellipsis">{{ q.question }}</span>
            <span aria-hidden="true">›</span>
          </button>
        </section>
        <p class="service__footer">没有找到答案？拨打客服热线 1010-1234</p>
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
  name: 'ServiceView',
  components: { PageScaffold, LoadingBlock, ErrorBlock },
  setup() {
    const categories = ref([])
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.serviceCenter()
        categories.value = (data && data.categories) || []
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { categories, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.service {
  padding: $space-lg $content-pad $space-2xl;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: $space-lg;
  align-items: start;
  max-width: 1280px;
}
.service__state {
  padding-top: rem(60);
}
.service__cat {
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &-title {
    @include sc(16, $text-title);
    font-weight: 700;
    margin-bottom: $space-md;
    padding-bottom: $space-md;
    border-bottom: 1px solid $border-color;
  }
}
.service__q {
  @include flex-between;
  width: 100%;
  margin-bottom: $space-xs;
  padding: $space-md;
  @include sc(14, $text-body);
  background: $bg-page;
  border-radius: $radius-md;
  gap: $space-md;
  text-align: left;
  transition: all $transition-fast;
  &:hover {
    background: $color-primary-soft;
    color: $color-primary;
    span:last-child {
      color: $color-primary;
      transform: translateX(2px);
    }
  }
  span:last-child {
    color: $text-placeholder;
    transition: transform $transition-fast;
    flex-shrink: 0;
  }
}
.service__footer {
  grid-column: 1 / -1;
  text-align: center;
  padding: $space-lg;
  @include sc(13, $text-placeholder);
}
</style>
